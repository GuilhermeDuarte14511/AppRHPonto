import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AppProviders } from '@/shared/providers/app-providers';

const RootLayout = () => (
  <AppProviders>
    <StatusBar style="dark" />
    <Stack screenOptions={{ headerShown: false }} />
  </AppProviders>
);

export default RootLayout;

