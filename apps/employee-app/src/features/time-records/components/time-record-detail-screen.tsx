import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/shared/components/app-icon';
import { MobileDetailSkeleton } from '@/shared/components/mobile-skeleton';
import { mobileTheme } from '@/shared/theme/tokens';

import { useTimeRecordDetail } from '../hooks/use-time-record-detail';
import {
  formatTimeRecordDate,
  formatTimeRecordDateTime,
  formatTimeRecordTime,
  resolveNextTimeRecordTypeAfter,
  timeRecordSourceLabels,
  timeRecordStatusDescriptions,
  timeRecordStatusLabels,
  timeRecordTypeLabels,
} from '../lib/time-record-mobile';

const statusPalette = {
  valid: {
    accent: mobileTheme.success,
    soft: mobileTheme.successSoft,
  },
  pending_review: {
    accent: mobileTheme.warning,
    soft: mobileTheme.warningSoft,
  },
  adjusted: {
    accent: mobileTheme.primary,
    soft: mobileTheme.primarySoft,
  },
  rejected: {
    accent: mobileTheme.danger,
    soft: mobileTheme.dangerSoft,
  },
} as const;

const formatCoordinates = (latitude?: number | null, longitude?: number | null) => {
  if (latitude == null || longitude == null) {
    return 'Coordenadas não registradas';
  }

  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
};

const buildAuditItems = (record: NonNullable<ReturnType<typeof useTimeRecordDetail>['record']>) => {
  const timeline = [
    {
      id: `${record.id}-recorded`,
      title: 'Registro criado',
      description: `Batida registrada em ${formatTimeRecordDateTime(record.recordedAt)}.`,
    },
  ];

  if (record.originalRecordedAt) {
    timeline.push({
      id: `${record.id}-original`,
      title: 'Horário original preservado',
      description: `Horário anterior: ${formatTimeRecordDateTime(record.originalRecordedAt)}.`,
    });
  }

  if (record.status === 'pending_review') {
    timeline.push({
      id: `${record.id}-review`,
      title: 'Encaminhado para revisão',
      description: 'O RH ou a liderança operacional poderão validar a ocorrência antes do fechamento.',
    });
  }

  if (record.status === 'adjusted') {
    timeline.push({
      id: `${record.id}-adjusted`,
      title: 'Registro ajustado',
      description: 'A marcação recebeu um ajuste posterior com histórico preservado.',
    });
  }

  if (record.status === 'rejected') {
    timeline.push({
      id: `${record.id}-rejected`,
      title: 'Registro rejeitado',
      description: 'A marcação foi rejeitada e pode exigir justificativa complementar.',
    });
  }

  return timeline;
};

export const TimeRecordDetailScreen = () => {
  const params = useLocalSearchParams<{ id?: string }>();
  const { record, timeRecordsQuery, photosQuery } = useTimeRecordDetail(params.id);

  if (timeRecordsQuery.isLoading) {
    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content} style={styles.container}>
        <MobileDetailSkeleton sectionCount={4} />
      </ScrollView>
    );
  }

  if (!record) {
    return (
      <View style={styles.loadingContainer}>
        <AppIcon color={mobileTheme.danger} name="alert-circle-outline" size={26} />
        <Text style={styles.loadingTitle}>Marcação não encontrada</Text>
        <Text style={styles.loadingText}>Esse registro pode não estar mais disponível no histórico atual.</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  const palette = statusPalette[record.status];
  const photo = photosQuery.data?.[0] ?? null;
  const auditItems = buildAuditItems(record);
  const nextExpectedType = resolveNextTimeRecordTypeAfter(record.recordType);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      style={styles.container}
    >
      <View style={styles.topBar}>
        <Pressable style={styles.topBarButton} onPress={() => router.back()}>
          <AppIcon color={mobileTheme.text} name="arrow-back-outline" size={20} />
        </Pressable>
        <Text style={styles.topBarTitle}>Detalhes da marcação</Text>
        <Pressable style={styles.topBarButton} onPress={() => router.push('/(tabs)/justifications')}>
          <AppIcon color={mobileTheme.text} name="document-text-outline" size={20} />
        </Pressable>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroEyebrow}>Horário registrado</Text>
        <Text style={styles.heroTime}>{formatTimeRecordTime(record.recordedAt)}</Text>
        <Text style={styles.heroDate}>{formatTimeRecordDate(record.recordedAt)}</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Resumo</Text>
            <View style={[styles.statusBadge, { backgroundColor: palette.soft }]}>
              <Text style={[styles.statusBadgeText, { color: palette.accent }]}>{timeRecordStatusLabels[record.status]}</Text>
            </View>
          </View>
          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tipo</Text>
              <Text style={styles.infoValue}>{timeRecordTypeLabels[record.recordType]}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Origem</Text>
              <Text style={styles.infoValue}>{timeRecordSourceLabels[record.source]}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Situação</Text>
              <Text style={styles.infoValue}>{timeRecordStatusDescriptions[record.status]}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>PrÃ³xima etapa</Text>
              <Text style={styles.infoValue}>
                {nextExpectedType ? timeRecordTypeLabels[nextExpectedType] : 'Jornada concluÃ­da'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Contexto</Text>
          </View>
          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Coordenadas</Text>
              <Text style={styles.infoValue}>{formatCoordinates(record.latitude, record.longitude)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Endereço</Text>
              <Text style={styles.infoValue}>{record.resolvedAddress ?? 'Endereço não informado'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>IP</Text>
              <Text style={styles.infoValue}>{record.ipAddress ?? 'Não informado'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Criação</Text>
              <Text style={styles.infoValue}>{formatTimeRecordDateTime(record.createdAt)}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Observação</Text>
        </View>
        <Text style={styles.bodyText}>{record.notes ?? 'Esse registro não recebeu observações adicionais.'}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Comprovação visual</Text>
        </View>
        {photosQuery.isLoading ? (
          <View style={styles.placeholder}>
            <ActivityIndicator color={mobileTheme.primary} />
            <Text style={styles.placeholderText}>Buscando imagens vinculadas à batida...</Text>
          </View>
        ) : photo ? (
          <View style={styles.photoWrap}>
            <Image source={{ uri: photo.fileUrl }} resizeMode="cover" style={styles.photo} />
            <View style={styles.photoMeta}>
              <Text style={styles.photoTitle}>{photo.fileName ?? 'Imagem da marcação'}</Text>
              <Text style={styles.photoText}>
                {photo.contentType ?? 'Imagem'} · {photo.isPrimary ? 'Arquivo principal' : 'Arquivo adicional'}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.placeholder}>
            <AppIcon color={mobileTheme.subtleText} name="image-outline" size={22} />
            <Text style={styles.placeholderText}>Esse registro não possui imagem vinculada.</Text>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Log de auditoria</Text>
        </View>
        <View style={styles.timeline}>
          {auditItems.map((item, index) => (
            <View key={item.id} style={styles.timelineRow}>
              <View style={styles.timelineRail}>
                <View style={styles.timelineDot} />
                {index < auditItems.length - 1 ? <View style={styles.timelineLine} /> : null}
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>{item.title}</Text>
                <Text style={styles.timelineText}>{item.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.primaryAction} onPress={() => router.push('/(tabs)/justifications')}>
          <AppIcon color="#ffffff" name="create-outline" size={18} />
          <Text style={styles.primaryActionText}>Solicitar ajuste</Text>
        </Pressable>
        <Pressable style={styles.secondaryAction} onPress={() => router.replace('/(tabs)/time-records')}>
          <Text style={styles.secondaryActionText}>Voltar ao histórico</Text>
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
    paddingTop: 12,
    paddingBottom: 40,
    gap: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 12,
    backgroundColor: mobileTheme.background,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: mobileTheme.text,
  },
  loadingText: {
    fontSize: 14,
    lineHeight: 21,
    color: mobileTheme.mutedText,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 8,
    minWidth: 120,
    minHeight: 46,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mobileTheme.primary,
  },
  backButtonText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mobileTheme.surfaceRaised,
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: mobileTheme.text,
  },
  hero: {
    borderRadius: 28,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 24,
    gap: 6,
  },
  heroEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: mobileTheme.primary,
  },
  heroTime: {
    fontSize: 46,
    fontWeight: '900',
    letterSpacing: -1.8,
    color: mobileTheme.text,
  },
  heroDate: {
    fontSize: 14,
    color: mobileTheme.mutedText,
  },
  grid: {
    gap: 12,
  },
  card: {
    borderRadius: 24,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 20,
    gap: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: mobileTheme.text,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoList: {
    gap: 12,
  },
  infoRow: {
    gap: 4,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: mobileTheme.mutedText,
  },
  infoValue: {
    fontSize: 14,
    lineHeight: 21,
    color: mobileTheme.text,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 21,
    color: mobileTheme.text,
  },
  placeholder: {
    minHeight: 120,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mobileTheme.surfaceLow,
    gap: 10,
    paddingHorizontal: 20,
  },
  placeholderText: {
    fontSize: 13,
    lineHeight: 20,
    color: mobileTheme.mutedText,
    textAlign: 'center',
  },
  photoWrap: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: mobileTheme.surfaceLow,
  },
  photo: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: mobileTheme.surfaceLow,
  },
  photoMeta: {
    padding: 14,
    gap: 4,
  },
  photoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: mobileTheme.text,
  },
  photoText: {
    fontSize: 12,
    lineHeight: 18,
    color: mobileTheme.mutedText,
  },
  timeline: {
    gap: 12,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineRail: {
    width: 18,
    alignItems: 'center',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: mobileTheme.primary,
    marginTop: 4,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: mobileTheme.surfaceHigh,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 4,
    gap: 4,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: mobileTheme.text,
  },
  timelineText: {
    fontSize: 13,
    lineHeight: 20,
    color: mobileTheme.mutedText,
  },
  actions: {
    gap: 12,
    paddingTop: 8,
  },
  primaryAction: {
    minHeight: 52,
    borderRadius: 20,
    backgroundColor: mobileTheme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryActionText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  secondaryAction: {
    minHeight: 52,
    borderRadius: 20,
    backgroundColor: mobileTheme.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryActionText: {
    fontSize: 15,
    fontWeight: '800',
    color: mobileTheme.text,
  },
});
