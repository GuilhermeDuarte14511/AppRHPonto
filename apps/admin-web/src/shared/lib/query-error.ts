const nonRetryableQueryErrorPatterns = [
  'UNAUTHENTICATED',
  'PERMISSION_DENIED',
  '403',
  '401',
  'signed-in user',
  'sessão',
  'session-expired',
];

export const shouldRetryAdminQuery = (failureCount: number, error: unknown): boolean => {
  if (failureCount >= 2) {
    return false;
  }

  const message = error instanceof Error ? error.message : String(error ?? '');

  return !nonRetryableQueryErrorPatterns.some((pattern) => message.includes(pattern));
};
