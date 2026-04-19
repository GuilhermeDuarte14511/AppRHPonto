import { AppError } from '@rh-ponto/core';

import { describe, expect, it } from 'vitest';

import { handleApiRouteError } from './api-route-error';

const readJson = async (response: Response): Promise<{ message: string }> => response.json();

describe('handleApiRouteError', () => {
  it('retorna mensagem generica para erro inesperado em 500', async () => {
    const response = handleApiRouteError(new Error('detalhe interno sensivel'));
    const body = await readJson(response);

    expect(response.status).toBe(500);
    expect(body.message).toBe('Ocorreu um erro interno. Tente novamente em instantes.');
  });

  it('preserva mensagem de AppError com status 401 para AUTH_UNAUTHORIZED', async () => {
    const response = handleApiRouteError(new AppError('AUTH_UNAUTHORIZED', 'Sessão inválida.'));
    const body = await readJson(response);

    expect(response.status).toBe(401);
    expect(body.message).toBe('Sessão inválida.');
  });
});
