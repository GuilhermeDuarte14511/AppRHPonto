import type { DateValue, Nullable } from '@rh-ponto/types';

export interface WorkScheduleDto {
  id: string;
  name: string;
  startTime: string;
  breakStartTime: Nullable<string>;
  breakEndTime: Nullable<string>;
  endTime: string;
  toleranceMinutes: number;
  expectedDailyMinutes: Nullable<number>;
  isActive: boolean;
  createdAt: DateValue;
  updatedAt: DateValue;
}

export interface WorkScheduleListItemDto {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}
