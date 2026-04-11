'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@rh-ponto/api-client';
import type { AssignWorkSchedulePayload, CreateWorkSchedulePayload, UpdateWorkSchedulePayload } from '@rh-ponto/work-schedules';

import { showActionErrorToast } from '@/shared/lib/mutation-feedback';
import { services } from '@/shared/lib/service-registry';

const invalidateScheduleQueries = async (queryClient: ReturnType<typeof useQueryClient>) => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.schedules }),
    queryClient.invalidateQueries({ queryKey: queryKeys.scheduleCatalog }),
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard }),
    queryClient.invalidateQueries({ queryKey: queryKeys.employees }),
  ]);
};

export const useCreateWorkSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateWorkSchedulePayload) => services.workSchedules.createWorkScheduleUseCase.execute(payload),
    onSuccess: async () => {
      await invalidateScheduleQueries(queryClient);
    },
    onError: (error) => {
      showActionErrorToast(error, 'Não foi possível criar a escala.');
    },
  });
};

export const useUpdateWorkSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateWorkSchedulePayload) => services.workSchedules.updateWorkScheduleUseCase.execute(payload),
    onSuccess: async () => {
      await invalidateScheduleQueries(queryClient);
    },
    onError: (error) => {
      showActionErrorToast(error, 'Não foi possível atualizar a escala.');
    },
  });
};

export const useAssignWorkSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AssignWorkSchedulePayload) =>
      services.workSchedules.assignWorkScheduleToEmployeeUseCase.execute(payload),
    onSuccess: async () => {
      await invalidateScheduleQueries(queryClient);
    },
    onError: (error) => {
      showActionErrorToast(error, 'Não foi possível vincular a escala ao colaborador.');
    },
  });
};
