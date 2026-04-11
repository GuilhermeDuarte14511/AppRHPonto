import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { SessionProvider, useSession } from './session-provider';

const authApiMocks = vi.hoisted(() => ({
  fetchAdminSession: vi.fn(),
  signInWithAdminSession: vi.fn(),
  signOutWithAdminSession: vi.fn(),
  waitForFirebaseClientAuth: vi.fn(),
  getCurrentFirebaseClientUser: vi.fn(),
}));

vi.mock('@rh-ponto/auth', () => ({
  SessionMapperService: class SessionMapperService {
    toDomain<T>(value: T) {
      return value;
    }
  },
}));

vi.mock('@/features/auth/lib/admin-auth-api', () => ({
  fetchAdminSession: authApiMocks.fetchAdminSession,
  signInWithAdminSession: authApiMocks.signInWithAdminSession,
  signOutWithAdminSession: authApiMocks.signOutWithAdminSession,
  waitForFirebaseClientAuth: authApiMocks.waitForFirebaseClientAuth,
  getCurrentFirebaseClientUser: authApiMocks.getCurrentFirebaseClientUser,
}));

const sessionDto = {
  accessToken: 'token',
  refreshToken: 'refresh',
  expiresAt: '2099-01-01T00:00:00.000Z',
  user: {
    id: 'user-1',
    firebaseUid: 'firebase-1',
    name: 'Caio Almeida',
    email: 'admin@empresa.com',
    role: 'admin' as const,
    isActive: true,
    lastLoginAt: '2026-04-04T12:00:00.000Z',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2026-04-04T12:00:00.000Z',
  },
};

const SessionConsumer = () => {
  const { isLoading, session, signIn, signOut } = useSession();

  return (
    <div>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="user-email">{session?.user.email ?? 'sem-sessao'}</span>
      <button onClick={() => void signIn({ email: 'admin@empresa.com', password: 'admin123' })}>entrar</button>
      <button onClick={() => void signOut()}>sair</button>
    </div>
  );
};

describe('SessionProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('restaura a sessao quando o firebase client corresponde ao usuario do cookie', async () => {
    authApiMocks.fetchAdminSession.mockResolvedValue(sessionDto);
    authApiMocks.waitForFirebaseClientAuth.mockResolvedValue(sessionDto);
    authApiMocks.getCurrentFirebaseClientUser.mockResolvedValue({
      email: 'admin@empresa.com',
    });

    render(
      <SessionProvider>
        <SessionConsumer />
      </SessionProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('user-email')).toHaveTextContent('admin@empresa.com');
  });

  it('descarta a sessao web quando o firebase auth nao esta sincronizado', async () => {
    authApiMocks.fetchAdminSession.mockResolvedValue(sessionDto);
    authApiMocks.waitForFirebaseClientAuth.mockResolvedValue(null);
    authApiMocks.getCurrentFirebaseClientUser.mockResolvedValue(null);
    authApiMocks.signOutWithAdminSession.mockResolvedValue(undefined);

    render(
      <SessionProvider>
        <SessionConsumer />
      </SessionProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    expect(authApiMocks.signOutWithAdminSession).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('user-email')).toHaveTextContent('sem-sessao');
  });

  it('atualiza a sessao apos login e limpa apos logout', async () => {
    authApiMocks.fetchAdminSession.mockResolvedValue(null);
    authApiMocks.signInWithAdminSession.mockResolvedValue(sessionDto);
    authApiMocks.signOutWithAdminSession.mockResolvedValue(undefined);

    const user = userEvent.setup();

    render(
      <SessionProvider>
        <SessionConsumer />
      </SessionProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    await user.click(screen.getByRole('button', { name: 'entrar' }));
    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('admin@empresa.com');
    });

    await user.click(screen.getByRole('button', { name: 'sair' }));
    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('sem-sessao');
    });
  });
});
