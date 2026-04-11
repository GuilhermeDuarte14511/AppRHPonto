import type { TimeRecordSource, TimeRecordStatus, TimeRecordType } from '@rh-ponto/types';

import { getPayrollOverview } from '@/features/payroll/lib/payroll-data-source';
import { fetchAdminLiveDataSnapshot } from '@/shared/lib/admin-live-data';
import {
  formatTimeRecordSourceLabel,
  formatTimeRecordStatusLabel,
  formatTimeRecordTypeLabel,
} from '@/shared/lib/admin-formatters';

type DashboardRecentTimeRecordAttentionTone = 'neutral' | 'warning' | 'danger' | 'info';

export interface DashboardRecentTimeRecordViewModel {
  id: string;
  employeeName: string;
  department: string;
  recordedAt: string | Date;
  recordedAtLabel: string;
  recordType: TimeRecordType;
  typeLabel: string;
  source: TimeRecordSource;
  sourceLabel: string;
  status: TimeRecordStatus;
  statusLabel: string;
  attentionLabel: string;
  attentionDescription: string;
  attentionTone: DashboardRecentTimeRecordAttentionTone;
}

const attentionByStatus: Partial<
  Record<
    TimeRecordStatus,
    Pick<
      DashboardRecentTimeRecordViewModel,
      'attentionLabel' | 'attentionDescription' | 'attentionTone'
    >
  >
> = {
  pending_review: {
    attentionLabel: 'Revisão pendente',
    attentionDescription: 'Exige validação manual do RH antes do fechamento.',
    attentionTone: 'warning',
  },
  adjusted: {
    attentionLabel: 'Ajuste manual',
    attentionDescription: 'O horário foi corrigido após análise de evidência.',
    attentionTone: 'info',
  },
  rejected: {
    attentionLabel: 'Rejeitada',
    attentionDescription: 'Registro recusado por inconsistência de evidência ou origem.',
    attentionTone: 'danger',
  },
};

const weekdayLabelMap = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

const getTypeBadgeVariant = (recordType: TimeRecordType) => {
  const variants: Record<TimeRecordType, 'info' | 'warning' | 'success' | 'neutral'> = {
    entry: 'info',
    break_start: 'warning',
    break_end: 'success',
    exit: 'neutral',
  };

  return variants[recordType];
};

const toDateKey = (value: string | Date) => new Date(value).toISOString().slice(0, 10);

const toTimeLabel = (hour: number, minute: number) =>
  `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

export const getDashboardSummary = async () => {
  const [snapshot, payrollOverview] = await Promise.all([fetchAdminLiveDataSnapshot(), getPayrollOverview()]);
  const {
    employees,
    timeRecords,
    justifications,
    auditLogs,
    vacationRequests,
    justificationAttachments,
    employeeScheduleHistories,
  } = snapshot;

  const employeeMap = new Map(employees.map((employee) => [employee.id, employee]));
  const orderedTimeRecords = [...timeRecords].sort(
    (left, right) => new Date(right.recordedAt).getTime() - new Date(left.recordedAt).getTime(),
  );

  const recentTimeRecords: DashboardRecentTimeRecordViewModel[] = orderedTimeRecords.slice(0, 6).map((record) => {
    const employee = employeeMap.get(record.employeeId);
    const defaultAttention =
      attentionByStatus[record.status] ??
      (record.notes?.toLowerCase().includes('atraso')
        ? {
            attentionLabel: 'Atraso monitorado',
            attentionDescription: record.notes,
            attentionTone: 'warning' as const,
          }
        : {
            attentionLabel: 'Sem alerta',
            attentionDescription: 'Registro capturado dentro do fluxo esperado.',
            attentionTone: 'neutral' as const,
          });

    return {
      id: record.id,
      employeeName: employee?.fullName ?? 'Colaborador sem cadastro',
      department: employee?.department ?? 'Departamento não informado',
      recordedAt: record.recordedAt,
      recordedAtLabel: new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(new Date(record.recordedAt)),
      recordType: record.recordType,
      typeLabel: formatTimeRecordTypeLabel(record.recordType),
      source: record.source,
      sourceLabel: formatTimeRecordSourceLabel(record.source),
      status: record.status,
      statusLabel: formatTimeRecordStatusLabel(record.status),
      attentionLabel: defaultAttention.attentionLabel,
      attentionDescription: defaultAttention.attentionDescription,
      attentionTone: defaultAttention.attentionTone,
    };
  });

  const lastFiveOperationDays = Array.from(new Set(orderedTimeRecords.map((record) => toDateKey(record.recordedAt))))
    .sort((left, right) => left.localeCompare(right))
    .slice(-5);

  const dayGroups = lastFiveOperationDays.map((dayKey) => {
    const records = orderedTimeRecords.filter((record) => toDateKey(record.recordedAt) === dayKey);
    const date = new Date(`${dayKey}T12:00:00.000Z`);
    const lateRecords = records.filter(
      (record) =>
        record.status === 'pending_review' ||
        record.status === 'adjusted' ||
        record.notes?.toLowerCase().includes('atraso'),
    ).length;

    return {
      key: dayKey,
      label: weekdayLabelMap[date.getUTCDay()] ?? dayKey.slice(-2),
      totalRecords: records.length,
      lateRecords,
    };
  });

  const maxDailyRecords = Math.max(...dayGroups.map((item) => item.totalRecords), 1);
  const activeDayKey = dayGroups.reduce(
    (current, item) => (item.totalRecords > current.totalRecords ? item : current),
    dayGroups[0] ?? { key: '', label: 'SEM', totalRecords: 0, lateRecords: 0 },
  ).key;

  const hourBuckets = orderedTimeRecords.reduce<Map<string, number>>((items, record) => {
    const date = new Date(record.recordedAt);
    const bucketKey = toTimeLabel(date.getUTCHours(), 15 * Math.floor(date.getUTCMinutes() / 15));
    items.set(bucketKey, (items.get(bucketKey) ?? 0) + 1);
    return items;
  }, new Map());

  const peakBucket = Array.from(hourBuckets.entries()).sort((left, right) => right[1] - left[1])[0]?.[0] ?? '09:00';
  const weeklyLateRecords = orderedTimeRecords.filter(
    (record) =>
      record.status === 'pending_review' ||
      record.status === 'adjusted' ||
      record.notes?.toLowerCase().includes('atraso'),
  ).length;
  const pendingTimeRecords = orderedTimeRecords.filter((item) => item.status === 'pending_review').length;
  const activeEmployees = employees.filter((employee) => employee.isActive).length;
  const pendingJustifications = justifications.filter((item) => item.status === 'pending').length;
  const pendingVacations = vacationRequests.filter((item) => item.status === 'pending').length;
  const employeesWithoutSchedule = employees.filter(
    (employee) =>
      employee.isActive &&
      !employeeScheduleHistories.some((history) => history.employeeId === employee.id && history.isCurrent),
  ).length;
  const documentsRequiringReview = justificationAttachments.filter((attachment) => {
    const relatedJustification = justifications.find((item) => item.id === attachment.justificationId);

    return relatedJustification?.status === 'pending';
  }).length;
  const today = new Date();
  const upcomingVacations = vacationRequests.filter((request) => {
    if (request.status !== 'approved') {
      return false;
    }

    const startDate = new Date(request.startDate);
    const diffInDays = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return diffInDays >= 0 && diffInDays <= 30;
  }).length;
  const vacationsInProgress = vacationRequests.filter((request) => {
    if (request.status !== 'approved') {
      return false;
    }

    const startDate = new Date(request.startDate).getTime();
    const endDate = new Date(request.endDate).getTime();
    const currentDate = today.getTime();

    return currentDate >= startDate && currentDate <= endDate;
  }).length;
  const totalApprovalsPending = pendingJustifications + pendingVacations;
  const payrollStatusLabel = payrollOverview.isClosed
    ? 'Competência fechada'
    : payrollOverview.pending === 0
      ? 'Pronta para fechamento'
      : 'Em conferência';
  const payrollStatusHint = payrollOverview.isClosed
    ? 'Espelhos validados e liberados para consulta.'
    : payrollOverview.pending === 0
      ? 'Nenhum espelho pendente antes do fechamento.'
      : `${payrollOverview.pending} espelho(s) ainda pedem validação do RH.`;

  return {
    employeesTotal: employees.length,
    activeEmployees,
    pendingJustifications,
    pendingTimeRecords,
    pendingVacations,
    totalApprovalsPending,
    documentsRequiringReview,
    upcomingVacations,
    vacationsInProgress,
    employeesWithoutSchedule,
    payrollSnapshot: {
      progress: payrollOverview.progress,
      pending: payrollOverview.pending,
      validated: payrollOverview.validated,
      statusLabel: payrollStatusLabel,
      statusHint: payrollStatusHint,
    },
    recentTimeRecords,
    recentAuditLogs: auditLogs.slice(0, 4),
    weeklyActivity: {
      peakTimeLabel: peakBucket,
      detailHref: '/analytics',
      summary: `A leitura da última janela operacional mostra ${dayGroups.reduce(
        (total, item) => total + item.totalRecords,
        0,
      )} marcações distribuídas em ${dayGroups.length} dia(s), com pico de uso às ${peakBucket} e ${weeklyLateRecords} ocorrência(s) fora do fluxo ideal.`,
      days: dayGroups.map((day) => ({
        label: day.label,
        recordVolume: day.totalRecords,
        height: `${Math.max(24, Math.round((day.totalRecords / maxDailyRecords) * 100))}%`,
        totalRecords: day.totalRecords,
        lateRecords: day.lateRecords,
        active: day.key === activeDayKey,
      })),
      indicators: [
        {
          label: 'Marcações na semana',
          value: String(dayGroups.reduce((total, item) => total + item.totalRecords, 0)),
          hint: 'Total apurado a partir das marcações persistidas na base atual.',
        },
        {
          label: 'Atrasos monitorados',
          value: String(weeklyLateRecords).padStart(2, '0'),
          hint: 'Inclui registros em revisão, ajustes e observações de atraso.',
        },
        {
          label: 'Revisões abertas',
          value: String(pendingTimeRecords),
          hint: 'Pendentes de validação administrativa no momento.',
        },
      ],
    },
    recentTimeRecordsMeta: {
      total: recentTimeRecords.length,
      pending: recentTimeRecords.filter((record) => record.status === 'pending_review').length,
      adjusted: recentTimeRecords.filter((record) => record.status === 'adjusted').length,
      manual: recentTimeRecords.filter((record) => record.source === 'admin_adjustment').length,
    },
    cadenceMetrics: {
      attendanceTodayPercent: Math.round((activeEmployees / Math.max(employees.length, 1)) * 100),
      openReviews: totalApprovalsPending + pendingTimeRecords,
    },
    typeBadgeVariantMap: {
      entry: getTypeBadgeVariant('entry'),
      break_start: getTypeBadgeVariant('break_start'),
      break_end: getTypeBadgeVariant('break_end'),
      exit: getTypeBadgeVariant('exit'),
    },
  };
};
