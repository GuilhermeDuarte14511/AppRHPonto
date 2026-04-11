import type {
  AttendancePolicyRepository,
  UpsertEmployeeAttendancePolicyPayload,
} from '../repositories/attendance-policy-repository';

export class UpsertEmployeeAttendancePolicyUseCase {
  constructor(private readonly attendancePolicyRepository: AttendancePolicyRepository) {}

  execute(payload: UpsertEmployeeAttendancePolicyPayload) {
    return this.attendancePolicyRepository.upsertEmployeePolicy(payload);
  }
}
