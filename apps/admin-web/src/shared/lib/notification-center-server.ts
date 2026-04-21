import { buildOperationsInbox } from '@/features/operations/lib/operations-inbox-service';
import { getLatestAssistedReviewDecision } from '@/features/operations/lib/assisted-review-audit';
import { buildTimeAdjustmentAssistedReviewCases } from '@/features/operations/lib/time-adjustment-assisted-review';

import { executeAdminGraphql } from './admin-server-data-connect';
import type { AdminNotificationFeed, AdminNotificationItem, AdminNotificationSeverity } from './notification-center-contracts';

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
    requestedAt: string;
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
  employeeDocuments: Array<{
    id: string;
    title: string;
    issuedAt: string;
    acknowledgedAt?: string | null;
    employee: { fullName: string };
  }>;
  timeRecords: Array<{
    id: string;
    recordType: string;
    recordedAt: string;
    originalRecordedAt?: string | null;
    source: string;
    notes?: string | null;
    isManual?: boolean;
    latitude?: number | null;
    longitude?: number | null;
    resolvedAddress?: string | null;
    referenceRecordId?: string | null;
    employee: { id: string; fullName: string };
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
    updatedAt: string;
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
      requestedAt
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
    employeeDocuments(
      where: { status: { eq: "pending_signature" } }
      orderBy: [{ issuedAt: DESC }]
      limit: 8
    ) {
      id
      title
      issuedAt
      acknowledgedAt
      employee {
        fullName
      }
    }
    timeRecords(where: { status: { eq: "pending_review" } }, orderBy: [{ recordedAt: DESC }], limit: 8) {
      id
      recordType
      recordedAt
      originalRecordedAt
      source
      notes
      isManual
      latitude
      longitude
      resolvedAddress
      referenceRecordId
      employee {
        id
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
      updatedAt
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
  const timeRecordCases = buildTimeAdjustmentAssistedReviewCases({
    pendingRecords: data.timeRecords
      .filter((timeRecord) => !getLatestAssistedReviewDecision(data.auditLogs as never, timeRecord.id))
      .map((timeRecord) => ({
        id: timeRecord.id,
        employeeId: timeRecord.employee.id,
        employeeName: timeRecord.employee.fullName,
        recordedAt: timeRecord.recordedAt,
        originalRecordedAt: timeRecord.originalRecordedAt ?? null,
        recordType: timeRecord.recordType as never,
        source: timeRecord.source as never,
        notes: timeRecord.notes ?? null,
        isManual: timeRecord.isManual ?? false,
        latitude: timeRecord.latitude ?? null,
        longitude: timeRecord.longitude ?? null,
        resolvedAddress: timeRecord.resolvedAddress ?? null,
        referenceRecordId: timeRecord.referenceRecordId ?? null,
      })),
    allTimeRecords: data.timeRecords.map((timeRecord) => ({
      id: timeRecord.id,
      employeeId: timeRecord.employee.id,
      employeeName: timeRecord.employee.fullName,
      recordedAt: timeRecord.recordedAt,
      originalRecordedAt: timeRecord.originalRecordedAt ?? null,
      recordType: timeRecord.recordType as never,
      source: timeRecord.source as never,
      notes: timeRecord.notes ?? null,
      isManual: timeRecord.isManual ?? false,
      latitude: timeRecord.latitude ?? null,
      longitude: timeRecord.longitude ?? null,
      resolvedAddress: timeRecord.resolvedAddress ?? null,
      referenceRecordId: timeRecord.referenceRecordId ?? null,
    })),
  });
  const timeRecordCaseMap = new Map(timeRecordCases.map((item) => [item.recordId, item]));
  const inbox = buildOperationsInbox({
    pendingTimeRecords: settings?.notifyOvertimeSummary
      ? data.timeRecords
          .filter((timeRecord) => !getLatestAssistedReviewDecision(data.auditLogs as never, timeRecord.id))
          .map((timeRecord) => ({
          id: timeRecord.id,
          employeeId: timeRecord.employee.id,
          employeeName: timeRecord.employee.fullName,
          recordedAt: timeRecord.recordedAt,
          status: 'pending_review' as const,
          recordType: timeRecord.recordType,
          source: timeRecord.source,
          notes: timeRecord.notes ?? null,
          latitude: timeRecord.latitude ?? null,
          longitude: timeRecord.longitude ?? null,
          resolvedAddress: timeRecord.resolvedAddress ?? null,
          referenceRecordId: timeRecord.referenceRecordId ?? null,
          assistedReview: timeRecordCaseMap.get(timeRecord.id),
        }))
      : [],
    pendingJustifications: settings?.notifyPendingVacations
      ? data.justifications.map((justification) => ({
          id: justification.id,
          employeeName: justification.employee.fullName,
          createdAt: justification.createdAt,
          type: justification.type,
        }))
      : [],
    pendingVacations: settings?.notifyPendingVacations
      ? data.vacationRequests.map((vacation) => ({
          id: vacation.id,
          employeeName: vacation.employee.fullName,
          requestedAt: vacation.requestedAt,
          startDate: vacation.startDate,
          endDate: vacation.endDate,
        }))
      : [],
    pendingDocumentAcknowledgements: (data.employeeDocuments ?? [])
      .filter((document) => !document.acknowledgedAt)
      .map((document) => ({
        id: document.id,
        employeeName: document.employee.fullName,
        title: document.title,
        issuedAt: document.issuedAt,
      })),
    blockedOnboardingTasks: data.onboardingTasks
      .filter((task) => {
        const isOverdue =
          task.dueDate != null &&
          task.status !== 'completed' &&
          new Date(`${task.dueDate}T23:59:59.999Z`).getTime() < Date.now();

        return task.status === 'blocked' || isOverdue;
      })
      .map((task) => ({
        id: task.id,
        title: task.title,
        status: task.status as 'blocked' | 'pending' | 'in_progress' | 'completed',
        dueDate: task.dueDate ?? null,
        employeeName: task.journey.employee.fullName,
        journeyId: task.journey.id,
        updatedAt: task.updatedAt,
      })),
    inactiveDevices: settings?.notifyDeviceSync
      ? data.devices.map((device) => ({
          id: device.id,
          name: device.name,
          locationName: device.locationName ?? null,
          lastSyncAt: device.lastSyncAt ?? null,
        }))
      : [],
  });

  items.push(...inbox.items.map((item) => item.notification));

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
