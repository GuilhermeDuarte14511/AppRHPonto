import type { UserRole } from '@rh-ponto/types';

import type { User } from '../../domain/entities/user';

export const hasRequiredRole = (user: User | null, allowedRoles: UserRole[]): boolean =>
  Boolean(user && allowedRoles.includes(user.role));

