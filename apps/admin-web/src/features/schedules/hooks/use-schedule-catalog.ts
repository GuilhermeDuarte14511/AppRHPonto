'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@rh-ponto/api-client';

import { useAdminQueryGate } from '@/shared/hooks/use-admin-query-gate';
import { services } from '@/shared/lib/service-registry';

export const useScheduleCatalog = () => {
  const { enabled } = useAdminQueryGate();

  return useQuery({
    queryKey: queryKeys.scheduleCatalog,
    queryFn: async () => {
      const [employees, workSchedules] = await Promise.all([
        services.employees.listEmployeesUseCase.execute(),
        services.workSchedules.listWorkSchedulesUseCase.execute(),
      ]);

      return {
        employees,
        workSchedules,
      };
    },
    enabled,
  });
};
