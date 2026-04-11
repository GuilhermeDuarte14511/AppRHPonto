import { z } from 'zod';

const optionalTrimmedString = () =>
  z
    .string()
    .trim()
    .optional()
    .transform((value) => {
      if (!value) {
        return undefined;
      }

      return value.length > 0 ? value : undefined;
    });

export const onboardingTaskCategories = [
  'documentation',
  'equipment',
  'signature',
  'access',
  'training',
  'benefits',
  'culture',
] as const;

export const onboardingTaskStatuses = ['pending', 'in_progress', 'blocked', 'completed'] as const;

export const onboardingTaskCreateSchema = z.object({
  title: z.string().trim().min(3, 'Informe o título da etapa.').max(120, 'O título deve ter no máximo 120 caracteres.'),
  category: z.enum(onboardingTaskCategories, {
    errorMap: () => ({ message: 'Selecione uma categoria válida.' }),
  }),
  description: optionalTrimmedString(),
  dueDate: optionalTrimmedString(),
  assignedUserId: optionalTrimmedString(),
  isRequired: z.boolean().default(true),
});

export const onboardingTaskStatusSchema = z
  .object({
    status: z.enum(onboardingTaskStatuses, {
      errorMap: () => ({ message: 'Selecione um status válido.' }),
    }),
    blockerReason: optionalTrimmedString(),
  })
  .superRefine((value, context) => {
    if (value.status === 'blocked' && !value.blockerReason) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['blockerReason'],
        message: 'Informe o motivo do bloqueio para continuar.',
      });
    }
  });

export type OnboardingTaskCreateSchema = z.infer<typeof onboardingTaskCreateSchema>;
export type OnboardingTaskStatusSchema = z.infer<typeof onboardingTaskStatusSchema>;
