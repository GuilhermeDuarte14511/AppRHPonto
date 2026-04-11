import type { AttendancePolicyRepository } from '../repositories/attendance-policy-repository';

export class ListAttendancePoliciesUseCase {
  constructor(private readonly attendancePolicyRepository: AttendancePolicyRepository) {}

  execute() {
    return this.attendancePolicyRepository.listPolicies();
  }
}
