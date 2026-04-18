'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { resolveRoleHomeRoute } from '@/features/auth/lib/auth-routes';
import { services } from '@/shared/lib/service-registry';

import { AuthTransitionScreen } from '../components/auth-transition-screen';
import { useSession } from '../providers/session-provider';

export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoading, session, signOut } = useSession();
  const hasAdminAccess = session ? services.auth.accessControlService.canAccessAdmin(session.user) : false;

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!session) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!hasAdminAccess) {
      void signOut().finally(() => {
        router.replace(resolveRoleHomeRoute(session.user.role));
      });
    }
  }, [hasAdminAccess, isLoading, pathname, router, session, signOut]);

  if (isLoading) {
    return (
      <AuthTransitionScreen
        title="Validando sua sessão"
        description="Estamos confirmando suas permissões e sincronizando o acesso ao ambiente administrativo."
      />
    );
  }

  if (!session || !hasAdminAccess) {
    return (
      <AuthTransitionScreen
        title="Redirecionando seu acesso"
        description="Estamos encaminhando você para a rota correta de acordo com o perfil autenticado."
        helperText="Você será levado automaticamente para a próxima etapa."
      />
    );
  }

  return <>{children}</>;
};
