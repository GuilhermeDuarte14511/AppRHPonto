import type { DateValue, Nullable } from '@rh-ponto/types';

export interface AdjustTimeRecordDto {
  timeRecordId: string;
  recordedAt: DateValue;
  notes?: Nullable<string>;
}

