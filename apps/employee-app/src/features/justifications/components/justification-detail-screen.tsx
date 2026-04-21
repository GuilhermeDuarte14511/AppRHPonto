import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/shared/components/app-icon';
import { MobileDetailSkeleton } from '@/shared/components/mobile-skeleton';
import { mobileTheme } from '@/shared/theme/tokens';

import { useJustificationDetail } from '../hooks/use-justification-detail';
import {
  buildJustificationOperationalSummary,
  formatAttachmentMeta,
  formatJustificationDate,
  justificationStatusLabels,
  justificationTypeLabels,
  requestedRecordTypeLabels,
} from '../lib/justification-mobile';

const statusPalette = {
  pending: {
    accent: mobileTheme.warning,
    soft: mobileTheme.warningSoft,
  },
  approved: {
    accent: mobileTheme.success,
    soft: mobileTheme.successSoft,
  },
  rejected: {
    accent: mobileTheme.danger,
    soft: mobileTheme.dangerSoft,
  },
} as const;

export const JustificationDetailScreen = () => {
  const params = useLocalSearchParams<{ id?: string }>();
  const { justification, justificationQuery, attachments, attachmentsQuery } = useJustificationDetail(params.id);

  if (justificationQuery.isLoading) {
    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content} style={styles.container}>
        <MobileDetailSkeleton sectionCount={4} />
      </ScrollView>
    );
  }

  if (!justification) {
    return (
      <View style={styles.loadingContainer}>
        <AppIcon color={mobileTheme.danger} name="alert-circle-outline" size={26} />
        <Text style={styles.loadingTitle}>Justificativa não encontrada</Text>
        <Text style={styles.loadingText}>Esse item pode não estar mais disponível na sua conta.</Text>
        <Pressable style={styles.backButton} onPress={() => router.replace('/(tabs)/justifications')}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  const palette = statusPalette[justification.status];
  const operational = buildJustificationOperationalSummary(justification);

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
        <Text style={styles.topBarTitle}>Detalhe da justificativa</Text>
        <Pressable style={styles.topBarButton} onPress={() => router.push('/justifications/new')}>
          <AppIcon color={mobileTheme.text} name="add-outline" size={20} />
        </Pressable>
      </View>

      <View style={styles.hero}>
        <View style={[styles.statusBadge, { backgroundColor: palette.soft }]}>
          <Text style={[styles.statusBadgeText, { color: palette.accent }]}>
            {justificationStatusLabels[justification.status]}
          </Text>
        </View>
        <Text style={styles.heroTitle}>{justificationTypeLabels[justification.type]}</Text>
        <Text style={styles.heroSubtitle}>{operational.statusDescription}</Text>
        <Text style={styles.heroDate}>Aberta em {formatJustificationDate(justification.createdAt)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Leitura operacional</Text>
        <Text style={styles.bodyText}>{operational.typeSummary}</Text>
        <View style={styles.infoList}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>O RH confere</Text>
            <Text style={styles.infoValue}>{operational.reviewFocus}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Próxima ação</Text>
            <Text style={styles.infoValue}>{operational.statusAction}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Situação da pendência</Text>
            <Text style={styles.infoValue}>{operational.decisionLabel}</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Motivo informado</Text>
        <Text style={styles.bodyText}>{justification.reason}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Dados da solicitação</Text>
        <View style={styles.infoList}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tipo</Text>
            <Text style={styles.infoValue}>{justificationTypeLabels[justification.type]}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={styles.infoValue}>{justificationStatusLabels[justification.status]}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Batida vinculada</Text>
            <Text style={styles.infoValue}>{operational.linkedRecordLabel}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tipo solicitado</Text>
            <Text style={styles.infoValue}>
              {justification.requestedRecordType
                ? requestedRecordTypeLabels[justification.requestedRecordType]
                : 'Não informado'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Data solicitada</Text>
            <Text style={styles.infoValue}>{operational.requestedRecordedAtLabel}</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Retorno do RH</Text>
        {justification.reviewedAt || justification.reviewNotes ? (
          <View style={styles.reviewBox}>
            <Text style={styles.reviewTitle}>
              {operational.reviewedAtLabel ?? 'Resposta do RH'}
            </Text>
            <Text style={styles.reviewText}>
              {justification.reviewNotes ?? operational.statusAction}
            </Text>
          </View>
        ) : (
          <View style={styles.placeholder}>
            <AppIcon color={mobileTheme.subtleText} name="time-outline" size={22} />
            <Text style={styles.placeholderText}>{operational.reviewFocus}</Text>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Anexos</Text>
        {attachmentsQuery.isLoading ? (
          <View style={styles.placeholder}>
            <ActivityIndicator color={mobileTheme.primary} />
            <Text style={styles.placeholderText}>Buscando anexos vinculados...</Text>
          </View>
        ) : attachments.length > 0 ? (
          <View style={styles.attachmentList}>
            {attachments.map((attachment) => (
              <Pressable
                key={attachment.id}
                onPress={() => void Linking.openURL(attachment.fileUrl)}
                style={styles.attachmentCard}
              >
                <View style={styles.attachmentIcon}>
                  <AppIcon color={mobileTheme.primary} name="document-attach-outline" size={20} />
                </View>
                <View style={styles.attachmentCopy}>
                  <Text numberOfLines={1} style={styles.attachmentTitle}>
                    {attachment.fileName}
                  </Text>
                  <Text style={styles.attachmentMeta}>{formatAttachmentMeta(attachment)}</Text>
                </View>
                <AppIcon color={mobileTheme.primary} name="open-outline" size={18} />
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.placeholder}>
            <AppIcon color={mobileTheme.subtleText} name="document-text-outline" size={22} />
            <Text style={styles.placeholderText}>Nenhum anexo foi vinculado a essa justificativa até agora.</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.primaryAction} onPress={() => router.push('/justifications/new')}>
          <AppIcon color="#ffffff" name="create-outline" size={18} />
          <Text style={styles.primaryActionText}>Nova justificativa</Text>
        </Pressable>
        <Pressable style={styles.secondaryAction} onPress={() => router.replace('/(tabs)/justifications')}>
          <Text style={styles.secondaryActionText}>Voltar para lista</Text>
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
    gap: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
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
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1.1,
    color: mobileTheme.text,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: mobileTheme.mutedText,
  },
  heroDate: {
    fontSize: 12,
    color: mobileTheme.primary,
    fontWeight: '700',
  },
  card: {
    borderRadius: 24,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 20,
    gap: 14,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: mobileTheme.text,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 22,
    color: mobileTheme.text,
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
  reviewBox: {
    borderRadius: 18,
    backgroundColor: mobileTheme.surfaceLow,
    padding: 14,
    gap: 6,
  },
  reviewTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: mobileTheme.text,
  },
  reviewText: {
    fontSize: 13,
    lineHeight: 20,
    color: mobileTheme.mutedText,
  },
  placeholder: {
    minHeight: 110,
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
  attachmentList: {
    gap: 10,
  },
  attachmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
    backgroundColor: mobileTheme.surfaceLow,
    padding: 14,
  },
  attachmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mobileTheme.surfaceRaised,
  },
  attachmentCopy: {
    flex: 1,
    gap: 4,
  },
  attachmentTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: mobileTheme.text,
  },
  attachmentMeta: {
    fontSize: 12,
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
