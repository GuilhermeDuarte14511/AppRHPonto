import type { AuditLog, CreateAuditLogPayload } from '@rh-ponto/audit';

import type { AssistedReviewCase } from './time-adjustment-assisted-review';

export const assistedReviewAuditActions = {
  approved: 'time-record.assisted-review.approved',
  rejected: 'time-record.assisted-review.rejected',
  justificationRequested: 'time-record.assisted-review.justification-requested',
  escalated: 'time-record.assisted-review.escalated',
} as const;

export type AssistedReviewAuditAction =
  (typeof assistedReviewAuditActions)[keyof typeof assistedReviewAuditActions];

export const isAssistedReviewAuditAction = (value: string): value is AssistedReviewAuditAction =>
  Object.values(assistedReviewAuditActions).includes(value as AssistedReviewAuditAction);

export const getLatestAssistedReviewDecision = (auditLogs: AuditLog[], recordId: string) =>
  [...auditLogs]
    .filter(
      (auditLog) =>
        auditLog.entityName === 'TimeRecord' &&
        auditLog.entityId === recordId &&
        isAssistedReviewAuditAction(auditLog.action),
    )
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())[0] ?? null;

const actionDescriptionByType: Record<AssistedReviewAuditAction, string> = {
  [assistedReviewAuditActions.approved]: 'Aprovou a sugestao assistida para o ajuste de ponto.',
  [assistedReviewAuditActions.rejected]: 'Rejeitou a sugestao assistida e encerrou o caso no inbox.',
  [assistedReviewAuditActions.justificationRequested]:
    'Solicitou justificativa adicional antes de qualquer liberacao operacional.',
  [assistedReviewAuditActions.escalated]: 'Escalou o caso assistido para revisao adicional.',
};

export const buildAssistedReviewAuditPayload = ({
  action,
  caseItem,
  notes,
  reviewerUserId,
  reviewerName,
}: {
  action: AssistedReviewAuditAction;
  caseItem: AssistedReviewCase;
  notes: string;
  reviewerUserId: string | null;
  reviewerName: string | null;
}): CreateAuditLogPayload => ({
  userId: reviewerUserId,
  entityName: 'TimeRecord',
  entityId: caseItem.recordId,
  action,
  description: `${reviewerName ?? 'Administrador'} ${actionDescriptionByType[action]}`,
  oldData: {
    status: 'pending_review',
    exceptionType: caseItem.exceptionType,
    confidence: caseItem.confidence,
    routingTarget: caseItem.routingTarget,
    recommendedAction: caseItem.recommendedAction,
  },
  newData: {
    action,
    notes,
    exceptionType: caseItem.exceptionType,
    confidence: caseItem.confidence,
    routingTarget: caseItem.routingTarget,
    recommendedAction: caseItem.recommendedAction,
    closureImpact: caseItem.closureImpact,
  },
  deviceInfo: 'Admin Web · Operations Inbox',
});
