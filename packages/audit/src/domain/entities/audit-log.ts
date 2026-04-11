import {
  ensureEntityId,
  ensureMinimumLength,
  freezeEntity,
  normalizeDateValue,
  type BaseEntity,
} from '@rh-ponto/core';
import type { Nullable } from '@rh-ponto/types';

export interface AuditLog extends BaseEntity {
  userId: Nullable<string>;
  entityName: string;
  entityId: Nullable<string>;
  action: string;
  description: Nullable<string>;
  oldData: unknown | null;
  newData: unknown | null;
  ipAddress: Nullable<string>;
  deviceInfo: Nullable<string>;
}

const normalizeNullableString = (value: string | null | undefined): string | null => {
  if (value == null) {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue.length > 0 ? normalizedValue : null;
};

export const createAuditLog = (input: AuditLog): AuditLog =>
  freezeEntity({
    id: ensureEntityId(input.id, 'Log de auditoria'),
    userId: normalizeNullableString(input.userId),
    entityName: ensureMinimumLength(input.entityName, 2, 'Entidade auditada'),
    entityId: normalizeNullableString(input.entityId),
    action: ensureMinimumLength(input.action, 2, 'Ação auditada'),
    description: normalizeNullableString(input.description),
    oldData: input.oldData ?? null,
    newData: input.newData ?? null,
    ipAddress: normalizeNullableString(input.ipAddress),
    deviceInfo: normalizeNullableString(input.deviceInfo),
    createdAt: normalizeDateValue(input.createdAt, 'Data de criação do log de auditoria'),
  });
