import { AppError } from '@rh-ponto/core';

import { createSession, createUser, type Session, type User } from '../../domain/entities/user';
import type { AuthRepository, SignInPayload } from '../../domain/repositories/auth-repository';

const now = new Date().toISOString();

export interface MockAuthCredential {
  id: string;
  label: string;
  description: string;
  email: string;
  password: string;
  role: User['role'];
  user: User;
}

export const mockAuthCredentials: MockAuthCredential[] = [
  {
    id: 'admin-primary',
    label: 'Admin principal',
    description: 'Acesso completo ao administrativo web.',
    email: 'admin@empresa.com',
    password: 'admin123',
    role: 'admin',
    user: createUser({
      id: 'user-admin-1',
      firebaseUid: 'mock-admin-uid',
      name: 'Marina Costa',
      email: 'admin@empresa.com',
      role: 'admin',
      isActive: true,
      lastLoginAt: now,
      createdAt: now,
      updatedAt: now,
    }),
  },
  {
    id: 'admin-rh',
    label: 'Admin RH',
    description: 'Conta extra para validar cenarios administrativos.',
    email: 'rh@empresa.com',
    password: 'rh123456',
    role: 'admin',
    user: createUser({
      id: 'user-admin-2',
      firebaseUid: 'mock-admin-rh-uid',
      name: 'Ricardo Mello',
      email: 'rh@empresa.com',
      role: 'admin',
      isActive: true,
      lastLoginAt: null,
      createdAt: now,
      updatedAt: now,
    }),
  },
  {
    id: 'employee-primary',
    label: 'Funcionário',
    description: 'Usada para testar o bloqueio de acesso ao admin.',
    email: 'employee@empresa.com',
    password: 'employee123',
    role: 'employee',
    user: createUser({
      id: 'user-employee-1',
      firebaseUid: 'mock-employee-uid',
      name: 'Joao Pereira',
      email: 'employee@empresa.com',
      role: 'employee',
      isActive: true,
      lastLoginAt: null,
      createdAt: now,
      updatedAt: now,
    }),
  },
  {
    id: 'kiosk-primary',
    label: 'Kiosk',
    description: 'Usada para testar o redirecionamento de perfis tablet.',
    email: 'kiosk@empresa.com',
    password: 'kiosk123',
    role: 'kiosk',
    user: createUser({
      id: 'user-kiosk-1',
      firebaseUid: 'mock-kiosk-uid',
      name: 'Tablet Portaria',
      email: 'kiosk@empresa.com',
      role: 'kiosk',
      isActive: true,
      lastLoginAt: null,
      createdAt: now,
      updatedAt: now,
    }),
  },
];

const users: Record<string, User> = Object.fromEntries(
  mockAuthCredentials.map((credential) => [credential.id, credential.user]),
) as Record<string, User>;

const credentialMap: Record<string, { password: string; userKey: keyof typeof users }> = {
  'admin@empresa.com': {
    password: 'admin123',
    userKey: 'admin-primary',
  },
  'rh@empresa.com': {
    password: 'rh123456',
    userKey: 'admin-rh',
  },
  'employee@empresa.com': {
    password: 'employee123',
    userKey: 'employee-primary',
  },
  'kiosk@empresa.com': {
    password: 'kiosk123',
    userKey: 'kiosk-primary',
  },
};

let currentSession: Session | null = null;

export class MockAuthRepository implements AuthRepository {
  async signIn(payload: SignInPayload): Promise<Session> {
    const credential = credentialMap[payload.email];

    if (!credential || credential.password !== payload.password) {
      throw new AppError('AUTH_INVALID_CREDENTIALS', 'Credenciais invalidas.');
    }

    const user = createUser({
      ...users[credential.userKey],
      lastLoginAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (!user.isActive) {
      throw new AppError('AUTH_INACTIVE_USER', 'Esta conta mockada esta inativa.');
    }

    currentSession = createSession({
      accessToken: `mock-token-${user.id}`,
      refreshToken: `mock-refresh-${user.id}`,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
      user,
    });

    users[credential.userKey] = user;

    return currentSession;
  }

  async signOut(): Promise<void> {
    currentSession = null;
  }

  async getCurrentUser(): Promise<User | null> {
    return currentSession?.user ?? null;
  }

  async getSession(): Promise<Session | null> {
    return currentSession;
  }

  async refreshSession(): Promise<Session | null> {
    if (!currentSession) {
      return null;
    }

    currentSession = createSession({
      ...currentSession,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
    });

    return currentSession;
  }
}
