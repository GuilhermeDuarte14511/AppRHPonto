import type { Session } from '../entities/user';

export interface SignInPayload {
  email: string;
  password: string;
}

export interface AuthRepository {
  signIn(payload: SignInPayload): Promise<Session>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<Session['user'] | null>;
  getSession(): Promise<Session | null>;
  refreshSession(): Promise<Session | null>;
}
