import type { AuditLog } from '../../domain/entities/audit-log';
import type { AuditLogRepository, CreateAuditLogPayload } from '../../domain/repositories/audit-log-repository';

let auditLogs: AuditLog[] = [
  {
    id: 'audit-1',
    userId: 'user-rh-mariana',
    entityName: 'TimeRecord',
    entityId: 'tr-10',
    action: 'time-record.adjusted',
    description: 'Mariana Costa aprovou o ajuste do ponto de entrada de Juliana Costa após validar a justificativa e o anexo.',
    oldData: {
      recordedAt: '2026-04-03T08:17:00.000Z',
      status: 'pending_review',
      notes: 'Registro original do kiosk.',
    },
    newData: {
      recordedAt: '2026-04-03T08:00:00.000Z',
      status: 'adjusted',
      notes: 'Ajuste aprovado pelo RH após conferência do documento.',
    },
    ipAddress: '177.20.10.23',
    deviceInfo: 'Chrome 135 · Windows 11 · Admin Web',
    createdAt: '2026-04-03T12:20:00.000Z',
  },
  {
    id: 'audit-2',
    userId: 'user-rh-mariana',
    entityName: 'Justification',
    entityId: 'just-2',
    action: 'justification.approved',
    description: 'Mariana Costa aprovou a justificativa de atraso de Juliana Costa e liberou o reflexo para a folha.',
    oldData: {
      status: 'pending',
      reviewedByUserId: null,
      reviewNotes: null,
    },
    newData: {
      status: 'approved',
      reviewedByUserId: 'user-rh-mariana',
      reviewNotes: 'Documento conferido e aceito.',
    },
    ipAddress: '177.20.10.23',
    deviceInfo: 'Chrome 135 · Windows 11 · Admin Web',
    createdAt: '2026-04-03T11:02:00.000Z',
  },
  {
    id: 'audit-3',
    userId: 'user-rh-caio',
    entityName: 'Vacation',
    entityId: 'vac-3',
    action: 'vacation.approved',
    description: 'Caio Almeida aprovou a solicitação de férias de Ricardo Souza para o período de 15 a 24 de abril.',
    oldData: {
      status: 'pending',
      approvedByUserId: null,
    },
    newData: {
      status: 'approved',
      approvedByUserId: 'user-rh-caio',
    },
    ipAddress: '177.20.10.45',
    deviceInfo: 'Edge 134 · Windows 11 · Admin Web',
    createdAt: '2026-04-03T10:12:00.000Z',
  },
  {
    id: 'audit-4',
    userId: 'user-rh-jessica',
    entityName: 'Document',
    entityId: 'att-3',
    action: 'document.attached',
    description: 'Jéssica Lima vinculou um atestado médico à justificativa de ausência de Felipe Rocha.',
    oldData: null,
    newData: {
      justificationId: 'just-4',
      fileName: 'atestado-medico-felipe.pdf',
      contentType: 'application/pdf',
    },
    ipAddress: '177.20.10.22',
    deviceInfo: 'Safari 17 · macOS · Admin Web',
    createdAt: '2026-04-03T09:48:00.000Z',
  },
  {
    id: 'audit-5',
    userId: 'user-rh-mariana',
    entityName: 'TimeRecord',
    entityId: 'tr-6',
    action: 'time-record.flagged',
    description: 'Registro de saída de Pedro Alves foi sinalizado para revisão automática por divergência de horário.',
    oldData: { status: 'valid' },
    newData: { status: 'pending_review' },
    ipAddress: '177.20.10.23',
    deviceInfo: 'Chrome 135 · Windows 11 · Admin Web',
    createdAt: '2026-04-03T09:10:00.000Z',
  },
  {
    id: 'audit-6',
    userId: 'user-rh-jessica',
    entityName: 'Justification',
    entityId: 'just-5',
    action: 'justification.rejected',
    description: 'Jéssica Lima reprovou a solicitação de ajuste de horário de Bruno Nunes por falta de evidência suficiente.',
    oldData: {
      status: 'pending',
      reviewNotes: null,
    },
    newData: {
      status: 'rejected',
      reviewNotes: 'Documento insuficiente para validar o ajuste.',
    },
    ipAddress: '177.20.10.24',
    deviceInfo: 'Chrome 135 · Windows 11 · Admin Web',
    createdAt: '2026-04-03T08:44:00.000Z',
  },
  {
    id: 'audit-7',
    userId: 'user-rh-caio',
    entityName: 'Employee',
    entityId: 'emp-4',
    action: 'employee.updated',
    description: 'Caio Almeida atualizou o departamento e o cargo de Fernanda Lima no cadastro principal.',
    oldData: {
      department: 'Operações',
      position: 'Analista Júnior',
    },
    newData: {
      department: 'Customer Success',
      position: 'Analista Pleno',
    },
    ipAddress: '177.20.10.51',
    deviceInfo: 'Edge 134 · Windows 11 · Admin Web',
    createdAt: '2026-04-02T17:05:00.000Z',
  },
  {
    id: 'audit-8',
    userId: 'user-rh-mariana',
    entityName: 'Settings',
    entityId: 'settings-geofence-main',
    action: 'settings.updated',
    description: 'Mariana Costa ajustou o raio da geofence da matriz para 180 metros.',
    oldData: {
      radiusMeters: 150,
    },
    newData: {
      radiusMeters: 180,
    },
    ipAddress: '177.20.10.23',
    deviceInfo: 'Chrome 135 · Windows 11 · Admin Web',
    createdAt: '2026-04-02T15:32:00.000Z',
  },
  {
    id: 'audit-9',
    userId: 'user-rh-caio',
    entityName: 'Schedule',
    entityId: 'sch-2',
    action: 'schedule.assigned',
    description: 'Caio Almeida vinculou a escala Comercial Flex ao colaborador Ricardo Souza.',
    oldData: {
      workScheduleId: 'ws-1',
    },
    newData: {
      workScheduleId: 'ws-3',
    },
    ipAddress: '177.20.10.45',
    deviceInfo: 'Edge 134 · Windows 11 · Admin Web',
    createdAt: '2026-04-02T14:11:00.000Z',
  },
  {
    id: 'audit-10',
    userId: 'user-rh-mariana',
    entityName: 'Payroll',
    entityId: 'pay-2026-03',
    action: 'payroll.closed',
    description: 'Mariana Costa encerrou a folha de março após validar pendências e auditoria final.',
    oldData: {
      status: 'in_review',
    },
    newData: {
      status: 'closed',
    },
    ipAddress: '177.20.10.23',
    deviceInfo: 'Chrome 135 · Windows 11 · Admin Web',
    createdAt: '2026-04-02T10:20:00.000Z',
  },
  {
    id: 'audit-11',
    userId: 'user-rh-jessica',
    entityName: 'Vacation',
    entityId: 'vac-5',
    action: 'vacation.rejected',
    description: 'Jéssica Lima reprovou férias de Bianca Prado por conflito de cobertura operacional.',
    oldData: {
      status: 'pending',
    },
    newData: {
      status: 'rejected',
      reviewNotes: 'Cobertura indisponível para o período solicitado.',
    },
    ipAddress: '177.20.10.22',
    deviceInfo: 'Safari 17 · macOS · Admin Web',
    createdAt: '2026-04-01T19:40:00.000Z',
  },
  {
    id: 'audit-12',
    userId: 'user-admin-1',
    entityName: 'Auth',
    entityId: 'session-120',
    action: 'auth.login',
    description: 'Administrador master acessou o painel administrativo com autenticação válida.',
    oldData: null,
    newData: {
      sessionStatus: 'active',
      role: 'admin',
    },
    ipAddress: '177.20.10.2',
    deviceInfo: 'Chrome 135 · Windows 11 · Admin Web',
    createdAt: '2026-04-01T08:05:00.000Z',
  },
];

export class MockAuditRepository implements AuditLogRepository {
  async list(): Promise<AuditLog[]> {
    return auditLogs;
  }

  async create(payload: CreateAuditLogPayload): Promise<AuditLog> {
    const auditLog: AuditLog = {
      id: `audit-${auditLogs.length + 1}`,
      userId: payload.userId ?? null,
      entityId: payload.entityId ?? null,
      description: payload.description ?? null,
      oldData: payload.oldData ?? null,
      newData: payload.newData ?? null,
      ipAddress: payload.ipAddress ?? null,
      deviceInfo: payload.deviceInfo ?? null,
      createdAt: new Date().toISOString(),
      ...payload,
    };

    auditLogs = [auditLog, ...auditLogs];

    return auditLog;
  }
}
