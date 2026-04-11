'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@rh-ponto/api-client';
import type { UpdateEmployeePayload } from '@rh-ponto/employees';

import { showActionErrorToast } from '@/shared/lib/mutation-feedback';
import { services } from '@/shared/lib/service-registry';

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateEmployeePayload) => services.employees.updateEmployeeUseCase.execute(payload),
    onSuccess: async (employee) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.employees }),
        queryClient.invalidateQueries({ queryKey: queryKeys.employeeDetail(employee.id) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard }),
      ]);
    },
    onError: (error) => {
      showActionErrorToast(error, 'Não foi possível atualizar o colaborador.');
    },
  });
};
