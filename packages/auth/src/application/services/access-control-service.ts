import { getPermissionsForRole, type AppPermission, type UserRole } from '@rh-ponto/types';

import type { User } from '../../domain/entities/user';

export class AccessControlService {
  canAccessAdmin(user: User | null): boolean {
    return Boolean(user?.isActive && user.role === 'admin');
  }

  canAccessRole(user: User | null, allowedRoles: UserRole[]): boolean {
    return Boolean(user && user.isActive && allowedRoles.includes(user.role));
  }

  getPermissionsForUser(user: User | null): AppPermission[] {
    if (!user) {
      return [];
    }

    return getPermissionsForRole(user.role);
  }

  canPerformAction(user: User | null, permission: AppPermission): boolean {
    if (!user || !user.isActive) {
      return false;
    }

    return this.getPermissionsForUser(user).includes(permission);
  }

  canPerformAll(user: User | null, permissions: AppPermission[]): boolean {
    return permissions.every((permission) => this.canPerformAction(user, permission));
  }

  canPerformAny(user: User | null, permissions: AppPermission[]): boolean {
    return permissions.some((permission) => this.canPerformAction(user, permission));
  }

  resolveDefaultRoute(role: UserRole): string {
    switch (role) {
      case 'admin':
        return '/dashboard';
      case 'employee':
        return '/employee';
      case 'kiosk':
        return '/kiosk';
      default:
        return '/login';
    }
  }
}
