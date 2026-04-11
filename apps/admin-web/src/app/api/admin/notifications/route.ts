import { NextResponse } from 'next/server';

import { AppError } from '@rh-ponto/core';

import { listAdminNotifications } from '@/shared/lib/notification-center-server';
import { getRequiredAdminSession } from '@/shared/lib/admin-server-session';

const handleRouteError = (error: unknown) => {
  if (error instanceof AppError) {
    const status = error.code === 'AUTH_UNAUTHORIZED' ? 401 : 400;

    return NextResponse.json({ message: error.message }, { status });
  }

  const message = error instanceof Error ? error.message : 'Não foi possível consultar as notificações.';

  return NextResponse.json({ message }, { status: 500 });
};

export const GET = async () => {
  try {
    const session = await getRequiredAdminSession();
    const data = await listAdminNotifications(session.user.id);

    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error);
  }
};
