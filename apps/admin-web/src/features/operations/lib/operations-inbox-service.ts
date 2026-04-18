import { formatDateTime } from '@rh-ponto/core';

import { formatJustificationTypeLabel, formatTimeRecordTypeLabel } from '@/shared/lib/admin-formatters';

export type OperationsInboxCategory = 'time-record' | 'justification' | 'vacation' | 'onboarding' | 'device';
export type OperationsInboxPriority = 'high' | 'medium' | 'low';
export type OperationsInboxNotificationSeverity = 'info' | 'warning' | 'danger' | 'success';

export interface OperationsInboxNotification {
  referenceKey: string;
  category: string;
  title: string;
  description: string;
  href: string | null;
  entityName: string | null;
  entityId: string | null;
  severity: OperationsInboxNotificationSeverity;
  triggeredAt: string;
}

export interface OperationsInboxItem {
  id: string;
  category: OperationsInboxCategory;
  priority: OperationsInboxPriority;
  title: string;
  description: string;
  href: string;
  occurredAt: string;
  notification: OperationsInboxNotification;
}

export interface OperationsInboxGroup {
  category: OperationsInboxCategory;
  count: number;
}

export interface BuildOperationsInboxInput {
  pendingTimeRecords: Array<{
    id: string;
    employeeName: string;
    recordedAt: string;
    status: 'pending_review';
    recordType: string;
  }>;
  pendingJustifications: Array<{
    id: string;
    employeeName: string;
    createdAt: string;
    type: string;
  }>;
  pendingVacations: Array<{
    id: string;
    employeeName: string;
    requestedAt: string;
    startDate: string;
    endDate: string;
  }>;
  blockedOnboardingTasks: Array<{
    id: string;
    title: string;
    status: 'blocked' | 'pending' | 'in_progress' | 'completed';
    dueDate?: string | null;
    employeeName: string;
    journeyId: string;
    updatedAt: string;
  }>;
  inactiveDevices: Array<{
    id: string;
    name: string;
    locationName?: string | null;
    lastSyncAt?: string | null;
  }>;
}

const priorityWeight: Record<OperationsInboxPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

const compareInboxItems = (left: OperationsInboxItem, right: OperationsInboxItem) =>
  priorityWeight[right.priority] - priorityWeight[left.priority] || right.occurredAt.localeCompare(left.occurredAt);

const createTimeRecordItem = (
  record: BuildOperationsInboxInput['pendingTimeRecords'][number],
): OperationsInboxItem => ({
  id: record.id,
  category: 'time-record',
  priority: 'high',
  title: `Marcacao em revisao: ${record.employeeName}`,
  description: 'Exige validacao antes do fechamento.',
  href: '/time-records',
  occurredAt: record.recordedAt,
  notification: {
    referenceKey: `time-record:${record.id}:review`,
    category: 'time_record',
    title: 'Marcacao em revisao',
    description: `${record.employeeName} registrou ${formatTimeRecordTypeLabel(record.recordType as never).toLowerCase()} em ${formatDateTime(record.recordedAt)}.`,
    href: '/time-records',
    entityName: 'time_record',
    entityId: record.id,
    severity: 'warning',
    triggeredAt: record.recordedAt,
  },
});

const createJustificationItem = (
  justification: BuildOperationsInboxInput['pendingJustifications'][number],
): OperationsInboxItem => ({
  id: justification.id,
  category: 'justification',
  priority: 'medium',
  title: `Justificativa pendente: ${justification.employeeName}`,
  description: `Solicitacao do tipo ${justification.type} aguardando analise.`,
  href: '/justifications',
  occurredAt: justification.createdAt,
  notification: {
    referenceKey: `justification:${justification.id}:pending`,
    category: 'justification',
    title: 'Justificativa aguardando analise',
    description: `${justification.employeeName} abriu uma ${formatJustificationTypeLabel(justification.type as never).toLowerCase()}.`,
    href: '/justifications',
    entityName: 'justification',
    entityId: justification.id,
    severity: 'info',
    triggeredAt: justification.createdAt,
  },
});

const createVacationItem = (
  vacation: BuildOperationsInboxInput['pendingVacations'][number],
): OperationsInboxItem => ({
  id: vacation.id,
  category: 'vacation',
  priority: 'medium',
  title: `Ferias pendentes: ${vacation.employeeName}`,
  description: 'Pedido aguardando aprovacao do RH.',
  href: '/vacations',
  occurredAt: vacation.requestedAt,
  notification: {
    referenceKey: `vacation:${vacation.id}:pending`,
    category: 'vacation',
    title: 'Pedido de ferias aguardando aprovacao',
    description: `${vacation.employeeName} solicitou ferias de ${vacation.startDate} a ${vacation.endDate}.`,
    href: `/vacations/${vacation.id}`,
    entityName: 'vacation_request',
    entityId: vacation.id,
    severity: 'warning',
    triggeredAt: `${vacation.startDate}T09:00:00.000Z`,
  },
});

const createOnboardingItem = (
  task: BuildOperationsInboxInput['blockedOnboardingTasks'][number],
): OperationsInboxItem => {
  const isBlocked = task.status === 'blocked';
  const triggeredAt = task.dueDate ? `${task.dueDate}T09:00:00.000Z` : task.updatedAt;

  return {
    id: task.id,
    category: 'onboarding',
    priority: 'high',
    title: isBlocked ? 'Etapa de onboarding bloqueada' : 'Etapa de onboarding vencida',
    description: `A etapa "${task.title}" exige intervencao operacional.`,
    href: `/onboarding/${task.journeyId}`,
    occurredAt: triggeredAt,
    notification: {
      referenceKey: `onboarding-task:${task.id}:${isBlocked ? 'blocked' : 'overdue'}:${task.dueDate ?? 'no-date'}`,
      category: 'onboarding',
      title: isBlocked ? 'Etapa de onboarding bloqueada' : 'Etapa de onboarding vencida',
      description: `${task.employeeName} exige atencao em "${task.title}".`,
      href: `/onboarding/${task.journeyId}`,
      entityName: 'onboarding_task',
      entityId: task.id,
      severity: isBlocked ? 'danger' : 'warning',
      triggeredAt,
    },
  };
};

const createDeviceItem = (device: BuildOperationsInboxInput['inactiveDevices'][number]): OperationsInboxItem => ({
  id: device.id,
  category: 'device',
  priority: 'low',
  title: `Dispositivo inativo: ${device.name}`,
  description: device.locationName ? `Ultimo contexto: ${device.locationName}.` : 'Dispositivo sem local associado.',
  href: '/devices',
  occurredAt: device.lastSyncAt ?? new Date(0).toISOString(),
  notification: {
    referenceKey: `device:${device.id}:inactive`,
    category: 'device',
    title: 'Dispositivo com atencao operacional',
    description: `${device.name}${device.locationName ? ` em ${device.locationName}` : ''} esta inativo ou precisa de verificacao de sincronizacao.`,
    href: '/settings',
    entityName: 'device',
    entityId: device.id,
    severity: 'danger',
    triggeredAt: device.lastSyncAt ?? new Date(0).toISOString(),
  },
});

const categoryOrder: OperationsInboxCategory[] = ['time-record', 'justification', 'vacation', 'onboarding', 'device'];

export const buildOperationsInbox = (input: BuildOperationsInboxInput) => {
  const items: OperationsInboxItem[] = [
    ...input.pendingTimeRecords.map(createTimeRecordItem),
    ...input.pendingJustifications.map(createJustificationItem),
    ...input.pendingVacations.map(createVacationItem),
    ...input.blockedOnboardingTasks.map(createOnboardingItem),
    ...input.inactiveDevices.map(createDeviceItem),
  ];

  const orderedItems = [...items].sort(compareInboxItems);
  const groups = categoryOrder
    .map((category) => ({
      category,
      count: orderedItems.filter((item) => item.category === category).length,
    }))
    .filter((group) => group.count > 0);

  return {
    summary: { total: orderedItems.length },
    items: orderedItems,
    groups,
  };
};
