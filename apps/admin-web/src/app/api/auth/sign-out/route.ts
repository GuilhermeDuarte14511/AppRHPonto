import { NextResponse } from 'next/server';

import { buildClearedAdminSessionCookie } from '@/features/auth/lib/admin-session-cookie';

export const POST = async () => {
  const response = NextResponse.json({ success: true });
  response.cookies.set(buildClearedAdminSessionCookie());

  return response;
};
