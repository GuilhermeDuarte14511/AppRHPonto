'use client';

import { useSession } from '../providers/session-provider';
import { services } from '../lib/service-registry';

export const useAdminQueryGate = () => {
  const { isLoading, session } = useSession();
  const enabled = session ? services.auth.accessControlService.canAccessAdmin(session.user) : false;

  return {
    enabled: !isLoading && enabled,
    isSessionLoading: isLoading,
    session,
  };
};
