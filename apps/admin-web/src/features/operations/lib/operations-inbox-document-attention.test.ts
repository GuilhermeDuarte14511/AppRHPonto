import { beforeEach, describe, expect, it, vi } from 'vitest';

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

import { getOperationsInboxAt } from './operations-inbox-query';

describe('getOperationsInboxAt document attention', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('inclui documentos aguardando ciência na fila operacional do RH', async () => {
    fetchAdminLiveDataSnapshotMock.mockResolvedValue({
      auditLogs: [],
      devices: [],
      employeeDocuments: [
        {
          id: 'document-1',
          employeeId: 'employee-1',
          category: 'policy',
          title: 'Política de home office',
          description: 'Documento oficial publicado.',
          status: 'pending_signature',
          fileName: 'politica-home-office.pdf',
          fileUrl: 'https://example.com/politica-home-office.pdf',
          issuedAt: '2026-04-19T09:00:00.000Z',
          acknowledgedAt: null,
          expiresAt: null,
          createdAt: '2026-04-19T09:00:00.000Z',
          updatedAt: '2026-04-19T09:00:00.000Z',
        },
      ],
      employeeScheduleHistories: [],
      employees: [{ id: 'employee-1', fullName: 'Ana Souza' }],
      justificationAttachments: [],
      justifications: [],
      payrollStatements: [],
      timeRecordPhotos: [],
      timeRecords: [],
      vacationRequests: [],
      workSchedules: [],
    });
    fetchOnboardingAttentionMock.mockResolvedValue({ total: 0, items: [] });

    const result = await getOperationsInboxAt(new Date('2026-04-19T12:00:00.000Z'));

    expect(result.summary.total).toBe(1);
    expect(result.items[0]).toMatchObject({
      category: 'document',
      title: 'Ciência pendente: Ana Souza',
      href: '/documents',
      notification: {
        entityName: 'employee_document',
        entityId: 'document-1',
      },
    });
  });
});
