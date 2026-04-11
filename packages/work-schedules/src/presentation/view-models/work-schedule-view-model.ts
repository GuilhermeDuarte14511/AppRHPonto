import type { WorkSchedule } from '../../domain/entities/work-schedule';

export interface WorkScheduleViewModel {
  id: string;
  label: string;
  window: string;
  toleranceLabel: string;
}

export const toWorkScheduleViewModel = (schedule: WorkSchedule): WorkScheduleViewModel => ({
  id: schedule.id,
  label: schedule.name,
  window: `${schedule.startTime} - ${schedule.endTime}`,
  toleranceLabel: `${schedule.toleranceMinutes} min`,
});

