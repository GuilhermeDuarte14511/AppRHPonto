import type { DateValue, Nullable } from '@rh-ponto/types';

export interface AuditLogDto {
  id: string;
  userId: Nullable<string>;
  entityName: string;
  entityId: Nullable<string>;
  action: string;
  description: Nullable<string>;
  oldData: unknown | null;
  newData: unknown | null;
  ipAddress: Nullable<string>;
  deviceInfo: Nullable<string>;
  createdAt: DateValue;
}

export interface AuditLogListItemDto {
  id: string;
  action: string;
  entityName: string;
  createdAt: DateValue;
}
