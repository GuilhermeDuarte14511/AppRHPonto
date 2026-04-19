import { NextResponse } from 'next/server';

import { getOnboardingAttentionForAdmin } from '@/features/onboarding/lib/onboarding-server';
import { handleApiRouteError } from '@/shared/lib/api-route-error';
import { getRequiredAdminSession } from '@/shared/lib/admin-server-session';

export const GET = async () => {
  try {
    if (process.env.NODE_ENV === 'production' || process.env.ADMIN_SESSION_SECRET?.trim()) {
      await getRequiredAdminSession();
    }
    const data = await getOnboardingAttentionForAdmin();

    return NextResponse.json({ data });
  } catch (error) {
    return handleApiRouteError(error, 'Não foi possível concluir a operação.');
  }
};
