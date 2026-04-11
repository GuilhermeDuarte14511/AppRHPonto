import { NextResponse } from 'next/server';

import { AppError } from '@rh-ponto/core';

import { getRequiredAdminSession } from '@/shared/lib/admin-server-session';
import { searchAcrossAdminData } from '@/shared/lib/global-search-server';

const handleRouteError = (error: unknown) => {
  if (error instanceof AppError) {
    const status = error.code === 'AUTH_UNAUTHORIZED' ? 401 : 400;

    return NextResponse.json({ message: error.message }, { status });
  }

  const message = error instanceof Error ? error.message : 'Não foi possível concluir a busca.';

  return NextResponse.json({ message }, { status: 500 });
};

export const GET = async (request: Request) => {
  try {
    await getRequiredAdminSession();
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('q') ?? '';
    const data = await searchAcrossAdminData(term);

    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error);
  }
};
