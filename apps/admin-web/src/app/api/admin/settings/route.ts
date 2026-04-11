import { NextResponse } from 'next/server';

import { AppError } from '@rh-ponto/core';
import { adminSettingsFormSchema } from '@rh-ponto/validations';

import { getRequiredAdminSession } from '@/shared/lib/admin-server-session';
import { getSettingsOverviewForAdmin, updateSettingsForAdmin } from '@/features/settings/lib/settings-server';

const handleRouteError = (error: unknown) => {
  if (error instanceof AppError) {
    const status = error.code === 'AUTH_UNAUTHORIZED' ? 401 : 400;

    return NextResponse.json({ message: error.message }, { status });
  }

  const message = error instanceof Error ? error.message : 'Não foi possível concluir a operação.';

  return NextResponse.json({ message }, { status: 500 });
};

export const GET = async () => {
  try {
    await getRequiredAdminSession();
    const data = await getSettingsOverviewForAdmin();

    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error);
  }
};

export const PUT = async (request: Request) => {
  try {
    const session = await getRequiredAdminSession();
    const payload = adminSettingsFormSchema.parse(await request.json());
    const data = await updateSettingsForAdmin(payload, session.user.id);

    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error);
  }
};
