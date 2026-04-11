import {
  ensureEntityId,
  ensureMinimumLength,
  ensureNonEmptyString,
  ensureNonNegativeNumber,
  freezeEntity,
  normalizeDateValue,
  normalizeNullableDateValue,
  type AuditableEntity,
  type DateValue,
} from '@rh-ponto/core';
import type {
  AttendanceLocationRole,
  AttendancePolicyMode,
  AttendanceValidationStrategy,
  Nullable,
  WorkLocationType,
} from '@rh-ponto/types';

export interface WorkLocation extends AuditableEntity {
  code: string;
  name: string;
  type: WorkLocationType;
  addressLine: Nullable<string>;
  addressComplement: Nullable<string>;
  city: Nullable<string>;
  state: Nullable<string>;
  postalCode: Nullable<string>;
  latitude: Nullable<number>;
  longitude: Nullable<number>;
  radiusMeters: number;
  isActive: boolean;
}

export interface AttendancePolicy extends AuditableEntity {
  code: string;
  name: string;
  mode: AttendancePolicyMode;
  validationStrategy: AttendanceValidationStrategy;
  geolocationRequired: boolean;
  photoRequired: boolean;
  allowOffsiteClocking: boolean;
  requiresAllowedLocations: boolean;
  description: Nullable<string>;
  isActive: boolean;
}

export interface EmployeeAttendancePolicy extends AuditableEntity {
  employeeId: string;
  attendancePolicyId: string;
  mode: AttendancePolicyMode;
  validationStrategy: AttendanceValidationStrategy;
  geolocationRequired: boolean;
  photoRequired: boolean;
  allowAnyLocation: boolean;
  blockOutsideAllowedLocations: boolean;
  notes: Nullable<string>;
  startsAt: Nullable<DateValue>;
  endsAt: Nullable<DateValue>;
  isCurrent: boolean;
}

export interface EmployeeAllowedLocation extends AuditableEntity {
  employeeAttendancePolicyId: string;
  workLocationId: string;
  locationRole: AttendanceLocationRole;
  isRequired: boolean;
}

const normalizeNullableText = (value: string | null | undefined): string | null => {
  if (value == null) {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue.length > 0 ? normalizedValue : null;
};

export const createWorkLocation = (input: WorkLocation): WorkLocation =>
  freezeEntity({
    id: ensureEntityId(input.id, 'Local autorizado'),
    code: ensureMinimumLength(input.code, 2, 'Código do local'),
    name: ensureMinimumLength(input.name, 3, 'Nome do local'),
    type: input.type,
    addressLine: normalizeNullableText(input.addressLine),
    addressComplement: normalizeNullableText(input.addressComplement),
    city: normalizeNullableText(input.city),
    state: normalizeNullableText(input.state),
    postalCode: normalizeNullableText(input.postalCode),
    latitude: input.latitude ?? null,
    longitude: input.longitude ?? null,
    radiusMeters: ensureNonNegativeNumber(input.radiusMeters, 'Raio do local'),
    isActive: input.isActive,
    createdAt: normalizeDateValue(input.createdAt, 'Data de criação do local'),
    updatedAt: normalizeDateValue(input.updatedAt, 'Data de atualização do local'),
  });

export const createAttendancePolicy = (input: AttendancePolicy): AttendancePolicy =>
  freezeEntity({
    id: ensureEntityId(input.id, 'Política de marcação'),
    code: ensureMinimumLength(input.code, 2, 'Código da política'),
    name: ensureMinimumLength(input.name, 3, 'Nome da política'),
    mode: input.mode,
    validationStrategy: input.validationStrategy,
    geolocationRequired: input.geolocationRequired,
    photoRequired: input.photoRequired,
    allowOffsiteClocking: input.allowOffsiteClocking,
    requiresAllowedLocations: input.requiresAllowedLocations,
    description: normalizeNullableText(input.description),
    isActive: input.isActive,
    createdAt: normalizeDateValue(input.createdAt, 'Data de criação da política'),
    updatedAt: normalizeDateValue(input.updatedAt, 'Data de atualização da política'),
  });

export const createEmployeeAttendancePolicy = (input: EmployeeAttendancePolicy): EmployeeAttendancePolicy =>
  freezeEntity({
    id: ensureEntityId(input.id, 'Vínculo de política de marcação'),
    employeeId: ensureEntityId(input.employeeId, 'Funcionário da política'),
    attendancePolicyId: ensureEntityId(input.attendancePolicyId, 'Política da marcação'),
    mode: input.mode,
    validationStrategy: input.validationStrategy,
    geolocationRequired: input.geolocationRequired,
    photoRequired: input.photoRequired,
    allowAnyLocation: input.allowAnyLocation,
    blockOutsideAllowedLocations: input.blockOutsideAllowedLocations,
    notes: normalizeNullableText(input.notes),
    startsAt: normalizeNullableDateValue(input.startsAt, 'Início da vigência da política'),
    endsAt: normalizeNullableDateValue(input.endsAt, 'Fim da vigência da política'),
    isCurrent: input.isCurrent,
    createdAt: normalizeDateValue(input.createdAt, 'Data de criação do vínculo de política'),
    updatedAt: normalizeDateValue(input.updatedAt, 'Data de atualização do vínculo de política'),
  });

export const createEmployeeAllowedLocation = (input: EmployeeAllowedLocation): EmployeeAllowedLocation =>
  freezeEntity({
    id: ensureEntityId(input.id, 'Local permitido do funcionário'),
    employeeAttendancePolicyId: ensureEntityId(input.employeeAttendancePolicyId, 'Vínculo da política do funcionário'),
    workLocationId: ensureEntityId(input.workLocationId, 'Local permitido'),
    locationRole: input.locationRole,
    isRequired: input.isRequired,
    createdAt: normalizeDateValue(input.createdAt, 'Data de criação do vínculo do local permitido'),
    updatedAt: normalizeDateValue(input.updatedAt, 'Data de atualização do vínculo do local permitido'),
  });

export const ensureAttendancePolicyCode = (value: string) => ensureNonEmptyString(value, 'Código da política');
