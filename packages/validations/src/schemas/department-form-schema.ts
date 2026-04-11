import { z } from 'zod';

import { minimumLengthMessage, requiredFieldMessage } from '../lib/field-messages';

const emptyStringToNull = <TSchema extends z.ZodTypeAny>(schema: TSchema) =>
  z.preprocess((value) => (value === '' ? null : value), schema.nullable());

export const departmentFormSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, requiredFieldMessage('Código'))
    .min(3, minimumLengthMessage('Código', 3))
    .max(24, 'Código deve ter no máximo 24 caracteres.'),
  name: z
    .string()
    .trim()
    .min(1, requiredFieldMessage('Nome do departamento'))
    .min(2, minimumLengthMessage('Nome do departamento', 2)),
  managerEmployeeId: emptyStringToNull(z.string().trim().min(1, requiredFieldMessage('Responsável'))),
  costCenter: emptyStringToNull(z.string().trim().min(2, minimumLengthMessage('Centro de custo', 2))),
  description: emptyStringToNull(z.string().trim().min(8, minimumLengthMessage('Descrição', 8))),
  isActive: z.boolean(),
});

export type DepartmentFormSchema = z.infer<typeof departmentFormSchema>;
