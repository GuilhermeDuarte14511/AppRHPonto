'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@rh-ponto/api-client';

import { useAdminQueryGate } from '@/shared/hooks/use-admin-query-gate';

import { getDashboardSummary } from '../lib/dashboard-summary-service';

export type { DashboardRecentTimeRecordViewModel } from '../lib/dashboard-summary-service';

export const useDashboardSummary = () => {
  const { enabled } = useAdminQueryGate();

  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: getDashboardSummary,
    enabled,
  });
};
