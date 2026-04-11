import {
  ensure,
  ensureEntityId,
  ensureMinimumLength,
  ensureNonEmptyString,
  freezeEntity,
  normalizeDateValue,
  normalizeNullableDateValue,
  type AuditableEntity,
  type DateValue,
} from '@rh-ponto/core';
import type { Nullable, UserRole } from '@rh-ponto/types';

export interface User extends AuditableEntity {
  firebaseUid: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: Nullable<DateValue>;
}

export interface Session {
  accessToken: string;
  refreshToken?: Nullable<string>;
  expiresAt?: Nullable<DateValue>;
  user: User;
}

const ensureEmail = (value: string): string => {
  const normalizedValue = ensureNonEmptyString(value, 'E-mail do usuário');

  ensure(normalizedValue.includes('@'), 'ENTITY_INVALID_FIELD', 'E-mail do usuário precisa ser válido.');

  return normalizedValue.toLowerCase();
};

export const createUser = (input: User): User =>
  freezeEntity({
    id: ensureEntityId(input.id, 'Usuário'),
    firebaseUid: ensureNonEmptyString(input.firebaseUid, 'Firebase UID'),
    name: ensureMinimumLength(input.name, 3, 'Nome do usuário'),
    email: ensureEmail(input.email),
    role: input.role,
    isActive: input.isActive,
    lastLoginAt: normalizeNullableDateValue(input.lastLoginAt, 'Último login'),
    createdAt: normalizeDateValue(input.createdAt, 'Data de criação do usuário'),
    updatedAt: normalizeDateValue(input.updatedAt, 'Data de atualização do usuário'),
  });

export const createSession = (input: Session): Session =>
  freezeEntity({
    accessToken: ensureNonEmptyString(input.accessToken, 'Access token'),
    refreshToken: input.refreshToken ? ensureNonEmptyString(input.refreshToken, 'Refresh token') : null,
    expiresAt: normalizeNullableDateValue(input.expiresAt ?? null, 'Expiração da sessão'),
    user: createUser(input.user),
  });
