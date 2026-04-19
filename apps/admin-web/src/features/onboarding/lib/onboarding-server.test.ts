import { beforeEach, describe, expect, it, vi } from 'vitest';

const { executeAdminGraphqlMock } = vi.hoisted(() => ({
  executeAdminGraphqlMock: vi.fn(),
}));

vi.mock('@/shared/lib/admin-server-data-connect', () => ({
  executeAdminGraphql: executeAdminGraphqlMock,
}));

import { getOnboardingAttentionForAdmin } from './onboarding-server';

describe('getOnboardingAttentionForAdmin', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-18T12:00:00.000Z'));
    executeAdminGraphqlMock.mockReset();
  });

  it('returns only blocked or overdue tasks in a single server-side query', async () => {
    executeAdminGraphqlMock.mockResolvedValue({
      onboardingTasks: [
        {
          id: 'task-blocked',
          title: 'Assinar contrato',
          status: 'blocked',
          dueDate: null,
          updatedAt: '2026-04-18T10:30:00.000Z',
          journey: {
            id: 'journey-1',
            employee: {
              fullName: 'Ana Souza',
            },
          },
        },
        {
          id: 'task-overdue',
          title: 'Enviar documentos',
          status: 'in_progress',
          dueDate: '2026-04-10',
          updatedAt: '2026-04-18T08:00:00.000Z',
          journey: {
            id: 'journey-1',
            employee: {
              fullName: 'Ana Souza',
            },
          },
        },
        {
          id: 'task-future',
          title: 'Liberar acessos',
          status: 'pending',
          dueDate: '2026-04-25',
          updatedAt: '2026-04-18T09:00:00.000Z',
          journey: {
            id: 'journey-2',
            employee: {
              fullName: 'Bruno Costa',
            },
          },
        },
        {
          id: 'task-completed',
          title: 'Cadastrar benefícios',
          status: 'completed',
          dueDate: '2026-04-09',
          updatedAt: '2026-04-09T09:00:00.000Z',
          journey: {
            id: 'journey-3',
            employee: {
              fullName: 'Carla Lima',
            },
          },
        },
      ],
    });

    const result = await getOnboardingAttentionForAdmin();

    expect(executeAdminGraphqlMock).toHaveBeenCalledTimes(1);
    expect(executeAdminGraphqlMock).toHaveBeenCalledWith(
      expect.stringContaining('query GetOnboardingAttention'),
    );
    expect(result).toEqual({
      total: 2,
      items: [
        {
          id: 'task-blocked',
          title: 'Assinar contrato',
          status: 'blocked',
          dueDate: null,
          employeeName: 'Ana Souza',
          journeyId: 'journey-1',
          updatedAt: '2026-04-18T10:30:00.000Z',
        },
        {
          id: 'task-overdue',
          title: 'Enviar documentos',
          status: 'in_progress',
          dueDate: '2026-04-10',
          employeeName: 'Ana Souza',
          journeyId: 'journey-1',
          updatedAt: '2026-04-18T08:00:00.000Z',
        },
      ],
    });
  });
});
