import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Session } from '@rh-ponto/auth';
import { AppError } from '@rh-ponto/core';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { getEmployeeAppServices } from '../lib/service-registry';
import { clearEmployeeSession, persistEmployeeSession, restoreEmployeeSession } from '../lib/session-storage';

interface AppSessionContextValue {
  backendMode: 'firebase';
  isLoading: boolean;
  session: Session | null;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AppSessionContext = createContext<AppSessionContextValue | undefined>(undefined);

const isUnauthorizedSessionError = (error: unknown) => {
  if (error instanceof AppError) {
    return ['AUTH_UNAUTHORIZED', 'AUTH_USER_NOT_FOUND', 'AUTH_INACTIVE_USER'].includes(error.code);
  }

  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    message.includes('unauthenticated') ||
    message.includes('auth rejected') ||
    message.includes('requires a signed-in user') ||
    message.includes('401')
  );
};

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  const resetSessionRef = useRef<(() => Promise<void>) | null>(null);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            if (isUnauthorizedSessionError(error)) {
              void resetSessionRef.current?.();
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            if (isUnauthorizedSessionError(error)) {
              void resetSessionRef.current?.();
            }
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 3,
            gcTime: 1000 * 60 * 30,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const services = useMemo(() => getEmployeeAppServices(), []);

  useEffect(() => {
    resetSessionRef.current = async () => {
      setSession(null);
      await clearEmployeeSession();
      await services.auth.signOutUseCase.execute().catch(() => undefined);
      queryClient.clear();
    };

    return () => {
      resetSessionRef.current = null;
    };
  }, [queryClient, services]);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const persistedSession = await restoreEmployeeSession();

        const currentSession = await services.auth.getCurrentSessionUseCase.execute().catch(async (error) => {
          if (isUnauthorizedSessionError(error)) {
            await clearEmployeeSession();
            return null;
          }

          throw error;
        });

        if (currentSession?.user.role === 'employee') {
          setSession(currentSession);
          await persistEmployeeSession(currentSession);
          return;
        }

        setSession(null);

        if (persistedSession) {
          await clearEmployeeSession();
          await services.auth.signOutUseCase.execute().catch(() => undefined);
        }
      } catch {
        setSession(null);
        await clearEmployeeSession();
        await services.auth.signOutUseCase.execute().catch(() => undefined);
      } finally {
        setIsLoading(false);
      }
    };

    void restoreSession();
  }, [services]);

  const value = useMemo<AppSessionContextValue>(
    () => ({
      backendMode: services.runtime.backendMode,
      isLoading,
      session,
      async signIn(credentials) {
        const nextSession = await services.auth.signInUseCase.execute(credentials);

        if (nextSession.user.role !== 'employee') {
          await services.auth.signOutUseCase.execute();
          throw new AppError('AUTH_INVALID_ROLE', 'A sessão retornada não pertence ao app do funcionário.');
        }

        setSession(nextSession);
        await persistEmployeeSession(nextSession);
      },
      async signOut() {
        await services.auth.signOutUseCase.execute();
        setSession(null);
        await clearEmployeeSession();
        queryClient.clear();
      },
    }),
    [isLoading, queryClient, services, session],
  );

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AppSessionContext.Provider value={value}>{children}</AppSessionContext.Provider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

export const useAppSession = () => {
  const context = useContext(AppSessionContext);

  if (!context) {
    throw new Error('useAppSession must be used within AppProviders.');
  }

  return context;
};
