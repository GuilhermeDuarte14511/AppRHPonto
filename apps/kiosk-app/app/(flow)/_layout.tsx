import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { useKioskSession } from '@/shared/providers/app-providers';
import { kioskTheme } from '@/shared/theme/tokens';

const FlowLayout = () => {
  const { isLoading, session } = useKioskSession();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: kioskTheme.background,
        }}
      >
        <ActivityIndicator color={kioskTheme.primary} />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  if (session.user.role !== 'kiosk') {
    return <Redirect href="/(auth)/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default FlowLayout;
