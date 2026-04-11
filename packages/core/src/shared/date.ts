import type { DateValue } from './entity';

export const toDate = (value: DateValue): Date => (value instanceof Date ? value : new Date(value));

export const formatDateTime = (value: DateValue): string =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(toDate(value));

export const formatDate = (value: DateValue): string =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
  }).format(toDate(value));
