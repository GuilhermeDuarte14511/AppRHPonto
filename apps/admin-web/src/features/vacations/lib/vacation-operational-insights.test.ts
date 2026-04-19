import { describe, expect, it } from 'vitest';

import type { VacationRequest } from '../types/vacation-request';

import { attachVacationOperationalInsights, buildVacationOperationalInsight } from './vacation-operational-insights';

const createVacationRequest = (overrides: Partial<VacationRequest>): VacationRequest => ({
  id: 'vac-1',
  employeeId: 'emp-1',
  employeeName: 'Ana Paula',
  employeeEmail: 'ana@empresa.com',
  department: 'Operações',
  position: 'Analista',
  requestedAt: '2026-04-01T10:00:00.000Z',
  startDate: '2026-07-10',
  endDate: '2026-07-20',
  totalDays: 11,
  availableDays: 19,
  accrualPeriod: '2025/2026',
  advanceThirteenthSalary: false,
  cashBonus: false,
  status: 'pending',
  attachment: null,
  coverageNotes: null,
  managerApproval: {
    label: 'Gestão imediata',
    status: 'pending',
    actor: 'RH',
    notes: 'Pendente',
    timestamp: null,
  },
  hrApproval: {
    label: 'RH',
    status: 'pending',
    actor: 'RH',
    notes: 'Pendente',
    timestamp: null,
  },
  reviewNotes: null,
  createdAt: '2026-04-01T10:00:00.000Z',
  updatedAt: '2026-04-01T10:00:00.000Z',
  operationalInsight: {
    overlapCount: 0,
    overlappingApprovedCount: 0,
    overlappingPendingCount: 0,
    overlappingEmployeeNames: [],
    coverageRisk: 'low',
    summary: '',
  },
  ...overrides,
});

describe('buildVacationOperationalInsight', () => {
  it('identifica conflitos ativos na mesma área e período', () => {
    const currentRequest = createVacationRequest({});
    const insight = buildVacationOperationalInsight(currentRequest, [
      currentRequest,
      createVacationRequest({
        id: 'vac-2',
        employeeName: 'João Pereira',
        status: 'approved',
        startDate: '2026-07-15',
        endDate: '2026-07-25',
      }),
      createVacationRequest({
        id: 'vac-3',
        employeeName: 'Marina Costa',
        status: 'rejected',
        startDate: '2026-07-12',
        endDate: '2026-07-14',
      }),
      createVacationRequest({
        id: 'vac-4',
        employeeName: 'Carlos Lima',
        department: 'Financeiro',
        status: 'pending',
        startDate: '2026-07-12',
        endDate: '2026-07-16',
      }),
    ]);

    expect(insight.overlapCount).toBe(1);
    expect(insight.overlappingApprovedCount).toBe(1);
    expect(insight.coverageRisk).toBe('medium');
    expect(insight.overlappingEmployeeNames).toEqual(['João Pereira']);
  });
});

describe('attachVacationOperationalInsights', () => {
  it('enriquece a lista inteira com risco de cobertura', () => {
    const requests = attachVacationOperationalInsights([
      createVacationRequest({ id: 'vac-1' }),
      createVacationRequest({
        id: 'vac-2',
        employeeName: 'João Pereira',
        status: 'approved',
        startDate: '2026-07-11',
        endDate: '2026-07-18',
      }),
      createVacationRequest({
        id: 'vac-3',
        employeeName: 'Bia Santos',
        status: 'pending',
        startDate: '2026-07-12',
        endDate: '2026-07-19',
      }),
    ]);

    expect(requests[0]?.operationalInsight.coverageRisk).toBe('high');
    expect(requests[0]?.operationalInsight.overlapCount).toBe(2);
  });
});
