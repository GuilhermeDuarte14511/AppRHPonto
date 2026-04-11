import { NextResponse } from 'next/server';

import { AppError } from '@rh-ponto/core';

import {
  getEmployeeOnboardingSnapshotForAdmin,
  initializeEmployeeOnboardingForAdmin,
} from '@/features/onboarding/lib/onboarding-server';
import { getRequiredAdminSession } from '@/shared/lib/admin-server-session';

const handleRouteError = (error: unknown) => {
  if (error instanceof AppError) {
    const status = error.code === 'AUTH_UNAUTHORIZED' ? 401 : 400;

    return NextResponse.json({ message: error.message }, { status });
  }

  const message = error instanceof Error ? error.message : 'Não foi possível concluir a operação.';

  return NextResponse.json({ message }, { status: 500 });
};

export const GET = async (_request: Request, context: { params: Promise<{ id: string }> }) => {
  try {
    await getRequiredAdminSession();
    const { id } = await context.params;
    const data = await getEmployeeOnboardingSnapshotForAdmin(id);

    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error);
  }
};

export const POST = async (_request: Request, context: { params: Promise<{ id: string }> }) => {
  try {
    const session = await getRequiredAdminSession();
    const { id } = await context.params;
    const data = await initializeEmployeeOnboardingForAdmin(id, session.user.id);

    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error);
  }
};
