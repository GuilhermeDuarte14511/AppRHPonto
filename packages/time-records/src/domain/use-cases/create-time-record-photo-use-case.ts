import type { TimeRecordPhoto } from '../entities/time-record';
import type { TimeRecordRepository } from '../repositories/time-record-repository';

export class CreateTimeRecordPhotoUseCase {
  constructor(private readonly timeRecordRepository: TimeRecordRepository) {}

  execute(payload: Omit<TimeRecordPhoto, 'id' | 'createdAt' | 'updatedAt'>): Promise<TimeRecordPhoto> {
    return this.timeRecordRepository.attachPhoto(payload);
  }
}
