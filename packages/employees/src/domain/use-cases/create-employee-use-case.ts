import type { Employee } from '../entities/employee';
import type { CreateEmployeePayload, EmployeeRepository } from '../repositories/employee-repository';

export class CreateEmployeeUseCase {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  execute(payload: CreateEmployeePayload): Promise<Employee> {
    return this.employeeRepository.create(payload);
  }
}
