import { beforeEach, describe, expect, it, vi } from 'vitest';

const { fetchAdminLiveDataSnapshotMock } = vi.hoisted(() => ({
  fetchAdminLiveDataSnapshotMock: vi.fn(),
}));

vi.mock('@/shared/lib/admin-live-data', () => ({
  fetchAdminLiveDataSnapshot: fetchAdminLiveDataSnapshotMock,
}));

import { getDocumentsOverview } from './documents-overview-service';

describe('getDocumentsOverview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('inclui EmployeeDocument como fonte oficial e marca ciência já registrada como documento assinado', async () => {
    fetchAdminLiveDataSnapshotMock.mockResolvedValue({
      auditLogs: [],
      devices: [],
      employeeScheduleHistories: [],
      employees: [
        {
          id: 'employee-1',
          fullName: 'João Pereira',
          department: 'Produto',
          position: 'Analista de produto',
          isActive: true,
        },
      ],
      justificationAttachments: [],
      justifications: [],
      timeRecordPhotos: [],
      timeRecords: [],
      vacationRequests: [],
      workSchedules: [],
      employeeDocuments: [
        {
          id: 'document-1',
          employeeId: 'employee-1',
          category: 'policy',
          title: 'Política de home office',
          description: 'Termo atualizado para registro de leitura.',
          status: 'pending_signature',
          fileName: 'politica-home-office.pdf',
          fileUrl: 'https://example.com/politica-home-office.pdf',
          issuedAt: '2026-04-18T09:00:00.000Z',
          acknowledgedAt: null,
          expiresAt: '2027-04-18',
          createdAt: '2026-04-18T09:00:00.000Z',
          updatedAt: '2026-04-18T09:00:00.000Z',
        },
        {
          id: 'document-2',
          employeeId: 'employee-1',
          category: 'contract',
          title: 'Contrato consolidado',
          description: 'Documento já confirmado pelo colaborador.',
          status: 'available',
          fileName: 'contrato-consolidado.pdf',
          fileUrl: 'https://example.com/contrato-consolidado.pdf',
          issuedAt: '2026-04-18T10:00:00.000Z',
          acknowledgedAt: '2026-04-18T11:30:00.000Z',
          expiresAt: null,
          createdAt: '2026-04-18T10:00:00.000Z',
          updatedAt: '2026-04-18T11:30:00.000Z',
        },
      ],
      payrollStatements: [],
    });

    const result = await getDocumentsOverview();

    expect(result.summary.total).toBe(2);
    expect(result.summary.signed).toBe(1);
    expect(result.summary.pending).toBe(1);
    expect(result.documents[0]).toMatchObject({
      id: 'document-2',
      sourceType: 'employee_document',
      employeeName: 'João Pereira',
      status: 'assinado',
      isSignable: false,
    });
    expect(result.documents[1]).toMatchObject({
      id: 'document-1',
      sourceType: 'employee_document',
      status: 'pendente_assinatura',
    });
  });

  it('inclui holerites publicados como documentos oficiais do portal administrativo', async () => {
    fetchAdminLiveDataSnapshotMock.mockResolvedValue({
      auditLogs: [],
      devices: [],
      employeeScheduleHistories: [],
      employees: [
        {
          id: 'employee-1',
          fullName: 'João Pereira',
          department: 'Produto',
          position: 'Analista de produto',
          isActive: true,
        },
      ],
      justificationAttachments: [],
      justifications: [],
      timeRecordPhotos: [],
      timeRecords: [],
      vacationRequests: [],
      workSchedules: [],
      employeeDocuments: [],
      payrollStatements: [
        {
          id: 'payroll-1',
          employeeId: 'employee-1',
          referenceLabel: 'Março/2026',
          referenceYear: 2026,
          referenceMonth: 3,
          status: 'available',
          grossAmount: 8688.55,
          netAmount: 6492.87,
          fileName: 'holerite-2026-03-joao-pereira.pdf',
          fileUrl: 'https://example.com/holerite-2026-03-joao-pereira.pdf',
          issuedAt: '2026-04-05T09:00:00.000Z',
          createdAt: '2026-04-05T09:00:00.000Z',
          updatedAt: '2026-04-05T09:00:00.000Z',
        },
      ],
    });

    const result = await getDocumentsOverview();

    expect(result.summary.total).toBe(1);
    expect(result.documents[0]).toMatchObject({
      id: 'payroll-1',
      sourceType: 'payroll_statement',
      category: 'holerites',
      status: 'publicado',
      title: 'Holerite Março/2026',
      employeeName: 'João Pereira',
    });
  });
});
