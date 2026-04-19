import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getOperationsInboxAt } from './operations-inbox-query';

const {
  fetchAdminLiveDataSnapshotMock,
  fetchOnboardingAttentionMock,
} = vi.hoisted(() => ({
  fetchAdminLiveDataSnapshotMock: vi.fn(),
  fetchOnboardingAttentionMock: vi.fn(),
}));

vi.mock('@/shared/lib/admin-live-data', () => ({
  fetchAdminLiveDataSnapshot: fetchAdminLiveDataSnapshotMock,
}));

vi.mock('@/features/onboarding/lib/onboarding-client', () => ({
  fetchOnboardingAttention: fetchOnboardingAttentionMock,
}));

describe('getOperationsInboxAt', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('includes blocked and overdue onboarding tasks from the server-side attention feed', async () => {
    fetchAdminLiveDataSnapshotMock.mockResolvedValue({
      auditLogs: [],
      devices: [],
      employeeScheduleHistories: [],
      employees: [
        {
          id: 'employee-1',
          fullName: 'Ana Souza',
        },
      ],
      justificationAttachments: [],
      justifications: [],
      timeRecordPhotos: [],
      timeRecords: [],
      vacationRequests: [],
      workSchedules: [],
    });

    fetchOnboardingAttentionMock.mockResolvedValue({
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

    const result = await getOperationsInboxAt(new Date('2026-04-18T12:00:00.000Z'));

    expect(fetchOnboardingAttentionMock).toHaveBeenCalledTimes(1);
    expect(result.groups.find((group) => group.category === 'onboarding')?.count).toBe(2);
    expect(result.items.filter((item) => item.category === 'onboarding').map((item) => item.id)).toEqual([
      'task-blocked',
      'task-overdue',
    ]);
  });

  it('fails the inbox query when onboarding attention cannot be loaded', async () => {
    fetchAdminLiveDataSnapshotMock.mockResolvedValue({
      auditLogs: [],
      devices: [],
      employeeScheduleHistories: [],
      employees: [],
      justificationAttachments: [],
      justifications: [],
      timeRecordPhotos: [],
      timeRecords: [],
      vacationRequests: [],
      workSchedules: [],
    });

    fetchOnboardingAttentionMock.mockRejectedValue(new Error('Falha no onboarding'));

    await expect(getOperationsInboxAt(new Date('2026-04-18T12:00:00.000Z'))).rejects.toThrow(
      'Falha no onboarding',
    );
  });
});
