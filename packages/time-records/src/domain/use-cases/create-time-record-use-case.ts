import type { TimeRecord } from '../entities/time-record';
import type { CreateTimeRecordPayload, TimeRecordRepository } from '../repositories/time-record-repository';

export class CreateTimeRecordUseCase {
  constructor(private readonly timeRecordRepository: TimeRecordRepository) {}

  execute(payload: CreateTimeRecordPayload): Promise<TimeRecord> {
    return this.timeRecordRepository.create(payload);
  }
}
