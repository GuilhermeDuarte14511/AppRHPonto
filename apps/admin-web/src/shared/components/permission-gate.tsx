'use client';

import type { ReactNode } from 'react';

import type { AppPermission } from '@rh-ponto/types';

import { usePermissions } from '../hooks/use-permissions';

interface PermissionGateProps {
  requires: AppPermission | AppPermission[];
  children: ReactNode;
  fallback?: ReactNode;
}

export const PermissionGate = ({ requires, children, fallback = null }: PermissionGateProps) => {
  const { all } = usePermissions();
  const requiredPermissions = Array.isArray(requires) ? requires : [requires];

  if (!all(requiredPermissions)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
