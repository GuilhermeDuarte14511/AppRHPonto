import {
  ensureEntityId,
  ensureMinimumLength,
  freezeEntity,
  normalizeDateValue,
  type AuditableEntity,
} from '@rh-ponto/core';
import type { Nullable } from '@rh-ponto/types';

export interface Department extends AuditableEntity {
  code: string;
  name: string;
  managerEmployeeId: Nullable<string>;
  managerName: Nullable<string>;
  description: Nullable<string>;
  costCenter: Nullable<string>;
  isActive: boolean;
  employeeCount: number;
}

const normalizeNullableString = (value: string | null | undefined): string | null => {
  if (value == null) {
    return null;
  }

  const normalized = value.trim();

  return normalized.length > 0 ? normalized : null;
};

export const createDepartment = (input: Department): Department =>
  freezeEntity({
    id: ensureEntityId(input.id, 'Departamento'),
    code: ensureMinimumLength(input.code, 2, 'Código do departamento'),
    name: ensureMinimumLength(input.name, 2, 'Nome do departamento'),
    managerEmployeeId: normalizeNullableString(input.managerEmployeeId),
    managerName: normalizeNullableString(input.managerName),
    description: normalizeNullableString(input.description),
    costCenter: normalizeNullableString(input.costCenter),
    isActive: input.isActive,
    employeeCount: Math.max(0, input.employeeCount),
    createdAt: normalizeDateValue(input.createdAt, 'Data de criação do departamento'),
    updatedAt: normalizeDateValue(input.updatedAt, 'Data de atualização do departamento'),
  });
