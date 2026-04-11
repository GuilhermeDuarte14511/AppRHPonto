import type { EmployeeRepository } from '../repositories/employee-repository';

export class DeactivateEmployeeUseCase {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  execute(id: string): Promise<void> {
    return this.employeeRepository.deactivate(id);
  }
}
