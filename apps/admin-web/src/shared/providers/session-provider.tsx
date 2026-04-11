'use client';

import { SessionMapperService, type Session } from '@rh-ponto/auth';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import {
  fetchAdminSession,
  getCurrentFirebaseClientUser,
  signInWithAdminSession,
  signOutWithAdminSession,
  waitForFirebaseClientAuth,
} from '@/features/auth/lib/admin-auth-api';
import { resolvePostLoginRoute } from '@/features/auth/lib/auth-routes';

interface SessionContextValue {
  isLoading: boolean;
  session: Session | null;
  signIn: (payload: { email: string; password: string }) => Promise<Session>;
  signOut: () => Promise<void>;
  resolveHomeRoute: (nextPath?: string | null) => string;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);
const sessionMapper = new SessionMapperService();

const hasMatchingFirebaseUser = async (session: Session | null): Promise<boolean> => {
  if (!session) {
    return false;
  }

  await waitForFirebaseClientAuth();
  const currentUser = await getCurrentFirebaseClientUser();

  return currentUser?.email === session.user.email;
};

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const currentSession = await fetchAdminSession();
        const mappedSession = currentSession ? sessionMapper.toDomain(currentSession) : null;

        if (!mappedSession) {
          setSession(null);
          return;
        }

        const hasFirebaseSession = await hasMatchingFirebaseUser(mappedSession);

        if (!hasFirebaseSession) {
          await signOutWithAdminSession().catch(() => undefined);
          setSession(null);
          return;
        }

        setSession(mappedSession);
      } finally {
        setIsLoading(false);
      }
    };

    void restoreSession();
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      isLoading,
      session,
      resolveHomeRoute(nextPath) {
        if (!session) {
          return '/login';
        }

        return resolvePostLoginRoute(session, nextPath);
      },
      async signIn(payload) {
        const nextSession = sessionMapper.toDomain(await signInWithAdminSession(payload));
        setSession(nextSession);
        return nextSession;
      },
      async signOut() {
        await signOutWithAdminSession();
        setSession(null);
      },
    }),
    [isLoading, session],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = (): SessionContextValue => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSession must be used within SessionProvider.');
  }

  return context;
};
