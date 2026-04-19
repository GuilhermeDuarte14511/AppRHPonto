import { NextResponse } from 'next/server';

import { getRequiredAdminSession } from '@/shared/lib/admin-server-session';
import { handleApiRouteError } from '@/shared/lib/api-route-error';
import { searchAcrossAdminData } from '@/shared/lib/global-search-server';

export const GET = async (request: Request) => {
  try {
    await getRequiredAdminSession();
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('q') ?? '';
    const data = await searchAcrossAdminData(term);

    return NextResponse.json({ data });
  } catch (error) {
    return handleApiRouteError(error, 'Não foi possível concluir a busca.');
  }
};
