'use client';

import { toast } from 'sonner';

const technicalErrorHints = ['firebase', 'data connect', 'graphql', 'network', 'query', 'mutation', 'http', 'auth'];

export const getActionErrorMessage = (
  error: unknown,
  fallback = 'Não foi possível concluir a ação agora. Tente novamente em instantes.',
) => {
  if (error instanceof Error && error.message.trim().length > 0) {
    const normalizedMessage = error.message.trim();
    const lowerCaseMessage = normalizedMessage.toLowerCase();

    if (technicalErrorHints.some((hint) => lowerCaseMessage.includes(hint))) {
      return fallback;
    }

    return normalizedMessage;
  }

  return fallback;
};

export const showActionErrorToast = (error: unknown, fallback?: string) => {
  toast.error(getActionErrorMessage(error, fallback));
};
