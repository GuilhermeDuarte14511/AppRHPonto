import { NextResponse } from 'next/server';

import { AppError } from '@rh-ponto/core';

import { getRequiredAdminSession } from '@/shared/lib/admin-server-session';
import { markAdminNotificationAsRead } from '@/shared/lib/notification-center-server';

const handleRouteError = (error: unknown) => {
  if (error instanceof AppError) {
    const status = error.code === 'AUTH_UNAUTHORIZED' ? 401 : 400;

    return NextResponse.json({ message: error.message }, { status });
  }

  const message = error instanceof Error ? error.message : 'Não foi possível atualizar a notificação.';

  return NextResponse.json({ message }, { status: 500 });
};

export const POST = async (_request: Request, context: { params: Promise<{ id: string }> }) => {
  try {
    await getRequiredAdminSession();
    const { id } = await context.params;
    await markAdminNotificationAsRead(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
};
