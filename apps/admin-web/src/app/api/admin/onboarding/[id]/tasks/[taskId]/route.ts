import { NextResponse } from 'next/server';

import { onboardingTaskStatusSchema } from '@rh-ponto/validations';

import { updateOnboardingTaskStatusForAdmin } from '@/features/onboarding/lib/onboarding-server';
import { handleApiRouteError } from '@/shared/lib/api-route-error';
import { getRequiredAdminSession } from '@/shared/lib/admin-server-session';

export const PUT = async (
  request: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> },
) => {
  try {
    const session = await getRequiredAdminSession();
    const { id, taskId } = await params;
    const payload = onboardingTaskStatusSchema.parse(await request.json());
    const data = await updateOnboardingTaskStatusForAdmin(id, taskId, payload, session.user.id);

    return NextResponse.json({ data });
  } catch (error) {
    return handleApiRouteError(error, 'Não foi possível concluir a operação.');
  }
};
