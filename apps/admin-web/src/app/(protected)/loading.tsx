import { AuthTransitionScreen } from '@/shared/components/auth-transition-screen';

const ProtectedLoading = () => (
  <AuthTransitionScreen
    title="Abrindo o painel"
    description="Estamos preparando a próxima tela com os dados operacionais mais recentes."
    helperText="Você já pode acompanhar a navegação no topo da página."
  />
);

export default ProtectedLoading;
