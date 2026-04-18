import type {
  DateRange,
  DateValue,
  Nullable,
  PáginationParams,
  TimeRecordSource,
  TimeRecordStatus,
  TimeRecordType,
} from '@rh-ponto/types';

import type { TimeRecord, TimeRecordPhoto } from '../entities/time-record';

export interface TimeRecordFilters extends PáginationParams, DateRange {
  employeeId?: string;
  recordType?: TimeRecordType;
  source?: TimeRecordSource;
  status?: TimeRecordStatus;
}

export interface CreateTimeRecordPayload {
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

export interface AdjustTimeRecordPayload {
  timeRecordId: string;
  recordedAt: DateValue;
  notes?: Nullable<string>;
}

export interface TimeRecordRepository {
  list(filters?: TimeRecordFilters): Promise<TimeRecord[]>;
  listByEmployee(employeeId: string): Promise<TimeRecord[]>;
  getById(id: string): Promise<TimeRecord | null>;
  create(payload: CreateTimeRecordPayload): Promise<TimeRecord>;
  adjust(payload: AdjustTimeRecordPayload): Promise<TimeRecord>;
  listPhotosByRecord(recordId: string): Promise<TimeRecordPhoto[]>;
  attachPhoto(payload: Omit<TimeRecordPhoto, 'id' | 'createdAt' | 'updatedAt'>): Promise<TimeRecordPhoto>;
}

export type TimeRecordsRepository = TimeRecordRepository;
export type ManualAdjustmentPayload = AdjustTimeRecordPayload;
