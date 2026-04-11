import type { Employee } from '../entities/employee';
import type { EmployeeRepository, UpdateEmployeePayload } from '../repositories/employee-repository';

export class UpdateEmployeeUseCase {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  execute(payload: UpdateEmployeePayload): Promise<Employee> {
    return this.employeeRepository.update(payload);
  }
}

