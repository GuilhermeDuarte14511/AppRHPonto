import { formatDateTime } from '@rh-ponto/core';

import { executeAdminGraphql } from './admin-server-data-connect';
import type { AdminNotificationFeed, AdminNotificationItem, AdminNotificationSeverity } from './notification-center-contracts';
import { formatJustificationTypeLabel, formatTimeRecordTypeLabel } from './admin-formatters';

interface NotificationsQueryData {
  adminSettings: {
    id: string;
    notifyOvertimeSummary: boolean;
    notifyPendingVacations: boolean;
    notifyDeviceSync: boolean;
    notifyAuditSummary: boolean;
  } | null;
  adminNotifications: Array<{
    id: string;
    referenceKey: string;
    category: string;
    title: string;
    description: string;
    href?: string | null;
    entityName?: string | null;
    entityId?: string | null;
    severity: string;
    status: string;
    triggeredAt: string;
    readAt?: string | null;
  }>;
  vacationRequests: Array<{
    id: string;
    startDate: string;
    endDate: string;
    employee: { fullName: string };
  }>;
  justifications: Array<{
    id: string;
    type: string;
    createdAt: string;
    employee: { fullName: string };
  }>;
  timeRecords: Array<{
    id: string;
    recordType: string;
    recordedAt: string;
    employee: { fullName: string };
  }>;
  devices: Array<{
    id: string;
    name: string;
    locationName?: string | null;
    lastSyncAt?: string | null;
  }>;
  onboardingTasks: Array<{
    id: string;
    title: string;
    status: string;
    dueDate?: string | null;
    journey: {
      id: string;
      employee: { fullName: string };
    };
  }>;
  auditLogs: Array<{
    id: string;
    action: string;
    description?: string | null;
    createdAt: string;
  }>;
}

interface NotificationMutationData {
  adminNotification_insert?: { id: string } | null;
  adminNotification_update?: { id: string } | null;
}

interface DerivedNotificationDefinition {
  referenceKey: string;
  category: string;
  title: string;
  description: string;
  href: string | null;
  entityName: string | null;
  entityId: string | null;
  severity: AdminNotificationSeverity;
  triggeredAt: string;
}

const DEFAULT_SETTINGS_KEY = 'default';

const notificationsQuery = `
  query GetAdminNotifications($userId: UUID!, $key: String!) {
    adminSettings(first: { where: { key: { eq: $key } } }) {
      id
      notifyOvertimeSummary
      notifyPendingVacations
      notifyDeviceSync
      notifyAuditSummary
    }
    adminNotifications(
      where: { recipientUserId: { eq: $userId } }
      orderBy: [{ triggeredAt: DESC }]
      limit: 50
    ) {
      id
      referenceKey
      category
      title
      description
      href
      entityName
      entityId
      severity
      status
      triggeredAt
      readAt
    }
    vacationRequests(where: { status: { eq: "pending" } }, orderBy: [{ requestedAt: DESC }], limit: 8) {
      id
      startDate
      endDate
      employee {
        fullName
      }
    }
    justifications(where: { status: { eq: "pending" } }, orderBy: [{ createdAt: DESC }], limit: 8) {
      id
      type
      createdAt
      employee {
        fullName
      }
    }
    timeRecords(where: { status: { eq: "pending_review" } }, orderBy: [{ recordedAt: DESC }], limit: 8) {
      id
      recordType
      recordedAt
      employee {
        fullName
      }
    }
    devices(where: { isActive: { eq: false } }, orderBy: [{ updatedAt: DESC }], limit: 8) {
      id
      name
      locationName
      lastSyncAt
    }
    onboardingTasks(
      where: { status: { in: ["blocked", "pending", "in_progress"] } }
      orderBy: [{ updatedAt: DESC }]
      limit: 8
    ) {
      id
      title
      status
      dueDate
      journey {
        id
        employee {
          fullName
        }
      }
    }
    auditLogs(orderBy: [{ createdAt: DESC }], limit: 8) {
      id
      action
      description
      createdAt
    }
  }
`;

const insertNotificationMutation = `
  mutation InsertAdminNotification(
    $userId: UUID!
    $referenceKey: String!
    $category: String!
    $title: String!
    $description: String!
    $href: String
    $entityName: String
    $entityId: String
    $severity: String!
    $triggeredAt: Timestamp!
  ) {
    adminNotification_insert(
      data: {
        recipientUser: { id: $userId }
        referenceKey: $referenceKey
        category: $category
        title: $title
        description: $description
        href: $href
        entityName: $entityName
        entityId: $entityId
        severity: $severity
        status: "unread"
        triggeredAt: $triggeredAt
        createdAt_expr: "request.time"
        updatedAt_expr: "request.time"
      }
    ) {
      id
    }
  }
`;

const markNotificationAsReadMutation = `
  mutation MarkAdminNotificationAsRead($id: UUID!) {
    adminNotification_update(
      id: $id
      data: {
        status: "read"
        readAt_expr: "request.time"
        updatedAt_expr: "request.time"
      }
    ) {
      id
    }
  }
`;

const mapSeverity = (value: string): AdminNotificationSeverity => {
  if (value === 'warning' || value === 'danger' || value === 'success') {
    return value;
  }

  return 'info';
};

const toItem = (item: NotificationsQueryData['adminNotifications'][number]): AdminNotificationItem => ({
  id: item.id,
  category: item.category,
  title: item.title,
  description: item.description,
  href: item.href ?? null,
  entityName: item.entityName ?? null,
  entityId: item.entityId ?? null,
  severity: mapSeverity(item.severity),
  status: item.status === 'read' ? 'read' : 'unread',
  triggeredAt: item.triggeredAt,
  readAt: item.readAt ?? null,
});

const buildDerivedNotifications = (data: NotificationsQueryData): DerivedNotificationDefinition[] => {
  const settings = data.adminSettings;
  const items: DerivedNotificationDefinition[] = [];

  if (settings?.notifyPendingVacations) {
    for (const vacation of data.vacationRequests) {
      items.push({
        referenceKey: `vacation:${vacation.id}:pending`,
        category: 'vacation',
        title: 'Pedido de férias aguardando aprovação',
        description: `${vacation.employee.fullName} solicitou férias de ${vacation.startDate} a ${vacation.endDate}.`,
        href: `/vacations/${vacation.id}`,
        entityName: 'vacation_request',
        entityId: vacation.id,
        severity: 'warning',
        triggeredAt: `${vacation.startDate}T09:00:00.000Z`,
      });
    }

    for (const justification of data.justifications) {
      items.push({
        referenceKey: `justification:${justification.id}:pending`,
        category: 'justification',
        title: 'Justificativa aguardando análise',
        description: `${justification.employee.fullName} abriu uma ${formatJustificationTypeLabel(justification.type as never).toLowerCase()}.`,
        href: '/justifications',
        entityName: 'justification',
        entityId: justification.id,
        severity: 'info',
        triggeredAt: justification.createdAt,
      });
    }
  }

  if (settings?.notifyOvertimeSummary) {
    for (const timeRecord of data.timeRecords) {
      items.push({
        referenceKey: `time-record:${timeRecord.id}:review`,
        category: 'time_record',
        title: 'Marcação em revisão',
        description: `${timeRecord.employee.fullName} registrou ${formatTimeRecordTypeLabel(timeRecord.recordType as never).toLowerCase()} em ${formatDateTime(timeRecord.recordedAt)}.`,
        href: '/time-records',
        entityName: 'time_record',
        entityId: timeRecord.id,
        severity: 'warning',
        triggeredAt: timeRecord.recordedAt,
      });
    }
  }

  if (settings?.notifyDeviceSync) {
    for (const device of data.devices) {
      items.push({
        referenceKey: `device:${device.id}:inactive`,
        category: 'device',
        title: 'Dispositivo com atenção operacional',
        description: `${device.name}${device.locationName ? ` em ${device.locationName}` : ''} está inativo ou precisa de verificação de sincronização.`,
        href: '/settings',
        entityName: 'device',
        entityId: device.id,
        severity: 'danger',
        triggeredAt: device.lastSyncAt ?? new Date().toISOString(),
      });
    }
  }

  if (settings?.notifyAuditSummary) {
    for (const audit of data.auditLogs) {
      items.push({
        referenceKey: `audit:${audit.id}`,
        category: 'audit',
        title: 'Alteração crítica registrada',
        description: audit.description ?? `Evento ${audit.action} persistido na trilha de auditoria.`,
        href: `/audit/${audit.id}`,
        entityName: 'audit',
        entityId: audit.id,
        severity: 'info',
        triggeredAt: audit.createdAt,
      });
    }
  }

  for (const task of data.onboardingTasks) {
    const isOverdue =
      task.dueDate != null &&
      task.status !== 'completed' &&
      new Date(`${task.dueDate}T23:59:59.999Z`).getTime() < Date.now();

    if (task.status === 'blocked' || isOverdue) {
      items.push({
        referenceKey: `onboarding-task:${task.id}:${task.status}:${task.dueDate ?? 'no-date'}`,
        category: 'onboarding',
        title: task.status === 'blocked' ? 'Etapa de onboarding bloqueada' : 'Etapa de onboarding vencida',
        description: `${task.journey.employee.fullName} exige atenção em "${task.title}".`,
        href: `/onboarding/${task.journey.id}`,
        entityName: 'onboarding_task',
        entityId: task.id,
        severity: task.status === 'blocked' ? 'danger' : 'warning',
        triggeredAt: task.dueDate ? `${task.dueDate}T09:00:00.000Z` : new Date().toISOString(),
      });
    }
  }

  return items;
};

const syncNotifications = async (data: NotificationsQueryData, userId: string) => {
  const existingReferenceKeys = new Set(data.adminNotifications.map((item) => item.referenceKey));
  const derivedNotifications = buildDerivedNotifications(data).filter((item) => !existingReferenceKeys.has(item.referenceKey));

  await Promise.all(
    derivedNotifications.map((item) =>
      executeAdminGraphql<NotificationMutationData>(insertNotificationMutation, {
        userId,
        referenceKey: item.referenceKey,
        category: item.category,
        title: item.title,
        description: item.description,
        href: item.href,
        entityName: item.entityName,
        entityId: item.entityId,
        severity: item.severity,
        triggeredAt: item.triggeredAt,
      }),
    ),
  );
};

export const listAdminNotifications = async (userId: string): Promise<AdminNotificationFeed> => {
  const initialData = await executeAdminGraphql<NotificationsQueryData>(notificationsQuery, {
    userId,
    key: DEFAULT_SETTINGS_KEY,
  });

  await syncNotifications(initialData, userId);

  const syncedData = await executeAdminGraphql<NotificationsQueryData>(notificationsQuery, {
    userId,
    key: DEFAULT_SETTINGS_KEY,
  });
  const items = syncedData.adminNotifications.map(toItem);

  return {
    unreadCount: items.filter((item) => item.status === 'unread').length,
    items,
  };
};

export const markAdminNotificationAsRead = async (notificationId: string) => {
  await executeAdminGraphql<NotificationMutationData>(markNotificationAsReadMutation, {
    id: notificationId,
  });
};

export const markAllAdminNotificationsAsRead = async (userId: string) => {
  const feed = await listAdminNotifications(userId);
  const unreadItems = feed.items.filter((item) => item.status === 'unread');

  await Promise.all(
    unreadItems.map((item) =>
      executeAdminGraphql<NotificationMutationData>(markNotificationAsReadMutation, {
        id: item.id,
      }),
    ),
  );
};
