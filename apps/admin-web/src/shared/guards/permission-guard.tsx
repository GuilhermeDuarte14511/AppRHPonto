'use client';

import type { ReactNode } from 'react';

import type { AppPermission } from '@rh-ponto/types';

import { usePermissions } from '../hooks/use-permissions';

interface PermissionGuardProps {
  requires: AppPermission | AppPermission[];
  children: ReactNode;
  fallback?: ReactNode;
}

export const PermissionGuard = ({ requires, children, fallback = null }: PermissionGuardProps) => {
  const { all } = usePermissions();
  const requiredPermissions = Array.isArray(requires) ? requires : [requires];

  if (!all(requiredPermissions)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
