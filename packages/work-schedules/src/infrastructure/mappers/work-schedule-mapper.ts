import type { WorkScheduleDto } from '../../application/dto/work-schedule-dto';
import { createWorkSchedule, type WorkSchedule } from '../../domain/entities/work-schedule';

export const mapWorkSchedule = (schedule: WorkScheduleDto): WorkSchedule => createWorkSchedule(schedule);

export const mapWorkScheduleToDto = (schedule: WorkSchedule): WorkScheduleDto => ({
  ...schedule,
});
