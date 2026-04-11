'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@rh-ponto/api-client';

import { useAdminQueryGate } from '@/shared/hooks/use-admin-query-gate';
import { showActionErrorToast } from '@/shared/lib/mutation-feedback';

import {
  fetchEmployeeOnboarding,
  initializeEmployeeOnboarding,
} from '../lib/employee-onboarding-client';

export const useEmployeeOnboarding = (employeeId: string) => {
  const { enabled } = useAdminQueryGate();

  return useQuery({
    queryKey: [...queryKeys.employeeDetail(employeeId), 'onboarding'],
    queryFn: () => fetchEmployeeOnboarding(employeeId),
    enabled: enabled && Boolean(employeeId),
  });
};

export const useInitializeEmployeeOnboarding = (employeeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => initializeEmployeeOnboarding(employeeId),
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.onboarding }),
        data.journeyId
          ? queryClient.invalidateQueries({ queryKey: queryKeys.onboardingDetail(data.journeyId) })
          : Promise.resolve(),
        queryClient.invalidateQueries({ queryKey: [...queryKeys.employeeDetail(employeeId), 'onboarding'] }),
      ]);
    },
    onError: (error) => {
      showActionErrorToast(error, 'Não foi possível iniciar o onboarding deste colaborador.');
    },
  });
};
