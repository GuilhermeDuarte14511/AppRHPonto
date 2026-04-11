import type { AdminNotificationFeed } from './notification-center-contracts';

const handleJsonResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;

    throw new Error(payload?.message ?? 'Não foi possível concluir a operação.');
  }

  return (await response.json()) as T;
};

export const fetchAdminNotifications = async (): Promise<AdminNotificationFeed> => {
  const response = await fetch('/api/admin/notifications', {
    credentials: 'include',
  });

  return handleJsonResponse<{ data: AdminNotificationFeed }>(response).then((payload) => payload.data);
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  const response = await fetch(`/api/admin/notifications/${notificationId}/read`, {
    method: 'POST',
    credentials: 'include',
  });

  await handleJsonResponse<{ success: true }>(response);
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  const response = await fetch('/api/admin/notifications/read-all', {
    method: 'POST',
    credentials: 'include',
  });

  await handleJsonResponse<{ success: true }>(response);
};
