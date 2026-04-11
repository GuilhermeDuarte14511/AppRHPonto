'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@rh-ponto/api-client';
import type { CreateDepartmentPayload, UpdateDepartmentPayload } from '@rh-ponto/departments';

import { showActionErrorToast } from '@/shared/lib/mutation-feedback';
import { services } from '@/shared/lib/service-registry';

const invalidateDepartmentQueries = async (queryClient: ReturnType<typeof useQueryClient>) => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.departments }),
    queryClient.invalidateQueries({ queryKey: queryKeys.departmentCatalog }),
    queryClient.invalidateQueries({ queryKey: queryKeys.employees }),
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard }),
    queryClient.invalidateQueries({ queryKey: queryKeys.audit }),
  ]);
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDepartmentPayload) => services.departments.createDepartmentUseCase.execute(payload),
    onSuccess: async () => {
      await invalidateDepartmentQueries(queryClient);
    },
    onError: (error) => {
      showActionErrorToast(error, 'Não foi possível criar o departamento.');
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateDepartmentPayload) => services.departments.updateDepartmentUseCase.execute(payload),
    onSuccess: async (department) => {
      await Promise.all([
        invalidateDepartmentQueries(queryClient),
        queryClient.invalidateQueries({ queryKey: queryKeys.departmentDetail(department.id) }),
      ]);
    },
    onError: (error) => {
      showActionErrorToast(error, 'Não foi possível atualizar o departamento.');
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => services.departments.deleteDepartmentUseCase.execute(id),
    onSuccess: async () => {
      await invalidateDepartmentQueries(queryClient);
    },
    onError: (error) => {
      showActionErrorToast(error, 'Não foi possível excluir o departamento.');
    },
  });
};
