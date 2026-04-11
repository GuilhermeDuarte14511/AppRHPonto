import { fetchAdminLiveDataSnapshot } from '@/shared/lib/admin-live-data';

import { createPayrollAuditEvent } from './payroll-audit-service';
import { buildPayrollState } from './payroll-record-builder';
import type { PayrollClosureState, PayrollRecordDetail } from './payroll-types';

export type { PayrollClosureState, PayrollRecordDetail } from './payroll-types';

export const getPayrollOverview = async (): Promise<PayrollClosureState> =>
  buildPayrollState(await fetchAdminLiveDataSnapshot());

export const getPayrollRecordDetail = async (id: string): Promise<PayrollRecordDetail | null> => {
  const state = buildPayrollState(await fetchAdminLiveDataSnapshot());

  return state.records.find((record) => record.id === id) ?? null;
};

export const validateAllPayrollRecords = async (notes?: string) => {
  await createPayrollAuditEvent({
    action: 'payroll.validated_all',
    description: notes?.trim() || 'Fechamento validado em lote pelo RH.',
  });

  return getPayrollOverview();
};

export const closePayrollCycle = async (notes?: string) => {
  await createPayrollAuditEvent({
    action: 'payroll.closed',
    description: notes?.trim() || 'Folha encerrada e liberada para auditoria.',
  });

  return getPayrollOverview();
};

export const validatePayrollRecord = async (id: string) => {
  await createPayrollAuditEvent({
    action: 'payroll.record.validated',
    description: 'Espelho individual validado pelo RH.',
    entityId: id,
  });

  return getPayrollRecordDetail(id);
};
