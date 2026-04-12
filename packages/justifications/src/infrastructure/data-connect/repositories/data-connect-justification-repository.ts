import {
  addJustificationAttachment,
  approveJustification,
  createJustification as createJustificationMutation,
  getJustificationById,
  listJustificationAttachments,
  listJustifications,
  rejectJustification,
  type AddJustificationAttachmentVariables,
  type ApproveJustificationVariables,
  type CreateJustificationVariables,
  type GetJustificationByIdData,
  type ListJustificationAttachmentsData,
  type ListJustificationsData,
  type RejectJustificationVariables,
} from '@rh-ponto/api-client/generated';
import { getAppDataConnect } from '@rh-ponto/api-client';
import { AppError } from '@rh-ponto/core';
import {
  justificationStatuses,
  justificationTypes,
  timeRecordTypes,
  type JustificationStatus,
  type JustificationType,
  type TimeRecordType,
} from '@rh-ponto/types';

import { createJustification, createJustificationAttachment, type Justification, type JustificationAttachment } from '../../../domain/entities/justification';
import type {
  AddJustificationAttachmentPayload,
  ApproveJustificationPayload,
  CreateJustificationPayload,
  JustificationFilters,
  JustificationRepository,
  RejectJustificationPayload,
} from '../../../domain/repositories/justification-repository';

const assertJustificationType = (value: string): JustificationType => {
  if (!justificationTypes.includes(value as JustificationType)) {
    throw new AppError('JUSTIFICATION_INVALID_TYPE', 'Tipo de justificativa inválido retornado pelo Data Connect.');
  }

  return value as JustificationType;
};

const assertJustificationStatus = (value: string): JustificationStatus => {
  if (!justificationStatuses.includes(value as JustificationStatus)) {
    throw new AppError(
      'JUSTIFICATION_INVALID_STATUS',
      'Status de justificativa inválido retornado pelo Data Connect.',
    );
  }

  return value as JustificationStatus;
};

const assertRequestedRecordType = (value: string | null | undefined): TimeRecordType | null => {
  if (!value) {
    return null;
  }

  if (!timeRecordTypes.includes(value as TimeRecordType)) {
    throw new AppError(
      'JUSTIFICATION_INVALID_RECORD_TYPE',
      'Tipo de marcação solicitado inválido retornado pelo Data Connect.',
    );
  }

  return value as TimeRecordType;
};

const mapJustificationRecord = (
  record:
    | ListJustificationsData['justifications'][number]
    | NonNullable<GetJustificationByIdData['justification']>,
): Justification =>
  createJustification({
    id: record.id,
    employeeId: record.employee.id,
    timeRecordId: record.timeRecord?.id ?? null,
    type: assertJustificationType(record.type),
    reason: record.reason,
    status: assertJustificationStatus(record.status),
    requestedRecordType: assertRequestedRecordType(record.requestedRecordType),
    requestedRecordedAt: record.requestedRecordedAt ?? null,
    reviewedByUserId: record.reviewedByUser?.id ?? null,
    reviewedAt: record.reviewedAt ?? null,
    reviewNotes: record.reviewNotes ?? null,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  });

const mapAttachmentRecord = (
  attachment: ListJustificationAttachmentsData['justificationAttachments'][number],
): JustificationAttachment =>
  createJustificationAttachment({
    id: attachment.id,
    justificationId: attachment.justification.id,
    fileName: attachment.fileName,
    fileUrl: attachment.fileUrl,
    contentType: attachment.contentType ?? null,
    fileSizeBytes: attachment.fileSizeBytes == null ? null : Number(attachment.fileSizeBytes),
    uploadedByUserId: attachment.uploadedByUser?.id ?? null,
    createdAt: attachment.createdAt,
  });

const toTimestamp = (value: string | Date | null | undefined): string | null => {
  if (!value) {
    return null;
  }

  return typeof value === 'string' ? value : value.toISOString();
};

const buildCreateVariables = (payload: CreateJustificationPayload): CreateJustificationVariables => ({
  employeeId: payload.employeeId,
  timeRecordId: payload.timeRecordId ?? null,
  type: payload.type,
  reason: payload.reason,
  requestedRecordType: payload.requestedRecordType ?? null,
  requestedRecordedAt: toTimestamp(payload.requestedRecordedAt),
});

const buildApproveVariables = (payload: ApproveJustificationPayload): ApproveJustificationVariables => ({
  id: payload.justificationId,
  reviewedByUserId: payload.reviewedByUserId,
  reviewNotes: payload.reviewNotes ?? null,
});

const buildRejectVariables = (payload: RejectJustificationPayload): RejectJustificationVariables => ({
  id: payload.justificationId,
  reviewedByUserId: payload.reviewedByUserId,
  reviewNotes: payload.reviewNotes ?? null,
});

const buildAttachmentVariables = (
  payload: AddJustificationAttachmentPayload,
): AddJustificationAttachmentVariables => ({
  justificationId: payload.justificationId,
  fileName: payload.fileName,
  fileUrl: payload.fileUrl,
  contentType: payload.contentType ?? null,
  fileSizeBytes: payload.fileSizeBytes == null ? null : String(payload.fileSizeBytes),
  uploadedByUserId: payload.uploadedByUserId ?? null,
});

const applyFilters = (items: Justification[], filters?: JustificationFilters): Justification[] => {
  if (!filters) {
    return items;
  }

  return items.filter((item) => {
    const matchesEmployee = filters.employeeId ? item.employeeId === filters.employeeId : true;
    const matchesStatus = filters.status ? item.status === filters.status : true;
    const matchesType = filters.type ? item.type === filters.type : true;
    const matchesSearch = filters.search
      ? [item.reason, item.type, item.status].join(' ').toLowerCase().includes(filters.search.toLowerCase())
      : true;

    return matchesEmployee && matchesStatus && matchesType && matchesSearch;
  });
};

const applyPagination = (items: Justification[], filters?: JustificationFilters): Justification[] => {
  const pageSize = filters?.pageSize;
  const page = filters?.page ?? 1;

  if (!pageSize || pageSize <= 0) {
    return items;
  }

  const offset = Math.max(page - 1, 0) * pageSize;

  return items.slice(offset, offset + pageSize);
};

export class DataConnectJustificationRepository implements JustificationRepository {
  async list(filters?: JustificationFilters): Promise<Justification[]> {
    const { data } = await listJustifications(getAppDataConnect());
    const items = data.justifications.map(mapJustificationRecord);

    return applyPagination(applyFilters(items, filters), filters);
  }

  async listByEmployee(employeeId: string): Promise<Justification[]> {
    return this.list({ employeeId });
  }

  async getById(id: string): Promise<Justification | null> {
    const { data } = await getJustificationById(getAppDataConnect(), { id });

    return data.justification ? mapJustificationRecord(data.justification) : null;
  }

  async listAttachmentsByJustification(justificationId: string): Promise<JustificationAttachment[]> {
    const { data } = await listJustificationAttachments(getAppDataConnect());

    return data.justificationAttachments
      .map(mapAttachmentRecord)
      .filter((attachment) => attachment.justificationId === justificationId);
  }

  async create(payload: CreateJustificationPayload): Promise<Justification> {
    const { data } = await createJustificationMutation(getAppDataConnect(), buildCreateVariables(payload));
    const justification = await this.getById(data.justification_insert.id);

    if (!justification) {
      throw new AppError(
        'JUSTIFICATION_NOT_FOUND_AFTER_CREATE',
        'Justificativa não encontrada após criação via Data Connect.',
      );
    }

    return justification;
  }

  async approve(payload: ApproveJustificationPayload): Promise<Justification> {
    const { data } = await approveJustification(getAppDataConnect(), buildApproveVariables(payload));
    const justificationId = data.justification_update?.id;

    if (!justificationId) {
      throw new AppError('JUSTIFICATION_NOT_FOUND', 'Justificativa não encontrada para aprovação.');
    }

    const justification = await this.getById(justificationId);

    if (!justification) {
      throw new AppError(
        'JUSTIFICATION_NOT_FOUND_AFTER_UPDATE',
        'Justificativa não encontrada após aprovação via Data Connect.',
      );
    }

    return justification;
  }

  async reject(payload: RejectJustificationPayload): Promise<Justification> {
    const { data } = await rejectJustification(getAppDataConnect(), buildRejectVariables(payload));
    const justificationId = data.justification_update?.id;

    if (!justificationId) {
      throw new AppError('JUSTIFICATION_NOT_FOUND', 'Justificativa não encontrada para reprovação.');
    }

    const justification = await this.getById(justificationId);

    if (!justification) {
      throw new AppError(
        'JUSTIFICATION_NOT_FOUND_AFTER_UPDATE',
        'Justificativa não encontrada após reprovação via Data Connect.',
      );
    }

    return justification;
  }

  async addAttachment(payload: AddJustificationAttachmentPayload): Promise<JustificationAttachment> {
    const { data } = await addJustificationAttachment(getAppDataConnect(), buildAttachmentVariables(payload));
    const attachment = (await this.listAttachmentsByJustification(payload.justificationId)).find(
      (item) => item.id === data.justificationAttachment_insert.id,
    );

    if (!attachment) {
      throw new AppError(
        'JUSTIFICATION_ATTACHMENT_NOT_FOUND_AFTER_CREATE',
        'Anexo não encontrado após criação via Data Connect.',
      );
    }

    return attachment;
  }
}
