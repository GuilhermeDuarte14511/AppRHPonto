'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@rh-ponto/api-client';

import { useAdminQueryGate } from '@/shared/hooks/use-admin-query-gate';
import { services } from '@/shared/lib/service-registry';

import { toAuditOverviewViewModel } from '../lib/audit-view-models';

export const useAuditOverview = () => {
  const { enabled } = useAdminQueryGate();

  return useQuery({
    queryKey: queryKeys.audit,
    queryFn: async () => {
      const logs = await services.audit.listAuditLogsUseCase.execute();

      return toAuditOverviewViewModel(logs);
    },
    enabled,
  });
};
