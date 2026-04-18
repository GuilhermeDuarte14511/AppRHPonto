import type { DateValue, Nullable, TimeRecordSource, TimeRecordStatus, TimeRecordType } from '@rh-ponto/types';

export interface CreateTimeRecordDto {
  employeeId: string;
  deviceId?: Nullable<string>;
  recordedByUserId?: Nullable<string>;
  recordType: TimeRecordType;
  source: TimeRecordSource;
  status: TimeRecordStatus;
  recordedAt: DateValue;
  originalRecordedAt?: Nullable<DateValue>;
  notes?: Nullable<string>;
  isManual: boolean;
  referenceRecordId?: Nullable<string>;
  latitude?: Nullable<number>;
  longitude?: Nullable<number>;
  resolvedAddress?: Nullable<string>;
  ipAddress?: Nullable<string>;
}
