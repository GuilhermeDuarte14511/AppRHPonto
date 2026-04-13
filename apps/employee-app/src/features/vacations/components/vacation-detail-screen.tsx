import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/shared/components/app-icon';
import { MobileEmptyState } from '@/shared/components/mobile-empty-state';
import { MobilePageHeader } from '@/shared/components/mobile-page-header';
import { mobileTheme } from '@/shared/theme/tokens';

import { useEmployeeVacationDetail } from '../hooks/use-employee-vacations';
import {
  approvalStatusLabels,
  formatVacationDate,
  formatVacationWindow,
  vacationStatusLabels,
} from '../lib/vacations-mobile';

export const VacationDetailScreen = () => {
  const params = useLocalSearchParams<{ id?: string }>();
  const detailQuery = useEmployeeVacationDetail(params.id);
  const vacation = detailQuery.data;

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
    >
      <MobilePageHeader
        title="Solicitação de férias"
        subtitle="Confira o período solicitado e a situação das aprovações."
        onBack={() => router.back()}
      />

      {detailQuery.isLoading ? (
        <View style={styles.loadingCard}>
          <ActivityIndicator color={mobileTheme.primary} />
          <Text style={styles.loadingText}>Carregando os detalhes da solicitação...</Text>
        </View>
      ) : !vacation ? (
        <MobileEmptyState
          iconName="airplane-outline"
          title="Solicitação não encontrada"
          description="Esse pedido pode não estar mais disponível para o seu cadastro."
          actionLabel="Voltar"
          onAction={() => router.replace('/vacations' as never)}
        />
      ) : (
        <>
          <View style={styles.hero}>
            <Text selectable style={styles.heroEyebrow}>
              {vacationStatusLabels[vacation.status] ?? 'Em análise'}
            </Text>
            <Text selectable style={styles.heroTitle}>
              {formatVacationWindow(vacation)}
            </Text>
            <Text selectable style={styles.heroSubtitle}>
              {vacation.totalDays} dia(s) solicitados · saldo informado no pedido: {vacation.availableDays} dia(s).
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Detalhes do pedido</Text>
            <View style={styles.infoList}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Período aquisitivo</Text>
                <Text selectable style={styles.infoValue}>
                  {vacation.accrualPeriod ?? 'Não informado'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Pedido registrado em</Text>
                <Text selectable style={styles.infoValue}>
                  {formatVacationDate(vacation.requestedAt)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Antecipação do 13º</Text>
                <Text selectable style={styles.infoValue}>
                  {vacation.advanceThirteenthSalary ? 'Solicitada' : 'Não solicitada'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Abono pecuniário</Text>
                <Text selectable style={styles.infoValue}>
                  {vacation.cashBonus ? 'Solicitado' : 'Não solicitado'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Fluxo de aprovação</Text>
            <View style={styles.approvalCard}>
              <Text style={styles.approvalTitle}>Gestão imediata</Text>
              <Text style={styles.approvalStatus}>
                {approvalStatusLabels[vacation.managerApprovalStatus] ?? vacation.managerApprovalStatus}
              </Text>
              <Text style={styles.approvalDescription}>
                {vacation.managerApprovalActor
                  ? `${vacation.managerApprovalActor} · ${formatVacationDate(vacation.managerApprovalTimestamp)}`
                  : 'Ainda não houve atualização da liderança.'}
              </Text>
            </View>
            <View style={styles.approvalCard}>
              <Text style={styles.approvalTitle}>RH</Text>
              <Text style={styles.approvalStatus}>
                {approvalStatusLabels[vacation.hrApprovalStatus] ?? vacation.hrApprovalStatus}
              </Text>
              <Text style={styles.approvalDescription}>
                {vacation.hrApprovalActor
                  ? `${vacation.hrApprovalActor} · ${formatVacationDate(vacation.hrApprovalTimestamp)}`
                  : 'Seu pedido ainda aguarda avaliação final do RH.'}
              </Text>
            </View>
          </View>

          {vacation.coverageNotes || vacation.reviewNotes ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Observações</Text>
              {vacation.coverageNotes ? (
                <View style={styles.noteBlock}>
                  <Text style={styles.noteLabel}>Cobertura combinada</Text>
                  <Text style={styles.noteText}>{vacation.coverageNotes}</Text>
                </View>
              ) : null}
              {vacation.reviewNotes ? (
                <View style={styles.noteBlock}>
                  <Text style={styles.noteLabel}>Retorno do RH</Text>
                  <Text style={styles.noteText}>{vacation.reviewNotes}</Text>
                </View>
              ) : null}
            </View>
          ) : null}

          {vacation.attachmentFileUrl ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Anexo</Text>
              <Pressable style={styles.attachmentRow} onPress={() => void Linking.openURL(vacation.attachmentFileUrl as string)}>
                <View style={styles.attachmentIcon}>
                  <AppIcon color={mobileTheme.primary} name="document-attach-outline" size={18} />
                </View>
                <View style={styles.attachmentCopy}>
                  <Text numberOfLines={1} style={styles.attachmentTitle}>
                    {vacation.attachmentFileName ?? 'Anexo da solicitação'}
                  </Text>
                  <Text style={styles.attachmentMeta}>Abrir documento vinculado ao pedido</Text>
                </View>
                <AppIcon color={mobileTheme.primary} name="open-outline" size={18} />
              </Pressable>
            </View>
          ) : null}
        </>
      )}
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
    gap: 18,
  },
  loadingCard: {
    minHeight: 150,
    borderRadius: 26,
    backgroundColor: mobileTheme.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  loadingText: {
    fontSize: 14,
    lineHeight: 21,
    color: mobileTheme.mutedText,
    textAlign: 'center',
  },
  hero: {
    borderRadius: 28,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 22,
    gap: 8,
  },
  heroEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: mobileTheme.primary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.8,
    color: mobileTheme.text,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: mobileTheme.mutedText,
  },
  card: {
    borderRadius: 26,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 20,
    gap: 14,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
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
    color: mobileTheme.subtleText,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 14,
    lineHeight: 21,
    color: mobileTheme.text,
  },
  approvalCard: {
    borderRadius: 18,
    backgroundColor: mobileTheme.surfaceLow,
    padding: 14,
    gap: 4,
  },
  approvalTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: mobileTheme.text,
  },
  approvalStatus: {
    fontSize: 13,
    fontWeight: '700',
    color: mobileTheme.primary,
  },
  approvalDescription: {
    fontSize: 12,
    lineHeight: 19,
    color: mobileTheme.mutedText,
  },
  noteBlock: {
    gap: 4,
  },
  noteLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: mobileTheme.text,
  },
  noteText: {
    fontSize: 13,
    lineHeight: 20,
    color: mobileTheme.mutedText,
  },
  attachmentRow: {
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
    backgroundColor: mobileTheme.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
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
});
