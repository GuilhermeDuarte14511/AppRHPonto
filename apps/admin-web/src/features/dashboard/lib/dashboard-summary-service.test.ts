import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  fetchAdminLiveDataSnapshotMock,
  getPayrollOverviewMock,
  fetchOnboardingAttentionMock,
} = vi.hoisted(() => ({
  fetchAdminLiveDataSnapshotMock: vi.fn(),
  getPayrollOverviewMock: vi.fn(),
  fetchOnboardingAttentionMock: vi.fn(),
}));

vi.mock('@/shared/lib/admin-live-data', () => ({
  fetchAdminLiveDataSnapshot: fetchAdminLiveDataSnapshotMock,
}));

vi.mock('@/features/payroll/lib/payroll-data-source', () => ({
  getPayrollOverview: getPayrollOverviewMock,
}));

vi.mock('@/features/onboarding/lib/onboarding-client', () => ({
  fetchOnboardingAttention: fetchOnboardingAttentionMock,
}));

import { getDashboardSummary } from './dashboard-summary-service';

describe('getDashboardSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('includes onboarding attention and inactive devices in the RH inbox shortcut count', async () => {
    fetchAdminLiveDataSnapshotMock.mockResolvedValue({
      auditLogs: [],
      devices: [
        {
          id: 'device-1',
          name: 'Totem Recepção',
          isActive: false,
          locationName: 'Recepção',
          lastSyncAt: '2026-04-18T09:00:00.000Z',
        },
      ],
      employeeDocuments: [
        {
          id: 'document-1',
          employeeId: 'employee-1',
          category: 'policy',
          title: 'Política de home office',
          description: 'Documento oficial pendente.',
          status: 'pending_signature',
          fileName: 'politica-home-office.pdf',
          fileUrl: 'https://example.com/politica-home-office.pdf',
          issuedAt: '2026-04-18T11:00:00.000Z',
          acknowledgedAt: null,
          expiresAt: null,
          createdAt: '2026-04-18T11:00:00.000Z',
          updatedAt: '2026-04-18T11:00:00.000Z',
        },
      ],
      employeeScheduleHistories: [],
      employees: [
        {
          id: 'employee-1',
          fullName: 'Ana Souza',
          department: 'RH',
          isActive: true,
        },
      ],
      justificationAttachments: [],
      justifications: [
        {
          id: 'justification-1',
          employeeId: 'employee-1',
          status: 'pending',
        },
      ],
      timeRecordPhotos: [],
      timeRecords: [
        {
          id: 'time-record-1',
          employeeId: 'employee-1',
          status: 'pending_review',
          recordedAt: '2026-04-18T08:00:00.000Z',
          recordType: 'entry',
          source: 'device',
          notes: null,
        },
      ],
      vacationRequests: [
        {
          id: 'vacation-1',
          employeeId: 'employee-1',
          status: 'pending',
          requestedAt: '2026-04-18T07:00:00.000Z',
          startDate: '2026-05-10',
          endDate: '2026-05-15',
        },
      ],
      workSchedules: [],
    });

    getPayrollOverviewMock.mockResolvedValue({
      progress: 80,
      pending: 1,
      validated: 3,
      isClosed: false,
      records: [],
    });

    fetchOnboardingAttentionMock.mockResolvedValue({
      total: 2,
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
        {
          id: 'task-2',
          title: 'Enviar documentos',
          status: 'in_progress',
          dueDate: '2026-04-10',
          employeeName: 'Ana Souza',
          journeyId: 'journey-1',
          updatedAt: '2026-04-18T08:00:00.000Z',
        },
      ],
    });

    const result = await getDashboardSummary();

    expect(result.pendingDocumentAcknowledgements).toBe(1);
    expect(result.operationsInboxTotal).toBe(7);
  });

  it('fails when onboarding attention cannot be loaded for the dashboard shortcut count', async () => {
    fetchAdminLiveDataSnapshotMock.mockResolvedValue({
      auditLogs: [],
      devices: [],
      employeeDocuments: [],
      employeeScheduleHistories: [],
      employees: [],
      justificationAttachments: [],
      justifications: [],
      timeRecordPhotos: [],
      timeRecords: [],
      vacationRequests: [],
      workSchedules: [],
    });

    getPayrollOverviewMock.mockResolvedValue({
      progress: 100,
      pending: 0,
      validated: 0,
      isClosed: true,
      records: [],
    });

    fetchOnboardingAttentionMock.mockRejectedValue(new Error('Falha no onboarding'));

    await expect(getDashboardSummary()).rejects.toThrow('Falha no onboarding');
  });
});
