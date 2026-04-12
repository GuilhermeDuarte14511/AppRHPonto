import type { Justification } from '../entities/justification';
import type { JustificationRepository } from '../repositories/justification-repository';

export class ListJustificationsByEmployeeUseCase {
  constructor(private readonly justificationRepository: JustificationRepository) {}

  execute(employeeId: string): Promise<Justification[]> {
    return this.justificationRepository.listByEmployee(employeeId);
  }
}
