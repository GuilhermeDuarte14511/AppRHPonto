import type { SessionDto } from '@rh-ponto/auth';

import { ADMIN_SESSION_COOKIE_MAX_AGE_SECONDS, ADMIN_SESSION_COOKIE_NAME } from './auth-routes';

const encoder = new TextEncoder();
const defaultDevSecret = 'rh-ponto-admin-dev-secret';

const getSessionSecret = (): string => {
  const configuredSecret = process.env.ADMIN_SESSION_SECRET?.trim();

  if (configuredSecret) {
    return configuredSecret;
  }

  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    return defaultDevSecret;
  }

  throw new Error('ADMIN_SESSION_SECRET must be configured.');
};

const encodeBase64Url = (value: string): string => {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(value, 'utf8')
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
  }

  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const decodeBase64Url = (value: string): string => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4 || 4)) % 4);

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(padded, 'base64').toString('utf8');
  }

  return atob(padded);
};

const signPayload = async (payload: string): Promise<string> => {
  const secret = getSessionSecret();
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    {
      name: 'HMAC',
      hash: 'SHA-256',
    },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(payload));
  const signatureBytes = Array.from(new Uint8Array(signature))
    .map((byte) => String.fromCharCode(byte))
    .join('');

  return encodeBase64Url(signatureBytes);
};

const verifySignature = async (payload: string, signature: string): Promise<boolean> => {
  const expectedSignature = await signPayload(payload);

  return expectedSignature === signature;
};

export const createAdminSessionCookieValue = async (session: SessionDto): Promise<string> => {
  const payload = encodeBase64Url(JSON.stringify(session));
  const signature = await signPayload(payload);

  return `${payload}.${signature}`;
};

export const parseAdminSessionCookieValue = async (value: string | undefined): Promise<SessionDto | null> => {
  if (!value) {
    return null;
  }

  const [payload, signature] = value.split('.');

  if (!payload || !signature) {
    return null;
  }

  const isValidSignature = await verifySignature(payload, signature);

  if (!isValidSignature) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(payload)) as SessionDto;
  } catch {
    return null;
  }
};

export const buildAdminSessionCookie = async (session: SessionDto) => ({
  name: ADMIN_SESSION_COOKIE_NAME,
  value: await createAdminSessionCookieValue(session),
  httpOnly: true,
  path: '/',
  sameSite: 'lax' as const,
  maxAge: ADMIN_SESSION_COOKIE_MAX_AGE_SECONDS,
  secure: process.env.NODE_ENV === 'production',
});

export const buildClearedAdminSessionCookie = () => ({
  name: ADMIN_SESSION_COOKIE_NAME,
  value: '',
  httpOnly: true,
  path: '/',
  sameSite: 'lax' as const,
  maxAge: 0,
  secure: process.env.NODE_ENV === 'production',
});
