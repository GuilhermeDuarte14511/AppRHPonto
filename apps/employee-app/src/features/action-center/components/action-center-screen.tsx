import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useEmployeeDocuments, usePayrollStatements } from '@/features/documents/hooks/use-employee-documents';
import { useCurrentEmployee } from '@/features/employee/hooks/use-current-employee';
import { useEmployeeJustifications } from '@/features/justifications/hooks/use-employee-justifications';
import {
  useEmployeeNotifications,
  useMarkEmployeeNotificationRead,
} from '@/features/notifications/hooks/use-employee-notifications';
import { useEmployeeVacations } from '@/features/vacations/hooks/use-employee-vacations';
import { AppIcon } from '@/shared/components/app-icon';
import { MobileEmptyState } from '@/shared/components/mobile-empty-state';
import { MobilePageHeader } from '@/shared/components/mobile-page-header';
import { MobileListSkeleton } from '@/shared/components/mobile-skeleton';
import { useAppSession } from '@/shared/providers/app-providers';
import { mobileTheme } from '@/shared/theme/tokens';

import {
  groupActionCenterItems,
  type ActionCenterItem,
  type ActionCenterSource,
  type ActionCenterStatusBucket,
} from '../lib/action-center-groups';
import { buildActionCenterItems } from '../lib/action-center-feed';

const sourceMeta: Record<ActionCenterSource, { label: string; icon: string }> = {
  notification: { label: 'Notificação', icon: 'notifications-outline' },
  document: { label: 'Documento', icon: 'document-text-outline' },
  payroll: { label: 'Holerite', icon: 'wallet-outline' },
  vacation: { label: 'Férias', icon: 'airplane-outline' },
  justification: { label: 'Justificativa', icon: 'chatbubble-ellipses-outline' },
};

const sectionMeta: Record<
  ActionCenterStatusBucket,
  {
    title: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
  }
> = {
  'requires-action': {
    title: 'Precisa da sua ação',
    description: 'Itens que dependem de leitura, resposta ou ajuste da sua parte.',
    emptyTitle: 'Nenhuma ação pendente',
    emptyDescription: 'Quando houver algo para responder, assinar ou ajustar, ele aparecerá aqui.',
  },
  'in-review': {
    title: 'Em análise',
    description: 'Solicitações já enviadas e que ainda estão passando pela conferência do RH.',
    emptyTitle: 'Nada em análise agora',
    emptyDescription: 'Novas solicitações de férias ou justificativas entram aqui enquanto aguardam retorno.',
  },
  recent: {
    title: 'Resolvido recentemente',
    description: 'Últimos retornos que já saíram da etapa de análise.',
    emptyTitle: 'Sem movimentações recentes',
    emptyDescription: 'Assim que houver aprovações, recusas ou confirmações recentes, vamos reunir tudo aqui.',
  },
};

const bucketPalette: Record<ActionCenterStatusBucket, { accent: string; soft: string; badge: string }> = {
  'requires-action': {
    accent: mobileTheme.danger,
    soft: mobileTheme.dangerSoft,
    badge: 'Ação',
  },
  'in-review': {
    accent: mobileTheme.warning,
    soft: mobileTheme.warningSoft,
    badge: 'Em análise',
  },
  recent: {
    accent: mobileTheme.success,
    soft: mobileTheme.successSoft,
    badge: 'Recente',
  },
};

const formatActionCenterTime = (value: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));

const ActionCenterSection = ({
  bucket,
  items,
  onOpenItem,
}: {
  bucket: ActionCenterStatusBucket;
  items: ActionCenterItem[];
  onOpenItem: (item: ActionCenterItem) => Promise<void>;
}) => {
  const meta = sectionMeta[bucket];
  const palette = bucketPalette[bucket];

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>{meta.title}</Text>
          <View style={[styles.sectionBadge, { backgroundColor: palette.soft }]}>
            <Text style={[styles.sectionBadgeText, { color: palette.accent }]}>{items.length}</Text>
          </View>
        </View>
        <Text style={styles.sectionDescription}>{meta.description}</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptySectionCard}>
          <Text style={styles.emptySectionTitle}>{meta.emptyTitle}</Text>
          <Text style={styles.emptySectionDescription}>{meta.emptyDescription}</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {items.map((item) => {
            const source = sourceMeta[item.source];

            return (
              <Pressable
                key={item.id}
                onPress={() => {
                  void onOpenItem(item);
                }}
                style={[styles.itemCard, { borderColor: palette.soft }]}
              >
                <View style={[styles.itemIconWrap, { backgroundColor: palette.soft }]}>
                  <AppIcon color={palette.accent} name={source.icon} size={20} />
                </View>

                <View style={styles.itemCopy}>
                  <View style={styles.itemTopRow}>
                    <Text style={[styles.itemSourcePill, { color: palette.accent, backgroundColor: palette.soft }]}>
                      {source.label}
                    </Text>
                    <Text style={styles.itemTime}>{formatActionCenterTime(item.occurredAt)}</Text>
                  </View>

                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemDescription}>{item.description}</Text>

                  <View style={styles.itemFooter}>
                    <Text style={[styles.itemStatus, { color: palette.accent }]}>
                      {palette.badge} · {item.statusLabel}
                    </Text>
                    <AppIcon color={palette.accent} name="arrow-forward-outline" size={16} />
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
};

export const ActionCenterScreen = () => {
  const { session } = useAppSession();
  const { employee, employeeQuery } = useCurrentEmployee(session);
  const userId = session?.user.id ?? null;
  const employeeId = employee?.id ?? null;
  const notificationsQuery = useEmployeeNotifications(userId);
  const markNotificationAsRead = useMarkEmployeeNotificationRead(userId);
  const documentsQuery = useEmployeeDocuments(employeeId);
  const payrollQuery = usePayrollStatements(employeeId);
  const vacationsQuery = useEmployeeVacations(employeeId);
  const { allJustifications, justificationsQuery } = useEmployeeJustifications();

  const handleOpenItem = async (item: ActionCenterItem) => {
    if (item.notificationId) {
      try {
        await markNotificationAsRead.mutateAsync(item.notificationId);
      } catch {
        Alert.alert(
          'Não foi possível atualizar',
          'Abrimos o item, mas a leitura da notificação não pôde ser registrada agora.',
        );
      }
    }

    router.push(item.href as never);
  };

  const items = buildActionCenterItems({
    notifications: notificationsQuery.data,
    documents: documentsQuery.data,
    payrollStatements: payrollQuery.data,
    vacations: vacationsQuery.data,
    justifications: allJustifications,
  });

  const groups = groupActionCenterItems(items);
  const pendingTotal = groups.requiresAction.length + groups.inReview.length;
  const hasAnyItems = pendingTotal + groups.recent.length > 0;
  const queryStates = [notificationsQuery, documentsQuery, payrollQuery, vacationsQuery, justificationsQuery];
  const isLoading = employeeQuery.isLoading || (queryStates.some((query) => query.isLoading) && !hasAnyItems);
  const hasPartialError = queryStates.some((query) => query.isError);

  if (isLoading) {
    return (
      <ScrollView contentContainerStyle={styles.content} style={styles.container}>
        <MobileListSkeleton itemCount={4} />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
    >
      <MobilePageHeader
        title="Central de pendências"
        subtitle="Tudo o que precisa da sua ação ou ainda está em análise pelo RH, sem trocar de tela a cada assunto."
        onBack={() => router.back()}
      />

      <View style={styles.hero}>
        <Text selectable style={styles.heroEyebrow}>
          Fila pessoal
        </Text>
        <Text selectable style={styles.heroTitle}>
          {pendingTotal > 0
            ? `${pendingTotal} item(ns) ainda pedem acompanhamento`
            : 'Sem pendências abertas agora'}
        </Text>
        <Text selectable style={styles.heroSubtitle}>
          {pendingTotal > 0
            ? 'Centralize o que depende de você e o que já está com o RH em uma visão única.'
            : 'Quando surgir algo novo em documentos, férias, justificativas ou notificações, a central vai destacar aqui.'}
        </Text>

        <View style={styles.metricRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{groups.requiresAction.length}</Text>
            <Text style={styles.metricLabel}>precisam da sua ação</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{groups.inReview.length}</Text>
            <Text style={styles.metricLabel}>estão com o RH</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{groups.recent.length}</Text>
            <Text style={styles.metricLabel}>movimentações recentes</Text>
          </View>
        </View>
      </View>

      {hasPartialError ? (
        <View style={styles.warningCard}>
          <AppIcon color={mobileTheme.warning} name="alert-circle-outline" size={18} />
          <Text style={styles.warningText}>
            Algumas fontes não responderam agora. A central segue mostrando o que já foi carregado.
          </Text>
        </View>
      ) : null}

      {!hasAnyItems ? (
        <MobileEmptyState
          iconName="checkmark-circle-outline"
          title="Nenhuma pendência no momento"
          description="Quando houver documentos para ciência, devolutivas do RH ou solicitações em andamento, tudo vai aparecer nesta central."
        />
      ) : (
        <>
          <ActionCenterSection bucket="requires-action" items={groups.requiresAction} onOpenItem={handleOpenItem} />
          <ActionCenterSection bucket="in-review" items={groups.inReview} onOpenItem={handleOpenItem} />
          <ActionCenterSection bucket="recent" items={groups.recent} onOpenItem={handleOpenItem} />
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
  hero: {
    borderRadius: 28,
    backgroundColor: mobileTheme.primary,
    padding: 22,
    gap: 10,
  },
  heroEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.78)',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.8,
    color: '#ffffff',
    lineHeight: 32,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: 'rgba(255,255,255,0.88)',
  },
  metricRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  metricCard: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
  },
  metricLabel: {
    fontSize: 12,
    lineHeight: 17,
    color: 'rgba(255,255,255,0.8)',
  },
  warningCard: {
    borderRadius: 18,
    backgroundColor: mobileTheme.warningSoft,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: mobileTheme.warning,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    gap: 6,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: mobileTheme.text,
  },
  sectionBadge: {
    minWidth: 34,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  sectionDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: mobileTheme.mutedText,
  },
  emptySectionCard: {
    borderRadius: 22,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 18,
    gap: 6,
  },
  emptySectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: mobileTheme.text,
  },
  emptySectionDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: mobileTheme.mutedText,
  },
  list: {
    gap: 12,
  },
  itemCard: {
    borderRadius: 24,
    borderWidth: 1,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  itemIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemCopy: {
    flex: 1,
    gap: 6,
  },
  itemTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  itemSourcePill: {
    overflow: 'hidden',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  itemTime: {
    fontSize: 11,
    fontWeight: '700',
    color: mobileTheme.subtleText,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: mobileTheme.text,
  },
  itemDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: mobileTheme.mutedText,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 2,
  },
  itemStatus: {
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
  },
});
