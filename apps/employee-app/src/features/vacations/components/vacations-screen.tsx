import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useCurrentEmployee } from '@/features/employee/hooks/use-current-employee';
import { AppIcon } from '@/shared/components/app-icon';
import { MobileEmptyState } from '@/shared/components/mobile-empty-state';
import { MobilePageHeader } from '@/shared/components/mobile-page-header';
import { useAppSession } from '@/shared/providers/app-providers';
import { mobileTheme } from '@/shared/theme/tokens';

import { useEmployeeVacations } from '../hooks/use-employee-vacations';
import { formatVacationWindow, vacationStatusLabels } from '../lib/vacations-mobile';

const paletteByStatus: Record<string, { accent: string; soft: string }> = {
  pending: { accent: mobileTheme.warning, soft: mobileTheme.warningSoft },
  approved: { accent: mobileTheme.success, soft: mobileTheme.successSoft },
  rejected: { accent: mobileTheme.danger, soft: mobileTheme.dangerSoft },
  cancelled: { accent: mobileTheme.subtleText, soft: mobileTheme.surfaceLow },
};

export const VacationsScreen = () => {
  const { session } = useAppSession();
  const { employee } = useCurrentEmployee(session);
  const employeeId = employee?.id ?? null;
  const vacationsQuery = useEmployeeVacations(employeeId);
  const vacations = vacationsQuery.data ?? [];
  const upcomingVacation = vacations.find((item) => item.status === 'approved') ?? vacations[0] ?? null;

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
    >
      <MobilePageHeader
        title="Férias"
        subtitle="Acompanhe seus pedidos, períodos aprovados e o saldo informado na sua solicitação."
        onBack={() => router.back()}
        action={
          <Pressable style={styles.iconButton} onPress={() => router.push('/vacations/new' as never)}>
            <AppIcon color={mobileTheme.text} name="add-outline" size={20} />
          </Pressable>
        }
      />

      <View style={styles.hero}>
        <Text selectable style={styles.heroEyebrow}>
          Planejamento pessoal
        </Text>
        <Text selectable style={styles.heroTitle}>
          {vacations.length} solicitação(ões) registradas
        </Text>
        <Text selectable style={styles.heroSubtitle}>
          {upcomingVacation
            ? `Próximo período em destaque: ${formatVacationWindow(upcomingVacation)}.`
            : 'Você ainda não tem períodos registrados no autosserviço.'}
        </Text>
      </View>

      {vacationsQuery.isLoading ? (
        <View style={styles.loadingCard}>
          <ActivityIndicator color={mobileTheme.primary} />
          <Text style={styles.loadingText}>Carregando suas solicitações de férias...</Text>
        </View>
      ) : vacations.length === 0 ? (
        <MobileEmptyState
          iconName="airplane-outline"
          title="Sem pedidos de férias"
          description="Quando você abrir sua primeira solicitação, ela aparecerá aqui com o andamento das aprovações."
          actionLabel="Nova solicitação"
          onAction={() => router.push('/vacations/new' as never)}
        />
      ) : (
        <View style={styles.list}>
          {vacations.map((item) => {
            const palette = paletteByStatus[item.status] ?? paletteByStatus.pending;

            return (
              <Pressable key={item.id} onPress={() => router.push(`/vacations/${item.id}` as never)} style={styles.card}>
                <View style={[styles.iconWrap, { backgroundColor: palette.soft }]}>
                  <AppIcon color={palette.accent} name="airplane-outline" size={22} />
                </View>

                <View style={styles.copy}>
                  <Text selectable style={styles.eyebrow}>
                    {item.accrualPeriod ?? 'Período aquisitivo em análise'}
                  </Text>
                  <Text selectable style={styles.title}>
                    {formatVacationWindow(item)}
                  </Text>
                  <Text selectable style={styles.description}>
                    {item.totalDays} dia(s) solicitados · saldo informado: {item.availableDays} dia(s)
                  </Text>
                  <View style={styles.metaRow}>
                    <Text selectable style={[styles.statusPill, { color: palette.accent, backgroundColor: palette.soft }]}>
                      {vacationStatusLabels[item.status] ?? 'Em análise'}
                    </Text>
                    <Text selectable style={styles.inlineMeta}>
                      Pedido em {new Date(item.requestedAt).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
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
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mobileTheme.surfaceRaised,
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
  list: {
    gap: 14,
  },
  card: {
    borderRadius: 26,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 6,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: mobileTheme.subtleText,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: mobileTheme.text,
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    color: mobileTheme.mutedText,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 2,
  },
  statusPill: {
    overflow: 'hidden',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 11,
    fontWeight: '800',
  },
  inlineMeta: {
    fontSize: 12,
    color: mobileTheme.mutedText,
  },
});
