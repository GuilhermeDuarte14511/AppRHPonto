import type { EmployeeScheduleHistory } from '../entities/work-schedule';
import type { AssignWorkSchedulePayload, WorkScheduleRepository } from '../repositories/work-schedule-repository';

export class AssignWorkScheduleToEmployeeUseCase {
  constructor(private readonly workScheduleRepository: WorkScheduleRepository) {}

  execute(payload: AssignWorkSchedulePayload): Promise<EmployeeScheduleHistory> {
    return this.workScheduleRepository.assignToEmployee(payload);
  }
}

