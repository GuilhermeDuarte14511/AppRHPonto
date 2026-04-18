'use client';

import { useQuery } from '@tanstack/react-query';

import { useAdminQueryGate } from '@/shared/hooks/use-admin-query-gate';

import { getOperationsInbox } from '../lib/operations-inbox-service';

export const useOperationsInbox = () => {
  const { enabled } = useAdminQueryGate();

  return useQuery({
    queryKey: ['operations-inbox'],
    queryFn: getOperationsInbox,
    enabled,
  });
};
