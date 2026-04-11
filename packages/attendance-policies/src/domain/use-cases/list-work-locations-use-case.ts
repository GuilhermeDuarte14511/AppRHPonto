import type { AttendancePolicyRepository } from '../repositories/attendance-policy-repository';

export class ListWorkLocationsUseCase {
  constructor(private readonly attendancePolicyRepository: AttendancePolicyRepository) {}

  execute() {
    return this.attendancePolicyRepository.listLocations();
  }
}
