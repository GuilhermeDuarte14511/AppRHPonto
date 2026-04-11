import type { DepartmentRepository } from '../repositories/department-repository';

export class GetDepartmentByIdUseCase {
  constructor(private readonly departmentRepository: DepartmentRepository) {}

  execute(id: string) {
    return this.departmentRepository.getById(id);
  }
}
