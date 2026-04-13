import type { TimeRecord } from '@rh-ponto/time-records';
import type { TimeRecordSource, TimeRecordStatus, TimeRecordType } from '@rh-ponto/types';

export const timeRecordTypeLabels: Record<TimeRecordType, string> = {
  entry: 'Entrada',
  break_start: 'Saída almoço',
  break_end: 'Volta almoço',
  exit: 'Saída',
};

export const timeRecordStatusLabels: Record<TimeRecordStatus, string> = {
  valid: 'Válido',
  pending_review: 'Em revisão',
  adjusted: 'Ajustado',
  rejected: 'Rejeitado',
};

export const timeRecordSourceLabels: Record<TimeRecordSource, string> = {
  kiosk: 'Kiosk da empresa',
  employee_app: 'Aplicativo do colaborador',
  admin_adjustment: 'Ajuste administrativo',
};

export const timeRecordStatusDescriptions: Record<TimeRecordStatus, string> = {
  valid: 'A marcação entrou normalmente na jornada e não exige ação adicional.',
  pending_review: 'O registro foi aceito, mas seguirá para análise operacional do RH.',
  adjusted: 'A batida passou por ajuste posterior com trilha de auditoria preservada.',
  rejected: 'A marcação foi rejeitada e pode precisar de justificativa complementar.',
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

export const resolveNextTimeRecordType = (records: TimeRecord[], referenceDate = new Date()): TimeRecordType => {
  const todayRecords = getRecordsForDay(records, referenceDate);
  const lastRecord = todayRecords.at(-1);

  switch (lastRecord?.recordType) {
    case 'entry':
      return 'break_start';
    case 'break_start':
      return 'break_end';
    case 'break_end':
      return 'exit';
    case 'exit':
    default:
      return 'entry';
  }
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
  const todayRecords = getRecordsForDay(records, referenceDate);
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
