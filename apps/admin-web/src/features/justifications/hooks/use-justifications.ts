'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@rh-ponto/api-client';

import { useAdminQueryGate } from '@/shared/hooks/use-admin-query-gate';
import { showActionErrorToast } from '@/shared/lib/mutation-feedback';
import { services } from '@/shared/lib/service-registry';

export const useJustifications = () => {
  const { enabled } = useAdminQueryGate();

  return useQuery({
    queryKey: queryKeys.justifications,
    queryFn: async () => {
      const [justifications, employees] = await Promise.all([
        services.justifications.listJustificationsUseCase.execute(),
        services.employees.listEmployeesUseCase.execute(),
      ]);

      const employeeMap = new Map(employees.map((employee) => [employee.id, employee]));

      return justifications.map((item) => ({
        ...item,
        employeeName: employeeMap.get(item.employeeId)?.fullName ?? 'Colaborador sem cadastro',
        department: employeeMap.get(item.employeeId)?.department ?? 'Sem departamento',
      }));
    },
    enabled,
  });
};

export const useReviewJustification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      justificationId: string;
      status: 'approved' | 'rejected';
      reviewNotes: string;
      reviewedByUserId: string;
    }) => services.justifications.reviewJustificationUseCase.execute(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.justifications });
    },
    onError: (error) => {
      showActionErrorToast(error, 'Não foi possível revisar a justificativa.');
    },
  });
};
