import { ensure } from './guard';

export type DateValue = string | Date;

export interface BaseEntity {
  id: string;
  createdAt: DateValue;
  updatedAt?: DateValue;
}

export interface AuditableEntity extends BaseEntity {
  updatedAt: DateValue;
}

export const ensureEntityId = (value: string, entityLabel: string): string => {
  const normalizedValue = value.trim();

  ensure(normalizedValue.length > 0, 'ENTITY_INVALID_ID', `${entityLabel} precisa ter um identificador válido.`);

  return normalizedValue;
};

export const ensureNonEmptyString = (value: string, fieldLabel: string): string => {
  const normalizedValue = value.trim();

  ensure(normalizedValue.length > 0, 'ENTITY_INVALID_FIELD', `${fieldLabel} é obrigatório.`);

  return normalizedValue;
};

export const ensureMinimumLength = (value: string, minimumLength: number, fieldLabel: string): string => {
  const normalizedValue = ensureNonEmptyString(value, fieldLabel);

  ensure(
    normalizedValue.length >= minimumLength,
    'ENTITY_INVALID_FIELD',
    `${fieldLabel} deve ter pelo menos ${minimumLength} caracteres.`,
  );

  return normalizedValue;
};

export const ensureNonNegativeNumber = (value: number, fieldLabel: string): number => {
  ensure(Number.isFinite(value), 'ENTITY_INVALID_NUMBER', `${fieldLabel} precisa ser um número válido.`);
  ensure(value >= 0, 'ENTITY_INVALID_NUMBER', `${fieldLabel} não pode ser negativo.`);

  return value;
};

export const normalizeDateValue = (value: DateValue, fieldLabel: string): string => {
  const parsedDate = value instanceof Date ? value : new Date(value);

  ensure(!Number.isNaN(parsedDate.getTime()), 'ENTITY_INVALID_DATE', `${fieldLabel} precisa ser uma data válida.`);

  return parsedDate.toISOString();
};

export const normalizeNullableDateValue = (value: DateValue | null | undefined, fieldLabel: string): string | null =>
  value == null ? null : normalizeDateValue(value, fieldLabel);

export const freezeEntity = <TEntity extends object>(entity: TEntity): TEntity => Object.freeze(entity);
