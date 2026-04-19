import { NextResponse } from 'next/server';

import {
  getEmployeeOnboardingSnapshotForAdmin,
  initializeEmployeeOnboardingForAdmin,
} from '@/features/onboarding/lib/onboarding-server';
import { handleApiRouteError } from '@/shared/lib/api-route-error';
import { getRequiredAdminSession } from '@/shared/lib/admin-server-session';

export const GET = async (_request: Request, context: { params: Promise<{ id: string }> }) => {
  try {
    await getRequiredAdminSession();
    const { id } = await context.params;
    const data = await getEmployeeOnboardingSnapshotForAdmin(id);

    return NextResponse.json({ data });
  } catch (error) {
    return handleApiRouteError(error, 'Não foi possível concluir a operação.');
  }
};

export const POST = async (_request: Request, context: { params: Promise<{ id: string }> }) => {
  try {
    const session = await getRequiredAdminSession();
    const { id } = await context.params;
    const data = await initializeEmployeeOnboardingForAdmin(id, session.user.id);

    return NextResponse.json({ data });
  } catch (error) {
    return handleApiRouteError(error, 'Não foi possível concluir a operação.');
  }
};
