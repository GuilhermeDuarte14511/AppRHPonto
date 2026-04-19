import type { Employee } from '@rh-ponto/employees';

import type { EmployeeVacationItem } from '@/shared/lib/employee-self-service-api';

const VACATION_ALLOWANCE_DAYS = 30;
const ACTIVE_VACATION_STATUSES = new Set(['pending', 'approved']);

const startOfDay = (value: string | Date) => {
  const date = new Date(value);

  date.setUTCHours(0, 0, 0, 0);

  return date;
};

const addYears = (value: Date, years: number) => {
  const nextDate = new Date(value);

  nextDate.setUTCFullYear(nextDate.getUTCFullYear() + years);

  return nextDate;
};

const getCompletedHireCycles = (hireDate: Date, referenceDate: Date) => {
  let completedCycles = referenceDate.getFullYear() - hireDate.getFullYear();
  const anniversaryThisYear = addYears(hireDate, completedCycles);

  if (anniversaryThisYear > referenceDate) {
    completedCycles -= 1;
  }

  return Math.max(completedCycles, 0);
};

export interface VacationEntitlementSnapshot {
  accrualPeriodLabel: string | null;
  accrualStartDate: string | null;
  accrualEndDate: string | null;
  availabilityDate: string | null;
  availableDays: number;
  reservedDays: number;
  allowanceDays: number;
  isEligible: boolean;
  remainingDaysAfterRequest: (requestedDays: number) => number;
}

export const resolveVacationAccrualPeriod = (
  hireDate: string | Date | null | undefined,
  referenceDate = new Date(),
) => {
  if (!hireDate) {
    return null;
  }

  const normalizedHireDate = startOfDay(hireDate);

  if (Number.isNaN(normalizedHireDate.getTime())) {
    return null;
  }

  const normalizedReferenceDate = startOfDay(referenceDate);
  const completedCycles = getCompletedHireCycles(normalizedHireDate, normalizedReferenceDate);
  const accrualStartDate = addYears(normalizedHireDate, completedCycles);
  const accrualEndDate = addYears(accrualStartDate, 1);
  const availabilityDate = addYears(normalizedHireDate, 1);

  return {
    label: `${accrualStartDate.getUTCFullYear()}/${accrualStartDate.getUTCFullYear() + 1}`,
    accrualStartDate,
    accrualEndDate,
    availabilityDate,
    isEligible: normalizedReferenceDate >= availabilityDate,
  };
};

const resolveVacationAccrualLabelForItem = (
  item: EmployeeVacationItem,
  hireDate: string | Date | null | undefined,
) => {
  if (item.accrualPeriod) {
    return item.accrualPeriod;
  }

  return resolveVacationAccrualPeriod(hireDate, new Date(item.requestedAt))?.label ?? null;
};

export const buildVacationEntitlementSnapshot = (
  employee: Pick<Employee, 'hireDate'> | null | undefined,
  vacations: EmployeeVacationItem[],
  referenceDate = new Date(),
): VacationEntitlementSnapshot => {
  const accrualPeriod = resolveVacationAccrualPeriod(employee?.hireDate ?? null, referenceDate);
  const accrualLabel = accrualPeriod?.label ?? null;
  const reservedDays = accrualLabel
    ? vacations
        .filter(
          (item) =>
            ACTIVE_VACATION_STATUSES.has(item.status) &&
            resolveVacationAccrualLabelForItem(item, employee?.hireDate ?? null) === accrualLabel,
        )
        .reduce((total, item) => total + item.totalDays, 0)
    : 0;
  const availableDays = Math.max(VACATION_ALLOWANCE_DAYS - reservedDays, 0);

  return {
    accrualPeriodLabel: accrualLabel,
    accrualStartDate: accrualPeriod?.accrualStartDate.toISOString() ?? null,
    accrualEndDate: accrualPeriod?.accrualEndDate.toISOString() ?? null,
    availabilityDate: accrualPeriod?.availabilityDate.toISOString() ?? null,
    availableDays,
    reservedDays,
    allowanceDays: VACATION_ALLOWANCE_DAYS,
    isEligible: accrualPeriod?.isEligible ?? false,
    remainingDaysAfterRequest: (requestedDays: number) =>
      Math.max(availableDays - Math.max(requestedDays, 0), 0),
  };
};
