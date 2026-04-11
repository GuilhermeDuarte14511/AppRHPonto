import type { TimeRecordPhoto } from '../entities/time-record';
import type { TimeRecordRepository } from '../repositories/time-record-repository';

export class ListTimeRecordPhotosByRecordUseCase {
  constructor(private readonly timeRecordRepository: TimeRecordRepository) {}

  execute(recordId: string): Promise<TimeRecordPhoto[]> {
    return this.timeRecordRepository.listPhotosByRecord(recordId);
  }
}

