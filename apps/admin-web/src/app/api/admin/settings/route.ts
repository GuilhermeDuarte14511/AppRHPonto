import { NextResponse } from 'next/server';

import { adminSettingsFormSchema } from '@rh-ponto/validations';

import { getRequiredAdminSession } from '@/shared/lib/admin-server-session';
import { handleApiRouteError } from '@/shared/lib/api-route-error';
import { getSettingsOverviewForAdmin, updateSettingsForAdmin } from '@/features/settings/lib/settings-server';

export const GET = async () => {
  try {
    await getRequiredAdminSession();
    const data = await getSettingsOverviewForAdmin();

    return NextResponse.json({ data });
  } catch (error) {
    return handleApiRouteError(error, 'Não foi possível concluir a operação.');
  }
};

export const PUT = async (request: Request) => {
  try {
    const session = await getRequiredAdminSession();
    const payload = adminSettingsFormSchema.parse(await request.json());
    const data = await updateSettingsForAdmin(payload, session.user.id);

    return NextResponse.json({ data });
  } catch (error) {
    return handleApiRouteError(error, 'Não foi possível concluir a operação.');
  }
};
