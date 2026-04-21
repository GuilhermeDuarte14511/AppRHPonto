import { documentStatusLabels } from '../../documents/lib/documents-mobile';
import {
  buildJustificationOperationalSummary,
  justificationStatusLabels,
  justificationTypeLabels,
} from '../../justifications/lib/justification-mobile';
import { formatVacationWindow, vacationStatusLabels } from '../../vacations/lib/vacations-mobile';

import { dedupeActionCenterItems, type ActionCenterItem } from './action-center-groups';

interface NotificationInput {
  id: string;
  title: string;
  description: string;
  href: string | null;
  status: 'unread' | 'read';
  triggeredAt: string;
  entityName: string | null;
  entityId: string | null;
}

interface DocumentInput {
  id: string;
  title: string;
  description: string | null;
  status: string;
  issuedAt: string;
  acknowledgedAt: string | null;
}

interface PayrollInput {
  id: string;
  referenceLabel: string;
  status: string;
  issuedAt: string;
}

interface VacationInput {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  requestedAt: string;
  reviewNotes: string | null;
  managerApprovalTimestamp: string | null;
  hrApprovalTimestamp: string | null;
}

interface JustificationInput {
  id: string;
  type: keyof typeof justificationTypeLabels;
  status: keyof typeof justificationStatusLabels;
  createdAt: string | Date;
  updatedAt: string | Date;
  reviewNotes: string | null;
}

export interface BuildActionCenterItemsInput {
  notifications?: NotificationInput[];
  documents?: DocumentInput[];
  payrollStatements?: PayrollInput[];
  vacations?: VacationInput[];
  justifications?: JustificationInput[];
}

const mapNotificationDedupeKey = (item: {
  id: string;
  entityName: string | null;
  entityId: string | null;
}) => {
  if (!item.entityId) {
    return `notification:${item.id}`;
  }

  if (item.entityName === 'justification') {
    return `justification:${item.entityId}`;
  }

  if (item.entityName === 'vacation_request') {
    return `vacation:${item.entityId}`;
  }

  if (item.entityName === 'document' || item.entityName === 'employee_document') {
    return `document:${item.entityId}`;
  }

  if (item.entityName === 'payroll_statement') {
    return `payroll:${item.entityId}`;
  }

  return `notification:${item.id}`;
};

const createNotificationItems = (items: NotificationInput[] = []): ActionCenterItem[] =>
  items
    .filter((item) => item.status === 'unread')
    .map((item) => ({
      id: `notification:${item.id}`,
      source: 'notification',
      statusBucket: 'requires-action',
      title: item.title,
      description: item.description,
      href: item.href ?? '/notifications',
      occurredAt: item.triggeredAt,
      statusLabel: 'Não lida',
      dedupeKey: mapNotificationDedupeKey(item),
      notificationId: item.id,
    }));

const createDocumentItems = (items: DocumentInput[] = []): ActionCenterItem[] =>
  items.flatMap<ActionCenterItem>((item) => {
    if (item.status === 'pending_signature') {
      return [{
        id: `document:${item.id}`,
        source: 'document',
        statusBucket: 'requires-action',
        title: item.title,
        description: item.description ?? 'Documento publicado e aguardando sua leitura ou ciência.',
        href: `/documents/${item.id}`,
        occurredAt: item.issuedAt,
        statusLabel: documentStatusLabels[item.status] ?? 'Aguardando ciência',
        dedupeKey: `document:${item.id}`,
      }];
    }

    if (item.acknowledgedAt) {
      return [{
        id: `document:${item.id}`,
        source: 'document',
        statusBucket: 'recent',
        title: item.title,
        description: 'Documento já registrado no seu arquivo digital.',
        href: `/documents/${item.id}`,
        occurredAt: item.acknowledgedAt,
        statusLabel: 'Ciência concluída',
        dedupeKey: `document:${item.id}`,
      }];
    }

    return [];
  });

const createPayrollItems = (items: PayrollInput[] = []): ActionCenterItem[] =>
  items
    .filter((item) => item.status === 'available')
    .map((item) => ({
      id: `payroll:${item.id}`,
      source: 'payroll',
      statusBucket: 'recent' as const,
      title: `Holerite disponível: ${item.referenceLabel}`,
      description: 'A competência foi publicada e já pode ser consultada no app.',
      href: `/payroll/${item.id}`,
      occurredAt: item.issuedAt,
      statusLabel: 'Holerite publicado',
      dedupeKey: `payroll:${item.id}`,
    }));

const createVacationItems = (items: VacationInput[] = []): ActionCenterItem[] =>
  items.flatMap<ActionCenterItem>((item) => {
    if (item.status === 'pending') {
      return [{
        id: `vacation:${item.id}`,
        source: 'vacation',
        statusBucket: 'in-review',
        title: `Pedido de férias: ${formatVacationWindow(item)}`,
        description: 'Sua solicitação segue em análise do gestor e do RH.',
        href: `/vacations/${item.id}`,
        occurredAt: item.requestedAt,
        statusLabel: vacationStatusLabels[item.status] ?? 'Em análise',
        dedupeKey: `vacation:${item.id}`,
      }];
    }

    if (item.status === 'rejected') {
      return [{
        id: `vacation:${item.id}`,
        source: 'vacation',
        statusBucket: 'requires-action',
        title: `Pedido recusado: ${formatVacationWindow(item)}`,
        description:
          item.reviewNotes?.trim() ||
          'Confira os apontamentos do RH e ajuste o período se precisar reenviar.',
        href: `/vacations/${item.id}`,
        occurredAt: item.hrApprovalTimestamp ?? item.managerApprovalTimestamp ?? item.requestedAt,
        statusLabel: vacationStatusLabels[item.status] ?? 'Reprovada',
        dedupeKey: `vacation:${item.id}`,
      }];
    }

    if (item.status === 'approved' || item.status === 'cancelled') {
      return [{
        id: `vacation:${item.id}`,
        source: 'vacation',
        statusBucket: 'recent',
        title: `Férias ${item.status === 'approved' ? 'confirmadas' : 'canceladas'}: ${formatVacationWindow(item)}`,
        description:
          item.reviewNotes?.trim() ||
          (item.status === 'approved'
            ? 'O período já foi confirmado e está registrado para acompanhamento.'
            : 'O pedido foi encerrado sem nova ação pendente neste momento.'),
        href: `/vacations/${item.id}`,
        occurredAt: item.hrApprovalTimestamp ?? item.managerApprovalTimestamp ?? item.requestedAt,
        statusLabel: vacationStatusLabels[item.status] ?? 'Atualizada',
        dedupeKey: `vacation:${item.id}`,
      }];
    }

    return [];
  });

const createJustificationItems = (items: JustificationInput[] = []): ActionCenterItem[] =>
  items.flatMap<ActionCenterItem>((item) => {
    const operational = buildJustificationOperationalSummary({
      id: item.id,
      status: item.status,
      type: item.type,
      reviewNotes: item.reviewNotes,
      reviewedAt: null,
      requestedRecordType: null,
      requestedRecordedAt: null,
      timeRecordId: null,
    });

    if (item.status === 'pending') {
      return [{
        id: `justification:${item.id}`,
        source: 'justification',
        statusBucket: 'in-review',
        title: justificationTypeLabels[item.type],
        description: operational.reviewFocus,
        href: `/justifications/${item.id}`,
        occurredAt: new Date(item.createdAt).toISOString(),
        statusLabel: justificationStatusLabels[item.status],
        dedupeKey: `justification:${item.id}`,
      }];
    }

    if (item.status === 'rejected') {
      return [{
        id: `justification:${item.id}`,
        source: 'justification',
        statusBucket: 'requires-action',
        title: `${justificationTypeLabels[item.type]} recusada`,
        description:
          item.reviewNotes?.trim() ||
          operational.statusAction,
        href: `/justifications/${item.id}`,
        occurredAt: new Date(item.updatedAt).toISOString(),
        statusLabel: justificationStatusLabels[item.status],
        dedupeKey: `justification:${item.id}`,
      }];
    }

    if (item.status === 'approved') {
      return [{
        id: `justification:${item.id}`,
        source: 'justification',
        statusBucket: 'recent',
        title: `${justificationTypeLabels[item.type]} aprovada`,
        description: operational.statusDescription,
        href: `/justifications/${item.id}`,
        occurredAt: new Date(item.updatedAt).toISOString(),
        statusLabel: justificationStatusLabels[item.status],
        dedupeKey: `justification:${item.id}`,
      }];
    }

    return [];
  });

export const buildActionCenterItems = (input: BuildActionCenterItemsInput): ActionCenterItem[] =>
  dedupeActionCenterItems([
    ...createNotificationItems(input.notifications),
    ...createDocumentItems(input.documents),
    ...createPayrollItems(input.payrollStatements),
    ...createVacationItems(input.vacations),
    ...createJustificationItems(input.justifications),
  ]);
