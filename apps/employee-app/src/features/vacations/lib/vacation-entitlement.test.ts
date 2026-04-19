import { describe, expect, it } from 'vitest';

import type { Employee } from '@rh-ponto/employees';

import type { EmployeeVacationItem } from '@/shared/lib/employee-self-service-api';

import { buildVacationEntitlementSnapshot, resolveVacationAccrualPeriod } from './vacation-entitlement';

const createVacation = (overrides: Partial<EmployeeVacationItem>): EmployeeVacationItem => ({
  id: 'vac-1',
  employeeId: 'emp-1',
  requestedAt: '2026-03-10T10:00:00.000Z',
  startDate: '2026-04-01',
  endDate: '2026-04-10',
  totalDays: 10,
  availableDays: 20,
  accrualPeriod: '2025/2026',
  advanceThirteenthSalary: false,
  cashBonus: false,
  status: 'approved',
  attachmentFileName: null,
  attachmentFileUrl: null,
  coverageNotes: null,
  reviewNotes: null,
  managerApprovalStatus: 'completed',
  managerApprovalActor: null,
  managerApprovalTimestamp: null,
  managerApprovalNotes: null,
  hrApprovalStatus: 'completed',
  hrApprovalActor: null,
  hrApprovalTimestamp: null,
  hrApprovalNotes: null,
  ...overrides,
});

const employee = {
  hireDate: '2022-08-31',
} as Pick<Employee, 'hireDate'>;

describe('resolveVacationAccrualPeriod', () => {
  it('resolve o período aquisitivo atual com base na data de admissão', () => {
    const result = resolveVacationAccrualPeriod('2022-08-31', new Date('2026-04-19T00:00:00.000Z'));

    expect(result?.label).toBe('2025/2026');
    expect(result?.isEligible).toBe(true);
  });

  it('mantém o colaborador inelegível antes do primeiro ciclo completo', () => {
    const result = resolveVacationAccrualPeriod('2025-10-01', new Date('2026-04-19T00:00:00.000Z'));

    expect(result?.label).toBe('2025/2026');
    expect(result?.isEligible).toBe(false);
    expect(result?.availabilityDate).toEqual(new Date('2026-10-01T00:00:00.000Z'));
  });
});

describe('buildVacationEntitlementSnapshot', () => {
  it('desconta apenas férias pendentes ou aprovadas do período atual', () => {
    const snapshot = buildVacationEntitlementSnapshot(
      employee,
      [
        createVacation({ id: 'vac-approved', totalDays: 10, status: 'approved' }),
        createVacation({ id: 'vac-pending', totalDays: 5, status: 'pending' }),
        createVacation({ id: 'vac-rejected', totalDays: 8, status: 'rejected' }),
        createVacation({ id: 'vac-old-period', totalDays: 7, accrualPeriod: '2024/2025', status: 'approved' }),
      ],
      new Date('2026-04-19T00:00:00.000Z'),
    );

    expect(snapshot.accrualPeriodLabel).toBe('2025/2026');
    expect(snapshot.reservedDays).toBe(15);
    expect(snapshot.availableDays).toBe(15);
    expect(snapshot.remainingDaysAfterRequest(6)).toBe(9);
  });
});
