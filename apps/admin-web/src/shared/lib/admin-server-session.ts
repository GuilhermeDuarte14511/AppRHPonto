import { cookies } from 'next/headers';

import type { SessionDto } from '@rh-ponto/auth';
import { AppError } from '@rh-ponto/core';

import { parseAdminSessionCookieValue } from '@/features/auth/lib/admin-session-cookie';
import { ADMIN_SESSION_COOKIE_NAME, isAdminSession, isSessionExpired } from '@/features/auth/lib/auth-routes';

export const getRequiredAdminSession = async (): Promise<SessionDto> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  const session = await parseAdminSessionCookieValue(sessionCookie);

  if (!session || !isAdminSession(session) || isSessionExpired(session)) {
    throw new AppError('AUTH_UNAUTHORIZED', 'Sua sessão administrativa é inválida ou expirou.');
  }

  return session;
};
