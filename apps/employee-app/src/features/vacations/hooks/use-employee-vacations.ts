import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createEmployeeVacationRequest,
  fetchEmployeeVacationRequestByIdForEmployee,
  fetchEmployeeVacationRequests,
  type CreateEmployeeVacationPayload,
} from '../../../shared/lib/employee-self-service-api';

export const useEmployeeVacations = (employeeId: string | null) =>
  useQuery({
    queryKey: ['employee-app', 'vacations', employeeId],
    enabled: Boolean(employeeId),
    queryFn: () => fetchEmployeeVacationRequests(employeeId as string),
  });

export const useEmployeeVacationDetail = (vacationId?: string | null, employeeId?: string | null) =>
  useQuery({
    queryKey: ['employee-app', 'vacations', 'detail', employeeId, vacationId],
    enabled: Boolean(vacationId && employeeId),
    queryFn: () => fetchEmployeeVacationRequestByIdForEmployee(vacationId as string, employeeId as string),
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
