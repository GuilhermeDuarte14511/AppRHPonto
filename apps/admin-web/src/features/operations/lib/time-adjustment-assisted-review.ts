import type { EmployeeScheduleHistory, WorkSchedule } from '@rh-ponto/work-schedules';
import type { TimeRecordSource, TimeRecordType } from '@rh-ponto/types';

export type AssistedReviewConfidence = 'high' | 'medium' | 'low';
export type AssistedReviewRoutingTarget = 'manager' | 'hr' | 'operations';
export type AssistedReviewExceptionType =
  | 'missing_punch'
  | 'incomplete_sequence'
  | 'outside_rule_window'
  | 'location_divergence';
export type AssistedReviewPriority = 'high' | 'medium' | 'low';
export type AssistedReviewRecommendedAction =
  | 'complete_with_expected_time'
  | 'request_employee_confirmation'
  | 'review_daily_sequence'
  | 'request_justification'
  | 'escalate_for_compliance_review';
export type AssistedReviewClosureImpact = 'none' | 'payroll' | 'compliance' | 'payroll_and_compliance';

export interface AssistedReviewSourceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  recordedAt: string;
  originalRecordedAt: string | null;
  recordType: TimeRecordType;
  source: TimeRecordSource;
  notes: string | null;
  isManual: boolean;
  latitude: number | null;
  longitude: number | null;
  resolvedAddress: string | null;
  referenceRecordId: string | null;
}

export interface AssistedReviewScheduleContext {
  employeeScheduleHistories: EmployeeScheduleHistory[];
  workSchedules: WorkSchedule[];
}

export interface AssistedReviewCase {
  recordId: string;
  employeeId: string;
  employeeName: string;
  recordedAt: string;
  recordType: TimeRecordType;
  priority: AssistedReviewPriority;
  exceptionType: AssistedReviewExceptionType;
  confidence: AssistedReviewConfidence;
  recommendedAction: AssistedReviewRecommendedAction;
  routingTarget: AssistedReviewRoutingTarget;
  batchEligible: boolean;
  batchGroupKey: string | null;
  closureImpact: AssistedReviewClosureImpact;
  title: string;
  description: string;
  confidenceReason: string;
  suggestionReason: string;
  decisionSummary: string;
}

export interface BuildTimeAdjustmentCasesInput {
  pendingRecords: AssistedReviewSourceRecord[];
  allTimeRecords: AssistedReviewSourceRecord[];
  scheduleContext?: AssistedReviewScheduleContext;
}

const sequenceOrder: Record<TimeRecordType, number> = {
  entry: 0,
  break_start: 1,
  break_end: 2,
  exit: 3,
};

const orderedRecordTypes: TimeRecordType[] = ['entry', 'break_start', 'break_end', 'exit'];

const exceptionTitle: Record<AssistedReviewExceptionType, string> = {
  missing_punch: 'Esqueci de bater ponto',
  incomplete_sequence: 'Marcacao incompleta',
  outside_rule_window: 'Marcacao fora da regra',
  location_divergence: 'Divergencia de local',
};

const confidenceLabel: Record<AssistedReviewConfidence, string> = {
  high: 'alta',
  medium: 'media',
  low: 'baixa',
};

const missingPunchKeywords = ['esquec', 'faltou marca', 'nao bateu', 'sem batida', 'sem registro', 'esqueci'];
const incompleteSequenceKeywords = ['sequencia incompleta', 'intervalo', 'duplic', 'ordem incorreta'];
const outsideRuleKeywords = ['atraso', 'tolerancia', 'janela', 'fora da regra', 'adiant', 'antecipa'];

const normalizeText = (value: string | null | undefined) =>
  (value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

const getDayKey = (value: string) => value.slice(0, 10);

const sortChronologically = (records: AssistedReviewSourceRecord[]) =>
  [...records].sort((left, right) => left.recordedAt.localeCompare(right.recordedAt));

const includesAny = (value: string, terms: string[]) => terms.some((term) => value.includes(term));

const parseClock = (value: string | null | undefined) => {
  if (!value) {
    return null;
  }

  const [hours, minutes] = value.split(':').map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  return hours * 60 + minutes;
};

const formatClock = (minutes: number | null) => {
  if (minutes == null) {
    return null;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${String(hours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`;
};

const formatDeltaMinutes = (minutes: number | null) => {
  if (minutes == null) {
    return null;
  }

  const absoluteValue = Math.abs(minutes);
  const hours = Math.floor(absoluteValue / 60);
  const remainingMinutes = absoluteValue % 60;
  const label = `${String(hours).padStart(2, '0')}h ${String(remainingMinutes).padStart(2, '0')}m`;

  return label;
};

const getRecordedMinutes = (value: string) => {
  const date = new Date(value);

  return date.getUTCHours() * 60 + date.getUTCMinutes();
};

const getDayRecords = (record: AssistedReviewSourceRecord, allRecords: AssistedReviewSourceRecord[]) =>
  sortChronologically(
    allRecords.filter(
      (item) => item.employeeId === record.employeeId && getDayKey(item.recordedAt) === getDayKey(record.recordedAt),
    ),
  );

const expectedRecordTypes = (schedule: WorkSchedule | null): TimeRecordType[] => {
  if (!schedule) {
    return ['entry', 'exit'];
  }

  return schedule.breakStartTime && schedule.breakEndTime
    ? ['entry', 'break_start', 'break_end', 'exit']
    : ['entry', 'exit'];
};

const expectedTimeByType = (schedule: WorkSchedule | null): Partial<Record<TimeRecordType, number>> => ({
  entry: parseClock(schedule?.startTime) ?? undefined,
  break_start: parseClock(schedule?.breakStartTime) ?? undefined,
  break_end: parseClock(schedule?.breakEndTime) ?? undefined,
  exit: parseClock(schedule?.endTime) ?? undefined,
});

const resolveScheduleForRecord = (
  record: AssistedReviewSourceRecord,
  scheduleContext?: AssistedReviewScheduleContext,
): WorkSchedule | null => {
  if (!scheduleContext) {
    return null;
  }

  const dateKey = getDayKey(record.recordedAt);
  const matchingHistory =
    [...scheduleContext.employeeScheduleHistories]
      .filter((history) => {
        if (history.employeeId !== record.employeeId) {
          return false;
        }

        const startDate = getDayKey(String(history.startDate));
        const endDate = history.endDate ? getDayKey(String(history.endDate)) : null;

        return startDate <= dateKey && (endDate == null || dateKey < endDate);
      })
      .sort((left, right) => String(right.startDate).localeCompare(String(left.startDate)))[0] ??
    scheduleContext.employeeScheduleHistories.find((history) => history.employeeId === record.employeeId && history.isCurrent) ??
    scheduleContext.employeeScheduleHistories.find((history) => history.employeeId === record.employeeId) ??
    null;

  if (!matchingHistory) {
    return scheduleContext.workSchedules.find((schedule) => schedule.isActive) ?? null;
  }

  return (
    scheduleContext.workSchedules.find((schedule) => schedule.id === matchingHistory.workScheduleId) ??
    scheduleContext.workSchedules.find((schedule) => schedule.isActive) ??
    null
  );
};

interface DaySequenceAnalysis {
  corroboratingRecordCount: number;
  dayRecords: AssistedReviewSourceRecord[];
  deltaFromExpectedMinutes: number | null;
  duplicateTypes: TimeRecordType[];
  hasBreakPairMismatch: boolean;
  hasSequenceRegression: boolean;
  hasUnexpectedBreakRecords: boolean;
  hasWindowSignal: boolean;
  isManualRecoverySignal: boolean;
  missingExpectedTypes: TimeRecordType[];
  missingPriorExpectedTypes: TimeRecordType[];
  recordExpectedMinutes: number | null;
  schedule: WorkSchedule | null;
  stableDayContext: boolean;
}

const analyzeDaySequence = (
  record: AssistedReviewSourceRecord,
  allRecords: AssistedReviewSourceRecord[],
  scheduleContext?: AssistedReviewScheduleContext,
): DaySequenceAnalysis => {
  const dayRecords = getDayRecords(record, allRecords);
  const schedule = resolveScheduleForRecord(record, scheduleContext);
  const expectedTypes = expectedRecordTypes(schedule);
  const expectedTimes = expectedTimeByType(schedule);
  const countsByType = dayRecords.reduce<Partial<Record<TimeRecordType, number>>>((accumulator, item) => {
    accumulator[item.recordType] = (accumulator[item.recordType] ?? 0) + 1;

    return accumulator;
  }, {});
  const duplicateTypes = orderedRecordTypes.filter((type) => (countsByType[type] ?? 0) > 1);
  const hasSequenceRegression = dayRecords.some((item, index) => {
    if (index === 0) {
      return false;
    }

    return sequenceOrder[dayRecords[index - 1]!.recordType] > sequenceOrder[item.recordType];
  });
  const hasBreakRecords = (countsByType.break_start ?? 0) > 0 || (countsByType.break_end ?? 0) > 0;
  const scheduleHasBreak = Boolean(schedule?.breakStartTime && schedule?.breakEndTime);
  const hasBreakPairMismatch = (countsByType.break_start ?? 0) !== (countsByType.break_end ?? 0);
  const hasUnexpectedBreakRecords = schedule != null && !scheduleHasBreak && hasBreakRecords;
  const missingExpectedTypes = expectedTypes.filter((type) => (countsByType[type] ?? 0) === 0);
  const missingPriorExpectedTypes = expectedTypes.filter(
    (type) => sequenceOrder[type] < sequenceOrder[record.recordType] && (countsByType[type] ?? 0) === 0,
  );
  const recordExpectedMinutes = expectedTimes[record.recordType] ?? null;
  const deltaFromExpectedMinutes =
    recordExpectedMinutes == null ? null : getRecordedMinutes(record.recordedAt) - recordExpectedMinutes;
  const normalizedNotes = normalizeText(record.notes);
  const isManualRecoverySignal =
    record.isManual || Boolean(record.originalRecordedAt) || includesAny(normalizedNotes, missingPunchKeywords);
  const hasWindowSignal =
    includesAny(normalizedNotes, outsideRuleKeywords) ||
    (recordExpectedMinutes != null &&
      Math.abs(deltaFromExpectedMinutes ?? 0) > (schedule?.toleranceMinutes ?? 0));

  return {
    corroboratingRecordCount: Math.max(dayRecords.length - 1, 0),
    dayRecords,
    deltaFromExpectedMinutes,
    duplicateTypes,
    hasBreakPairMismatch,
    hasSequenceRegression,
    hasUnexpectedBreakRecords,
    hasWindowSignal,
    isManualRecoverySignal,
    missingExpectedTypes,
    missingPriorExpectedTypes,
    recordExpectedMinutes,
    schedule,
    stableDayContext:
      duplicateTypes.length === 0 &&
      !hasSequenceRegression &&
      !hasBreakPairMismatch &&
      !hasUnexpectedBreakRecords &&
      missingExpectedTypes.length === 0,
  };
};

const detectLocationDivergence = (record: AssistedReviewSourceRecord) => {
  const normalizedNotes = normalizeText(record.notes);

  return (
    normalizedNotes.includes('geolocal') ||
    normalizedNotes.includes('geofence') ||
    normalizedNotes.includes('divergencia') ||
    normalizedNotes.includes('fora do local')
  );
};

const detectMissingPunch = (analysis: DaySequenceAnalysis) => {
  if (!analysis.isManualRecoverySignal) {
    return false;
  }

  if (
    analysis.duplicateTypes.length > 0 ||
    analysis.hasSequenceRegression ||
    analysis.hasBreakPairMismatch ||
    analysis.hasUnexpectedBreakRecords
  ) {
    return false;
  }

  if (analysis.recordExpectedMinutes != null && analysis.deltaFromExpectedMinutes != null) {
    const autoApprovalWindow = Math.max((analysis.schedule?.toleranceMinutes ?? 0) + 30, 90);

    if (Math.abs(analysis.deltaFromExpectedMinutes) > autoApprovalWindow) {
      return false;
    }
  }

  return true;
};

const detectOutsideRuleWindow = (record: AssistedReviewSourceRecord, analysis: DaySequenceAnalysis) => {
  const normalizedNotes = normalizeText(record.notes);
  const recordedMinutes = getRecordedMinutes(record.recordedAt);

  return (
    analysis.hasWindowSignal ||
    normalizedNotes.includes('fora da regra') ||
    recordedMinutes < 6 * 60 ||
    recordedMinutes > 22 * 60
  );
};

const detectIncompleteSequence = (record: AssistedReviewSourceRecord, analysis: DaySequenceAnalysis) => {
  const previousRecords = analysis.dayRecords.filter((item) => item.recordedAt < record.recordedAt);
  const lastRecord = previousRecords.at(-1) ?? null;
  const normalizedNotes = normalizeText(record.notes);

  if (includesAny(normalizedNotes, incompleteSequenceKeywords)) {
    return true;
  }

  if (
    analysis.duplicateTypes.length > 0 ||
    analysis.hasSequenceRegression ||
    analysis.hasBreakPairMismatch ||
    analysis.hasUnexpectedBreakRecords
  ) {
    return true;
  }

  if (lastRecord && sequenceOrder[lastRecord.recordType] >= sequenceOrder[record.recordType]) {
    return true;
  }

  if (record.recordType === 'break_end' && !previousRecords.some((item) => item.recordType === 'break_start')) {
    return true;
  }

  if (record.recordType === 'exit' && !previousRecords.some((item) => item.recordType === 'entry')) {
    return true;
  }

  if (analysis.schedule && analysis.missingPriorExpectedTypes.length > 0 && !analysis.isManualRecoverySignal) {
    return true;
  }

  return false;
};

const inferExceptionType = (
  record: AssistedReviewSourceRecord,
  allRecords: AssistedReviewSourceRecord[],
  scheduleContext?: AssistedReviewScheduleContext,
): AssistedReviewExceptionType => {
  const analysis = analyzeDaySequence(record, allRecords, scheduleContext);

  if (detectLocationDivergence(record)) {
    return 'location_divergence';
  }

  if (detectIncompleteSequence(record, analysis)) {
    return 'incomplete_sequence';
  }

  if (detectMissingPunch(analysis)) {
    return 'missing_punch';
  }

  if (detectOutsideRuleWindow(record, analysis)) {
    return 'outside_rule_window';
  }

  return 'missing_punch';
};

const inferPriority = (exceptionType: AssistedReviewExceptionType): AssistedReviewPriority => {
  if (exceptionType === 'missing_punch') {
    return 'medium';
  }

  return 'high';
};

const inferConfidence = (
  exceptionType: AssistedReviewExceptionType,
  record: AssistedReviewSourceRecord,
  allRecords: AssistedReviewSourceRecord[],
  scheduleContext?: AssistedReviewScheduleContext,
): AssistedReviewConfidence => {
  const analysis = analyzeDaySequence(record, allRecords, scheduleContext);

  switch (exceptionType) {
    case 'missing_punch':
      return analysis.stableDayContext && analysis.corroboratingRecordCount >= 1 ? 'high' : 'medium';
    case 'incomplete_sequence':
      return 'medium';
    case 'outside_rule_window':
      return analysis.recordExpectedMinutes != null && analysis.deltaFromExpectedMinutes != null ? 'high' : 'medium';
    case 'location_divergence':
      return 'low';
    default:
      return normalizeText(record.notes).includes('valida') ? 'medium' : 'high';
  }
};

const inferRecommendedAction = (
  exceptionType: AssistedReviewExceptionType,
  confidence: AssistedReviewConfidence,
): AssistedReviewRecommendedAction => {
  switch (exceptionType) {
    case 'missing_punch':
      return confidence === 'high' ? 'complete_with_expected_time' : 'request_employee_confirmation';
    case 'incomplete_sequence':
      return 'review_daily_sequence';
    case 'outside_rule_window':
      return 'request_justification';
    case 'location_divergence':
      return 'escalate_for_compliance_review';
  }
};

const inferClosureImpact = (exceptionType: AssistedReviewExceptionType): AssistedReviewClosureImpact => {
  switch (exceptionType) {
    case 'missing_punch':
      return 'payroll';
    case 'incomplete_sequence':
      return 'payroll';
    case 'outside_rule_window':
      return 'payroll';
    case 'location_divergence':
      return 'payroll_and_compliance';
  }
};

const inferRoutingTarget = (
  exceptionType: AssistedReviewExceptionType,
  closureImpact: AssistedReviewClosureImpact,
  record: AssistedReviewSourceRecord,
): AssistedReviewRoutingTarget => {
  if (closureImpact === 'compliance' || closureImpact === 'payroll_and_compliance') {
    return 'hr';
  }

  if (exceptionType === 'location_divergence' && record.source === 'kiosk') {
    return 'operations';
  }

  return 'manager';
};

const buildConfidenceReason = (
  exceptionType: AssistedReviewExceptionType,
  record: AssistedReviewSourceRecord,
  allRecords: AssistedReviewSourceRecord[],
  scheduleContext: AssistedReviewScheduleContext | undefined,
) => {
  const analysis = analyzeDaySequence(record, allRecords, scheduleContext);

  switch (exceptionType) {
    case 'missing_punch': {
      const scheduleLabel = analysis.schedule ? ` na escala ${analysis.schedule.name}` : '';

      if (analysis.stableDayContext) {
        return `${analysis.corroboratingRecordCount} batida(s) do mesmo dia${scheduleLabel} sustentam um esquecimento isolado sem quebra de sequencia.`;
      }

      return 'Ha sinal de esquecimento de batida, mas o RH ainda precisa confirmar o contexto operacional antes do fechamento.';
    }
    case 'incomplete_sequence': {
      const reasons: string[] = [];

      if (analysis.duplicateTypes.length > 0) {
        reasons.push(`ha duplicidade em ${analysis.duplicateTypes.join(', ')}`);
      }

      if (analysis.hasSequenceRegression) {
        reasons.push('a ordem cronologica das batidas ficou inconsistente');
      }

      if (analysis.hasBreakPairMismatch) {
        reasons.push('o intervalo ficou sem par completo');
      }

      if (reasons.length === 0 && analysis.missingExpectedTypes.length > 0) {
        reasons.push(`faltam etapas esperadas da jornada (${analysis.missingExpectedTypes.join(', ')})`);
      }

      return `A jornada de ${getDayKey(record.recordedAt)} possui ${analysis.dayRecords.length} batida(s) e ${reasons.join('; ')}.`;
    }
    case 'outside_rule_window': {
      const expectedClock = formatClock(analysis.recordExpectedMinutes);
      const deltaLabel = formatDeltaMinutes(analysis.deltaFromExpectedMinutes);

      if (expectedClock && deltaLabel) {
        const deviationDirection = (analysis.deltaFromExpectedMinutes ?? 0) >= 0 ? 'depois' : 'antes';

        return `A marcacao ficou ${deltaLabel} ${deviationDirection} do horario previsto (${expectedClock}) e ultrapassa a tolerancia de ${analysis.schedule?.toleranceMinutes ?? 0} minuto(s).`;
      }

      return 'A batida indica desvio temporal fora da tolerancia esperada e precisa de contexto operacional.';
    }
    case 'location_divergence':
      return 'Os sinais de localizacao aumentam o risco de compliance e impedem automatizacao inicial.';
  }
};

const buildSuggestionReason = (
  exceptionType: AssistedReviewExceptionType,
  recommendedAction: AssistedReviewRecommendedAction,
) => {
  switch (recommendedAction) {
    case 'complete_with_expected_time':
      return 'O historico e o tipo da excecao favorecem revisao em lote com horario esperado.';
    case 'request_employee_confirmation':
      return 'Ainda ha pouca seguranca para completar sem uma confirmacao adicional.';
    case 'review_daily_sequence':
      return 'A ordem das batidas do dia precisa ser reconstruida antes de qualquer ajuste.';
    case 'request_justification':
      return 'A excecao afeta a jornada e deve ser justificada antes do fechamento.';
    case 'escalate_for_compliance_review':
      return 'O caso deve subir para revisao de risco antes de qualquer aprovacao.';
    default:
      return `Acao recomendada: ${exceptionTitle[exceptionType]}.`;
  }
};

const buildDescription = (
  record: AssistedReviewSourceRecord,
  exceptionType: AssistedReviewExceptionType,
  recommendedAction: AssistedReviewRecommendedAction,
) => {
  const actionDescriptions: Record<AssistedReviewRecommendedAction, string> = {
    complete_with_expected_time: 'Sugestao pronta para revisao em lote.',
    request_employee_confirmation: 'Sugestao depende de confirmacao adicional.',
    review_daily_sequence: 'A sequencia do dia precisa ser revisada antes do ajuste.',
    request_justification: 'Solicite justificativa antes de decidir.',
    escalate_for_compliance_review: 'Escalacao recomendada por risco operacional/compliance.',
  };

  return `${record.employeeName} possui um caso de ${exceptionTitle[exceptionType].toLowerCase()}. ${actionDescriptions[recommendedAction]}`;
};

export const buildTimeAdjustmentAssistedReviewCases = ({
  pendingRecords,
  allTimeRecords,
  scheduleContext,
}: BuildTimeAdjustmentCasesInput): AssistedReviewCase[] =>
  pendingRecords.map((record) => {
    const exceptionType = inferExceptionType(record, allTimeRecords, scheduleContext);
    const confidence = inferConfidence(exceptionType, record, allTimeRecords, scheduleContext);
    const recommendedAction = inferRecommendedAction(exceptionType, confidence);
    const closureImpact = inferClosureImpact(exceptionType);
    const routingTarget = inferRoutingTarget(exceptionType, closureImpact, record);
    const priority = inferPriority(exceptionType);
    const batchEligible =
      exceptionType === 'missing_punch' &&
      confidence === 'high' &&
      recommendedAction === 'complete_with_expected_time';

    return {
      recordId: record.id,
      employeeId: record.employeeId,
      employeeName: record.employeeName,
      recordedAt: record.recordedAt,
      recordType: record.recordType,
      priority,
      exceptionType,
      confidence,
      recommendedAction,
      routingTarget,
      batchEligible,
      batchGroupKey: batchEligible ? `${exceptionType}:${recommendedAction}:${record.recordType}` : null,
      closureImpact,
      title: `${exceptionTitle[exceptionType]}: ${record.employeeName}`,
      description: buildDescription(record, exceptionType, recommendedAction),
      confidenceReason: buildConfidenceReason(exceptionType, record, allTimeRecords, scheduleContext),
      suggestionReason: buildSuggestionReason(exceptionType, recommendedAction),
      decisionSummary: `Confianca ${confidenceLabel[confidence]} com sugestao de ${recommendedAction}.`,
    };
  });
