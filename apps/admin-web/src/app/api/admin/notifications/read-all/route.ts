import { NextResponse } from 'next/server';

import { markAllAdminNotificationsAsRead } from '@/shared/lib/notification-center-server';
import { handleApiRouteError } from '@/shared/lib/api-route-error';
import { getRequiredAdminSession } from '@/shared/lib/admin-server-session';

export const POST = async () => {
  try {
    const session = await getRequiredAdminSession();
    await markAllAdminNotificationsAsRead(session.user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiRouteError(error, 'Não foi possível atualizar as notificações.');
  }
};
