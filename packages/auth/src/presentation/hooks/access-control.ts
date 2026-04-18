import { getPermissionsForRole, type AppPermission, type UserRole } from '@rh-ponto/types';

import type { User } from '../../domain/entities/user';

export const hasRequiredRole = (user: User | null, allowedRoles: UserRole[]): boolean =>
  Boolean(user && user.isActive && allowedRoles.includes(user.role));

export const hasRequiredPermission = (user: User | null, permission: AppPermission): boolean =>
  Boolean(user && user.isActive && getPermissionsForRole(user.role).includes(permission));

export const getUserPermissions = (user: User | null): AppPermission[] => (user ? getPermissionsForRole(user.role) : []);
