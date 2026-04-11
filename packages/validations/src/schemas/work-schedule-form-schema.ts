import { z } from 'zod';

import { minimumLengthMessage, requiredFieldMessage } from '../lib/field-messages';

const emptyStringToNull = <TSchema extends z.ZodTypeAny>(schema: TSchema) =>
  z.preprocess((value) => (value === '' ? null : value), schema.nullable());

const integerField = (fieldLabel: string) =>
  z.coerce
    .number({
      invalid_type_error: `Informe um valor numérico para "${fieldLabel}".`,
    })
    .int(`${fieldLabel} deve ser um número inteiro.`)
    .min(0, `${fieldLabel} não pode ser negativo.`);

export const workScheduleFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, requiredFieldMessage('Nome da escala'))
    .min(3, minimumLengthMessage('Nome da escala', 3)),
  startTime: z.string().trim().min(1, requiredFieldMessage('Início da jornada')),
  breakStartTime: emptyStringToNull(z.string().trim().min(1, requiredFieldMessage('Início do intervalo'))),
  breakEndTime: emptyStringToNull(z.string().trim().min(1, requiredFieldMessage('Fim do intervalo'))),
  endTime: z.string().trim().min(1, requiredFieldMessage('Fim da jornada')),
  toleranceMinutes: integerField('Tolerância em minutos'),
  expectedDailyMinutes: emptyStringToNull(integerField('Carga diária esperada')),
  isActive: z.boolean(),
});

export type WorkScheduleFormSchema = z.infer<typeof workScheduleFormSchema>;
