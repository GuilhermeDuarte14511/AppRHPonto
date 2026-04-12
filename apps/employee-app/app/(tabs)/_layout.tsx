import { Redirect, Tabs } from 'expo-router';

import { AppIcon } from '@/shared/components/app-icon';
import { AuthTransitionScreen } from '@/shared/components/auth-transition-screen';
import { useAppSession } from '@/shared/providers/app-providers';
import { mobileTheme } from '@/shared/theme/tokens';

const iconByRouteName = {
  index: ['home', 'home-outline'],
  'time-records': ['time', 'time-outline'],
  justifications: ['document-text', 'document-text-outline'],
  profile: ['person-circle', 'person-circle-outline'],
} as const;

const titleByRouteName = {
  index: 'Início',
  'time-records': 'Marcações',
  justifications: 'Justificativas',
  profile: 'Perfil',
} as const;

const TabsLayout = () => {
  const { isLoading, session } = useAppSession();

  if (isLoading) {
    return (
      <AuthTransitionScreen
        title="Preparando seu aplicativo"
        description="Estamos organizando sua jornada, histórico e dados de acesso."
      />
    );
  }

  if (!session || session.user.role !== 'employee') {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={({ route }) => {
        const [focusedIcon, defaultIcon] = iconByRouteName[route.name as keyof typeof iconByRouteName];

        return {
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: mobileTheme.primary,
          tabBarInactiveTintColor: mobileTheme.subtleText,
          tabBarStyle: {
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 18,
            height: 78,
            borderTopWidth: 0,
            borderRadius: 28,
            backgroundColor: 'rgba(255,255,255,0.92)',
            paddingTop: 10,
            paddingBottom: 10,
            shadowColor: mobileTheme.primary,
            shadowOpacity: 0.08,
            shadowRadius: 24,
            shadowOffset: {
              width: 0,
              height: 12,
            },
            elevation: 8,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '700',
            letterSpacing: 0.6,
            marginTop: 2,
          },
          tabBarIcon: ({ color, focused }) => (
            <AppIcon
              color={color}
              name={focused ? focusedIcon : defaultIcon}
              size={focused ? 22 : 20}
            />
          ),
          tabBarItemStyle: {
            borderRadius: 20,
            marginHorizontal: 4,
          },
          sceneStyle: {
            backgroundColor: mobileTheme.background,
          },
          title: titleByRouteName[route.name as keyof typeof titleByRouteName],
        };
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="time-records" />
      <Tabs.Screen name="justifications" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
};

export default TabsLayout;
