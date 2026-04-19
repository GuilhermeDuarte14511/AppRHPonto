import { NextResponse } from 'next/server';

import { getRequiredAdminSession } from '@/shared/lib/admin-server-session';
import { handleApiRouteError } from '@/shared/lib/api-route-error';
import { markAdminNotificationAsRead } from '@/shared/lib/notification-center-server';

export const POST = async (_request: Request, context: { params: Promise<{ id: string }> }) => {
  try {
    await getRequiredAdminSession();
    const { id } = await context.params;
    await markAdminNotificationAsRead(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiRouteError(error, 'Não foi possível atualizar a notificação.');
  }
};
