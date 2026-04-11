import type { DateValue, JustificationStatus, JustificationType, Nullable, TimeRecordType } from '@rh-ponto/types';

export interface JustificationDto {
  id: string;
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
  createdAt: DateValue;
  updatedAt: DateValue;
}

export interface JustificationAttachmentDto {
  id: string;
  justificationId: string;
  fileName: string;
  fileUrl: string;
  contentType: Nullable<string>;
  fileSizeBytes: Nullable<number>;
  uploadedByUserId: Nullable<string>;
  createdAt: DateValue;
}

export interface JustificationListItemDto {
  id: string;
  employeeId: string;
  type: JustificationType;
  status: JustificationStatus;
  createdAt: DateValue;
}
