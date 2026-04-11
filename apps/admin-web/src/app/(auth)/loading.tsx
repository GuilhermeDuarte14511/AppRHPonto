import { AuthTransitionScreen } from '@/shared/components/auth-transition-screen';

const AuthLoading = () => (
  <AuthTransitionScreen
    title="Preparando acesso"
    description="Estamos carregando a autenticação e os recursos essenciais da sessão."
    helperText="Isso costuma ser bem rápido."
  />
);

export default AuthLoading;
