import {
  assignWorkScheduleToEmployee,
  createWorkSchedule as createWorkScheduleMutation,
  getWorkScheduleById,
  listEmployeeScheduleHistory,
  listWorkSchedules,
  updateWorkSchedule,
  type AssignWorkScheduleToEmployeeVariables,
  type CreateWorkScheduleVariables,
  type GetWorkScheduleByIdData,
  type ListEmployeeScheduleHistoryData,
  type ListWorkSchedulesData,
  type UpdateWorkScheduleVariables,
} from '@rh-ponto/api-client/generated';
import { getAppDataConnect } from '@rh-ponto/api-client';
import { AppError } from '@rh-ponto/core';

import {
  createEmployeeScheduleHistory,
  createWorkSchedule,
  type EmployeeScheduleHistory,
  type WorkSchedule,
} from '../../../domain/entities/work-schedule';
import type {
  AssignWorkSchedulePayload,
  CreateWorkSchedulePayload,
  UpdateWorkSchedulePayload,
  WorkScheduleRepository,
} from '../../../domain/repositories/work-schedule-repository';

const mapScheduleRecord = (
  record: ListWorkSchedulesData['workSchedules'][number] | NonNullable<GetWorkScheduleByIdData['workSchedule']>,
): WorkSchedule =>
  createWorkSchedule({
    id: record.id,
    name: record.name,
    startTime: record.startTime,
    breakStartTime: record.breakStartTime ?? null,
    breakEndTime: record.breakEndTime ?? null,
    endTime: record.endTime,
    toleranceMinutes: record.toleranceMinutes,
    expectedDailyMinutes: record.expectedDailyMinutes ?? null,
    isActive: record.isActive,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  });

const mapHistoryRecord = (record: ListEmployeeScheduleHistoryData['employeeScheduleHistories'][number]): EmployeeScheduleHistory =>
  createEmployeeScheduleHistory({
    id: record.id,
    employeeId: record.employee.id,
    workScheduleId: record.workSchedule.id,
    startDate: record.startDate,
    endDate: record.endDate ?? null,
    isCurrent: record.isCurrent,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  });

const toDate = (value: string | Date | null | undefined): string | null => {
  if (!value) {
    return null;
  }

  return typeof value === 'string' ? value : value.toISOString().slice(0, 10);
};

const buildCreateVariables = (payload: CreateWorkSchedulePayload): CreateWorkScheduleVariables => ({
  name: payload.name,
  startTime: payload.startTime,
  breakStartTime: payload.breakStartTime ?? null,
  breakEndTime: payload.breakEndTime ?? null,
  endTime: payload.endTime,
  toleranceMinutes: payload.toleranceMinutes,
  expectedDailyMinutes: payload.expectedDailyMinutes ?? null,
  isActive: payload.isActive,
});

const buildUpdateVariables = (payload: UpdateWorkSchedulePayload): UpdateWorkScheduleVariables => ({
  id: payload.id,
  name: payload.name,
  startTime: payload.startTime,
  breakStartTime: payload.breakStartTime,
  breakEndTime: payload.breakEndTime,
  endTime: payload.endTime,
  toleranceMinutes: payload.toleranceMinutes,
  expectedDailyMinutes: payload.expectedDailyMinutes,
  isActive: payload.isActive,
});

const buildAssignVariables = (payload: AssignWorkSchedulePayload): AssignWorkScheduleToEmployeeVariables => ({
  employeeId: payload.employeeId,
  workScheduleId: payload.workScheduleId,
  startDate: toDate(payload.startDate)!,
  endDate: toDate(payload.endDate),
});

export class DataConnectWorkScheduleRepository implements WorkScheduleRepository {
  async list(): Promise<WorkSchedule[]> {
    const { data } = await listWorkSchedules(getAppDataConnect());

    return data.workSchedules.map(mapScheduleRecord);
  }

  async getById(id: string): Promise<WorkSchedule | null> {
    const { data } = await getWorkScheduleById(getAppDataConnect(), { id });

    return data.workSchedule ? mapScheduleRecord(data.workSchedule) : null;
  }

  async create(payload: CreateWorkSchedulePayload): Promise<WorkSchedule> {
    const { data } = await createWorkScheduleMutation(getAppDataConnect(), buildCreateVariables(payload));
    const schedule = await this.getById(data.workSchedule_insert.id);

    if (!schedule) {
      throw new AppError('WORK_SCHEDULE_NOT_FOUND_AFTER_CREATE', 'Jornada não encontrada após criação.');
    }

    return schedule;
  }

  async update(payload: UpdateWorkSchedulePayload): Promise<WorkSchedule> {
    const { data } = await updateWorkSchedule(getAppDataConnect(), buildUpdateVariables(payload));
    const scheduleId = data.workSchedule_update?.id;

    if (!scheduleId) {
      throw new AppError('WORK_SCHEDULE_NOT_FOUND', 'Jornada não encontrada para atualização.');
    }

    const schedule = await this.getById(scheduleId);

    if (!schedule) {
      throw new AppError('WORK_SCHEDULE_NOT_FOUND_AFTER_UPDATE', 'Jornada não encontrada após atualização.');
    }

    return schedule;
  }

  async assignToEmployee(payload: AssignWorkSchedulePayload): Promise<EmployeeScheduleHistory> {
    const { data } = await assignWorkScheduleToEmployee(getAppDataConnect(), buildAssignVariables(payload));
    const items = await this.listEmployeeScheduleHistory(payload.employeeId);
    const history = items.find((item) => item.id === data.employeeScheduleHistory_insert.id);

    if (!history) {
      throw new AppError('WORK_SCHEDULE_HISTORY_NOT_FOUND_AFTER_CREATE', 'Histórico de jornada não encontrado.');
    }

    return history;
  }

  async listEmployeeScheduleHistory(employeeId: string): Promise<EmployeeScheduleHistory[]> {
    const { data } = await listEmployeeScheduleHistory(getAppDataConnect());

    return data.employeeScheduleHistories.map(mapHistoryRecord).filter((item) => item.employeeId === employeeId);
  }
}
