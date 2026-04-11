'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@rh-ponto/api-client';
import type { CreateEmployeePayload } from '@rh-ponto/employees';

import { showActionErrorToast } from '@/shared/lib/mutation-feedback';
import { services } from '@/shared/lib/service-registry';

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) => services.employees.createEmployeeUseCase.execute(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.employees });
    },
    onError: (error) => {
      showActionErrorToast(error, 'Não foi possível criar o colaborador.');
    },
  });
};
