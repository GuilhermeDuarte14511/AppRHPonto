import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { kioskTheme } from '@/shared/theme/tokens';

const statusLabels = {
  allowed: 'Registrado com sucesso',
  pending_review: 'Registrado com revisão',
  blocked: 'Registro bloqueado',
} as const;

export const SuccessScreen = () => {
  const params = useLocalSearchParams<{
    employeeName?: string;
    policyName?: string;
    status?: keyof typeof statusLabels;
    title?: string;
    description?: string;
    coordinates?: string;
  }>();

  const status = params.status && params.status in statusLabels ? params.status : 'allowed';

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>{statusLabels[status]}</Text>
        <Text style={styles.title}>{params.employeeName ?? 'Colaborador'}</Text>
        <Text style={styles.description}>
          {params.title ?? 'Batida concluída.'} {params.description ?? 'O tablet concluiu o fluxo operacional da marcação.'}
        </Text>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Política aplicada</Text>
          <Text style={styles.summaryValue}>{params.policyName ?? 'Política operacional'}</Text>
          <Text style={styles.summaryLabel}>Coordenadas</Text>
          <Text selectable style={styles.summaryValue}>
            {params.coordinates ?? 'Não informadas'}
          </Text>
        </View>

        <Pressable style={styles.button} onPress={() => router.replace('/(flow)/punch')}>
          <Text style={styles.buttonText}>Voltar para a tela inicial</Text>
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
    borderWidth: 1,
    borderColor: kioskTheme.border,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#67e8f9',
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
  summaryBox: {
    borderRadius: 20,
    backgroundColor: '#0b1820',
    padding: 18,
    gap: 6,
  },
  summaryLabel: {
    color: kioskTheme.mutedText,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '700',
  },
  summaryValue: {
    color: kioskTheme.text,
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    marginTop: 8,
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
