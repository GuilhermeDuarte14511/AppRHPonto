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
import type { JustificationStatus, JustificationType, Nullable, TimeRecordType } from '@rh-ponto/types';

export interface Justification extends AuditableEntity {
  employeeId: string;
  timeRecordId: Nullable<string>;
  type: JustificationType;
  reason: string;
  status: JustificationStatus;
  requestedRecordType: Nullable<TimeRecordType>;
  requestedRecordedAt: Nullable<DateValue>;
  reviewedByUserId: Nullable<string>;
  reviewedAt: Nullable<DateValue>;
  reviewNotes: Nullable<string>;
}

export interface JustificationAttachment extends BaseEntity {
  justificationId: string;
  fileName: string;
  fileUrl: string;
  contentType: Nullable<string>;
  fileSizeBytes: Nullable<number>;
  uploadedByUserId: Nullable<string>;
}

const normalizeNullableString = (value: string | null | undefined): string | null => {
  if (value == null) {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue.length > 0 ? normalizedValue : null;
};

export const createJustification = (input: Justification): Justification =>
  freezeEntity({
    id: ensureEntityId(input.id, 'Justificativa'),
    employeeId: ensureEntityId(input.employeeId, 'Funcionário da justificativa'),
    timeRecordId: normalizeNullableString(input.timeRecordId),
    type: input.type,
    reason: ensureMinimumLength(input.reason, 5, 'Motivo da justificativa'),
    status: input.status,
    requestedRecordType: input.requestedRecordType ?? null,
    requestedRecordedAt: normalizeNullableDateValue(input.requestedRecordedAt, 'Data solicitada da justificativa'),
    reviewedByUserId: normalizeNullableString(input.reviewedByUserId),
    reviewedAt: normalizeNullableDateValue(input.reviewedAt, 'Data da revisão da justificativa'),
    reviewNotes: normalizeNullableString(input.reviewNotes),
    createdAt: normalizeDateValue(input.createdAt, 'Data de criação da justificativa'),
    updatedAt: normalizeDateValue(input.updatedAt, 'Data de atualização da justificativa'),
  });

export const createJustificationAttachment = (input: JustificationAttachment): JustificationAttachment =>
  freezeEntity({
    id: ensureEntityId(input.id, 'Anexo da justificativa'),
    justificationId: ensureEntityId(input.justificationId, 'Justificativa do anexo'),
    fileName: ensureMinimumLength(input.fileName, 3, 'Nome do arquivo do anexo'),
    fileUrl: ensureMinimumLength(input.fileUrl, 3, 'URL do anexo'),
    contentType: normalizeNullableString(input.contentType),
    fileSizeBytes: input.fileSizeBytes ?? null,
    uploadedByUserId: normalizeNullableString(input.uploadedByUserId),
    createdAt: normalizeDateValue(input.createdAt, 'Data de criação do anexo'),
  });
