'use client';

import { useSession } from '../providers/session-provider';

export const useCurrentUser = () => {
  const { session } = useSession();

  return session?.user ?? null;
};

