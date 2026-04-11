import type { DepartmentRepository } from '../repositories/department-repository';

export class DeleteDepartmentUseCase {
  constructor(private readonly departmentRepository: DepartmentRepository) {}

  execute(id: string) {
    return this.departmentRepository.delete(id);
  }
}
