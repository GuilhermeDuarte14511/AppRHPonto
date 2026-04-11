import type { EmployeeScheduleHistory, WorkSchedule } from '../../domain/entities/work-schedule';
import type {
  AssignWorkSchedulePayload,
  CreateWorkSchedulePayload,
  UpdateWorkSchedulePayload,
  WorkScheduleRepository,
} from '../../domain/repositories/work-schedule-repository';

let schedules: WorkSchedule[] = [
  {
    id: 'ws-1',
    name: 'Horário comercial',
    startTime: '09:00',
    breakStartTime: '12:00',
    breakEndTime: '13:00',
    endTime: '18:00',
    toleranceMinutes: 10,
    expectedDailyMinutes: 480,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

let history: EmployeeScheduleHistory[] = [
  {
    id: 'esh-1',
    employeeId: 'emp-1',
    workScheduleId: 'ws-1',
    startDate: '2026-01-01',
    endDate: null,
    isCurrent: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

export class MockWorkSchedulesRepository implements WorkScheduleRepository {
  async list(): Promise<WorkSchedule[]> {
    return schedules;
  }

  async getById(id: string): Promise<WorkSchedule | null> {
    return schedules.find((schedule) => schedule.id === id) ?? null;
  }

  async create(payload: CreateWorkSchedulePayload): Promise<WorkSchedule> {
    const schedule: WorkSchedule = {
      id: `ws-${schedules.length + 1}`,
      breakStartTime: payload.breakStartTime ?? null,
      breakEndTime: payload.breakEndTime ?? null,
      expectedDailyMinutes: payload.expectedDailyMinutes ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...payload,
    };

    schedules = [schedule, ...schedules];

    return schedule;
  }

  async update(payload: UpdateWorkSchedulePayload): Promise<WorkSchedule> {
    const existing = schedules.find((schedule) => schedule.id === payload.id);

    if (!existing) {
      throw new Error('Work schedule not found.');
    }

    const updated: WorkSchedule = {
      ...existing,
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    schedules = schedules.map((schedule) => (schedule.id === updated.id ? updated : schedule));

    return updated;
  }

  async assignToEmployee(payload: AssignWorkSchedulePayload): Promise<EmployeeScheduleHistory> {
    history = history.map((item) =>
      item.employeeId === payload.employeeId && item.isCurrent
        ? {
            ...item,
            isCurrent: false,
            endDate: payload.startDate,
            updatedAt: new Date().toISOString(),
          }
        : item,
    );

    const nextHistoryItem: EmployeeScheduleHistory = {
      id: `esh-${history.length + 1}`,
      employeeId: payload.employeeId,
      workScheduleId: payload.workScheduleId,
      startDate: payload.startDate,
      endDate: payload.endDate ?? null,
      isCurrent: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    history = [nextHistoryItem, ...history];

    return nextHistoryItem;
  }

  async listEmployeeScheduleHistory(employeeId: string): Promise<EmployeeScheduleHistory[]> {
    return history.filter((item) => item.employeeId === employeeId);
  }
}
