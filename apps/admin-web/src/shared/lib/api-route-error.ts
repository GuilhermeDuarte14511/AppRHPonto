import { NextResponse } from 'next/server';

import { AppError } from '@rh-ponto/core';

const DEFAULT_UNEXPECTED_ERROR_MESSAGE = 'Ocorreu um erro interno. Tente novamente em instantes.';

export const handleApiRouteError = (
  error: unknown,
  unexpectedErrorMessage: string = DEFAULT_UNEXPECTED_ERROR_MESSAGE,
) => {
  if (error instanceof AppError) {
    const status = error.code === 'AUTH_UNAUTHORIZED' ? 401 : 400;

    return NextResponse.json({ message: error.message }, { status });
  }

  return NextResponse.json({ message: unexpectedErrorMessage }, { status: 500 });
};
