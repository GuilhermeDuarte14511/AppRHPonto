'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@rh-ponto/api-client';

import { useAdminQueryGate } from '@/shared/hooks/use-admin-query-gate';
import { services } from '@/shared/lib/service-registry';

export const useEmployeeDetail = (id: string) => {
  const { enabled } = useAdminQueryGate();

  return useQuery({
    queryKey: queryKeys.employeeDetail(id),
    queryFn: () => services.employees.getEmployeeByIdUseCase.execute(id),
    enabled: enabled && Boolean(id),
  });
};
