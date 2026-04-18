import { beforeEach, describe, expect, it, vi } from 'vitest';

const { executeAdminGraphqlMock } = vi.hoisted(() => ({
  executeAdminGraphqlMock: vi.fn(),
}));

vi.mock('./admin-server-data-connect', () => ({
  executeAdminGraphql: executeAdminGraphqlMock,
}));

import { listAdminNotifications } from './notification-center-server';

describe('listAdminNotifications', () => {
  beforeEach(() => {
    executeAdminGraphqlMock.mockReset();
  });

  it('keeps blocked onboarding without due date fresh through notification sync', async () => {
    const initialQueryData = {
      adminSettings: {
        id: 'settings-1',
        notifyOvertimeSummary: false,
        notifyPendingVacations: false,
        notifyDeviceSync: false,
        notifyAuditSummary: false,
      },
      adminNotifications: [],
      vacationRequests: [],
      justifications: [],
      timeRecords: [],
      devices: [],
      onboardingTasks: [
        {
          id: 'task-1',
          title: 'Assinar contrato',
          status: 'blocked',
          dueDate: null,
          updatedAt: '2026-04-18T10:30:00.000Z',
          journey: {
            id: 'journey-1',
            employee: { fullName: 'Diego' },
          },
        },
      ],
      auditLogs: [],
    };

    const syncedQueryData = {
      ...initialQueryData,
      adminNotifications: [
        {
          id: 'notification-1',
          referenceKey: 'onboarding-task:task-1:blocked:no-date',
          category: 'onboarding',
          title: 'Etapa de onboarding bloqueada',
          description: 'Diego exige atencao em "Assinar contrato".',
          href: '/onboarding/journey-1',
          entityName: 'onboarding_task',
          entityId: 'task-1',
          severity: 'danger',
          status: 'unread',
          triggeredAt: '2026-04-18T10:30:00.000Z',
          readAt: null,
        },
      ],
    };

    executeAdminGraphqlMock
      .mockResolvedValueOnce(initialQueryData)
      .mockResolvedValueOnce({ adminNotification_insert: { id: 'notification-1' } })
      .mockResolvedValueOnce(syncedQueryData);

    const result = await listAdminNotifications('user-1');

    expect(executeAdminGraphqlMock).toHaveBeenCalledTimes(3);
    expect(executeAdminGraphqlMock).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('mutation InsertAdminNotification'),
      expect.objectContaining({
        userId: 'user-1',
        referenceKey: 'onboarding-task:task-1:blocked:no-date',
        category: 'onboarding',
        title: 'Etapa de onboarding bloqueada',
        description: 'Diego exige atencao em "Assinar contrato".',
        href: '/onboarding/journey-1',
        entityName: 'onboarding_task',
        entityId: 'task-1',
        severity: 'danger',
        triggeredAt: '2026-04-18T10:30:00.000Z',
      }),
    );

    expect(result).toEqual({
      unreadCount: 1,
      items: [
        {
          id: 'notification-1',
          category: 'onboarding',
          title: 'Etapa de onboarding bloqueada',
          description: 'Diego exige atencao em "Assinar contrato".',
          href: '/onboarding/journey-1',
          entityName: 'onboarding_task',
          entityId: 'task-1',
          severity: 'danger',
          status: 'unread',
          triggeredAt: '2026-04-18T10:30:00.000Z',
          readAt: null,
        },
      ],
    });
  });
});
