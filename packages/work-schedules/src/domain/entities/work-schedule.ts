import {
  ensureEntityId,
  ensureMinimumLength,
  ensureNonNegativeNumber,
  freezeEntity,
  normalizeDateValue,
  normalizeNullableDateValue,
  type AuditableEntity,
  type DateValue,
} from '@rh-ponto/core';
import type { Nullable } from '@rh-ponto/types';

export interface WorkSchedule extends AuditableEntity {
  name: string;
  startTime: string;
  breakStartTime: Nullable<string>;
  breakEndTime: Nullable<string>;
  endTime: string;
  toleranceMinutes: number;
  expectedDailyMinutes: Nullable<number>;
  isActive: boolean;
}

export interface EmployeeScheduleHistory extends AuditableEntity {
  employeeId: string;
  workScheduleId: string;
  startDate: DateValue;
  endDate: Nullable<DateValue>;
  isCurrent: boolean;
}

const normalizeNullableString = (value: string | null | undefined): string | null => {
  if (value == null) {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue.length > 0 ? normalizedValue : null;
};

export const createWorkSchedule = (input: WorkSchedule): WorkSchedule =>
  freezeEntity({
    id: ensureEntityId(input.id, 'Escala'),
    name: ensureMinimumLength(input.name, 3, 'Nome da escala'),
    startTime: ensureMinimumLength(input.startTime, 4, 'Hora inicial'),
    breakStartTime: normalizeNullableString(input.breakStartTime),
    breakEndTime: normalizeNullableString(input.breakEndTime),
    endTime: ensureMinimumLength(input.endTime, 4, 'Hora final'),
    toleranceMinutes: ensureNonNegativeNumber(input.toleranceMinutes, 'Tolerância da escala'),
    expectedDailyMinutes:
      input.expectedDailyMinutes == null
        ? null
        : ensureNonNegativeNumber(input.expectedDailyMinutes, 'Carga horária diária esperada'),
    isActive: input.isActive,
    createdAt: normalizeDateValue(input.createdAt, 'Data de criação da escala'),
    updatedAt: normalizeDateValue(input.updatedAt, 'Data de atualização da escala'),
  });

export const createEmployeeScheduleHistory = (input: EmployeeScheduleHistory): EmployeeScheduleHistory =>
  freezeEntity({
    id: ensureEntityId(input.id, 'Histórico de escala'),
    employeeId: ensureEntityId(input.employeeId, 'Funcionário do histórico de escala'),
    workScheduleId: ensureEntityId(input.workScheduleId, 'Escala do histórico'),
    startDate: normalizeDateValue(input.startDate, 'Início da vigência da escala'),
    endDate: normalizeNullableDateValue(input.endDate, 'Fim da vigência da escala'),
    isCurrent: input.isCurrent,
    createdAt: normalizeDateValue(input.createdAt, 'Data de criação do histórico de escala'),
    updatedAt: normalizeDateValue(input.updatedAt, 'Data de atualização do histórico de escala'),
  });
