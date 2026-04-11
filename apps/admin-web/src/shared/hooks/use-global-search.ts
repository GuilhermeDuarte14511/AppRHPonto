'use client';

import { useDeferredValue } from 'react';
import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@rh-ponto/api-client';

import { fetchGlobalSearchResults } from '../lib/global-search-api';
import { useAdminQueryGate } from './use-admin-query-gate';

export const useGlobalSearch = (term: string) => {
  const { enabled } = useAdminQueryGate();
  const deferredTerm = useDeferredValue(term.trim());

  return useQuery({
    queryKey: queryKeys.globalSearch(deferredTerm),
    queryFn: () => fetchGlobalSearchResults(deferredTerm),
    enabled: enabled && deferredTerm.length >= 2,
    staleTime: 30 * 1000,
  });
};
