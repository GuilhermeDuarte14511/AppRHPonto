import type {
  AdjustTimeRecordPayload,
  TimeRecordRepository,
} from '../repositories/time-record-repository';

export class AdjustTimeRecordUseCase {
  constructor(private readonly timeRecordRepository: TimeRecordRepository) {}

  execute(payload: AdjustTimeRecordPayload) {
    return this.timeRecordRepository.adjust(payload);
  }
}
