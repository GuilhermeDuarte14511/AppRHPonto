import { describe, expect, it, vi } from 'vitest';

import { getLoginReasonMessage, isAdminSession, isSessionExpired, resolvePostLoginRoute } from './auth-routes';

describe('auth-routes', () => {
  it('resolve a rota protegida para admins quando o next e valido', () => {
    const route = resolvePostLoginRoute(
      {
        accessToken: 'token',
        expiresAt: '2099-01-01T00:00:00.000Z',
        refreshToken: null,
        user: {
          id: 'user-1',
          firebaseUid: 'firebase-1',
          name: 'Caio Almeida',
          email: 'admin@empresa.com',
          role: 'admin',
          isActive: true,
          lastLoginAt: null,
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z',
        },
      },
      '/employees/new',
    );

    expect(route).toBe('/employees/new');
  });

  it('redireciona perfis nao administrativos para a rota adequada', () => {
    const route = resolvePostLoginRoute(
      {
        accessToken: 'token',
        expiresAt: '2099-01-01T00:00:00.000Z',
        refreshToken: null,
        user: {
          id: 'user-2',
          firebaseUid: 'firebase-2',
          name: 'João',
          email: 'employee@empresa.com',
          role: 'employee',
          isActive: true,
          lastLoginAt: null,
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z',
        },
      },
      '/employees',
    );

    expect(route).toBe('/login?reason=employee-role');
  });

  it('detecta expiração de sessao com base no relogio atual', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-04T12:00:00.000Z'));

    expect(isSessionExpired({ expiresAt: '2026-04-04T11:59:59.000Z' })).toBe(true);
    expect(isSessionExpired({ expiresAt: '2026-04-04T12:30:00.000Z' })).toBe(false);

    vi.useRealTimers();
  });

  it('reconhece sessao administrativa ativa', () => {
    expect(
      isAdminSession({
        user: {
          id: 'user-1',
          firebaseUid: 'firebase-1',
          name: 'Caio Almeida',
          email: 'admin@empresa.com',
          role: 'admin',
          isActive: true,
          lastLoginAt: null,
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z',
        },
      }),
    ).toBe(true);

    expect(
      isAdminSession({
        user: {
          id: 'user-2',
          firebaseUid: 'firebase-2',
          name: 'João',
          email: 'employee@empresa.com',
          role: 'employee',
          isActive: true,
          lastLoginAt: null,
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z',
        },
      }),
    ).toBe(false);
  });

  it('retorna mensagens amigaveis de motivo no login', () => {
    expect(getLoginReasonMessage('session-expired')).toContain('sessão expirou');
    expect(getLoginReasonMessage('unauthorized')).toContain('não tem permissão');
    expect(getLoginReasonMessage('unknown')).toBeNull();
  });
});
