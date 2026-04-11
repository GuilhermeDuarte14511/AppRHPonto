import type { DepartmentRepository, UpdateDepartmentPayload } from '../repositories/department-repository';

export class UpdateDepartmentUseCase {
  constructor(private readonly departmentRepository: DepartmentRepository) {}

  execute(payload: UpdateDepartmentPayload) {
    return this.departmentRepository.update(payload);
  }
}
