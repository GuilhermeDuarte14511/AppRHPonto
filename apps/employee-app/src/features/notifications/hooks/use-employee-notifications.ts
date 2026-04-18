import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  fetchEmployeeNotificationPreferences,
  fetchEmployeeNotifications,
  markAllEmployeeNotificationsRead,
  markEmployeeNotificationRead,
  type EmployeeNotificationPreferences,
  updateEmployeeNotificationPreferenceSet,
} from '@/shared/lib/employee-self-service-api';

const notificationsKey = (userId: string | null) => ['employee-app', 'notifications', userId] as const;
const notificationPreferencesKey = (userId: string | null) =>
  ['employee-app', 'notification-preferences', userId] as const;

export const useEmployeeNotifications = (userId: string | null) =>
  useQuery({
    queryKey: notificationsKey(userId),
    enabled: Boolean(userId),
    queryFn: () => fetchEmployeeNotifications(userId as string),
  });

export const useMarkEmployeeNotificationRead = (userId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => markEmployeeNotificationRead(notificationId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: notificationsKey(userId) });
    },
  });
};

export const useMarkAllEmployeeNotificationsRead = (userId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllEmployeeNotificationsRead(userId as string),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: notificationsKey(userId) });
    },
  });
};

export const useEmployeeNotificationPreferences = (userId: string | null) =>
  useQuery({
    queryKey: notificationPreferencesKey(userId),
    enabled: Boolean(userId),
    queryFn: () => fetchEmployeeNotificationPreferences(userId as string),
  });

export const useUpdateEmployeeNotificationPreferences = (userId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EmployeeNotificationPreferences) => updateEmployeeNotificationPreferenceSet(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: notificationPreferencesKey(userId) });
    },
  });
};
