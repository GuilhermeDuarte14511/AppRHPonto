import { z } from 'zod';

import { calculateDaysBetween } from './vacations-mobile';

export const vacationFormSchema = z
  .object({
    startDate: z.string().trim().min(10, 'Informe a data inicial no formato AAAA-MM-DD.'),
    endDate: z.string().trim().min(10, 'Informe a data final no formato AAAA-MM-DD.'),
    accrualPeriod: z.string().trim().max(40, 'Use um período de aquisição curto.').optional().or(z.literal('')),
    coverageNotes: z.string().trim().max(300, 'Escreva um resumo mais curto.').optional().or(z.literal('')),
    advanceThirteenthSalary: z.boolean(),
    cashBonus: z.boolean(),
  })
  .superRefine((values, ctx) => {
    const start = new Date(values.startDate);
    const end = new Date(values.endDate);

    if (Number.isNaN(start.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Data inicial inválida.',
        path: ['startDate'],
      });
    }

    if (Number.isNaN(end.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Data final inválida.',
        path: ['endDate'],
      });
    }

    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end < start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A data final precisa ser igual ou posterior à data inicial.',
        path: ['endDate'],
      });
    }
  });

export type VacationFormValues = z.output<typeof vacationFormSchema>;

export const getVacationTotalDays = (values: Pick<VacationFormValues, 'startDate' | 'endDate'>) =>
  calculateDaysBetween(values.startDate, values.endDate);
