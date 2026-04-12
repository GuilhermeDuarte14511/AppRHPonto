import { justificationTypes, timeRecordTypes } from '@rh-ponto/types';
import { z } from 'zod';

const optionalTextField = () =>
  z
    .string()
    .trim()
    .transform((value) => value || undefined);

const optionalEnumField = <TValues extends readonly [string, ...string[]]>(values: TValues) =>
  z
    .string()
    .trim()
    .transform((value) => value || undefined)
    .refine((value) => value == null || values.includes(value), 'Selecione uma opção válida.')
    .transform((value) => value as TValues[number] | undefined);

const parseRequestedDateTimeValue = (value: string) => {
  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  const brazilianDateTimeMatch = normalized.match(
    /^(\d{2})\/(\d{2})\/(\d{4})(?:[ T](\d{2}):(\d{2}))?$/,
  );

  if (brazilianDateTimeMatch) {
    const [, day, month, year, hours = '00', minutes = '00'] = brazilianDateTimeMatch;
    const parsed = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);

    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const fallbackDate = new Date(normalized);

  return Number.isNaN(fallbackDate.getTime()) ? null : fallbackDate;
};

export const employeeJustificationFormSchema = z.object({
  type: z.enum(justificationTypes, {
    required_error: 'Selecione o tipo da justificativa.',
  }),
  timeRecordId: optionalTextField(),
  requestedRecordType: optionalEnumField(timeRecordTypes),
  requestedRecordedAt: optionalTextField().refine(
    (value) => value == null || parseRequestedDateTimeValue(value) != null,
    'Informe uma data válida.',
  ),
  reason: z
    .string()
    .trim()
    .min(10, 'Explique o motivo com pelo menos 10 caracteres.')
    .max(600, 'Use até 600 caracteres para descrever a ocorrência.'),
});

export type EmployeeJustificationFormValues = z.infer<typeof employeeJustificationFormSchema>;

export const parseRequestedDateTime = (value?: string | null) => {
  if (!value) {
    return null;
  }

  const parsed = parseRequestedDateTimeValue(value);

  return parsed ? parsed.toISOString() : null;
};
