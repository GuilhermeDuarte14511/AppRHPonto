import { Redirect, Stack } from 'expo-router';

import { AuthTransitionScreen } from '@/shared/components/auth-transition-screen';
import { useAppSession } from '@/shared/providers/app-providers';

const AuthLayout = () => {
  const { isLoading, session } = useAppSession();

  if (isLoading) {
    return <AuthTransitionScreen title="Restaurando sessão" description="Estamos verificando seu acesso antes de abrir o aplicativo." />;
  }

  if (session?.user.role === 'employee') {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default AuthLayout;
