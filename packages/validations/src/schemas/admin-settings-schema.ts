import { z } from 'zod';

import { minimumLengthMessage, requiredFieldMessage } from '../lib/field-messages';

const timeField = (fieldLabel: string) =>
  z
    .string()
    .trim()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, `Informe um horário válido para "${fieldLabel}".`);

const integerField = (fieldLabel: string, min: number, max: number) =>
  z.coerce
    .number({
      invalid_type_error: `Informe um valor numérico para "${fieldLabel}".`,
    })
    .int(`${fieldLabel} deve ser um número inteiro.`)
    .min(min, `${fieldLabel} deve ser maior ou igual a ${min}.`)
    .max(max, `${fieldLabel} deve ser menor ou igual a ${max}.`);

export const adminSettingsFormSchema = z.object({
  defaultAttendancePolicyId: z.string().trim().min(1, requiredFieldMessage('Política padrão de marcação')),
  scheduleId: z.string().trim().min(1, requiredFieldMessage('Jornada padrão')),
  startTime: timeField('Início da jornada'),
  breakStartTime: timeField('Início do intervalo'),
  breakEndTime: timeField('Fim do intervalo'),
  endTime: timeField('Fim da jornada'),
  toleranceMinutes: integerField('Tolerância em minutos', 0, 180),
  expectedDailyMinutes: integerField('Carga diária esperada', 60, 960),
  primaryDeviceId: z.string().trim().min(1, requiredFieldMessage('Dispositivo principal')),
  geofenceMainArea: z
    .string()
    .trim()
    .min(1, requiredFieldMessage('Área principal'))
    .min(3, minimumLengthMessage('Área principal', 3)),
  geofenceRadiusMeters: integerField('Raio de geofence', 50, 5000),
  geofenceBlockingEnabled: z.boolean(),
  notifyOvertimeSummary: z.boolean(),
  notifyPendingVacations: z.boolean(),
  notifyDeviceSync: z.boolean(),
  notifyAuditSummary: z.boolean(),
});

export type AdminSettingsFormSchema = z.infer<typeof adminSettingsFormSchema>;
