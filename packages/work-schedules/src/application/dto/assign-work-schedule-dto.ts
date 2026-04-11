import type { DateValue, Nullable } from '@rh-ponto/types';

export interface AssignWorkScheduleDto {
  employeeId: string;
  workScheduleId: string;
  startDate: DateValue;
  endDate?: Nullable<DateValue>;
}

