import { cookies } from 'next/headers';
import { SessionMapperService } from '@rh-ponto/auth';
import { NextResponse } from 'next/server';

import { buildClearedAdminSessionCookie, parseAdminSessionCookieValue } from '@/features/auth/lib/admin-session-cookie';
import { isAdminSession, isSessionExpired, ADMIN_SESSION_COOKIE_NAME } from '@/features/auth/lib/auth-routes';

const sessionMapper = new SessionMapperService();

export const GET = async (request: Request) => {
  void request;
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  const sessionDto = await parseAdminSessionCookieValue(sessionCookie);

  if (!sessionDto) {
    return new NextResponse(null, { status: 204 });
  }

  const session = sessionMapper.toDomain(sessionDto);

  if (!isAdminSession(session) || isSessionExpired(session)) {
    const response = new NextResponse(null, { status: 204 });
    response.cookies.set(buildClearedAdminSessionCookie());
    return response;
  }

  return NextResponse.json({
    session: sessionDto,
  });
};
