'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@rh-ponto/api-client';

import { useAdminQueryGate } from '@/shared/hooks/use-admin-query-gate';

import { getDocumentsOverview } from '../lib/documents-overview-service';

export const useDocumentsOverview = () => {
  const { enabled } = useAdminQueryGate();

  return useQuery({
    queryKey: queryKeys.documents,
    queryFn: getDocumentsOverview,
    enabled,
  });
};
