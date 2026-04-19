import { NextResponse } from 'next/server';

import { getOnboardingOverviewForAdmin } from '@/features/onboarding/lib/onboarding-server';
import { handleApiRouteError } from '@/shared/lib/api-route-error';
import { getRequiredAdminSession } from '@/shared/lib/admin-server-session';

export const GET = async () => {
  try {
    await getRequiredAdminSession();
    const data = await getOnboardingOverviewForAdmin();

    return NextResponse.json({ data });
  } catch (error) {
    return handleApiRouteError(error, 'Não foi possível concluir a operação.');
  }
};
