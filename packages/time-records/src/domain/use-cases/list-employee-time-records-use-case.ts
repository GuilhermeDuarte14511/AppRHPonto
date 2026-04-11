import type { TimeRecord } from '../entities/time-record';
import type { TimeRecordRepository } from '../repositories/time-record-repository';

export class ListEmployeeTimeRecordsUseCase {
  constructor(private readonly timeRecordRepository: TimeRecordRepository) {}

  execute(employeeId: string): Promise<TimeRecord[]> {
    return this.timeRecordRepository.listByEmployee(employeeId);
  }
}

