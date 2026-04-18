export type OperationsInboxCategory = 'time-record' | 'justification' | 'vacation' | 'onboarding' | 'device';
export type OperationsInboxPriority = 'high' | 'medium' | 'low';

export interface OperationsInboxItem {
  id: string;
  category: OperationsInboxCategory;
  priority: OperationsInboxPriority;
  title: string;
  description: string;
  href: string;
  occurredAt: string;
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
  }>;
  blockedOnboardingTasks: Array<{
    id: string;
    title: string;
    status: 'blocked' | 'pending' | 'in_progress' | 'completed';
    dueDate?: string | null;
    employeeName: string;
    journeyId: string;
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
});

const createOnboardingItem = (
  task: BuildOperationsInboxInput['blockedOnboardingTasks'][number],
): OperationsInboxItem => ({
  id: task.id,
  category: 'onboarding',
  priority: 'high',
  title: `Onboarding com bloqueio: ${task.employeeName}`,
  description: `A etapa "${task.title}" exige intervencao operacional.`,
  href: `/onboarding/${task.journeyId}`,
  occurredAt: task.dueDate ? `${task.dueDate}T09:00:00.000Z` : new Date(0).toISOString(),
});

const createDeviceItem = (device: BuildOperationsInboxInput['inactiveDevices'][number]): OperationsInboxItem => ({
  id: device.id,
  category: 'device',
  priority: 'low',
  title: `Dispositivo inativo: ${device.name}`,
  description: device.locationName ? `Ultimo contexto: ${device.locationName}.` : 'Dispositivo sem local associado.',
  href: '/devices',
  occurredAt: device.lastSyncAt ?? new Date(0).toISOString(),
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
