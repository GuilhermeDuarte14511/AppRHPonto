import type { TimeRecordFilters, TimeRecordRepository } from '../repositories/time-record-repository';

export class ListTimeRecordsUseCase {
  constructor(private readonly timeRecordRepository: TimeRecordRepository) {}

  execute(filters?: TimeRecordFilters) {
    return this.timeRecordRepository.list(filters);
  }
}
