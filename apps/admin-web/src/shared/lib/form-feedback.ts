'use client';

import type { FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';

const flattenErrorMessages = (errors: FieldErrors): string[] =>
  Object.values(errors).flatMap((error) => {
    if (!error) {
      return [];
    }

    if ('message' in error && typeof error.message === 'string' && error.message.length > 0) {
      return [error.message];
    }

    if ('types' in error && error.types) {
      return Object.values(error.types).filter((value): value is string => typeof value === 'string');
    }

    return flattenErrorMessages(error as FieldErrors);
  });

export const showValidationToast = (
  errors: FieldErrors,
  options?: {
    title?: string;
  },
) => {
  const [firstMessage] = flattenErrorMessages(errors);

  toast.error(options?.title ?? 'Revise os campos obrigatórios.', {
    description: firstMessage ?? 'Preencha os campos destacados para continuar.',
  });
};

