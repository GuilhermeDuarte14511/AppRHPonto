'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@rh-ponto/api-client';

import { useAdminQueryGate } from '@/shared/hooks/use-admin-query-gate';
import { services } from '@/shared/lib/service-registry';

export const useTimeRecordCatalog = () => {
  const { enabled } = useAdminQueryGate();

  return useQuery({
    queryKey: queryKeys.timeRecordCatalog,
    queryFn: async () => {
      const [employees, devices] = await Promise.all([
        services.employees.listEmployeesUseCase.execute(),
        services.devices.listDevicesUseCase.execute(),
      ]);

      return {
        employees,
        devices,
      };
    },
    enabled,
  });
};
