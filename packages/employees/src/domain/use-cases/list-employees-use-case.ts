import type { Employee } from '../entities/employee';
import type { EmployeeListFilters, EmployeeRepository } from '../repositories/employee-repository';

export class ListEmployeesUseCase {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  execute(filters?: EmployeeListFilters): Promise<Employee[]> {
    return this.employeeRepository.list(filters);
  }
}
