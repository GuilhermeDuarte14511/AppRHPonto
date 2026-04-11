import {
  ensureEntityId,
  ensureMinimumLength,
  freezeEntity,
  normalizeDateValue,
  normalizeNullableDateValue,
  type AuditableEntity,
  type DateValue,
} from '@rh-ponto/core';
import type { Nullable } from '@rh-ponto/types';

export interface Employee extends AuditableEntity {
  userId: Nullable<string>;
  registrationNumber: string;
  fullName: string;
  cpf: Nullable<string>;
  email: Nullable<string>;
  phone: Nullable<string>;
  birthDate: Nullable<DateValue>;
  hireDate: Nullable<DateValue>;
  departmentId: Nullable<string>;
  department: Nullable<string>;
  position: Nullable<string>;
  profilePhotoUrl: Nullable<string>;
  pinCode: Nullable<string>;
  isActive: boolean;
}

const normalizeNullableString = (value: string | null | undefined): string | null => {
  if (value == null) {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue.length > 0 ? normalizedValue : null;
};

export const createEmployee = (input: Employee): Employee =>
  freezeEntity({
    id: ensureEntityId(input.id, 'Funcionário'),
    userId: normalizeNullableString(input.userId),
    registrationNumber: ensureMinimumLength(input.registrationNumber, 1, 'Matrícula'),
    fullName: ensureMinimumLength(input.fullName, 3, 'Nome completo'),
    cpf: normalizeNullableString(input.cpf),
    email: normalizeNullableString(input.email)?.toLowerCase() ?? null,
    phone: normalizeNullableString(input.phone),
    birthDate: normalizeNullableDateValue(input.birthDate, 'Nascimento'),
    hireDate: normalizeNullableDateValue(input.hireDate, 'Admissão'),
    departmentId: normalizeNullableString(input.departmentId),
    department: normalizeNullableString(input.department),
    position: normalizeNullableString(input.position),
    profilePhotoUrl: normalizeNullableString(input.profilePhotoUrl),
    pinCode: normalizeNullableString(input.pinCode),
    isActive: input.isActive,
    createdAt: normalizeDateValue(input.createdAt, 'Data de criação do funcionário'),
    updatedAt: normalizeDateValue(input.updatedAt, 'Data de atualização do funcionário'),
  });
