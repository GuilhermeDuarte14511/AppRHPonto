'use client';

import { useSession } from '../providers/session-provider';

export const useAdminQueryGate = () => {
  const { isLoading, session } = useSession();

  return {
    enabled: !isLoading && session?.user.role === 'admin' && session.user.isActive,
    isSessionLoading: isLoading,
    session,
  };
};
