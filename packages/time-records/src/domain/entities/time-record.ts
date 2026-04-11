import {
  ensureEntityId,
  ensureMinimumLength,
  freezeEntity,
  normalizeDateValue,
  normalizeNullableDateValue,
  type AuditableEntity,
  type BaseEntity,
  type DateValue,
} from '@rh-ponto/core';
import type { Nullable, TimeRecordSource, TimeRecordStatus, TimeRecordType } from '@rh-ponto/types';

export interface TimeRecord extends AuditableEntity {
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
}

export interface TimeRecordPhoto extends BaseEntity {
  timeRecordId: string;
  fileUrl: string;
  fileName: Nullable<string>;
  contentType: Nullable<string>;
  fileSizeBytes: Nullable<number>;
  isPrimary: boolean;
}

const normalizeNullableString = (value: string | null | undefined): string | null => {
  if (value == null) {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue.length > 0 ? normalizedValue : null;
};

export const createTimeRecord = (input: TimeRecord): TimeRecord =>
  freezeEntity({
    id: ensureEntityId(input.id, 'Marcação'),
    employeeId: ensureEntityId(input.employeeId, 'Funcionário da marcação'),
    deviceId: normalizeNullableString(input.deviceId),
    recordedByUserId: normalizeNullableString(input.recordedByUserId),
    recordType: input.recordType,
    source: input.source,
    status: input.status,
    recordedAt: normalizeDateValue(input.recordedAt, 'Data e hora da marcação'),
    originalRecordedAt: normalizeNullableDateValue(input.originalRecordedAt, 'Data e hora original da marcação'),
    notes: normalizeNullableString(input.notes),
    isManual: input.isManual,
    referenceRecordId: normalizeNullableString(input.referenceRecordId),
    latitude: input.latitude ?? null,
    longitude: input.longitude ?? null,
    ipAddress: normalizeNullableString(input.ipAddress),
    createdAt: normalizeDateValue(input.createdAt, 'Data de criação da marcação'),
    updatedAt: normalizeDateValue(input.updatedAt, 'Data de atualização da marcação'),
  });

export const createTimeRecordPhoto = (input: TimeRecordPhoto): TimeRecordPhoto =>
  freezeEntity({
    id: ensureEntityId(input.id, 'Foto da marcação'),
    timeRecordId: ensureEntityId(input.timeRecordId, 'Marcação da foto'),
    fileUrl: ensureMinimumLength(input.fileUrl, 3, 'URL do arquivo da foto'),
    fileName: normalizeNullableString(input.fileName),
    contentType: normalizeNullableString(input.contentType),
    fileSizeBytes: input.fileSizeBytes ?? null,
    isPrimary: input.isPrimary,
    createdAt: normalizeDateValue(input.createdAt, 'Data de criação da foto da marcação'),
  });
