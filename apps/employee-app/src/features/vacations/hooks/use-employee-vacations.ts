import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createEmployeeVacationRequest,
  fetchEmployeeVacationRequestById,
  fetchEmployeeVacationRequests,
  type CreateEmployeeVacationPayload,
} from '@/shared/lib/employee-self-service-api';

export const useEmployeeVacations = (employeeId: string | null) =>
  useQuery({
    queryKey: ['employee-app', 'vacations', employeeId],
    enabled: Boolean(employeeId),
    queryFn: () => fetchEmployeeVacationRequests(employeeId as string),
  });

export const useEmployeeVacationDetail = (vacationId?: string | null) =>
  useQuery({
    queryKey: ['employee-app', 'vacations', 'detail', vacationId],
    enabled: Boolean(vacationId),
    queryFn: () => fetchEmployeeVacationRequestById(vacationId as string),
  });

export const useCreateEmployeeVacation = (employeeId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEmployeeVacationPayload) => createEmployeeVacationRequest(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['employee-app', 'vacations', employeeId] });
    },
  });
};
