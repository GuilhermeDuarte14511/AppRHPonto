import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppSession } from '@/shared/providers/app-providers';
import { mobileTheme } from '@/shared/theme/tokens';

export const MobileLoginScreen = () => {
  const { signInAsEmployee } = useAppSession();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>APP DO FUNCIONARIO</Text>
        <Text style={styles.title}>Acesse sua jornada de trabalho</Text>
        <Text style={styles.description}>
          Estrutura inicial pronta para histórico de marcações, justificativas e perfil.
        </Text>
        <Pressable
          style={styles.button}
          onPress={async () => {
            await signInAsEmployee();
            router.replace('/(tabs)');
          }}
        >
          <Text style={styles.buttonText}>Entrar com conta mockada</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mobileTheme.background,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    borderRadius: 24,
    backgroundColor: mobileTheme.surface,
    padding: 24,
    gap: 14,
  },
  eyebrow: {
    color: mobileTheme.primary,
    fontWeight: '700',
    letterSpacing: 1.8,
    fontSize: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: mobileTheme.text,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: mobileTheme.mutedText,
  },
  button: {
    marginTop: 10,
    borderRadius: 16,
    backgroundColor: mobileTheme.primary,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});

