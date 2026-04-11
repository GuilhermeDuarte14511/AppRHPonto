import { initializeApp, getApps } from 'firebase-admin/app';
import { getDataConnect } from 'firebase-admin/data-connect';

import { AppError } from '@rh-ponto/core';
import type { SessionDto } from '@rh-ponto/auth';

const FIREBASE_AUTH_ENDPOINT = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword';
const DATA_CONNECT_LOCATION = 'southamerica-east1';
const DATA_CONNECT_SERVICE_ID = 'myrh-32b0a-service';

interface FirebaseSignInResponse {
  localId: string;
  email: string;
  idToken: string;
  refreshToken: string;
  expiresIn: string;
}

interface ApplicationUserRecord {
  id: string;
  firebaseUid: string;
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'kiosk';
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

const getRequiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new AppError('FIREBASE_ENV_MISSING', `A variável ${name} não foi configurada.`);
  }

  return value;
};

const getServerDataConnect = () => {
  if (getApps().length === 0) {
    initializeApp();
  }

  return getDataConnect({
    serviceId: DATA_CONNECT_SERVICE_ID,
    location: DATA_CONNECT_LOCATION,
  });
};

const executeServerGraphql = async <T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> => {
  try {
    const response = await getServerDataConnect().executeGraphql(query, {
      variables,
    });

    if (!response.data) {
      throw new AppError('DATA_CONNECT_EMPTY_RESPONSE', 'O Data Connect não retornou dados válidos.');
    }

    return response.data as T;
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Não foi possível consultar o Data Connect.';

    throw new AppError(
      'DATA_CONNECT_REQUEST_FAILED',
      message,
    );
  }
};

const getUserByEmailQuery = `
  query GetUserByEmail($email: String!) {
    users(where: { email: { eq: $email } }, limit: 1) {
      id
      firebaseUid
      name
      email
      role
      isActive
      lastLoginAt
      createdAt
      updatedAt
    }
  }
`;

const linkUserFirebaseUidMutation = `
  mutation LinkUserFirebaseUid($id: UUID!, $firebaseUid: String!) {
    user_update(
      id: $id
      data: {
        firebaseUid: $firebaseUid
        updatedAt_expr: "request.time"
      }
    )
  }
`;

const touchUserLastLoginMutation = `
  mutation TouchUserLastLogin($id: UUID!) {
    user_update(
      id: $id
      data: {
        lastLoginAt_expr: "request.time"
        updatedAt_expr: "request.time"
      }
    )
  }
`;

const fetchApplicationUserByEmail = async (email: string): Promise<ApplicationUserRecord> => {
  const data = await executeServerGraphql<{ users: ApplicationUserRecord[] }>(getUserByEmailQuery, {
    email: email.toLowerCase(),
  });
  const user = data.users[0];

  if (!user) {
    throw new AppError('AUTH_USER_NOT_FOUND', 'Usuário autenticado não encontrado na base da aplicação.');
  }

  if (!user.isActive) {
    throw new AppError('AUTH_INACTIVE_USER', 'Esta conta está inativa.');
  }

  return user;
};

const signInWithFirebasePassword = async (email: string, password: string): Promise<FirebaseSignInResponse> => {
  const apiKey = getRequiredEnv('NEXT_PUBLIC_FIREBASE_API_KEY');
  const response = await fetch(`${FIREBASE_AUTH_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true,
    }),
    cache: 'no-store',
  });

  const payload = (await response.json()) as FirebaseSignInResponse & {
    error?: {
      message?: string;
    };
  };

  if (!response.ok) {
    const message =
      payload.error?.message === 'INVALID_LOGIN_CREDENTIALS'
        ? 'Credenciais inválidas.'
        : 'Não foi possível autenticar com o Firebase Auth.';

    throw new AppError('AUTH_INVALID_CREDENTIALS', message);
  }

  return payload;
};

export const signInAdminWithFirebase = async (payload: {
  email: string;
  password: string;
}): Promise<SessionDto> => {
  const authenticatedUser = await signInWithFirebasePassword(payload.email, payload.password);
  let applicationUser = await fetchApplicationUserByEmail(authenticatedUser.email);

  if (applicationUser.firebaseUid !== authenticatedUser.localId) {
    await executeServerGraphql(linkUserFirebaseUidMutation, {
      id: applicationUser.id,
      firebaseUid: authenticatedUser.localId,
    });

    applicationUser = {
      ...applicationUser,
      firebaseUid: authenticatedUser.localId,
    };
  }

  await executeServerGraphql(touchUserLastLoginMutation, {
    id: applicationUser.id,
  }).catch(() => undefined);

  const expiresAt = new Date(Date.now() + Number(authenticatedUser.expiresIn) * 1000).toISOString();
  const now = new Date().toISOString();

  return {
    accessToken: authenticatedUser.idToken,
    refreshToken: authenticatedUser.refreshToken,
    expiresAt,
    user: {
      id: applicationUser.id,
      firebaseUid: applicationUser.firebaseUid,
      name: applicationUser.name,
      email: applicationUser.email,
      role: applicationUser.role,
      isActive: applicationUser.isActive,
      lastLoginAt: now,
      createdAt: applicationUser.createdAt,
      updatedAt: now,
    },
  };
};
