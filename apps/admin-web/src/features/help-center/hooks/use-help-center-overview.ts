'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@rh-ponto/api-client';

import { useAdminQueryGate } from '@/shared/hooks/use-admin-query-gate';

import { getHelpCenterOverview } from '../lib/help-center-overview-service';

export const useHelpCenterOverview = () => {
  const { enabled } = useAdminQueryGate();

  return useQuery({
    queryKey: queryKeys.helpCenter,
    queryFn: getHelpCenterOverview,
    enabled,
  });
};
