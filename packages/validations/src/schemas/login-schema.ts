import { z } from 'zod';

import { emailFieldMessage, minimumLengthMessage, requiredFieldMessage } from '../lib/field-messages';

export const loginSchema = z.object({
  email: z.string().trim().min(1, requiredFieldMessage('E-mail')).email(emailFieldMessage),
  password: z
    .string()
    .trim()
    .min(1, requiredFieldMessage('Senha'))
    .min(6, minimumLengthMessage('Senha', 6)),
});

export type LoginSchema = z.infer<typeof loginSchema>;
