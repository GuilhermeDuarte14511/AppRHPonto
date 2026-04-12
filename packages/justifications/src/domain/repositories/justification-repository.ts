import type {
  DateValue,
  JustificationStatus,
  JustificationType,
  Nullable,
  PáginationParams,
  TimeRecordType,
} from '@rh-ponto/types';

import type { Justification, JustificationAttachment } from '../entities/justification';

export interface JustificationFilters extends PáginationParams {
  employeeId?: string;
  status?: JustificationStatus;
  type?: JustificationType;
}

export interface CreateJustificationPayload {
  employeeId: string;
  timeRecordId?: Nullable<string>;
  type: JustificationType;
  reason: string;
  requestedRecordType?: Nullable<TimeRecordType>;
  requestedRecordedAt?: Nullable<DateValue>;
}

export interface ApproveJustificationPayload {
  justificationId: string;
  reviewNotes?: Nullable<string>;
  reviewedByUserId: string;
}

export interface RejectJustificationPayload {
  justificationId: string;
  reviewNotes?: Nullable<string>;
  reviewedByUserId: string;
}

export interface ReviewJustificationPayload {
  justificationId: string;
  status: 'approved' | 'rejected';
  reviewNotes: string;
  reviewedByUserId: string;
}

export interface AddJustificationAttachmentPayload {
  justificationId: string;
  fileName: string;
  fileUrl: string;
  contentType?: Nullable<string>;
  fileSizeBytes?: Nullable<number>;
  uploadedByUserId?: Nullable<string>;
}

export interface JustificationRepository {
  list(filters?: JustificationFilters): Promise<Justification[]>;
  listByEmployee(employeeId: string): Promise<Justification[]>;
  getById(id: string): Promise<Justification | null>;
  listAttachmentsByJustification(justificationId: string): Promise<JustificationAttachment[]>;
  create(payload: CreateJustificationPayload): Promise<Justification>;
  approve(payload: ApproveJustificationPayload): Promise<Justification>;
  reject(payload: RejectJustificationPayload): Promise<Justification>;
  addAttachment(payload: AddJustificationAttachmentPayload): Promise<JustificationAttachment>;
}

export type JustificationsRepository = JustificationRepository;
