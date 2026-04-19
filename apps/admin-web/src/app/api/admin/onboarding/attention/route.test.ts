import { NextResponse } from 'next/server';

import { AppError } from '@rh-ponto/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  getRequiredAdminSessionMock,
  getOnboardingAttentionForAdminMock,
  handleApiRouteErrorMock,
} = vi.hoisted(() => ({
  getRequiredAdminSessionMock: vi.fn(),
  getOnboardingAttentionForAdminMock: vi.fn(),
  handleApiRouteErrorMock: vi.fn(),
}));

vi.mock('@/shared/lib/admin-server-session', () => ({
  getRequiredAdminSession: getRequiredAdminSessionMock,
}));

vi.mock('@/features/onboarding/lib/onboarding-server', () => ({
  getOnboardingAttentionForAdmin: getOnboardingAttentionForAdminMock,
}));

vi.mock('@/shared/lib/api-route-error', () => ({
  handleApiRouteError: handleApiRouteErrorMock,
}));

import { GET } from './route';

describe('GET /api/admin/onboarding/attention', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna 200 quando a sessão admin é válida', async () => {
    getRequiredAdminSessionMock.mockResolvedValue({
      user: {
        id: 'admin-1',
      },
    });

    getOnboardingAttentionForAdminMock.mockResolvedValue({
      total: 1,
      items: [
        {
          id: 'task-1',
          title: 'Assinar contrato',
          status: 'blocked',
          dueDate: null,
          employeeName: 'Ana Souza',
          journeyId: 'journey-1',
          updatedAt: '2026-04-18T10:30:00.000Z',
        },
      ],
    });

    const response = await GET();
    const body = await response.json();

    expect(getRequiredAdminSessionMock).toHaveBeenCalledTimes(1);
    expect(getOnboardingAttentionForAdminMock).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
    expect(body).toEqual({
      data: {
        total: 1,
        items: [
          {
            id: 'task-1',
            title: 'Assinar contrato',
            status: 'blocked',
            dueDate: null,
            employeeName: 'Ana Souza',
            journeyId: 'journey-1',
            updatedAt: '2026-04-18T10:30:00.000Z',
          },
        ],
      },
    });
  });

  it('retorna 401 quando a sessão admin é inválida', async () => {
    const authError = new AppError('AUTH_UNAUTHORIZED', 'Sessão inválida.');
    getRequiredAdminSessionMock.mockRejectedValue(authError);
    handleApiRouteErrorMock.mockImplementation((error: unknown) => {
      const appError = error as AppError;
      return NextResponse.json({ message: appError.message }, { status: 401 });
    });

    const response = await GET();
    const body = await response.json();

    expect(getRequiredAdminSessionMock).toHaveBeenCalledTimes(1);
    expect(getOnboardingAttentionForAdminMock).not.toHaveBeenCalled();
    expect(handleApiRouteErrorMock).toHaveBeenCalledWith(
      authError,
      'Não foi possível concluir a operação.',
    );
    expect(response.status).toBe(401);
    expect(body).toEqual({ message: 'Sessão inválida.' });
  });
});
