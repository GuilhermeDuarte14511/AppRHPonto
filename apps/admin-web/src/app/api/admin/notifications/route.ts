import { NextResponse } from 'next/server';

import { listAdminNotifications } from '@/shared/lib/notification-center-server';
import { handleApiRouteError } from '@/shared/lib/api-route-error';
import { getRequiredAdminSession } from '@/shared/lib/admin-server-session';

export const GET = async () => {
  try {
    const session = await getRequiredAdminSession();
    const data = await listAdminNotifications(session.user.id);

    return NextResponse.json({ data });
  } catch (error) {
    return handleApiRouteError(error, 'Não foi possível consultar as notificações.');
  }
};
