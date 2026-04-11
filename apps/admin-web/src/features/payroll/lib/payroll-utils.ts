import { formatDate, toDate } from '@rh-ponto/core';

import type { PayrollSignatureLine, PeriodBounds } from './payroll-types';
import { managerByDepartment, rhManagerName } from './payroll-constants';

export const weekdayFormatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', timeZone: 'UTC' });
export const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' });
export const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'UTC',
});

export const parseClock = (value: string | null | undefined): number | null => {
  if (!value) {
    return null;
  }

  const [hours, minutes] = value.split(':').map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  return hours * 60 + minutes;
};

export const formatClock = (value: Date | null): string | null => {
  if (!value) {
    return null;
  }

  return value.toISOString().slice(11, 16);
};

export const formatMinutes = (minutes: number, options?: { signed?: boolean }): string => {
  const absoluteValue = Math.abs(Math.round(minutes));
  const hours = Math.floor(absoluteValue / 60);
  const remainingMinutes = absoluteValue % 60;
  const base = `${String(hours).padStart(2, '0')}h ${String(remainingMinutes).padStart(2, '0')}m`;

  if (options?.signed) {
    if (minutes > 0) {
      return `+${base}`;
    }

    if (minutes < 0) {
      return `-${base}`;
    }
  }

  return base;
};

export const formatHoursShort = (minutes: number): string => formatMinutes(minutes);

export const parseDurationLabel = (value: string) =>
  parseClock(value.replace(/[+-]/, '').replace('h ', ':').replace('m', '')) ?? 0;

export const getDateKey = (value: Date | string) => toDate(value).toISOString().slice(0, 10);

export const isInsidePeriod = (value: Date, period: PeriodBounds) => value >= period.start && value <= period.end;

export const calculateWorkedMinutes = (times: {
  breakEnd: Date | null;
  breakStart: Date | null;
  entry: Date | null;
  exit: Date | null;
}) => {
  if (!times.entry || !times.exit) {
    return 0;
  }

  if (times.breakStart && times.breakEnd) {
    return (
      Math.max(0, (times.breakStart.getTime() - times.entry.getTime()) / 60000) +
      Math.max(0, (times.exit.getTime() - times.breakEnd.getTime()) / 60000)
    );
  }

  return Math.max(0, (times.exit.getTime() - times.entry.getTime()) / 60000);
};

export const createSignatureLines = (employeeName: string, managerName: string): PayrollSignatureLine[] => [
  {
    id: `${employeeName}-employee-signature`,
    label: 'Assinatura do colaborador',
    name: employeeName,
    role: 'Colaborador',
  },
  {
    id: `${employeeName}-manager-signature`,
    label: 'Gestor imediato',
    name: managerName,
    role: 'Gestor da área',
  },
  {
    id: `${employeeName}-rh-signature`,
    label: 'Gestor de RH',
    name: rhManagerName,
    role: 'Responsável pelo fechamento',
  },
];

export const resolveManagerName = (department: string | null) =>
  managerByDepartment[department ?? ''] ?? 'Gestor não definido';

export const buildMonthPeriodBounds = (reference: Date): PeriodBounds => {
  const start = new Date(Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth(), 1));
  const end = new Date(Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth() + 1, 0, 23, 59, 59));

  return {
    year: reference.getUTCFullYear(),
    month: reference.getUTCMonth(),
    start,
    end,
    label: monthFormatter.format(start).replace(/^\w/, (character) => character.toUpperCase()),
    startLabel: formatDate(start),
    endLabel: formatDate(end),
  };
};
