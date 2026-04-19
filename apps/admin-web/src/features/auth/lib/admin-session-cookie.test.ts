import type { SessionDto } from '@rh-ponto/auth';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const sampleSession: SessionDto = {
  accessToken: 'access-token',
  refreshToken: null,
  expiresAt: '2099-01-01T00:00:00.000Z',
  user: {
    id: 'user-1',
    firebaseUid: 'firebase-user-1',
    name: 'Admin User',
    email: 'admin@empresa.com',
    role: 'admin',
    isActive: true,
    lastLoginAt: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
};

describe('admin-session-cookie', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    vi.stubEnv('ADMIN_SESSION_SECRET', undefined);
  });

  afterEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it('falha em production quando ADMIN_SESSION_SECRET nao foi configurado', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    const { createAdminSessionCookieValue } = await import('./admin-session-cookie');

    await expect(createAdminSessionCookieValue(sampleSession)).rejects.toThrow('ADMIN_SESSION_SECRET');
  });

  it('usa um fallback estavel em development para permitir leitura da mesma sessao entre requests', async () => {
    vi.stubEnv('NODE_ENV', 'development');

    const { createAdminSessionCookieValue, parseAdminSessionCookieValue } = await import('./admin-session-cookie');

    const cookieValue = await createAdminSessionCookieValue(sampleSession);
    const parsedSession = await parseAdminSessionCookieValue(cookieValue);

    expect(parsedSession).toEqual(sampleSession);
  });
});
