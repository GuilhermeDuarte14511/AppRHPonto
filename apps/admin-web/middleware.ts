import { NextResponse, type NextRequest } from 'next/server';

import { buildClearedAdminSessionCookie, parseAdminSessionCookieValue } from '@/features/auth/lib/admin-session-cookie';
import {
  ADMIN_SESSION_COOKIE_NAME,
  isAdminSession,
  isSessionExpired,
  protectedAdminPrefixes,
} from '@/features/auth/lib/auth-routes';

export const middleware = async (request: NextRequest) => {
  const { pathname, search } = request.nextUrl;
  const isProtectedRoute = protectedAdminPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  const session = await parseAdminSessionCookieValue(sessionCookie);

  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', `${pathname}${search}`);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.set(buildClearedAdminSessionCookie());
    return response;
  }

  if (isSessionExpired(session)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('reason', 'session-expired');
    loginUrl.searchParams.set('next', `${pathname}${search}`);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.set(buildClearedAdminSessionCookie());
    return response;
  }

  if (!isAdminSession(session)) {
    const unauthorizedUrl = new URL('/unauthorized', request.url);
    const response = NextResponse.redirect(unauthorizedUrl);
    response.cookies.set(buildClearedAdminSessionCookie());
    return response;
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/employees/:path*',
    '/onboarding/:path*',
    '/departments/:path*',
    '/time-records/:path*',
    '/justifications/:path*',
    '/vacations/:path*',
    '/help-center/:path*',
    '/analytics/:path*',
    '/schedules/:path*',
    '/payroll/:path*',
    '/documents/:path*',
    '/audit/:path*',
    '/settings/:path*',
  ],
};
