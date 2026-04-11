import type { Session } from '../../domain/entities/user';

export interface SessionViewModel {
  userName: string;
  userEmail: string;
  role: Session['user']['role'];
  isAuthenticated: boolean;
}

export const toSessionViewModel = (session: Session | null): SessionViewModel => ({
  userName: session?.user.name ?? '',
  userEmail: session?.user.email ?? '',
  role: session?.user.role ?? 'employee',
  isAuthenticated: Boolean(session),
});

