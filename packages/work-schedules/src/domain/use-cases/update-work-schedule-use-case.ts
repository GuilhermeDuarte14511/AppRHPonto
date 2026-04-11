import type { UpdateWorkSchedulePayload, WorkScheduleRepository } from '../repositories/work-schedule-repository';

export class UpdateWorkScheduleUseCase {
  constructor(private readonly workScheduleRepository: WorkScheduleRepository) {}

  execute(payload: UpdateWorkSchedulePayload) {
    return this.workScheduleRepository.update(payload);
  }
}
