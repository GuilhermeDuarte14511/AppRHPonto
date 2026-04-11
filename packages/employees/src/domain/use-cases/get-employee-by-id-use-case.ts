import type { Employee } from '../entities/employee';
import type { EmployeeRepository } from '../repositories/employee-repository';

export class GetEmployeeByIdUseCase {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  execute(id: string): Promise<Employee | null> {
    return this.employeeRepository.getById(id);
  }
}
