import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Session } from '@rh-ponto/auth';
import { AppError } from '@rh-ponto/core';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { getKioskAppServices } from '../lib/service-registry';
import { clearKioskSession, persistKioskSession, restoreKioskSession } from '../lib/session-storage';

interface KioskSessionContextValue {
  isLoading: boolean;
  session: Session | null;
  signInAsKiosk: () => Promise<void>;
  signOut: () => Promise<void>;
}

const KioskSessionContext = createContext<KioskSessionContextValue | undefined>(undefined);

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const services = getKioskAppServices();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const persistedSession = await restoreKioskSession();

        if (persistedSession?.user.role === 'kiosk') {
          setSession(persistedSession);
          return;
        }

        if (persistedSession) {
          await clearKioskSession();
        }

        const currentSession = await services.auth.getCurrentSessionUseCase.execute();

        if (currentSession?.user.role === 'kiosk') {
          setSession(currentSession);
          await persistKioskSession(currentSession);
        }
      } finally {
        setIsLoading(false);
      }
    };

    void restoreSession();
  }, [services.auth.getCurrentSessionUseCase]);

  const value = useMemo<KioskSessionContextValue>(
    () => ({
      isLoading,
      session,
      async signInAsKiosk() {
        const nextSession = await services.auth.signInUseCase.execute({
          email: 'kiosk@empresa.com',
          password: 'kiosk123',
        });

        if (nextSession.user.role !== 'kiosk') {
          await services.auth.signOutUseCase.execute();
          throw new AppError('AUTH_INVALID_ROLE', 'A sessao retornada nao pertence ao app de kiosk.');
        }

        setSession(nextSession);
        await persistKioskSession(nextSession);
      },
      async signOut() {
        await services.auth.signOutUseCase.execute();
        setSession(null);
        await clearKioskSession();
      },
    }),
    [isLoading, services, session],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <KioskSessionContext.Provider value={value}>{children}</KioskSessionContext.Provider>
    </QueryClientProvider>
  );
};

export const useKioskSession = () => {
  const context = useContext(KioskSessionContext);

  if (!context) {
    throw new Error('useKioskSession must be used within AppProviders.');
  }

  return context;
};
