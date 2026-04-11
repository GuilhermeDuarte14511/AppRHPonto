import {
  ensureEntityId,
  ensureMinimumLength,
  freezeEntity,
  normalizeDateValue,
  normalizeNullableDateValue,
  type AuditableEntity,
  type DateValue,
} from '@rh-ponto/core';
import type { DeviceType, Nullable } from '@rh-ponto/types';

export interface Device extends AuditableEntity {
  name: string;
  identifier: string;
  type: DeviceType;
  locationName: Nullable<string>;
  description: Nullable<string>;
  isActive: boolean;
  lastSyncAt: Nullable<DateValue>;
}

const normalizeNullableString = (value: string | null | undefined): string | null => {
  if (value == null) {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue.length > 0 ? normalizedValue : null;
};

export const createDevice = (input: Device): Device =>
  freezeEntity({
    id: ensureEntityId(input.id, 'Dispositivo'),
    name: ensureMinimumLength(input.name, 3, 'Nome do dispositivo'),
    identifier: ensureMinimumLength(input.identifier, 3, 'Identificador do dispositivo'),
    type: input.type,
    locationName: normalizeNullableString(input.locationName),
    description: normalizeNullableString(input.description),
    isActive: input.isActive,
    lastSyncAt: normalizeNullableDateValue(input.lastSyncAt, 'Última sincronização'),
    createdAt: normalizeDateValue(input.createdAt, 'Data de criação do dispositivo'),
    updatedAt: normalizeDateValue(input.updatedAt, 'Data de atualização do dispositivo'),
  });
