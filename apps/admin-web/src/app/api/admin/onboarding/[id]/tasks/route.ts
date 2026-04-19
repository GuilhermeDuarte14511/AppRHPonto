import { NextResponse } from 'next/server';

import { onboardingTaskCreateSchema } from '@rh-ponto/validations';

import { createOnboardingTaskForAdmin } from '@/features/onboarding/lib/onboarding-server';
import { handleApiRouteError } from '@/shared/lib/api-route-error';
import { getRequiredAdminSession } from '@/shared/lib/admin-server-session';

export const POST = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const session = await getRequiredAdminSession();
    const { id } = await params;
    const payload = onboardingTaskCreateSchema.parse(await request.json());
    const data = await createOnboardingTaskForAdmin(id, payload, session.user.id);

    return NextResponse.json({ data });
  } catch (error) {
    return handleApiRouteError(error, 'Não foi possível concluir a operação.');
  }
};
