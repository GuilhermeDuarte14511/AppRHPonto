'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { resolvePostLoginRoute, resolveRoleHomeRoute } from '@/features/auth/lib/auth-routes';

import { AuthTransitionScreen } from '../components/auth-transition-screen';
import { useSession } from '../providers/session-provider';

export const PublicOnlyGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading, session, signOut } = useSession();

  useEffect(() => {
    if (isLoading || !session) {
      return;
    }

    if (session.user.role !== 'admin') {
      void signOut().finally(() => {
        router.replace(resolveRoleHomeRoute(session.user.role));
      });
      return;
    }

    router.replace(resolvePostLoginRoute(session, searchParams.get('next')));
  }, [isLoading, router, searchParams, session, signOut]);

  if (isLoading) {
    return (
      <AuthTransitionScreen
        title="Preparando seu acesso"
        description="Estamos verificando se já existe uma sessão ativa antes de carregar a tela de entrada."
      />
    );
  }

  if (session) {
    return (
      <AuthTransitionScreen
        title="Redirecionando seu acesso"
        description="Encontramos uma sessão ativa e vamos abrir a área correta para você."
        helperText="Isso acontece automaticamente."
      />
    );
  }

  return <>{children}</>;
};
