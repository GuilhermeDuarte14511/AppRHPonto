import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/shared/components/app-icon';
import { mobileTheme } from '@/shared/theme/tokens';

import {
  formatTimeRecordDateTime,
  resolveNextTimeRecordTypeAfter,
  timeRecordStatusLabels,
  timeRecordTypeLabels,
} from '../lib/time-record-mobile';

const statusPalette = {
  valid: {
    accent: mobileTheme.success,
    soft: mobileTheme.successSoft,
    icon: 'checkmark-circle',
    title: 'Ponto registrado com sucesso',
    description: 'Seu registro já entrou no histórico da jornada.',
  },
  pending_review: {
    accent: mobileTheme.warning,
    soft: mobileTheme.warningSoft,
    icon: 'alert-circle',
    title: 'Ponto enviado para revisão',
    description: 'A batida foi aceita, mas ficará sinalizada para conferência do RH.',
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
    description: 'Esse retorno não é esperado para uma nova batida.',
  },
} as const;

export const PunchConfirmationScreen = () => {
  const params = useLocalSearchParams<{
    status?: keyof typeof statusPalette;
    type?: keyof typeof timeRecordTypeLabels;
    recordedAt?: string;
    locationName?: string;
    reason?: string;
    reviewReasonTitle?: string;
    reviewReasonDescription?: string;
    nextStepLabel?: string;
    coordinates?: string;
    address?: string;
  }>();

  const statusKey = params.status && params.status in statusPalette ? params.status : 'valid';
  const palette = statusPalette[statusKey];
  const typeLabel = params.type && params.type in timeRecordTypeLabels ? timeRecordTypeLabels[params.type] : 'Registro';
  const recordedAtLabel = params.recordedAt ? formatTimeRecordDateTime(params.recordedAt) : 'Agora mesmo';
  const nextExpectedType =
    params.type && params.type in timeRecordTypeLabels ? resolveNextTimeRecordTypeAfter(params.type) : null;

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <View style={styles.hero}>
        <View style={[styles.iconWrap, { backgroundColor: palette.soft }]}>
          <AppIcon color={palette.accent} name={palette.icon} size={44} />
        </View>
        <Text style={styles.title}>{palette.title}</Text>
        <Text style={styles.subtitle}>{palette.description}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.eyebrow}>Resumo da marcação</Text>
        <Row label="Tipo selecionado" value={typeLabel} />
        <Row label="Status" value={timeRecordStatusLabels[statusKey]} />
        <Row label="Horário" value={recordedAtLabel} />
        <Row
          label="Próxima etapa"
          value={params.nextStepLabel || (nextExpectedType ? timeRecordTypeLabels[nextExpectedType] : 'Jornada concluída')}
        />
        {params.locationName ? <Row label="Local validado" value={params.locationName} /> : null}
        {params.coordinates ? <Row label="Coordenadas" value={params.coordinates} /> : null}
        {params.address ? <Row label="Endereço" value={params.address} multiline /> : null}
      </View>

      {params.reason ? (
        <View style={styles.card}>
          <Text style={styles.eyebrow}>Contexto da validação</Text>
          <Text style={styles.reason}>{params.reason}</Text>
          {params.reviewReasonTitle ? (
            <>
              <Text style={styles.eyebrow}>Motivo operacional</Text>
              <Text style={styles.reasonTitle}>{params.reviewReasonTitle}</Text>
            </>
          ) : null}
          {params.reviewReasonDescription ? <Text style={styles.reason}>{params.reviewReasonDescription}</Text> : null}
        </View>
      ) : null}

      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.primaryButtonText}>Voltar ao início</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => router.replace('/(tabs)/time-records')}>
          <Text style={styles.secondaryButtonText}>Ver histórico</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const Row = ({ label, value, multiline = false }: { label: string; value: string; multiline?: boolean }) => (
  <View style={[styles.row, multiline && styles.rowColumn]}>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, multiline && styles.valueMultiline]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: mobileTheme.background },
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  hero: { borderRadius: 28, backgroundColor: mobileTheme.surfaceRaised, padding: 24, alignItems: 'center', gap: 10 },
  iconWrap: { width: 88, height: 88, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '900', color: mobileTheme.text, textAlign: 'center' },
  subtitle: { fontSize: 14, lineHeight: 21, color: mobileTheme.mutedText, textAlign: 'center' },
  card: { borderRadius: 24, backgroundColor: mobileTheme.surfaceRaised, padding: 20, gap: 12 },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', color: mobileTheme.primary },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  rowColumn: { alignItems: 'flex-start', flexDirection: 'column' },
  label: { fontSize: 12, fontWeight: '700', color: mobileTheme.mutedText },
  value: { flex: 1, textAlign: 'right', fontSize: 14, fontWeight: '700', color: mobileTheme.text },
  valueMultiline: { textAlign: 'left', width: '100%' },
  reason: { fontSize: 14, lineHeight: 21, color: mobileTheme.mutedText },
  reasonTitle: { fontSize: 14, fontWeight: '800', color: mobileTheme.text },
  actions: { gap: 12 },
  primaryButton: {
    minHeight: 54,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mobileTheme.primary,
  },
  primaryButtonText: { fontSize: 15, fontWeight: '800', color: '#ffffff' },
  secondaryButton: {
    minHeight: 54,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mobileTheme.surfaceRaised,
  },
  secondaryButtonText: { fontSize: 15, fontWeight: '800', color: mobileTheme.text },
});
