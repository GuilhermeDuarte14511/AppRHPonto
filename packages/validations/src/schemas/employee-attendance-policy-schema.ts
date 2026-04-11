import { z } from 'zod';

import {
  attendanceLocationRoles,
  attendancePolicyModes,
  attendanceValidationStrategies,
} from '@rh-ponto/types';

import { minimumLengthMessage, requiredFieldMessage } from '../lib/field-messages';

const nullableTextField = (fieldLabel: string, minimum = 0) =>
  z
    .string()
    .trim()
    .transform((value) => value || null)
    .refine(
      (value) => value == null || value.length >= minimum,
      minimum > 0 ? minimumLengthMessage(fieldLabel, minimum) : undefined,
    );

export const employeeAttendancePolicyFormSchema = z
  .object({
    attendancePolicyId: z.string().trim().min(1, requiredFieldMessage('Política de marcação')),
    mode: z.enum(attendancePolicyModes, {
      message: requiredFieldMessage('Modo de marcação'),
    }),
    validationStrategy: z.enum(attendanceValidationStrategies, {
      message: requiredFieldMessage('Estratégia de validação'),
    }),
    geolocationRequired: z.boolean(),
    photoRequired: z.boolean(),
    allowAnyLocation: z.boolean(),
    blockOutsideAllowedLocations: z.boolean(),
    notes: nullableTextField('Observações', 3),
    selectedLocationIds: z.array(z.string().trim().min(1)).default([]),
    selectedLocationRoleById: z.record(z.string(), z.enum(attendanceLocationRoles)).default({}),
  })
  .superRefine((value, context) => {
    const requiresAllowedLocations = !value.allowAnyLocation && value.mode !== 'free' && value.mode !== 'field';

    if (requiresAllowedLocations && value.selectedLocationIds.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Selecione pelo menos um local permitido para essa política.',
        path: ['selectedLocationIds'],
      });
    }

    for (const locationId of value.selectedLocationIds) {
      if (!value.selectedLocationRoleById[locationId]) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Defina o papel do local autorizado selecionado.',
          path: ['selectedLocationRoleById', locationId],
        });
      }
    }
  });

export type EmployeeAttendancePolicyFormSchema = z.infer<typeof employeeAttendancePolicyFormSchema>;
