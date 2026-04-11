import type { CreateWorkSchedulePayload, WorkScheduleRepository } from '../repositories/work-schedule-repository';

export class CreateWorkScheduleUseCase {
  constructor(private readonly workScheduleRepository: WorkScheduleRepository) {}

  execute(payload: CreateWorkSchedulePayload) {
    return this.workScheduleRepository.create(payload);
  }
}
