import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Session } from '@rh-ponto/auth';
import { AppError } from '@rh-ponto/core';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { getEmployeeAppServices } from '../lib/service-registry';
import { clearEmployeeSession, persistEmployeeSession, restoreEmployeeSession } from '../lib/session-storage';

interface AppSessionContextValue {
  isLoading: boolean;
  session: Session | null;
  signInAsEmployee: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AppSessionContext = createContext<AppSessionContextValue | undefined>(undefined);

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const services = getEmployeeAppServices();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const persistedSession = await restoreEmployeeSession();

        if (persistedSession?.user.role === 'employee') {
          setSession(persistedSession);
          return;
        }

        if (persistedSession) {
          await clearEmployeeSession();
        }

        const currentSession = await services.auth.getCurrentSessionUseCase.execute();

        if (currentSession?.user.role === 'employee') {
          setSession(currentSession);
          await persistEmployeeSession(currentSession);
        }
      } finally {
        setIsLoading(false);
      }
    };

    void restoreSession();
  }, [services.auth.getCurrentSessionUseCase]);

  const value = useMemo<AppSessionContextValue>(
    () => ({
      isLoading,
      session,
      async signInAsEmployee() {
        const nextSession = await services.auth.signInUseCase.execute({
          email: 'employee@empresa.com',
          password: 'employee123',
        });

        if (nextSession.user.role !== 'employee') {
          await services.auth.signOutUseCase.execute();
          throw new AppError('AUTH_INVALID_ROLE', 'A sessao retornada nao pertence ao app do funcionario.');
        }

        setSession(nextSession);
        await persistEmployeeSession(nextSession);
      },
      async signOut() {
        await services.auth.signOutUseCase.execute();
        setSession(null);
        await clearEmployeeSession();
      },
    }),
    [isLoading, services, session],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AppSessionContext.Provider value={value}>{children}</AppSessionContext.Provider>
    </QueryClientProvider>
  );
};

export const useAppSession = () => {
  const context = useContext(AppSessionContext);

  if (!context) {
    throw new Error('useAppSession must be used within AppProviders.');
  }

  return context;
};
