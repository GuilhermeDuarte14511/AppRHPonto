import { justificationStatuses, justificationTypes, timeRecordTypes } from '@rh-ponto/types';
import { z } from 'zod';

import { minimumLengthMessage, requiredFieldMessage } from '../lib/field-messages';

const emptyStringToUndefined = <TSchema extends z.ZodTypeAny>(schema: TSchema) =>
  z.preprocess((value) => (value === '' ? undefined : value), schema.optional());

export const justificationFormSchema = z.object({
  employeeId: z.string().trim().min(1, requiredFieldMessage('Funcionário')),
  timeRecordId: emptyStringToUndefined(z.string().trim().min(1, requiredFieldMessage('Registro de ponto'))),
  type: z.enum(justificationTypes),
  reason: z.string().trim().min(1, requiredFieldMessage('Motivo')).min(10, minimumLengthMessage('Motivo', 10)),
  status: z.enum(justificationStatuses).default('pending'),
  requestedRecordType: emptyStringToUndefined(z.enum(timeRecordTypes)),
  requestedRecordedAt: emptyStringToUndefined(z.string().trim().min(1, requiredFieldMessage('Data e hora solicitadas'))),
});

export type JustificationFormSchema = z.infer<typeof justificationFormSchema>;
