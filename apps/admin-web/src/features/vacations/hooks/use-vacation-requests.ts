'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@rh-ponto/api-client';
import type { Employee } from '@rh-ponto/employees';

import { useAdminQueryGate } from '@/shared/hooks/use-admin-query-gate';
import { showActionErrorToast } from '@/shared/lib/mutation-feedback';
import { services } from '@/shared/lib/service-registry';

import {
  createVacationRequestRecord,
  fetchVacationRequestDetail,
  fetchVacationRequests,
  reviewVacationRequestRecord,
} from '../lib/vacation-data-source';
import type { CreateVacationRequestPayload } from '../types/vacation-request';

const fetchEmployees = () => services.employees.listEmployeesUseCase.execute();

export const useVacationRequests = () => {
  const { enabled } = useAdminQueryGate();

  return useQuery({
    queryKey: queryKeys.vacations,
    queryFn: async () => fetchVacationRequests(await fetchEmployees()),
    enabled,
  });
};

export const useVacationRequestDetail = (id: string) => {
  const { enabled } = useAdminQueryGate();

  return useQuery({
    queryKey: queryKeys.vacationDetail(id),
    queryFn: async () => fetchVacationRequestDetail(id, await fetchEmployees()),
    enabled: enabled && Boolean(id),
  });
};

export const useVacationEmployees = () => {
  const { enabled } = useAdminQueryGate();

  return useQuery({
    queryKey: queryKeys.vacationEmployees,
    queryFn: fetchEmployees,
    enabled,
  });
};

const getEmployeesFromCache = async (
  queryClient: ReturnType<typeof useQueryClient>,
): Promise<Employee[]> => {
  const cachedEmployees = queryClient.getQueryData<Employee[]>(queryKeys.vacationEmployees);

  if (cachedEmployees) {
    return cachedEmployees;
  }

  return fetchEmployees();
};

export const useCreateVacationRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateVacationRequestPayload) =>
      createVacationRequestRecord(payload, await getEmployeesFromCache(queryClient)),
    onSuccess: async (createdRequest) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.vacations }),
        queryClient.setQueryData(queryKeys.vacationDetail(createdRequest.id), createdRequest),
      ]);
    },
    onError: (error) => {
      showActionErrorToast(error, 'Não foi possível criar a solicitação de férias.');
    },
  });
};

export const useReviewVacationRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: string; status: 'approved' | 'rejected'; notes: string; actorName?: string }) =>
      reviewVacationRequestRecord({
        ...payload,
        employees: await getEmployeesFromCache(queryClient),
      }),
    onSuccess: async (updatedRequest) => {
      if (!updatedRequest) {
        return;
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.vacations }),
        queryClient.setQueryData(queryKeys.vacationDetail(updatedRequest.id), updatedRequest),
      ]);
    },
    onError: (error) => {
      showActionErrorToast(error, 'Não foi possível concluir a revisão da solicitação de férias.');
    },
  });
};
