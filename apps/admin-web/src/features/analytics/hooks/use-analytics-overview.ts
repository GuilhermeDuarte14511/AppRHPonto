'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@rh-ponto/api-client';

import { useAdminQueryGate } from '@/shared/hooks/use-admin-query-gate';

import { getAnalyticsOverview } from '../lib/analytics-overview-service';

export const useAnalyticsOverview = () => {
  const { enabled } = useAdminQueryGate();

  return useQuery({
    queryKey: queryKeys.analytics,
    queryFn: getAnalyticsOverview,
    enabled,
  });
};
