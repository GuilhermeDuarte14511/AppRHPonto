import { getAppDataConnect } from '@rh-ponto/api-client';
import {
  getUserByEmail,
  getUserByFirebaseUid,
  linkUserFirebaseUid,
  touchUserLastLogin,
} from '@rh-ponto/api-client/generated';
import { AppError } from '@rh-ponto/core';
import type { FirebaseAuthClient } from '@rh-ponto/firebase';
import { userRoles, type UserRole } from '@rh-ponto/types';

import { createSession, createUser, type Session } from '../../domain/entities/user';
import type { AuthRepository, SignInPayload } from '../../domain/repositories/auth-repository';

const toDomainUser = (user: {
  id: string;
  firebaseUid: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}) =>
  createUser({
    id: user.id,
    firebaseUid: user.firebaseUid,
    name: user.name,
    email: user.email,
    role: (() => {
      if (!userRoles.includes(user.role as UserRole)) {
        throw new AppError('AUTH_INVALID_ROLE', 'O perfil retornado pelo Data Connect é inválido.');
      }

      return user.role as UserRole;
    })(),
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });

const ensureActiveUser = (user: ReturnType<typeof toDomainUser>) => {
  if (!user.isActive) {
    throw new AppError('AUTH_INACTIVE_USER', 'Esta conta está inativa.');
  }

  return user;
};

const resolveApplicationUserByFirebaseUid = async (firebaseUid: string) => {
  const { data } = await getUserByFirebaseUid(getAppDataConnect(), { firebaseUid });
  const user = data.users[0];

  if (!user) {
    return null;
  }

  return ensureActiveUser(toDomainUser(user));
};

const resolveApplicationUser = async (firebaseUid: string, email: string | null) => {
  const userByFirebaseUid = await resolveApplicationUserByFirebaseUid(firebaseUid);

  if (userByFirebaseUid) {
    return userByFirebaseUid;
  }

  if (!email) {
    throw new AppError('AUTH_USER_NOT_FOUND', 'Usuário autenticado não encontrado na base da aplicação.');
  }

  const { data } = await getUserByEmail(getAppDataConnect(), { email: email.toLowerCase() });
  const userByEmail = data.users[0];

  if (!userByEmail) {
    throw new AppError('AUTH_USER_NOT_FOUND', 'Usuário autenticado não encontrado na base da aplicação.');
  }

  if (userByEmail.firebaseUid !== firebaseUid) {
    await linkUserFirebaseUid(getAppDataConnect(), {
      id: userByEmail.id,
      firebaseUid,
    });
  }

  return ensureActiveUser(
    toDomainUser({
      ...userByEmail,
      firebaseUid,
    }),
  );
};

const buildSession = async (
  firebaseUid: string,
  email: string | null,
  accessToken: string,
  refreshToken?: string | null,
  expiresAt?: string | null,
): Promise<Session> => {
  const user = await resolveApplicationUser(firebaseUid, email);

  return createSession({
    accessToken,
    refreshToken: refreshToken ?? null,
    expiresAt: expiresAt ?? null,
    user,
  });
};

export class FirebaseAuthRepository implements AuthRepository {
  constructor(private readonly authClient: FirebaseAuthClient) {}

  async signIn(payload: SignInPayload): Promise<Session> {
    const authenticatedUser = await this.authClient.signInWithEmailAndPassword(payload.email, payload.password);
    const session = await buildSession(
      authenticatedUser.uid,
      authenticatedUser.email,
      authenticatedUser.accessToken,
      authenticatedUser.refreshToken,
      authenticatedUser.expiresAt,
    );

    await touchUserLastLogin(getAppDataConnect(), {
      id: session.user.id,
    }).catch(() => undefined);

    return session;
  }

  signOut(): Promise<void> {
    return this.authClient.signOut();
  }

  async getCurrentUser(): Promise<Session['user'] | null> {
    const session = await this.getSession();

    return session?.user ?? null;
  }

  async getSession(): Promise<Session | null> {
    const authenticatedUser = await this.authClient.getCurrentUser();

    if (!authenticatedUser) {
      return null;
    }

    return buildSession(
      authenticatedUser.uid,
      authenticatedUser.email,
      authenticatedUser.accessToken,
      authenticatedUser.refreshToken,
      authenticatedUser.expiresAt,
    );
  }

  async refreshSession(): Promise<Session | null> {
    return this.getSession();
  }
}
