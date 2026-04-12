import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/shared/components/app-icon';
import { mobileTheme } from '@/shared/theme/tokens';

import { formatTimeRecordDateTime, timeRecordStatusLabels, timeRecordTypeLabels } from '../lib/time-record-mobile';

const statusPalette = {
  valid: {
    accent: mobileTheme.success,
    soft: mobileTheme.successSoft,
    icon: 'checkmark-circle',
    title: 'Ponto registrado com sucesso',
    description: 'Seu registro entrou na jornada atual e já está disponível para consulta.',
  },
  pending_review: {
    accent: mobileTheme.warning,
    soft: mobileTheme.warningSoft,
    icon: 'alert-circle',
    title: 'Ponto enviado para revisão',
    description: 'O RH poderá revisar essa batida antes da validação final.',
  },
  adjusted: {
    accent: mobileTheme.primary,
    soft: mobileTheme.primarySoft,
    icon: 'refresh-circle',
    title: 'Ponto atualizado',
    description: 'A marcação foi registrada com atualização operacional.',
  },
  rejected: {
    accent: mobileTheme.danger,
    soft: mobileTheme.dangerSoft,
    icon: 'close-circle',
    title: 'Ponto rejeitado',
    description: 'Esse retorno não é esperado para uma nova batida, mas o registro foi consultado.',
  },
} as const;

export const PunchConfirmationScreen = () => {
  const params = useLocalSearchParams<{
    status?: keyof typeof statusPalette;
    type?: keyof typeof timeRecordTypeLabels;
    recordedAt?: string;
    locationName?: string;
    reason?: string;
  }>();

  const statusKey = params.status && params.status in statusPalette ? params.status : 'valid';
  const palette = statusPalette[statusKey];
  const typeLabel = params.type && params.type in timeRecordTypeLabels ? timeRecordTypeLabels[params.type] : 'Registro';
  const recordedAtLabel = params.recordedAt ? formatTimeRecordDateTime(params.recordedAt) : 'Agora mesmo';

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      style={styles.container}
    >
      <View style={styles.hero}>
        <View style={[styles.iconWrap, { backgroundColor: palette.soft }]}>
          <AppIcon color={palette.accent} name={palette.icon} size={44} />
        </View>
        <Text style={styles.title}>{palette.title}</Text>
        <Text style={styles.subtitle}>{palette.description}</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryEyebrow}>Resumo da marcação</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tipo</Text>
          <Text style={styles.summaryValue}>{typeLabel}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Status</Text>
          <Text style={styles.summaryValue}>{timeRecordStatusLabels[statusKey]}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Horário</Text>
          <Text style={styles.summaryValue}>{recordedAtLabel}</Text>
        </View>
        {params.locationName ? (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Local validado</Text>
            <Text style={styles.summaryValue}>{params.locationName}</Text>
          </View>
        ) : null}
      </View>

      {params.reason ? (
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <AppIcon color={palette.accent} name="information-circle-outline" size={18} />
            <Text style={styles.infoTitle}>Contexto da validação</Text>
          </View>
          <Text style={styles.infoText}>{params.reason}</Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={() => router.replace('/(tabs)/index')}>
          <Text style={styles.primaryButtonText}>Voltar ao início</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => router.replace('/(tabs)/time-records')}>
          <Text style={styles.secondaryButtonText}>Ver histórico</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mobileTheme.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 48,
    gap: 18,
  },
  hero: {
    borderRadius: 28,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 24,
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: mobileTheme.text,
    textAlign: 'center',
    letterSpacing: -0.7,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: mobileTheme.mutedText,
    textAlign: 'center',
  },
  summaryCard: {
    borderRadius: 24,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 20,
    gap: 12,
  },
  summaryEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: mobileTheme.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: mobileTheme.mutedText,
  },
  summaryValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '700',
    color: mobileTheme.text,
  },
  infoCard: {
    borderRadius: 24,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 20,
    gap: 10,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: mobileTheme.text,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 21,
    color: mobileTheme.mutedText,
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    minHeight: 54,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mobileTheme.primary,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  secondaryButton: {
    minHeight: 54,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mobileTheme.surfaceRaised,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: mobileTheme.text,
  },
});
