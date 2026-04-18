import type { TimeRecord } from '@rh-ponto/time-records';
import type { TimeRecordSource, TimeRecordStatus, TimeRecordType } from '@rh-ponto/types';

export const timeRecordTypeLabels: Record<TimeRecordType, string> = {
  entry: 'Entrada',
  break_start: 'Saida almoco',
  break_end: 'Volta almoco',
  exit: 'Saida',
};

export const timeRecordStatusLabels: Record<TimeRecordStatus, string> = {
  valid: 'Valido',
  pending_review: 'Em revisao',
  adjusted: 'Ajustado',
  rejected: 'Rejeitado',
};

export const timeRecordSourceLabels: Record<TimeRecordSource, string> = {
  kiosk: 'Kiosk da empresa',
  employee_app: 'Aplicativo do colaborador',
  admin_adjustment: 'Ajuste administrativo',
};

export const timeRecordStatusDescriptions: Record<TimeRecordStatus, string> = {
  valid: 'A marcacao entrou normalmente na jornada e nao exige acao adicional.',
  pending_review: 'O registro foi aceito, mas seguira para analise operacional do RH.',
  adjusted: 'A batida passou por ajuste posterior com trilha de auditoria preservada.',
  rejected: 'A marcacao foi rejeitada e pode precisar de justificativa complementar.',
};

export const orderedTimeRecordTypes: TimeRecordType[] = ['entry', 'break_start', 'break_end', 'exit'];

const dayStepCopyByNextType: Record<
  TimeRecordType,
  { dayStatusLabel: string; currentStepLabel: string; currentStepDescription: string }
> = {
  entry: {
    dayStatusLabel: 'Aguardando entrada',
    currentStepLabel: 'Entrada do dia',
    currentStepDescription: 'Esta sera a primeira batida da sua jornada hoje.',
  },
  break_start: {
    dayStatusLabel: 'Aguardando saida para almoco',
    currentStepLabel: 'Saida para almoco',
    currentStepDescription: 'A entrada de hoje ja foi registrada. A proxima batida esperada e a saida para o almoco.',
  },
  break_end: {
    dayStatusLabel: 'Aguardando volta do almoco',
    currentStepLabel: 'Volta do almoco',
    currentStepDescription: 'A saida para almoco ja foi registrada. Agora o sistema espera a volta do intervalo.',
  },
  exit: {
    dayStatusLabel: 'Aguardando saida',
    currentStepLabel: 'Saida do dia',
    currentStepDescription: 'A jornada esta em andamento e a proxima batida esperada e a saida.',
  },
};

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
});

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export interface DailyTimeRecordFlow {
  acceptedRecords: TimeRecord[];
  completedTypes: TimeRecordType[];
  currentStepLabel: string;
  currentStepDescription: string;
  dayStatusLabel: string;
  isComplete: boolean;
  hasUnexpectedSequence: boolean;
  lastAcceptedRecordType: TimeRecordType | null;
  nextRecordType: TimeRecordType | null;
}

export const formatTimeRecordDateTime = (value: string | Date) => dateTimeFormatter.format(new Date(value));

export const formatTimeRecordDate = (value: string | Date) => dateFormatter.format(new Date(value));

export const formatTimeRecordTime = (value: string | Date) => timeFormatter.format(new Date(value));

export const sortTimeRecordsNewestFirst = (records: TimeRecord[]) =>
  records.slice().sort((left, right) => new Date(right.recordedAt).getTime() - new Date(left.recordedAt).getTime());

export const sortTimeRecordsOldestFirst = (records: TimeRecord[]) =>
  records.slice().sort((left, right) => new Date(left.recordedAt).getTime() - new Date(right.recordedAt).getTime());

export const getRecordsForDay = (records: TimeRecord[], referenceDate = new Date()) => {
  const start = new Date(referenceDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(referenceDate);
  end.setHours(23, 59, 59, 999);

  return sortTimeRecordsOldestFirst(
    records.filter((record) => {
      const recordedAt = new Date(record.recordedAt);

      return recordedAt >= start && recordedAt <= end;
    }),
  );
};

export const resolveDailyTimeRecordFlow = (
  records: TimeRecord[],
  referenceDate = new Date(),
): DailyTimeRecordFlow => {
  const todayRecords = getRecordsForDay(records, referenceDate);
  const acceptedRecords = todayRecords.filter((record) => record.status !== 'rejected');
  const completedTypes: TimeRecordType[] = [];
  let expectedIndex = 0;
  let hasUnexpectedSequence = false;

  for (const record of acceptedRecords) {
    const expectedType = orderedTimeRecordTypes[expectedIndex];

    if (record.recordType === expectedType) {
      completedTypes.push(record.recordType);
      expectedIndex += 1;
      continue;
    }

    hasUnexpectedSequence = true;
  }

  const isComplete = expectedIndex >= orderedTimeRecordTypes.length;
  const nextRecordType = isComplete ? null : orderedTimeRecordTypes[expectedIndex];
  const lastAcceptedRecordType = acceptedRecords.at(-1)?.recordType ?? null;

  if (isComplete) {
    return {
      acceptedRecords,
      completedTypes,
      currentStepLabel: 'Jornada encerrada',
      currentStepDescription:
        'As quatro batidas esperadas para hoje ja foram registradas. Se precisar registrar algo fora do fluxo, escolha manualmente o tipo da batida.',
      dayStatusLabel: 'Jornada concluida',
      isComplete: true,
      hasUnexpectedSequence,
      lastAcceptedRecordType,
      nextRecordType: null,
    };
  }

  const stepCopy = dayStepCopyByNextType[nextRecordType!];

  return {
    acceptedRecords,
    completedTypes,
    currentStepLabel: stepCopy.currentStepLabel,
    currentStepDescription: hasUnexpectedSequence
      ? 'Ha uma divergencia na sequencia das batidas do dia. O tipo abaixo segue a proxima etapa esperada, mas o RH pode revisar esse fluxo.'
      : stepCopy.currentStepDescription,
    dayStatusLabel: hasUnexpectedSequence ? `${stepCopy.dayStatusLabel} com revisao` : stepCopy.dayStatusLabel,
    isComplete: false,
    hasUnexpectedSequence,
    lastAcceptedRecordType,
    nextRecordType,
  };
};

export const resolveNextTimeRecordType = (records: TimeRecord[], referenceDate = new Date()) =>
  resolveDailyTimeRecordFlow(records, referenceDate).nextRecordType;

export const resolveNextTimeRecordTypeAfter = (recordType: TimeRecordType) => {
  const currentIndex = orderedTimeRecordTypes.indexOf(recordType);

  if (currentIndex === -1 || currentIndex === orderedTimeRecordTypes.length - 1) {
    return null;
  }

  return orderedTimeRecordTypes[currentIndex + 1];
};

export const filterTimeRecordsByPreset = (
  records: TimeRecord[],
  preset: 'all' | 'today' | 'week' | 'pending_review',
  referenceDate = new Date(),
) => {
  if (preset === 'all') {
    return records;
  }

  if (preset === 'today') {
    return getRecordsForDay(records, referenceDate);
  }

  if (preset === 'pending_review') {
    return records.filter((record) => record.status === 'pending_review');
  }

  const start = new Date(referenceDate);
  start.setDate(start.getDate() - 7);

  return records.filter((record) => new Date(record.recordedAt) >= start);
};

export const calculateWorkedMinutes = (records: TimeRecord[], referenceDate = new Date()) => {
  const todayRecords = getRecordsForDay(records, referenceDate).filter((record) => record.status !== 'rejected');
  let openRangeStartedAt: Date | null = null;
  let totalMinutes = 0;

  for (const record of todayRecords) {
    const recordedAt = new Date(record.recordedAt);

    if (record.recordType === 'entry' || record.recordType === 'break_end') {
      openRangeStartedAt = recordedAt;
      continue;
    }

    if ((record.recordType === 'break_start' || record.recordType === 'exit') && openRangeStartedAt) {
      totalMinutes += Math.max((recordedAt.getTime() - openRangeStartedAt.getTime()) / 60000, 0);
      openRangeStartedAt = null;
    }
  }

  if (openRangeStartedAt) {
    totalMinutes += Math.max((referenceDate.getTime() - openRangeStartedAt.getTime()) / 60000, 0);
  }

  return Math.round(totalMinutes);
};

export const formatDurationFromMinutes = (minutes: number) => {
  const normalizedMinutes = Math.max(minutes, 0);
  const hours = Math.floor(normalizedMinutes / 60);
  const remainingMinutes = normalizedMinutes % 60;

  return `${String(hours).padStart(2, '0')}h ${String(remainingMinutes).padStart(2, '0')}m`;
};
