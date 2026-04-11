import { AppError } from '@rh-ponto/core';
import { SessionMapperService } from '@rh-ponto/auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { buildAdminSessionCookie, buildClearedAdminSessionCookie } from '@/features/auth/lib/admin-session-cookie';
import { isAdminSession } from '@/features/auth/lib/auth-routes';
import { signInAdminWithFirebase } from '@/features/auth/lib/firebase-admin-auth';

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const sessionMapper = new SessionMapperService();

export const POST = async (request: Request) => {
  try {
    const payload = signInSchema.parse(await request.json());
    const session = sessionMapper.toDomain(await signInAdminWithFirebase(payload));
    const response = NextResponse.json({
      session: sessionMapper.toDto(session),
    });

    if (isAdminSession(session)) {
      response.cookies.set(await buildAdminSessionCookie(sessionMapper.toDto(session)));
    } else {
      response.cookies.set(buildClearedAdminSessionCookie());
    }

    return response;
  } catch (error) {
    const message =
      error instanceof AppError
        ? error.message
        : error instanceof z.ZodError
          ? 'Dados de acesso inválidos.'
          : 'Não foi possível concluir o login.';

    return NextResponse.json(
      {
        message,
      },
      { status: 400 },
    );
  }
};
