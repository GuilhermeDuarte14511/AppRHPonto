import type { TimeRecordSource, TimeRecordStatus, TimeRecordType } from '@rh-ponto/types';

import type { TimeRecord } from '../../domain/entities/time-record';

const timeRecordTypeLabels: Record<TimeRecordType, string> = {
  entry: 'Entrada',
  break_start: 'Início do intervalo',
  break_end: 'Fim do intervalo',
  exit: 'Saída',
};

const timeRecordStatusLabels: Record<TimeRecordStatus, string> = {
  valid: 'Válido',
  pending_review: 'Em revisão',
  adjusted: 'Ajustado',
  rejected: 'Rejeitado',
};

const timeRecordSourceLabels: Record<TimeRecordSource, string> = {
  kiosk: 'Kiosk da empresa',
  employee_app: 'Aplicativo do colaborador',
  admin_adjustment: 'Ajuste administrativo',
};

export interface TimeRecordViewModel {
  id: string;
  employeeId: string;
  typeLabel: string;
  statusLabel: string;
  sourceLabel: string;
}

export const toTimeRecordViewModel = (record: TimeRecord): TimeRecordViewModel => ({
  id: record.id,
  employeeId: record.employeeId,
  typeLabel: timeRecordTypeLabels[record.recordType],
  statusLabel: timeRecordStatusLabels[record.status],
  sourceLabel: timeRecordSourceLabels[record.source],
});
