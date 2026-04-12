import { AppError } from '@rh-ponto/core';

import type { Justification, JustificationAttachment } from '../../domain/entities/justification';
import type {
  AddJustificationAttachmentPayload,
  ApproveJustificationPayload,
  CreateJustificationPayload,
  JustificationFilters,
  JustificationRepository,
  RejectJustificationPayload,
  ReviewJustificationPayload,
} from '../../domain/repositories/justification-repository';

const justificationsSeed: Justification[] = [
  {
    id: 'just-1',
    employeeId: 'emp-2',
    timeRecordId: 'tr-2',
    type: 'late',
    reason: 'Transito intenso devido a acidente na marginal.',
    status: 'pending',
    requestedRecordType: 'entry',
    requestedRecordedAt: '2026-03-31T12:00:00.000Z',
    reviewedByUserId: null,
    reviewedAt: null,
    reviewNotes: null,
    createdAt: '2026-03-31T14:00:00.000Z',
    updatedAt: '2026-03-31T14:00:00.000Z',
  },
  {
    id: 'just-2',
    employeeId: 'emp-1',
    timeRecordId: 'tr-3',
    type: 'adjustment_request',
    reason: 'Saída registrada com horário incorreto.',
    status: 'approved',
    requestedRecordType: 'exit',
    requestedRecordedAt: '2026-03-31T21:05:00.000Z',
    reviewedByUserId: 'user-admin-1',
    reviewedAt: '2026-03-31T21:20:00.000Z',
    reviewNotes: 'Ajuste coerente com o turno.',
    createdAt: '2026-03-31T20:59:00.000Z',
    updatedAt: '2026-03-31T21:20:00.000Z',
  },
  {
    id: 'just-3',
    employeeId: 'emp-5',
    timeRecordId: 'tr-5',
    type: 'missing_record',
    reason: 'Declaração de reuniao externa enviada para incluir entrada que não foi registrada no app.',
    status: 'pending',
    requestedRecordType: 'entry',
    requestedRecordedAt: '2026-04-02T12:00:00.000Z',
    reviewedByUserId: null,
    reviewedAt: null,
    reviewNotes: null,
    createdAt: '2026-04-02T12:15:00.000Z',
    updatedAt: '2026-04-02T12:15:00.000Z',
  },
  {
    id: 'just-4',
    employeeId: 'emp-6',
    timeRecordId: null,
    type: 'absence',
    reason: 'A colaboradora anexou atestado médico referente a ausência do dia 02/04.',
    status: 'approved',
    requestedRecordType: null,
    requestedRecordedAt: null,
    reviewedByUserId: 'user-admin-2',
    reviewedAt: '2026-04-02T18:10:00.000Z',
    reviewNotes: 'Atestado conferido e aprovado pelo RH.',
    createdAt: '2026-04-02T15:40:00.000Z',
    updatedAt: '2026-04-02T18:10:00.000Z',
  },
  {
    id: 'just-5',
    employeeId: 'emp-7',
    timeRecordId: 'tr-10',
    type: 'late',
    reason: 'Atraso por acidente no trajeto, sem documento comprobatório suficiente.',
    status: 'rejected',
    requestedRecordType: 'entry',
    requestedRecordedAt: '2026-04-03T12:18:00.000Z',
    reviewedByUserId: 'user-admin-1',
    reviewedAt: '2026-04-03T13:00:00.000Z',
    reviewNotes: 'Justificativa rejeitada por falta de evidencias anexas.',
    createdAt: '2026-04-03T12:30:00.000Z',
    updatedAt: '2026-04-03T13:00:00.000Z',
  },
  {
    id: 'just-6',
    employeeId: 'emp-8',
    timeRecordId: 'tr-6',
    type: 'adjustment_request',
    reason: 'Solicitação para consolidar ajuste de entrada após falha no kiosk da recepcao.',
    status: 'pending',
    requestedRecordType: 'entry',
    requestedRecordedAt: '2026-04-03T11:05:00.000Z',
    reviewedByUserId: null,
    reviewedAt: null,
    reviewNotes: null,
    createdAt: '2026-04-03T11:45:00.000Z',
    updatedAt: '2026-04-03T11:45:00.000Z',
  },
];

const attachmentsSeed: JustificationAttachment[] = [
  {
    id: 'att-1',
    justificationId: 'just-1',
    fileName: 'comprovante-transito.pdf',
    fileUrl: '#',
    contentType: 'application/pdf',
    fileSizeBytes: 302123,
    uploadedByUserId: 'user-employee-2',
    createdAt: '2026-03-31T14:00:00.000Z',
  },
  {
    id: 'att-2',
    justificationId: 'just-3',
    fileName: 'declaração-reuniao-externa.pdf',
    fileUrl: '#',
    contentType: 'application/pdf',
    fileSizeBytes: 214550,
    uploadedByUserId: 'user-admin-1',
    createdAt: '2026-04-02T12:15:00.000Z',
  },
  {
    id: 'att-3',
    justificationId: 'just-4',
    fileName: 'atestado-médico-juliana.pdf',
    fileUrl: '#',
    contentType: 'application/pdf',
    fileSizeBytes: 412774,
    uploadedByUserId: 'user-admin-2',
    createdAt: '2026-04-02T15:40:00.000Z',
  },
  {
    id: 'att-4',
    justificationId: 'just-6',
    fileName: 'foto-kiosk-indisponível.jpg',
    fileUrl: '#',
    contentType: 'image/jpeg',
    fileSizeBytes: 185200,
    uploadedByUserId: 'user-admin-1',
    createdAt: '2026-04-03T11:45:00.000Z',
  },
];

let justifications = [...justificationsSeed];
let attachments = [...attachmentsSeed];

export class MockJustificationsRepository implements JustificationRepository {
  async list(filters?: JustificationFilters): Promise<Justification[]> {
    return justifications.filter((justification) => {
      const matchesEmployee = filters?.employeeId ? justification.employeeId === filters.employeeId : true;
      const matchesStatus = filters?.status ? justification.status === filters.status : true;
      const matchesType = filters?.type ? justification.type === filters.type : true;

      return matchesEmployee && matchesStatus && matchesType;
    });
  }

  async listByEmployee(employeeId: string): Promise<Justification[]> {
    return justifications.filter((justification) => justification.employeeId === employeeId);
  }

  async getById(id: string): Promise<Justification | null> {
    return justifications.find((justification) => justification.id === id) ?? null;
  }

  async listAttachmentsByJustification(justificationId: string): Promise<JustificationAttachment[]> {
    return attachments.filter((attachment) => attachment.justificationId === justificationId);
  }

  async create(payload: CreateJustificationPayload): Promise<Justification> {
    const timestamp = new Date().toISOString();
    const justification: Justification = {
      id: `just-${justifications.length + 1}`,
      timeRecordId: payload.timeRecordId ?? null,
      requestedRecordType: payload.requestedRecordType ?? null,
      requestedRecordedAt: payload.requestedRecordedAt ?? null,
      reviewedByUserId: null,
      reviewedAt: null,
      reviewNotes: null,
      status: 'pending',
      createdAt: timestamp,
      updatedAt: timestamp,
      ...payload,
    };

    justifications = [justification, ...justifications];

    return justification;
  }

  async approve(payload: ApproveJustificationPayload): Promise<Justification> {
    return this.review({
      ...payload,
      reviewNotes: payload.reviewNotes ?? 'Justificativa aprovada.',
      status: 'approved',
    });
  }

  async reject(payload: RejectJustificationPayload): Promise<Justification> {
    return this.review({
      ...payload,
      reviewNotes: payload.reviewNotes ?? 'Justificativa rejeitada.',
      status: 'rejected',
    });
  }

  async addAttachment(payload: AddJustificationAttachmentPayload): Promise<JustificationAttachment> {
    const justification = await this.getById(payload.justificationId);

    if (!justification) {
      throw new AppError('JUSTIFICATION_NOT_FOUND', 'Justificativa não encontrada para anexar arquivo.');
    }

    const attachment: JustificationAttachment = {
      id: `att-${attachments.length + 1}`,
      contentType: payload.contentType ?? null,
      fileSizeBytes: payload.fileSizeBytes ?? null,
      uploadedByUserId: payload.uploadedByUserId ?? null,
      createdAt: new Date().toISOString(),
      ...payload,
    };

    attachments = [attachment, ...attachments];

    return attachment;
  }

  private async review(payload: ReviewJustificationPayload): Promise<Justification> {
    const existingJustification = justifications.find((justification) => justification.id === payload.justificationId);

    if (!existingJustification) {
      throw new AppError('JUSTIFICATION_NOT_FOUND', 'Justificativa não encontrada.');
    }

    const reviewedJustification: Justification = {
      ...existingJustification,
      status: payload.status,
      reviewNotes: payload.reviewNotes,
      reviewedByUserId: payload.reviewedByUserId,
      reviewedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    justifications = justifications.map((item) => (item.id === reviewedJustification.id ? reviewedJustification : item));

    return reviewedJustification;
  }
}
