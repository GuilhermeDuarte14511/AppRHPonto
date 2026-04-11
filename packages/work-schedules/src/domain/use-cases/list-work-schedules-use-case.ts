import type { WorkScheduleRepository } from '../repositories/work-schedule-repository';

export class ListWorkSchedulesUseCase {
  constructor(private readonly workScheduleRepository: WorkScheduleRepository) {}

  execute() {
    return this.workScheduleRepository.list();
  }
}
