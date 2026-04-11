import type { UserRole } from '@rh-ponto/types';

import type { User } from '../../domain/entities/user';

export class AccessControlService {
  canAccessAdmin(user: User | null): boolean {
    return user?.role === 'admin';
  }

  canAccessRole(user: User | null, allowedRoles: UserRole[]): boolean {
    return Boolean(user && allowedRoles.includes(user.role));
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
