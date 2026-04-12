import {
  adjustTimeRecord,
  createTimeRecord as createTimeRecordMutation,
  createTimeRecordPhoto as createTimeRecordPhotoMutation,
  getTimeRecordById,
  listTimeRecordPhotos,
  listTimeRecords,
  type AdjustTimeRecordVariables,
  type CreateTimeRecordVariables,
  type GetTimeRecordByIdData,
  type ListTimeRecordPhotosData,
  type ListTimeRecordsData,
} from '@rh-ponto/api-client/generated';
import { getAppDataConnect } from '@rh-ponto/api-client';
import { AppError } from '@rh-ponto/core';
import {
  timeRecordSources,
  timeRecordStatuses,
  timeRecordTypes,
  type TimeRecordSource,
  type TimeRecordStatus,
  type TimeRecordType,
} from '@rh-ponto/types';

import { createTimeRecord, createTimeRecordPhoto, type TimeRecord, type TimeRecordPhoto } from '../../../domain/entities/time-record';
import type {
  AdjustTimeRecordPayload,
  CreateTimeRecordPayload,
  TimeRecordFilters,
  TimeRecordRepository,
} from '../../../domain/repositories/time-record-repository';

const assertTimeRecordType = (value: string): TimeRecordType => {
  if (!timeRecordTypes.includes(value as TimeRecordType)) {
    throw new AppError('TIME_RECORD_INVALID_TYPE', 'Tipo de marcação inválido retornado pelo Data Connect.');
  }

  return value as TimeRecordType;
};

const assertTimeRecordSource = (value: string): TimeRecordSource => {
  if (!timeRecordSources.includes(value as TimeRecordSource)) {
    throw new AppError('TIME_RECORD_INVALID_SOURCE', 'Origem de marcação inválida retornada pelo Data Connect.');
  }

  return value as TimeRecordSource;
};

const assertTimeRecordStatus = (value: string): TimeRecordStatus => {
  if (!timeRecordStatuses.includes(value as TimeRecordStatus)) {
    throw new AppError('TIME_RECORD_INVALID_STATUS', 'Status de marcação inválido retornado pelo Data Connect.');
  }

  return value as TimeRecordStatus;
};

const mapTimeRecordRecord = (
  record: ListTimeRecordsData['timeRecords'][number] | NonNullable<GetTimeRecordByIdData['timeRecord']>,
): TimeRecord =>
  createTimeRecord({
    id: record.id,
    employeeId: record.employee.id,
    deviceId: record.device?.id ?? null,
    recordedByUserId: record.recordedByUser?.id ?? null,
    recordType: assertTimeRecordType(record.recordType),
    source: assertTimeRecordSource(record.source),
    status: assertTimeRecordStatus(record.status),
    recordedAt: record.recordedAt,
    originalRecordedAt: record.originalRecordedAt ?? null,
    notes: record.notes ?? null,
    isManual: record.isManual,
    referenceRecordId: record.referenceRecord?.id ?? null,
    latitude: record.latitude ?? null,
    longitude: record.longitude ?? null,
    ipAddress: record.ipAddress ?? null,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  });

const mapPhotoRecord = (photo: ListTimeRecordPhotosData['timeRecordPhotos'][number]): TimeRecordPhoto =>
  createTimeRecordPhoto({
    id: photo.id,
    timeRecordId: photo.timeRecord.id,
    fileUrl: photo.fileUrl,
    fileName: photo.fileName ?? null,
    contentType: photo.contentType ?? null,
    fileSizeBytes: photo.fileSizeBytes == null ? null : Number(photo.fileSizeBytes),
    isPrimary: photo.isPrimary,
    createdAt: photo.createdAt,
  });

const toTimestamp = (value: string | Date): string => (typeof value === 'string' ? value : value.toISOString());

const buildCreateVariables = (payload: CreateTimeRecordPayload): CreateTimeRecordVariables => ({
  employeeId: payload.employeeId,
  deviceId: payload.deviceId ?? null,
  recordedByUserId: payload.recordedByUserId ?? null,
  recordType: payload.recordType,
  source: payload.source,
  status: payload.status,
  recordedAt: toTimestamp(payload.recordedAt),
  originalRecordedAt: payload.originalRecordedAt == null ? null : toTimestamp(payload.originalRecordedAt),
  notes: payload.notes ?? null,
  isManual: payload.isManual,
  referenceRecordId: payload.referenceRecordId ?? null,
  latitude: payload.latitude ?? null,
  longitude: payload.longitude ?? null,
  ipAddress: payload.ipAddress ?? null,
});

const buildAdjustVariables = (payload: AdjustTimeRecordPayload): AdjustTimeRecordVariables => ({
  id: payload.timeRecordId,
  recordedAt: toTimestamp(payload.recordedAt),
  notes: payload.notes ?? null,
});

const applyFilters = (records: TimeRecord[], filters?: TimeRecordFilters): TimeRecord[] => {
  if (!filters) {
    return records;
  }

  return records.filter((record) => {
    const matchesEmployee = filters.employeeId ? record.employeeId === filters.employeeId : true;
    const matchesRecordType = filters.recordType ? record.recordType === filters.recordType : true;
    const matchesSource = filters.source ? record.source === filters.source : true;
    const matchesStatus = filters.status ? record.status === filters.status : true;
    const matchesStartDate = filters.startDate ? new Date(record.recordedAt) >= new Date(filters.startDate) : true;
    const matchesEndDate = filters.endDate ? new Date(record.recordedAt) <= new Date(filters.endDate) : true;

    return matchesEmployee && matchesRecordType && matchesSource && matchesStatus && matchesStartDate && matchesEndDate;
  });
};

const applyPagination = (records: TimeRecord[], filters?: TimeRecordFilters): TimeRecord[] => {
  const pageSize = filters?.pageSize;
  const page = filters?.page ?? 1;

  if (!pageSize || pageSize <= 0) {
    return records;
  }

  const offset = Math.max(page - 1, 0) * pageSize;

  return records.slice(offset, offset + pageSize);
};

export class DataConnectTimeRecordRepository implements TimeRecordRepository {
  async list(filters?: TimeRecordFilters): Promise<TimeRecord[]> {
    const { data } = await listTimeRecords(getAppDataConnect());
    const records = data.timeRecords.map(mapTimeRecordRecord);

    return applyPagination(applyFilters(records, filters), filters);
  }

  async listByEmployee(employeeId: string): Promise<TimeRecord[]> {
    return this.list({ employeeId });
  }

  async getById(id: string): Promise<TimeRecord | null> {
    const { data } = await getTimeRecordById(getAppDataConnect(), { id });

    return data.timeRecord ? mapTimeRecordRecord(data.timeRecord) : null;
  }

  async create(payload: CreateTimeRecordPayload): Promise<TimeRecord> {
    const { data } = await createTimeRecordMutation(getAppDataConnect(), buildCreateVariables(payload));
    const record = await this.getById(data.timeRecord_insert.id);

    if (!record) {
      throw new AppError('TIME_RECORD_NOT_FOUND_AFTER_CREATE', 'Marcação não encontrada após criação via Data Connect.');
    }

    return record;
  }

  async adjust(payload: AdjustTimeRecordPayload): Promise<TimeRecord> {
    const { data } = await adjustTimeRecord(getAppDataConnect(), buildAdjustVariables(payload));
    const recordId = data.timeRecord_update?.id;

    if (!recordId) {
      throw new AppError('TIME_RECORD_NOT_FOUND', 'Marcação não encontrada para ajuste.');
    }

    const record = await this.getById(recordId);

    if (!record) {
      throw new AppError('TIME_RECORD_NOT_FOUND_AFTER_UPDATE', 'Marcação não encontrada após ajuste via Data Connect.');
    }

    return record;
  }

  async listPhotosByRecord(recordId: string): Promise<TimeRecordPhoto[]> {
    const { data } = await listTimeRecordPhotos(getAppDataConnect());

    return data.timeRecordPhotos.map(mapPhotoRecord).filter((photo) => photo.timeRecordId === recordId);
  }

  async attachPhoto(payload: Omit<TimeRecordPhoto, 'id' | 'createdAt' | 'updatedAt'>): Promise<TimeRecordPhoto> {
    const { data } = await createTimeRecordPhotoMutation(getAppDataConnect(), {
      timeRecordId: payload.timeRecordId,
      fileUrl: payload.fileUrl,
      fileName: payload.fileName ?? null,
      contentType: payload.contentType ?? null,
      fileSizeBytes: payload.fileSizeBytes != null ? String(payload.fileSizeBytes) : null,
      isPrimary: payload.isPrimary,
    });
    
    // In a real scenario we'd query it back using getById, but since we just
    // inserted it and know the ID, we can construct the partial record or query it.
    // For simplicity, we just rebuild it here for the return type.
    return createTimeRecordPhoto({
      id: data.timeRecordPhoto_insert.id,
      timeRecordId: payload.timeRecordId,
      fileUrl: payload.fileUrl,
      fileName: payload.fileName ?? null,
      contentType: payload.contentType ?? null,
      fileSizeBytes: payload.fileSizeBytes ?? null,
      isPrimary: payload.isPrimary,
      createdAt: new Date().toISOString(),
    });
  }
}
