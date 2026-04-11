import type { Session, SessionDto } from '@rh-ponto/auth';

type SessionRole = Session['user']['role'];

export const ADMIN_SESSION_COOKIE_NAME = 'rh-ponto-admin-session';
export const ADMIN_SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 8;

export const protectedAdminPrefixes = [
  '/dashboard',
  '/employees',
  '/onboarding',
  '/departments',
  '/time-records',
  '/justifications',
  '/vacations',
  '/help-center',
  '/analytics',
  '/schedules',
  '/payroll',
  '/documents',
  '/audit',
  '/settings',
];

const roleFallbackRoutes: Record<SessionRole, string> = {
  admin: '/dashboard',
  employee: '/login?reason=employee-role',
  kiosk: '/login?reason=kiosk-role',
};

export const resolveRoleHomeRoute = (role: SessionRole): string => roleFallbackRoutes[role];

export const isSessionExpired = (session: Pick<Session, 'expiresAt'> | Pick<SessionDto, 'expiresAt'>): boolean => {
  if (!session.expiresAt) {
    return false;
  }

  return new Date(session.expiresAt).getTime() <= Date.now();
};

export const isAdminSession = (session: Pick<Session, 'user'> | Pick<SessionDto, 'user'> | null): boolean =>
  session?.user.role === 'admin' && session.user.isActive;

export const resolvePostLoginRoute = (session: Session, nextPath?: string | null): string => {
  if (!isAdminSession(session)) {
    return resolveRoleHomeRoute(session.user.role);
  }

  if (nextPath && protectedAdminPrefixes.some((prefix) => nextPath.startsWith(prefix))) {
    return nextPath;
  }

  return '/dashboard';
};

export const getLoginReasonMessage = (reason: string | null): string | null => {
  switch (reason) {
    case 'unauthorized':
      return 'Sua conta não tem permissão para acessar o painel administrativo.';
    case 'employee-role':
      return 'Perfis de colaborador devem usar o app do funcionário.';
    case 'kiosk-role':
      return 'Perfis de kiosk devem usar o app do tablet.';
    case 'session-expired':
      return 'Sua sessão expirou. Entre novamente para continuar.';
    default:
      return null;
  }
};
