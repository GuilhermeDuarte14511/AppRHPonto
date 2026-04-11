import { z } from 'zod';

import { requiredFieldMessage } from '../lib/field-messages';

export const vacationRequestSchema = z
  .object({
    employeeId: z.string().trim().min(1, requiredFieldMessage('Funcionário')),
    startDate: z.string().trim().min(1, requiredFieldMessage('Data de início')),
    endDate: z.string().trim().min(1, requiredFieldMessage('Data de fim')),
    advanceThirteenthSalary: z.boolean().default(false),
    attachmentName: z.string().optional(),
  })
  .superRefine((values, context) => {
    if (!values.startDate || !values.endDate) {
      return;
    }

    const startDate = new Date(values.startDate);
    const endDate = new Date(values.endDate);

    if (endDate < startDate) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        message: 'A data final deve ser igual ou posterior à data inicial.',
      });
    }
  });

export type VacationRequestSchema = z.output<typeof vacationRequestSchema>;
