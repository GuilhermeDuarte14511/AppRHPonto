import { NextResponse } from 'next/server';

import { getOnboardingJourneyDetailForAdmin } from '@/features/onboarding/lib/onboarding-server';
import { getRequiredAdminSession } from '@/shared/lib/admin-server-session';
import { handleApiRouteError } from '@/shared/lib/api-route-error';

export const GET = async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await getRequiredAdminSession();
    const { id } = await params;
    const data = await getOnboardingJourneyDetailForAdmin(id);

    return NextResponse.json({ data });
  } catch (error) {
    return handleApiRouteError(error, 'Não foi possível concluir a operação.');
  }
};
