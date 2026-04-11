import { z } from 'zod';

import {
  emailFieldMessage,
  minimumDigitsMessage,
  minimumLengthMessage,
  requiredFieldMessage,
} from '../lib/field-messages';

const emptyStringToNull = <TSchema extends z.ZodTypeAny>(schema: TSchema) =>
  z.preprocess((value) => (value === '' ? null : value), schema.nullable());

const digitsOnly = (value: unknown) => (typeof value === 'string' ? value.replace(/\D+/g, '') : value);

export const employeeFormSchema = z.object({
  registrationNumber: z
    .string()
    .trim()
    .min(1, requiredFieldMessage('Matrícula'))
    .min(3, minimumLengthMessage('Matrícula', 3)),
  fullName: z
    .string()
    .trim()
    .min(1, requiredFieldMessage('Nome completo'))
    .min(3, minimumLengthMessage('Nome completo', 3)),
  cpf: emptyStringToNull(z.preprocess(digitsOnly, z.string().trim().length(11, minimumDigitsMessage('CPF', 11)))),
  email: emptyStringToNull(z.string().trim().email(emailFieldMessage)),
  phone: emptyStringToNull(
    z.preprocess(
      digitsOnly,
      z
        .string()
        .trim()
        .refine((value) => value.length >= 10 && value.length <= 11, minimumDigitsMessage('Telefone', 10)),
    ),
  ),
  birthDate: emptyStringToNull(z.string().trim().min(1, requiredFieldMessage('Nascimento'))),
  hireDate: emptyStringToNull(z.string().trim().min(1, requiredFieldMessage('Admissão'))),
  departmentId: emptyStringToNull(z.string().trim().min(1, requiredFieldMessage('Departamento'))),
  position: emptyStringToNull(z.string().trim().min(2, minimumLengthMessage('Cargo', 2))),
  pinCode: emptyStringToNull(
    z.preprocess(
      digitsOnly,
      z
        .string()
        .trim()
        .min(4, minimumLengthMessage('PIN', 4))
        .max(8, 'PIN deve ter no máximo 8 dígitos.')
        .regex(/^\d+$/, 'PIN deve conter apenas números.'),
    ),
  ),
  isActive: z.boolean(),
});

export type EmployeeFormSchema = z.infer<typeof employeeFormSchema>;
