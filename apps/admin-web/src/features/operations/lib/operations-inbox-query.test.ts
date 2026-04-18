import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getOperationsInboxAt } from './operations-inbox-query';

const {
  fetchAdminLiveDataSnapshotMock,
  fetchOnboardingOverviewMock,
  fetchOnboardingJourneyDetailMock,
} = vi.hoisted(() => ({
  fetchAdminLiveDataSnapshotMock: vi.fn(),
  fetchOnboardingOverviewMock: vi.fn(),
  fetchOnboardingJourneyDetailMock: vi.fn(),
}));

vi.mock('@/shared/lib/admin-live-data', () => ({
  fetchAdminLiveDataSnapshot: fetchAdminLiveDataSnapshotMock,
}));

vi.mock('@/features/onboarding/lib/onboarding-client', () => ({
  fetchOnboardingOverview: fetchOnboardingOverviewMock,
  fetchOnboardingJourneyDetail: fetchOnboardingJourneyDetailMock,
}));

describe('getOperationsInboxAt', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('includes blocked and overdue onboarding tasks from the client-safe onboarding API', async () => {
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

    fetchOnboardingOverviewMock.mockResolvedValue({
      metrics: {
        total: 1,
        inProgress: 0,
        blocked: 1,
        completed: 0,
        pendingDocuments: 0,
        pendingEquipment: 0,
        pendingSignatures: 0,
        overdueTasks: 1,
      },
      departments: [],
      statuses: ['blocked'],
      items: [
        {
          id: 'journey-1',
          employeeId: 'employee-1',
          employeeName: 'Ana Souza',
          employeeEmail: null,
          department: 'RH',
          position: 'Analista',
          ownerName: 'Marcos',
          status: 'blocked',
          statusLabel: 'Bloqueado',
          progressPercent: 25,
          currentStageLabel: 'Documentação',
          startDateLabel: '18/04/2026',
          expectedEndDateLabel: '24/04/2026',
          overdueTasksCount: 1,
          categorySummaries: {
            documentation: {
              category: 'documentation',
              label: 'Documentação',
              status: 'blocked',
              completedCount: 0,
              totalCount: 1,
            },
            equipment: {
              category: 'equipment',
              label: 'Equipamentos',
              status: 'empty',
              completedCount: 0,
              totalCount: 0,
            },
            signature: {
              category: 'signature',
              label: 'Assinaturas',
              status: 'empty',
              completedCount: 0,
              totalCount: 0,
            },
          },
        },
      ],
    });

    fetchOnboardingJourneyDetailMock.mockResolvedValue({
      id: 'journey-1',
      employeeId: 'employee-1',
      employeeName: 'Ana Souza',
      employeeEmail: null,
      department: 'RH',
      position: 'Analista',
      registrationNumber: '123',
      hireDateLabel: '18/04/2026',
      phoneLabel: '-',
      ownerName: 'Marcos',
      status: 'blocked',
      statusLabel: 'Bloqueado',
      progressPercent: 25,
      currentStageLabel: 'Documentação',
      startDateLabel: '18/04/2026',
      expectedEndDateLabel: '24/04/2026',
      completedAtLabel: '-',
      notes: null,
      stats: {
        totalTasks: 3,
        completedTasks: 1,
        blockedTasks: 1,
        overdueTasks: 1,
      },
      assigneeOptions: [],
      sections: [
        {
          category: 'documentation',
          label: 'Documentação',
          summary: 'Pendências',
          completedCount: 1,
          totalCount: 3,
          tasks: [
            {
              id: 'task-blocked',
              title: 'Assinar contrato',
              description: null,
              category: 'documentation',
              categoryLabel: 'Documentação',
              status: 'blocked',
              statusLabel: 'Bloqueado',
              dueDate: null,
              dueDateLabel: '-',
              completedAtLabel: '-',
              assignedToLabel: 'RH',
              blockerReason: 'Aguardando documento',
              evidenceLabel: null,
              evidenceUrl: null,
              isRequired: true,
            },
            {
              id: 'task-overdue',
              title: 'Enviar documentos',
              description: null,
              category: 'documentation',
              categoryLabel: 'Documentação',
              status: 'in_progress',
              statusLabel: 'Em andamento',
              dueDate: '2026-04-10',
              dueDateLabel: '10/04/2026',
              completedAtLabel: '-',
              assignedToLabel: 'RH',
              blockerReason: null,
              evidenceLabel: null,
              evidenceUrl: null,
              isRequired: true,
            },
            {
              id: 'task-completed',
              title: 'Cadastrar acessos',
              description: null,
              category: 'access',
              categoryLabel: 'Acessos',
              status: 'completed',
              statusLabel: 'Concluído',
              dueDate: '2026-04-12',
              dueDateLabel: '12/04/2026',
              completedAtLabel: '12/04/2026',
              assignedToLabel: 'TI',
              blockerReason: null,
              evidenceLabel: null,
              evidenceUrl: null,
              isRequired: true,
            },
          ],
        },
      ],
    });

    const result = await getOperationsInboxAt(new Date('2026-04-18T12:00:00.000Z'));

    expect(fetchOnboardingJourneyDetailMock).toHaveBeenCalledWith('journey-1');
    expect(result.groups.find((group) => group.category === 'onboarding')?.count).toBe(2);
    expect(result.items.filter((item) => item.category === 'onboarding').map((item) => item.id)).toEqual([
      'task-blocked',
      'task-overdue',
    ]);
  });
});
