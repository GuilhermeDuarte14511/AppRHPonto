import type { AttendancePolicyRepository } from '../repositories/attendance-policy-repository';

export class GetEmployeeAttendancePolicyUseCase {
  constructor(private readonly attendancePolicyRepository: AttendancePolicyRepository) {}

  execute(employeeId: string) {
    return this.attendancePolicyRepository.getEmployeePolicy(employeeId);
  }
}
