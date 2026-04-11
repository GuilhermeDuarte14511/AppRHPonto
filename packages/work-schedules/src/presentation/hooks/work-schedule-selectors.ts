import type { WorkSchedule } from '../../domain/entities/work-schedule';

export const toWorkScheduleLabel = (schedule: WorkSchedule): string =>
  `${schedule.name} (${schedule.startTime} - ${schedule.endTime})`;

