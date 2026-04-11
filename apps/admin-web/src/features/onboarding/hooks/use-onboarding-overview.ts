'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@rh-ponto/api-client';
import type {
  OnboardingTaskCreateSchema,
  OnboardingTaskStatusSchema,
} from '@rh-ponto/validations';

import { useAdminQueryGate } from '@/shared/hooks/use-admin-query-gate';
import { showActionErrorToast } from '@/shared/lib/mutation-feedback';

import {
  createOnboardingTask,
  fetchOnboardingJourneyDetail,
  fetchOnboardingOverview,
  updateOnboardingTaskStatus,
} from '../lib/onboarding-client';

export const useOnboardingOverview = () => {
  const { enabled } = useAdminQueryGate();

  return useQuery({
    queryKey: queryKeys.onboarding,
    queryFn: fetchOnboardingOverview,
    enabled,
  });
};

export const useOnboardingJourneyDetail = (journeyId: string) => {
  const { enabled } = useAdminQueryGate();

  return useQuery({
    queryKey: queryKeys.onboardingDetail(journeyId),
    queryFn: () => fetchOnboardingJourneyDetail(journeyId),
    enabled: enabled && Boolean(journeyId),
  });
};

export const useCreateOnboardingTask = (journeyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: OnboardingTaskCreateSchema) => createOnboardingTask(journeyId, payload),
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.onboarding }),
        queryClient.setQueryData(queryKeys.onboardingDetail(journeyId), data),
      ]);
    },
    onError: (error) => {
      showActionErrorToast(error, 'Não foi possível adicionar a etapa de onboarding.');
    },
  });
};

export const useUpdateOnboardingTaskStatus = (journeyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload: OnboardingTaskStatusSchema }) =>
      updateOnboardingTaskStatus(journeyId, taskId, payload),
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.onboarding }),
        queryClient.setQueryData(queryKeys.onboardingDetail(journeyId), data),
        queryClient.invalidateQueries({ queryKey: queryKeys.notifications }),
        queryClient.invalidateQueries({ queryKey: queryKeys.audit }),
      ]);
    },
    onError: (error) => {
      showActionErrorToast(error, 'Não foi possível atualizar a etapa de onboarding.');
    },
  });
};
