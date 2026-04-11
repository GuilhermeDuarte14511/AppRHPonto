import { deviceTypes } from '@rh-ponto/types';
import { z } from 'zod';

import { minimumLengthMessage, requiredFieldMessage } from '../lib/field-messages';

const emptyStringToNull = <TSchema extends z.ZodTypeAny>(schema: TSchema) =>
  z.preprocess((value) => (value === '' ? null : value), schema.nullable());

export const deviceFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, requiredFieldMessage('Nome do dispositivo'))
    .min(3, minimumLengthMessage('Nome do dispositivo', 3)),
  identifier: z
    .string()
    .trim()
    .min(1, requiredFieldMessage('Identificador'))
    .min(3, minimumLengthMessage('Identificador', 3)),
  type: z.enum(deviceTypes),
  locationName: emptyStringToNull(z.string().trim().min(2, minimumLengthMessage('Local de uso', 2))),
  description: emptyStringToNull(z.string().trim().min(3, minimumLengthMessage('Descrição', 3))),
  isActive: z.boolean().default(true),
});

export type DeviceFormSchema = z.infer<typeof deviceFormSchema>;
