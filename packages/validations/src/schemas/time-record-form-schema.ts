import { timeRecordSources, timeRecordStatuses, timeRecordTypes } from '@rh-ponto/types';
import { z } from 'zod';

import { requiredFieldMessage } from '../lib/field-messages';

const emptyStringToNull = <TSchema extends z.ZodTypeAny>(schema: TSchema) =>
  z.preprocess((value) => (value === '' ? null : value), schema.nullable());

export const timeRecordFormSchema = z.object({
  employeeId: z.string().trim().min(1, requiredFieldMessage('Colaborador')),
  deviceId: emptyStringToNull(z.string().trim().min(1, requiredFieldMessage('Dispositivo'))),
  recordType: z.enum(timeRecordTypes, {
    required_error: requiredFieldMessage('Tipo de marcação'),
  }),
  source: z.enum(timeRecordSources, {
    required_error: requiredFieldMessage('Origem'),
  }),
  status: z.enum(timeRecordStatuses, {
    required_error: requiredFieldMessage('Status'),
  }),
  recordedAt: z.string().trim().min(1, requiredFieldMessage('Data e hora da marcação')),
  notes: emptyStringToNull(z.string().trim().max(300, 'As observações devem ter no máximo 300 caracteres.')),
});

export type TimeRecordFormSchema = z.infer<typeof timeRecordFormSchema>;
