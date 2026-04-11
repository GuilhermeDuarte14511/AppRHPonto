import type { Nullable } from '@rh-ponto/types';

import type { AuditLog } from '../entities/audit-log';

export interface CreateAuditLogPayload {
  userId?: Nullable<string>;
  entityName: string;
  entityId?: Nullable<string>;
  action: string;
  description?: Nullable<string>;
  oldData?: unknown | null;
  newData?: unknown | null;
  ipAddress?: Nullable<string>;
  deviceInfo?: Nullable<string>;
}

export interface AuditLogRepository {
  list(): Promise<AuditLog[]>;
  create(payload: CreateAuditLogPayload): Promise<AuditLog>;
}

export type AuditRepository = AuditLogRepository;

