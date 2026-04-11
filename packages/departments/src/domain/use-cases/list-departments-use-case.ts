import type { DepartmentRepository, DepartmentListFilters } from '../repositories/department-repository';

export class ListDepartmentsUseCase {
  constructor(private readonly departmentRepository: DepartmentRepository) {}

  execute(filters?: DepartmentListFilters) {
    return this.departmentRepository.list(filters);
  }
}
