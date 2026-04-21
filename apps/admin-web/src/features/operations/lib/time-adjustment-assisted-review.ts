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
  recordType: TimeRecordType;
  source: TimeRecordSource;
  notes: string | null;
  latitude: number | null;
  longitude: number | null;
  resolvedAddress: string | null;
  referenceRecordId: string | null;
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
}

const sequenceOrder: Record<TimeRecordType, number> = {
  entry: 0,
  break_start: 1,
  break_end: 2,
  exit: 3,
};

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

const normalizeText = (value: string | null | undefined) =>
  (value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

const getDayKey = (value: string) => value.slice(0, 10);

const sortChronologically = (records: AssistedReviewSourceRecord[]) =>
  [...records].sort((left, right) => left.recordedAt.localeCompare(right.recordedAt));

const getDayRecords = (record: AssistedReviewSourceRecord, allRecords: AssistedReviewSourceRecord[]) =>
  sortChronologically(
    allRecords.filter(
      (item) => item.employeeId === record.employeeId && getDayKey(item.recordedAt) === getDayKey(record.recordedAt),
    ),
  );

const detectLocationDivergence = (record: AssistedReviewSourceRecord) => {
  const normalizedNotes = normalizeText(record.notes);

  return (
    normalizedNotes.includes('geolocal') ||
    normalizedNotes.includes('geofence') ||
    normalizedNotes.includes('divergencia') ||
    normalizedNotes.includes('fora do local')
  );
};

const detectOutsideRuleWindow = (record: AssistedReviewSourceRecord) => {
  const normalizedNotes = normalizeText(record.notes);
  const hour = new Date(record.recordedAt).getUTCHours();

  return (
    normalizedNotes.includes('atraso') ||
    normalizedNotes.includes('tolerancia') ||
    normalizedNotes.includes('janela') ||
    normalizedNotes.includes('fora da regra') ||
    normalizedNotes.includes('adiant') ||
    hour < 6 ||
    hour > 22
  );
};

const detectIncompleteSequence = (record: AssistedReviewSourceRecord, allRecords: AssistedReviewSourceRecord[]) => {
  const dayRecords = getDayRecords(record, allRecords);
  const previousRecords = dayRecords.filter((item) => item.recordedAt < record.recordedAt);
  const lastRecord = previousRecords.at(-1) ?? null;
  const duplicateTypeCount = dayRecords.filter((item) => item.recordType === record.recordType).length;
  const normalizedNotes = normalizeText(record.notes);

  if (normalizedNotes.includes('sequencia incompleta') || normalizedNotes.includes('intervalo')) {
    return true;
  }

  if (duplicateTypeCount > 1) {
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

  return false;
};

const inferExceptionType = (
  record: AssistedReviewSourceRecord,
  allRecords: AssistedReviewSourceRecord[],
): AssistedReviewExceptionType => {
  if (detectLocationDivergence(record)) {
    return 'location_divergence';
  }

  if (detectOutsideRuleWindow(record)) {
    return 'outside_rule_window';
  }

  if (detectIncompleteSequence(record, allRecords)) {
    return 'incomplete_sequence';
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
): AssistedReviewConfidence => {
  switch (exceptionType) {
    case 'missing_punch':
      return 'high';
    case 'incomplete_sequence':
      return 'medium';
    case 'outside_rule_window':
      return 'medium';
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
) => {
  switch (exceptionType) {
    case 'missing_punch':
      return 'A sequencia do dia oferece contexto suficiente para completar o ponto com baixo risco.';
    case 'incomplete_sequence': {
      const dayRecords = getDayRecords(record, allRecords);
      return `A jornada de ${getDayKey(record.recordedAt)} possui ${dayRecords.length} batida(s) e a sequencia exige revisao humana.`;
    }
    case 'outside_rule_window':
      return 'A batida indica desvio temporal fora da tolerancia esperada e precisa de contexto operacional.';
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
}: BuildTimeAdjustmentCasesInput): AssistedReviewCase[] =>
  pendingRecords.map((record) => {
    const exceptionType = inferExceptionType(record, allTimeRecords);
    const confidence = inferConfidence(exceptionType, record);
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
      confidenceReason: buildConfidenceReason(exceptionType, record, allTimeRecords),
      suggestionReason: buildSuggestionReason(exceptionType, recommendedAction),
      decisionSummary: `Confianca ${confidenceLabel[confidence]} com sugestao de ${recommendedAction}.`,
    };
  });
