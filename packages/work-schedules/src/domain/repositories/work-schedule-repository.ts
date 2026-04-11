import type { DateValue, Nullable } from '@rh-ponto/types';

import type { EmployeeScheduleHistory, WorkSchedule } from '../entities/work-schedule';

export interface CreateWorkSchedulePayload {
  name: string;
  startTime: string;
  breakStartTime?: Nullable<string>;
  breakEndTime?: Nullable<string>;
  endTime: string;
  toleranceMinutes: number;
  expectedDailyMinutes?: Nullable<number>;
  isActive: boolean;
}

export interface UpdateWorkSchedulePayload extends Partial<CreateWorkSchedulePayload> {
  id: string;
}

export interface AssignWorkSchedulePayload {
  employeeId: string;
  workScheduleId: string;
  startDate: DateValue;
  endDate?: Nullable<DateValue>;
}

export interface WorkScheduleRepository {
  list(): Promise<WorkSchedule[]>;
  getById(id: string): Promise<WorkSchedule | null>;
  create(payload: CreateWorkSchedulePayload): Promise<WorkSchedule>;
  update(payload: UpdateWorkSchedulePayload): Promise<WorkSchedule>;
  assignToEmployee(payload: AssignWorkSchedulePayload): Promise<EmployeeScheduleHistory>;
  listEmployeeScheduleHistory(employeeId: string): Promise<EmployeeScheduleHistory[]>;
}

