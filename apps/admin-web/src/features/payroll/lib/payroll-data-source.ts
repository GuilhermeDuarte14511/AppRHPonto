import { getAppDataConnect } from '@rh-ponto/api-client';
import {
  createPayrollClosure,
  getPayrollClosureByReferenceKey,
  updatePayrollClosure,
} from '@rh-ponto/api-client/generated';

import { fetchAdminLiveDataSnapshot } from '@/shared/lib/admin-live-data';

import { createPayrollAuditEvent } from './payroll-audit-service';
import { buildPayrollState, buildPeriodBounds } from './payroll-record-builder';
import type { PayrollClosureState, PayrollRecordDetail, PeriodBounds } from './payroll-types';

export type { PayrollClosureState, PayrollRecordDetail } from './payroll-types';

interface PersistedPayrollStateEnvelope {
  kind: 'payroll-closure-state';
  version: 1;
  state: PayrollClosureState;
}

const createReferenceKey = (referenceYear: number, referenceMonth: number) =>
  `${referenceYear}-${String(referenceMonth).padStart(2, '0')}`;

const isPayrollClosureState = (value: unknown): value is PayrollClosureState => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<PayrollClosureState>;

  return (
    typeof candidate.periodLabel === 'string' &&
    typeof candidate.progress === 'number' &&
    typeof candidate.validated === 'number' &&
    typeof candidate.employeesTotal === 'number' &&
    typeof candidate.pending === 'number' &&
    typeof candidate.overtime === 'string' &&
    typeof candidate.criticalIssues === 'number' &&
    typeof candidate.isClosed === 'boolean' &&
    Array.isArray(candidate.records)
  );
};

const isPersistedPayrollStateEnvelope = (value: unknown): value is PersistedPayrollStateEnvelope => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<PersistedPayrollStateEnvelope>;

  return candidate.kind === 'payroll-closure-state' && candidate.version === 1 && isPayrollClosureState(candidate.state);
};

const createClosureEnvelope = (state: PayrollClosureState): PersistedPayrollStateEnvelope => ({
  kind: 'payroll-closure-state',
  version: 1,
  state: {
    ...state,
    isClosed: true,
  },
});

const readPersistedState = async (referenceKey: string): Promise<{
  closureId: string;
  state: PayrollClosureState;
} | null> => {
  const { data } = await getPayrollClosureByReferenceKey(getAppDataConnect(), { referenceKey });
  const closure = data.payrollClosures[0];

  if (!closure || !isPersistedPayrollStateEnvelope(closure.stateData)) {
    return null;
  }

  return {
    closureId: closure.id,
    state: closure.stateData.state,
  };
};

const closePayrollForPeriod = async (input: {
  state: PayrollClosureState;
  period: PeriodBounds;
  notes?: string;
  userId?: string | null;
}) => {
  const referenceYear = input.period.year;
  const referenceMonth = input.period.month + 1;
  const referenceKey = createReferenceKey(referenceYear, referenceMonth);
  const envelope = createClosureEnvelope(input.state);
  const existingClosure = await readPersistedState(referenceKey);

  if (existingClosure) {
    await updatePayrollClosure(getAppDataConnect(), {
      id: existingClosure.closureId,
      status: 'closed',
      notes: input.notes?.trim() || 'Folha encerrada e consolidada para consulta.',
      closedByUserId: input.userId ?? null,
      stateData: envelope,
    });
  } else {
    await createPayrollClosure(getAppDataConnect(), {
      referenceKey,
      referenceLabel: input.period.label,
      referenceYear,
      referenceMonth,
      periodStart: input.period.start.toISOString().slice(0, 10),
      periodEnd: input.period.end.toISOString().slice(0, 10),
      status: 'closed',
      notes: input.notes?.trim() || 'Folha encerrada e consolidada para consulta.',
      closedByUserId: input.userId ?? null,
      stateData: envelope,
    });
  }

  return {
    referenceKey,
    previousState: existingClosure?.state ?? null,
    persistedState: envelope.state,
  };
};

export const getPayrollOverview = async (): Promise<PayrollClosureState> => {
  const liveSnapshot = await fetchAdminLiveDataSnapshot();
  const period = buildPeriodBounds(liveSnapshot);
  const persisted = await readPersistedState(createReferenceKey(period.year, period.month + 1));

  if (persisted) {
    return persisted.state;
  }

  return buildPayrollState(liveSnapshot);
};

export const getPayrollRecordDetail = async (id: string): Promise<PayrollRecordDetail | null> => {
  const state = await getPayrollOverview();

  return state.records.find((record) => record.id === id) ?? null;
};

export const validateAllPayrollRecords = async (notes?: string, userId?: string | null) => {
  const liveSnapshot = await fetchAdminLiveDataSnapshot();
  const period = buildPeriodBounds(liveSnapshot);
  const state = buildPayrollState(liveSnapshot);
  const referenceKey = createReferenceKey(period.year, period.month + 1);

  await createPayrollAuditEvent({
    userId,
    action: 'payroll.validated_all',
    description: notes?.trim() || 'Fechamento validado em lote pelo RH.',
    entityId: referenceKey,
    newData: createClosureEnvelope({
      ...state,
      isClosed: false,
    }),
  });

  return state;
};

export const closePayrollCycle = async (notes?: string, userId?: string | null) => {
  const liveSnapshot = await fetchAdminLiveDataSnapshot();
  const period = buildPeriodBounds(liveSnapshot);
  const state = buildPayrollState(liveSnapshot);
  const persisted = await closePayrollForPeriod({
    state,
    period,
    notes,
    userId,
  });

  await createPayrollAuditEvent({
    userId,
    action: 'payroll.closed',
    description: notes?.trim() || 'Folha encerrada e liberada para auditoria.',
    entityId: persisted.referenceKey,
    oldData: persisted.previousState ? createClosureEnvelope(persisted.previousState) : null,
    newData: createClosureEnvelope(persisted.persistedState),
  });

  return persisted.persistedState;
};

export const validatePayrollRecord = async (id: string, userId?: string | null) => {
  const record = await getPayrollRecordDetail(id);

  await createPayrollAuditEvent({
    userId,
    action: 'payroll.record.validated',
    description: 'Espelho individual validado pelo RH.',
    entityId: id,
    newData: record,
  });

  return record;
};
