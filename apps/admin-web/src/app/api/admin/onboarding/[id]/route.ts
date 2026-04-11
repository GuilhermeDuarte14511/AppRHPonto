import { NextResponse } from 'next/server';

import { AppError } from '@rh-ponto/core';

import { getOnboardingJourneyDetailForAdmin } from '@/features/onboarding/lib/onboarding-server';
import { getRequiredAdminSession } from '@/shared/lib/admin-server-session';

const handleRouteError = (error: unknown) => {
  if (error instanceof AppError) {
    const status = error.code === 'AUTH_UNAUTHORIZED' ? 401 : 400;

    return NextResponse.json({ message: error.message }, { status });
  }

  const message = error instanceof Error ? error.message : 'Não foi possível concluir a operação.';

  return NextResponse.json({ message }, { status: 500 });
};

export const GET = async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await getRequiredAdminSession();
    const { id } = await params;
    const data = await getOnboardingJourneyDetailForAdmin(id);

    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error);
  }
};
