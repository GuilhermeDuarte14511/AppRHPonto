import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useKioskSession } from '@/shared/providers/app-providers';
import { kioskTheme } from '@/shared/theme/tokens';

export const DeviceAuthScreen = () => {
  const { signInAsKiosk } = useKioskSession();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>KIOSK / TABLET</Text>
        <Text style={styles.title}>Autenticar dispositivo</Text>
        <Text style={styles.description}>
          Estrutura pronta para autenticação do tablet, captura de foto e fluxo simplificado de ponto.
        </Text>
        <Pressable
          style={styles.button}
          onPress={async () => {
            await signInAsKiosk();
            router.replace('/(flow)/punch');
          }}
        >
          <Text style={styles.buttonText}>Ativar dispositivo mockado</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: kioskTheme.background,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    borderRadius: 28,
    backgroundColor: kioskTheme.surface,
    padding: 28,
    gap: 16,
  },
  eyebrow: {
    color: '#5eead4',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: kioskTheme.text,
  },
  description: {
    color: kioskTheme.mutedText,
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    marginTop: 12,
    borderRadius: 18,
    backgroundColor: kioskTheme.primary,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});

