'use client';

import { useMemo } from 'react';

import type { AppPermission } from '@rh-ponto/types';

import { useSession } from '../providers/session-provider';
import { services } from '../lib/service-registry';

export const usePermissions = () => {
  const { session } = useSession();

  const permissions = useMemo(
    () => services.auth.accessControlService.getPermissionsForUser(session?.user ?? null),
    [session?.user],
  );

  const can = (permission: AppPermission) => permissions.includes(permission);
  const all = (required: AppPermission[]) => required.every((permission) => can(permission));
  const any = (required: AppPermission[]) => required.some((permission) => can(permission));

  return {
    permissions,
    can,
    all,
    any,
    isAdmin: session?.user.role === 'admin' && session.user.isActive,
  };
};
