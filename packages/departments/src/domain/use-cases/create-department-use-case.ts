import type { CreateDepartmentPayload, DepartmentRepository } from '../repositories/department-repository';

export class CreateDepartmentUseCase {
  constructor(private readonly departmentRepository: DepartmentRepository) {}

  execute(payload: CreateDepartmentPayload) {
    return this.departmentRepository.create(payload);
  }
}
