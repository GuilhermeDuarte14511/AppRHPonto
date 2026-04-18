'use client';

import { useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';

import { queryKeys } from '@rh-ponto/api-client';
import type { CreateDevicePayload, UpdateDevicePayload } from '@rh-ponto/devices';

import { showActionErrorToast } from '@/shared/lib/mutation-feedback';
import { services } from '@/shared/lib/service-registry';

const invalidateDeviceQueries = async (queryClient: QueryClient) => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.devices }),
    queryClient.invalidateQueries({ queryKey: queryKeys.deviceCatalog }),
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard }),
    queryClient.invalidateQueries({ queryKey: queryKeys.analytics }),
    queryClient.invalidateQueries({ queryKey: queryKeys.settings }),
  ]);
};

export const useCreateDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDevicePayload) => services.devices.createDeviceUseCase.execute(payload),
    onSuccess: async () => {
      await invalidateDeviceQueries(queryClient);
    },
    onError: (error) => {
      showActionErrorToast(error, 'Não foi possível criar o dispositivo.');
    },
  });
};

export const useUpdateDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateDevicePayload) => services.devices.updateDeviceUseCase.execute(payload),
    onSuccess: async (device) => {
      await Promise.all([
        invalidateDeviceQueries(queryClient),
        queryClient.invalidateQueries({ queryKey: queryKeys.deviceDetail(device.id) }),
      ]);
    },
    onError: (error) => {
      showActionErrorToast(error, 'Não foi possível atualizar o dispositivo.');
    },
  });
};

export const useDeactivateDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => services.devices.deactivateDeviceUseCase.execute(id),
    onSuccess: async () => {
      await invalidateDeviceQueries(queryClient);
    },
    onError: (error) => {
      showActionErrorToast(error, 'Não foi possível desativar o dispositivo.');
    },
  });
};
