export type AdminNotificationSeverity = 'info' | 'warning' | 'danger' | 'success';
export type AdminNotificationStatus = 'unread' | 'read';

export interface AdminNotificationItem {
  id: string;
  category: string;
  title: string;
  description: string;
  href: string | null;
  entityName: string | null;
  entityId: string | null;
  severity: AdminNotificationSeverity;
  status: AdminNotificationStatus;
  triggeredAt: string;
  readAt: string | null;
}

export interface AdminNotificationFeed {
  unreadCount: number;
  items: AdminNotificationItem[];
}
