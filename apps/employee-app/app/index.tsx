import { Redirect } from 'expo-router';

import { AuthTransitionScreen } from '@/shared/components/auth-transition-screen';
import { useAppSession } from '@/shared/providers/app-providers';

const IndexScreen = () => {
  const { isLoading, session } = useAppSession();

  if (isLoading) {
    return <AuthTransitionScreen />;
  }

  if (session?.user.role === 'employee') {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
};

export default IndexScreen;
