'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@rh-ponto/api-client';
import type { EmployeeAttendancePolicyFormSchema } from '@rh-ponto/validations';

import { useAdminQueryGate } from '@/shared/hooks/use-admin-query-gate';
import { showActionErrorToast } from '@/shared/lib/mutation-feedback';

import {
  fetchEmployeeAttendancePolicy,
  updateEmployeeAttendancePolicy,
} from '../lib/employee-attendance-policy-client';

export const useEmployeeAttendancePolicy = (employeeId: string) => {
  const { enabled } = useAdminQueryGate();

  return useQuery({
    queryKey: queryKeys.employeeAttendancePolicy(employeeId),
    queryFn: () => fetchEmployeeAttendancePolicy(employeeId),
    enabled: enabled && Boolean(employeeId),
  });
};

export const useUpdateEmployeeAttendancePolicy = (employeeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EmployeeAttendancePolicyFormSchema) => updateEmployeeAttendancePolicy(employeeId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.employeeAttendancePolicy(employeeId) });
    },
    onError: (error) => {
      showActionErrorToast(error, 'Não foi possível atualizar a política de marcação.');
    },
  });
};
