import { Suspense } from 'react';

import { LoginScreen } from '@/features/auth/components/login-screen';
import { AuthTransitionScreen } from '@/shared/components/auth-transition-screen';
import { PublicOnlyGuard } from '@/shared/guards/public-only-guard';

const LoginPage = () => (
  <Suspense
    fallback={
      <AuthTransitionScreen
        title="Preparando a autenticação"
        description="Estamos organizando os parâmetros de acesso antes de exibir a tela de entrada."
      />
    }
  >
    <PublicOnlyGuard>
      <LoginScreen />
    </PublicOnlyGuard>
  </Suspense>
);

export default LoginPage;
