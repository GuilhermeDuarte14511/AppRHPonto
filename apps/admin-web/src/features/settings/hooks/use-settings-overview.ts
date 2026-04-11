'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@rh-ponto/api-client';
import type { AdminSettingsFormSchema } from '@rh-ponto/validations';

import { useAdminQueryGate } from '@/shared/hooks/use-admin-query-gate';
import { showActionErrorToast } from '@/shared/lib/mutation-feedback';

import { fetchSettingsOverview, updateSettingsOverview } from '../lib/settings-client';

export const useSettingsOverview = () => {
  const { enabled } = useAdminQueryGate();

  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: fetchSettingsOverview,
    enabled,
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdminSettingsFormSchema) => updateSettingsOverview(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.settings }),
        queryClient.invalidateQueries({ queryKey: queryKeys.notifications }),
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard }),
        queryClient.invalidateQueries({ queryKey: queryKeys.analytics }),
        queryClient.invalidateQueries({ queryKey: queryKeys.schedules }),
      ]);
    },
    onError: (error) => {
      showActionErrorToast(error, 'Não foi possível salvar as configurações.');
    },
  });
};
