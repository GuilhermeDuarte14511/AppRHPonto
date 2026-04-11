import { formatDate, toDate } from '@rh-ponto/core';

import { formatCpf, formatRegistrationNumber, formatTimeRecordSourceLabel } from '@/shared/lib/admin-formatters';
import type { AdminLiveDataSnapshot } from '@/shared/lib/admin-live-data';

import { companyName, rhManagerName, unitName } from './payroll-constants';
import type {
  PayrollClosureState,
  PayrollDayEntry,
  PayrollNoteTone,
  PayrollRecordDetail,
  PayrollSupportingDocument,
  PeriodBounds,
} from './payroll-types';
import {
  buildMonthPeriodBounds,
  calculateWorkedMinutes,
  createSignatureLines,
  dateTimeFormatter,
  formatClock,
  formatHoursShort,
  formatMinutes,
  getDateKey,
  isInsidePeriod,
  parseClock,
  parseDurationLabel,
  resolveManagerName,
  weekdayFormatter,
} from './payroll-utils';

type ValidationEvents = {
  closeEvent: AdminLiveDataSnapshot['auditLogs'][number] | null;
  perRecordValidationIds: Set<string>;
  validateAllEvent: AdminLiveDataSnapshot['auditLogs'][number] | null;
};

export const buildPeriodBounds = (snapshot: AdminLiveDataSnapshot): PeriodBounds => {
  const latestReference =
    snapshot.timeRecords
      .map((record) => toDate(record.recordedAt))
      .sort((left, right) => right.getTime() - left.getTime())[0] ?? new Date();

  return buildMonthPeriodBounds(latestReference);
};

export const resolveSchedule = (snapshot: AdminLiveDataSnapshot, employeeId: string) => {
  const currentHistory =
    snapshot.employeeScheduleHistories.find((history) => history.employeeId === employeeId && history.isCurrent) ??
    snapshot.employeeScheduleHistories.find((history) => history.employeeId === employeeId) ??
    null;

  if (!currentHistory) {
    return snapshot.workSchedules.find((schedule) => schedule.isActive) ?? null;
  }

  return snapshot.workSchedules.find((schedule) => schedule.id === currentHistory.workScheduleId) ?? null;
};

export const getValidationEvents = (snapshot: AdminLiveDataSnapshot): ValidationEvents => ({
  closeEvent: snapshot.auditLogs.find((log) => log.action === 'payroll.closed') ?? null,
  validateAllEvent: snapshot.auditLogs.find((log) => log.action === 'payroll.validated_all') ?? null,
  perRecordValidationIds: new Set(
    snapshot.auditLogs
      .filter((log) => log.action === 'payroll.record.validated' && log.entityId)
      .map((log) => log.entityId as string),
  ),
});

export const buildDocuments = (
  snapshot: AdminLiveDataSnapshot,
  employeeId: string,
): PayrollSupportingDocument[] => {
  const justificationsById = new Map(snapshot.justifications.map((justification) => [justification.id, justification]));
  const justificationDocuments = snapshot.justificationAttachments
    .filter((attachment) => justificationsById.get(attachment.justificationId)?.employeeId === employeeId)
    .map((attachment) => {
      const justification = justificationsById.get(attachment.justificationId);

      return {
        id: attachment.id,
        name: attachment.fileName,
        typeLabel: 'Justificativa',
        issuer: justification?.status === 'approved' ? 'RH aprovado' : 'Colaborador',
        issuedAtLabel: formatDate(attachment.createdAt),
        statusLabel: justification?.status === 'approved' ? 'Homologado' : 'Em revisão',
      };
    });

  const vacationDocuments = snapshot.vacationRequests
    .filter((request) => request.employeeId === employeeId && (request.attachmentFileName || request.attachmentFileUrl))
    .map((request) => ({
      id: request.id,
      name: request.attachmentFileName ?? 'solicitação-ferias.pdf',
      typeLabel: 'Férias',
      issuer: request.hrApprovalActor ?? request.managerApprovalActor ?? 'RH',
      issuedAtLabel: formatDate(request.createdAt),
      statusLabel:
        request.status === 'approved' ? 'Aprovado' : request.status === 'rejected' ? 'Rejeitado' : 'Pendente',
    }));

  return [...justificationDocuments, ...vacationDocuments].slice(0, 4);
};

export const buildDayEntry = ({
  dateKey,
  expectedDailyMinutes,
  justification,
  records,
  schedule,
}: {
  dateKey: string;
  expectedDailyMinutes: number;
  justification?: AdminLiveDataSnapshot['justifications'][number];
  records: AdminLiveDataSnapshot['timeRecords'];
  schedule: AdminLiveDataSnapshot['workSchedules'][number] | null;
}): PayrollDayEntry => {
  const orderedRecords = [...records].sort(
    (left, right) => toDate(left.recordedAt).getTime() - toDate(right.recordedAt).getTime(),
  );
  const entry = orderedRecords.find((record) => record.recordType === 'entry');
  const breakStart = orderedRecords.find((record) => record.recordType === 'break_start');
  const breakEnd = orderedRecords.find((record) => record.recordType === 'break_end');
  const exit = orderedRecords.find((record) => record.recordType === 'exit');
  const workedMinutes =
    orderedRecords.length > 0
      ? calculateWorkedMinutes({
          entry: entry ? toDate(entry.recordedAt) : null,
          breakStart: breakStart ? toDate(breakStart.recordedAt) : null,
          breakEnd: breakEnd ? toDate(breakEnd.recordedAt) : null,
          exit: exit ? toDate(exit.recordedAt) : null,
        })
      : 0;
  const regularMinutes =
    workedMinutes > 0
      ? Math.min(workedMinutes, expectedDailyMinutes)
      : justification?.type === 'absence' && justification.status === 'approved'
        ? expectedDailyMinutes
        : 0;
  const overtimeMinutes = Math.max(0, workedMinutes - expectedDailyMinutes);
  const scheduleStartMinutes = parseClock(schedule?.startTime ?? null);
  const toleranceMinutes = schedule?.toleranceMinutes ?? 0;
  const entryMinutes = entry ? toDate(entry.recordedAt).getUTCHours() * 60 + toDate(entry.recordedAt).getUTCMinutes() : null;
  const lateMinutes =
    entryMinutes != null && scheduleStartMinutes != null
      ? Math.max(0, entryMinutes - (scheduleStartMinutes + toleranceMinutes))
      : 0;
  const balanceMinutes =
    workedMinutes > 0
      ? workedMinutes - expectedDailyMinutes
      : justification?.type === 'absence' && justification.status === 'approved'
        ? 0
        : justification?.type === 'absence'
          ? -expectedDailyMinutes
          : 0;
  const weekday = weekdayFormatter
    .format(new Date(`${dateKey}T00:00:00.000Z`))
    .replace(/^\w/, (character) => character.toUpperCase());
  const sourceLabel =
    orderedRecords[0] != null
      ? formatTimeRecordSourceLabel(orderedRecords[0].source)
      : justification
        ? 'Fluxo administrativo'
        : 'Sem registro';

  let note: string | null = null;
  let noteTone: PayrollNoteTone = 'neutral';
  let occurrenceDetail: string | null = null;

  if (justification?.type === 'absence') {
    note = justification.status === 'approved' ? 'Ausência abonada' : 'Ausência em análise';
    noteTone = justification.status === 'approved' ? 'info' : 'danger';
    occurrenceDetail = justification.reason;
  } else if (orderedRecords.some((record) => record.status === 'pending_review')) {
    note = 'Em revisão';
    noteTone = 'warning';
    occurrenceDetail = orderedRecords.find((record) => record.notes)?.notes ?? 'Registro aguardando conferência do RH.';
  } else if (lateMinutes > 0) {
    note = 'Atraso';
    noteTone = 'danger';
    occurrenceDetail = `Entrada acima da tolerância em ${formatMinutes(lateMinutes)}.`;
  } else if (overtimeMinutes > 0) {
    note = 'Hora extra';
    noteTone = 'warning';
    occurrenceDetail = 'Jornada excedente apurada no período.';
  } else if (orderedRecords.some((record) => record.isManual)) {
    note = 'Ajuste manual';
    noteTone = 'info';
    occurrenceDetail = orderedRecords.find((record) => record.notes)?.notes ?? 'Registro ajustado manualmente.';
  }

  return {
    id: `${dateKey}-${records[0]?.employeeId ?? justification?.employeeId ?? 'sem-funcionario'}`,
    date: formatDate(`${dateKey}T00:00:00.000Z`),
    weekday,
    firstEntry: formatClock(entry ? toDate(entry.recordedAt) : null),
    firstExit: formatClock(breakStart ? toDate(breakStart.recordedAt) : null),
    secondEntry: formatClock(breakEnd ? toDate(breakEnd.recordedAt) : null),
    secondExit: formatClock(exit ? toDate(exit.recordedAt) : null),
    expectedHours: formatHoursShort(expectedDailyMinutes),
    regularHours: formatHoursShort(regularMinutes),
    overtimeHours: formatHoursShort(overtimeMinutes),
    balance: formatMinutes(balanceMinutes, { signed: true }),
    total: formatHoursShort(workedMinutes || regularMinutes),
    note,
    noteTone,
    occurrenceDetail,
    sourceLabel,
  };
};

export const buildPayrollRecord = (
  snapshot: AdminLiveDataSnapshot,
  employeeId: string,
  validationEvents: ValidationEvents,
  period: PeriodBounds,
): PayrollRecordDetail | null => {
  const employee = snapshot.employees.find((item) => item.id === employeeId);

  if (!employee) {
    return null;
  }

  const employeeRecords = snapshot.timeRecords.filter(
    (record) => record.employeeId === employeeId && isInsidePeriod(toDate(record.recordedAt), period),
  );
  const employeeJustifications = snapshot.justifications.filter(
    (item) => item.employeeId === employeeId && isInsidePeriod(toDate(item.createdAt), period),
  );
  const employeeVacations = snapshot.vacationRequests.filter(
    (item) =>
      item.employeeId === employeeId &&
      (item.startDate.startsWith(`${period.year}-${String(period.month + 1).padStart(2, '0')}`) ||
        item.endDate.startsWith(`${period.year}-${String(period.month + 1).padStart(2, '0')}`)),
  );

  if (employeeRecords.length === 0 && employeeJustifications.length === 0 && employeeVacations.length === 0) {
    return null;
  }

  const schedule = resolveSchedule(snapshot, employeeId);
  const expectedDailyMinutes = schedule?.expectedDailyMinutes ?? 8 * 60;
  const dateKeys = new Set<string>(employeeRecords.map((record) => getDateKey(record.recordedAt)));

  employeeJustifications.forEach((justification) => {
    if (justification.type === 'absence' || justification.type === 'missing_record') {
      dateKeys.add(getDateKey(justification.requestedRecordedAt ?? justification.createdAt));
    }
  });

  const days = Array.from(dateKeys)
    .sort((left, right) => new Date(left).getTime() - new Date(right).getTime())
    .map((dateKey) =>
      buildDayEntry({
        dateKey,
        expectedDailyMinutes,
        records: employeeRecords.filter((record) => getDateKey(record.recordedAt) === dateKey),
        justification: employeeJustifications.find(
          (item) => getDateKey(item.requestedRecordedAt ?? item.createdAt) === dateKey,
        ),
        schedule,
      }),
    );

  const workedMinutes = days.reduce((total, day) => total + parseDurationLabel(day.total), 0);
  const normalMinutes = days.reduce((total, day) => total + parseDurationLabel(day.regularHours), 0);
  const overtimeMinutes = days.reduce((total, day) => total + parseDurationLabel(day.overtimeHours), 0);
  const lateMinutes = days.reduce(
    (total, day) =>
      total +
      (day.note === 'Atraso' ? parseDurationLabel(day.occurrenceDetail?.match(/(\d{2}h \d{2}m)/)?.[1] ?? '00h 00m') : 0),
    0,
  );
  const approvedAbsencesMinutes =
    employeeJustifications.filter((item) => item.type === 'absence' && item.status === 'approved').length *
    expectedDailyMinutes;
  const unapprovedAbsencesMinutes =
    employeeJustifications.filter((item) => item.type === 'absence' && item.status !== 'approved').length *
    expectedDailyMinutes;
  const balanceMinutes = days.reduce(
    (total, day) => total + parseDurationLabel(day.balance) * (day.balance.startsWith('-') ? -1 : 1),
    0,
  );
  const bankMinutes = balanceMinutes - overtimeMinutes;
  const overtime100Minutes = Math.round(overtimeMinutes * 0.25);
  const overtime50Minutes = Math.max(0, overtimeMinutes - overtime100Minutes);
  const nightMinutes = employeeRecords.filter((record) => {
    const hour = toDate(record.recordedAt).getUTCHours();
    return hour >= 22 || hour < 5;
  }).length * 30;
  const baseHourlyValue = 28;
  const totalExtraPay = (overtime50Minutes / 60) * baseHourlyValue * 1.5 + (overtime100Minutes / 60) * baseHourlyValue * 2;
  const additionalsPay = (nightMinutes / 60) * 6;
  const mealAllowance = Math.max(days.length, 20) * 32;
  const documents = buildDocuments(snapshot, employeeId);
  const managerName = resolveManagerName(employee.department);
  const hasPendingIssues =
    employeeJustifications.some((item) => item.status === 'pending') ||
    employeeRecords.some((record) => record.status === 'pending_review');
  const hasCriticalIssues = employeeJustifications.some((item) => item.status === 'rejected') || bankMinutes < 0;
  const isValidated =
    Boolean(validationEvents.closeEvent || validationEvents.validateAllEvent) ||
    validationEvents.perRecordValidationIds.has(employee.id);

  const status = isValidated ? 'validado' : hasCriticalIssues ? 'em_analise' : hasPendingIssues ? 'pendente' : 'validado';

  const validationStatusLabel =
    validationEvents.closeEvent?.description && status === 'validado'
      ? validationEvents.closeEvent.description
      : validationEvents.validateAllEvent?.description && status === 'validado'
        ? validationEvents.validateAllEvent.description
        : status === 'validado'
          ? 'Validado pelo RH'
          : status === 'em_analise'
            ? 'Em análise pelo RH'
            : 'Pendente de conferência';

  const occurrenceSummary = [
    `${days.length} dias úteis ou operacionais apurados na competência.`,
    `${employeeJustifications.length} justificativas relacionadas ao colaborador no período.`,
    `${documents.length} documentos vinculados para conferência.`,
    hasCriticalIssues
      ? 'Há pendências que ainda exigem validação manual do RH.'
      : 'Sem inconsistências críticas na competência atual.',
  ];

  return {
    id: employee.id,
    employeeName: employee.fullName,
    registrationNumber: formatRegistrationNumber(employee.registrationNumber),
    department: employee.department ?? 'Sem departamento',
    role: employee.position ?? 'Cargo não informado',
    avatarName: employee.fullName,
    companyName,
    unitName,
    periodLabel: period.label,
    periodStartLabel: period.startLabel,
    periodEndLabel: period.endLabel,
    employeeCpf: formatCpf(employee.cpf),
    hireDateLabel: employee.hireDate ? formatDate(employee.hireDate) : 'Não informado',
    scheduleLabel: schedule ? `${schedule.name} ${schedule.startTime} às ${schedule.endTime}` : 'Escala não configurada',
    costCenter: employee.department ?? 'Centro de custo não informado',
    managerName,
    rhManagerName,
    generatedAtLabel: dateTimeFormatter.format(new Date()),
    workedHoursLabel: formatHoursShort(workedMinutes),
    workedHoursHint: 'Total efetivamente apurado no período com base nas marcações persistidas no banco.',
    normalHoursLabel: formatHoursShort(normalMinutes),
    normalHoursHint: 'Carga horária regular considerada no fechamento da competência.',
    bankHoursLabel: formatMinutes(bankMinutes, { signed: true }),
    bankHoursHint: 'Saldo final separado das horas extras pagas, sem duplicidade no fechamento.',
    overtimeHoursLabel: formatHoursShort(overtimeMinutes),
    overtimeHoursHint: 'Horas excedentes apuradas no período para pagamento ou compensação.',
    overtime50HoursLabel: formatHoursShort(overtime50Minutes),
    overtime100HoursLabel: formatHoursShort(overtime100Minutes),
    nightHoursLabel: formatHoursShort(nightMinutes),
    lateHoursLabel: formatHoursShort(lateMinutes),
    absencesLabel: formatHoursShort(unapprovedAbsencesMinutes),
    absencesHint: 'Impacto líquido das ausências sem abono ou ainda pendentes de regularização.',
    approvedAbsencesLabel: formatHoursShort(approvedAbsencesMinutes),
    unapprovedAbsencesLabel: formatHoursShort(unapprovedAbsencesMinutes),
    additionalsLabel: `R$ ${additionalsPay.toFixed(2).replace('.', ',')}`,
    totalExtraPayLabel: `R$ ${totalExtraPay.toFixed(2).replace('.', ',')}`,
    mealAllowanceLabel: `R$ ${mealAllowance.toFixed(2).replace('.', ',')}`,
    status,
    validationStatusLabel,
    validationHint:
      status === 'validado'
        ? 'Espelho pronto para envio ao colaborador.'
        : status === 'em_analise'
          ? 'Pendências exigem revisão manual antes do fechamento final.'
          : 'Aguardando validação operacional do RH.',
    occurrenceSummary,
    documents,
    signatures: createSignatureLines(employee.fullName, managerName),
    days,
  };
};

export const buildPayrollState = (snapshot: AdminLiveDataSnapshot): PayrollClosureState => {
  const period = buildPeriodBounds(snapshot);
  const validationEvents = getValidationEvents(snapshot);
  const records = snapshot.employees
    .map((employee) => buildPayrollRecord(snapshot, employee.id, validationEvents, period))
    .filter((record): record is PayrollRecordDetail => Boolean(record))
    .sort((left, right) => left.employeeName.localeCompare(right.employeeName, 'pt-BR'));

  const validated = records.filter((record) => record.status === 'validado').length;
  const employeesTotal = records.length;
  const pending = Math.max(employeesTotal - validated, 0);
  const overtimeMinutes = records.reduce(
    (total, record) => total + (parseClock(record.overtimeHoursLabel.replace('h ', ':').replace('m', '')) ?? 0),
    0,
  );

  return {
    periodLabel: period.label,
    progress: employeesTotal === 0 ? 100 : Math.round((validated / employeesTotal) * 100),
    validated,
    employeesTotal,
    pending,
    overtime: formatHoursShort(overtimeMinutes),
    criticalIssues: records.filter((record) => record.status !== 'validado').length,
    isClosed: Boolean(validationEvents.closeEvent),
    records,
  };
};
