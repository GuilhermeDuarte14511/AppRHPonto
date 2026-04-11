'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@rh-ponto/api-client';

import { useAdminQueryGate } from '@/shared/hooks/use-admin-query-gate';
import { services } from '@/shared/lib/service-registry';

export const useEmployees = () => {
  const { enabled } = useAdminQueryGate();

  return useQuery({
    queryKey: queryKeys.employees,
    queryFn: () => services.employees.listEmployeesUseCase.execute(),
    enabled,
  });
};
