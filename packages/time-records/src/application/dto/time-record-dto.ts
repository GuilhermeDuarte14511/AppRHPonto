import type { DateValue, Nullable, TimeRecordSource, TimeRecordStatus, TimeRecordType } from '@rh-ponto/types';

export interface TimeRecordDto {
  id: string;
  employeeId: string;
  deviceId: Nullable<string>;
  recordedByUserId: Nullable<string>;
  recordType: TimeRecordType;
  source: TimeRecordSource;
  status: TimeRecordStatus;
  recordedAt: DateValue;
  originalRecordedAt: Nullable<DateValue>;
  notes: Nullable<string>;
  isManual: boolean;
  referenceRecordId: Nullable<string>;
  latitude: Nullable<number>;
  longitude: Nullable<number>;
  ipAddress: Nullable<string>;
  createdAt: DateValue;
  updatedAt: DateValue;
}

export interface TimeRecordPhotoDto {
  id: string;
  timeRecordId: string;
  fileUrl: string;
  fileName: Nullable<string>;
  contentType: Nullable<string>;
  fileSizeBytes: Nullable<number>;
  isPrimary: boolean;
  createdAt: DateValue;
}

export interface TimeRecordListItemDto {
  id: string;
  employeeId: string;
  recordType: TimeRecordType;
  status: TimeRecordStatus;
  recordedAt: DateValue;
  source: TimeRecordSource;
}
