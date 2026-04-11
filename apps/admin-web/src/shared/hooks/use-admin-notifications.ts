'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@rh-ponto/api-client';

import { useAdminQueryGate } from './use-admin-query-gate';
import { showActionErrorToast } from '../lib/mutation-feedback';
import {
  fetchAdminNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../lib/notification-center-api';

export const useAdminNotifications = () => {
  const { enabled } = useAdminQueryGate();

  return useQuery({
    queryKey: queryKeys.notifications,
    queryFn: fetchAdminNotifications,
    enabled,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => markNotificationAsRead(notificationId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
    onError: (error) => {
      showActionErrorToast(error, 'Não foi possível atualizar a notificação.');
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
    onError: (error) => {
      showActionErrorToast(error, 'Não foi possível marcar as notificações como lidas.');
    },
  });
};
