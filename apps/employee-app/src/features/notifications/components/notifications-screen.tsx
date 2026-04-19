import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useCurrentEmployee } from '@/features/employee/hooks/use-current-employee';
import { AppIcon } from '@/shared/components/app-icon';
import { MobileEmptyState } from '@/shared/components/mobile-empty-state';
import { MobilePageHeader } from '@/shared/components/mobile-page-header';
import { MobileListSkeleton } from '@/shared/components/mobile-skeleton';
import { useAppSession } from '@/shared/providers/app-providers';
import { mobileTheme } from '@/shared/theme/tokens';

import {
  useEmployeeNotifications,
  useMarkAllEmployeeNotificationsRead,
  useMarkEmployeeNotificationRead,
} from '../hooks/use-employee-notifications';
import {
  formatNotificationTime,
  groupNotificationsByDay,
  notificationCategoryLabels,
  notificationSeverityPalette,
} from '../lib/notification-mobile';

export const NotificationsScreen = () => {
  const { session } = useAppSession();
  const { employee } = useCurrentEmployee(session);
  const userId = session?.user.id ?? null;
  const notificationsQuery = useEmployeeNotifications(userId);
  const markAsRead = useMarkEmployeeNotificationRead(userId);
  const markAllAsRead = useMarkAllEmployeeNotificationsRead(userId);

  const groups = groupNotificationsByDay(notificationsQuery.data ?? []);
  const unreadNotifications = (notificationsQuery.data ?? []).filter((item) => item.status === 'unread');

  const handleOpenNotification = async (notificationId: string, href?: string | null) => {
    try {
      if (!markAsRead.isPending) {
        await markAsRead.mutateAsync(notificationId);
      }
    } catch {
      Alert.alert('Não foi possível atualizar', 'A mensagem foi aberta, mas não conseguimos registrar a leitura agora.');
    }

    if (href) {
      router.push(href as never);
    }
  };

  const handleReadAll = async () => {
    if (unreadNotifications.length === 0 || markAllAsRead.isPending) {
      return;
    }

    try {
      await markAllAsRead.mutateAsync();
    } catch {
      Alert.alert('Não foi possível concluir', 'Tente novamente em instantes para limpar todas as mensagens.');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
    >
      <MobilePageHeader
        title="Notificações"
        subtitle="Acompanhe alertas de jornada, respostas do RH e novos documentos publicados para o seu cadastro."
        onBack={() => router.back()}
        action={
          <Pressable style={styles.iconButton} onPress={() => router.push('/notification-settings' as never)}>
            <AppIcon color={mobileTheme.text} name="settings-outline" size={18} />
          </Pressable>
        }
      />

      <View style={styles.hero}>
        <Text selectable style={styles.heroEyebrow}>
          Centro de mensagens
        </Text>
        <Text selectable style={styles.heroTitle}>
          {employee?.fullName?.split(' ')[0] ?? 'Colaborador'}, você tem {unreadNotifications.length} item(ns) que podem exigir ação
        </Text>
        <Pressable
          disabled={unreadNotifications.length === 0 || markAllAsRead.isPending}
          onPress={() => void handleReadAll()}
          style={[
            styles.heroAction,
            (unreadNotifications.length === 0 || markAllAsRead.isPending) && styles.heroActionDisabled,
          ]}
        >
          <AppIcon color="#ffffff" name="mail-open-outline" size={18} />
          <Text style={styles.heroActionText}>
            {markAllAsRead.isPending ? 'Atualizando...' : 'Marcar tudo como lido'}
          </Text>
        </Pressable>
      </View>

      {notificationsQuery.isLoading ? (
        <MobileListSkeleton itemCount={4} showHero={false} />
      ) : groups.length === 0 ? (
        <MobileEmptyState
          iconName="notifications-off-outline"
          title="Sem notificações por enquanto"
          description="Quando houver avisos sobre marcações, férias, documentos ou retornos do RH, eles aparecerão aqui."
        />
      ) : (
        groups.map((group) => (
          <View key={group.key} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{group.title}</Text>
              <View style={styles.sectionDivider} />
            </View>

            <View style={styles.list}>
              {group.items.map((item) => {
                const palette = notificationSeverityPalette[item.severity];
                const isUnread = item.status === 'unread';

                return (
                  <Pressable
                    key={item.id}
                    onPress={() => void handleOpenNotification(item.id, item.href)}
                    style={[styles.notificationCard, isUnread && styles.notificationCardUnread]}
                  >
                    <View style={[styles.notificationIcon, { backgroundColor: palette.soft }]}>
                      <AppIcon color={palette.accent} name={palette.icon} size={20} />
                    </View>

                    <View style={styles.notificationCopy}>
                      <View style={styles.notificationTopRow}>
                        <Text selectable style={styles.notificationTitle}>
                          {item.title}
                        </Text>
                        <Text selectable style={styles.notificationTime}>
                          {formatNotificationTime(item.triggeredAt)}
                        </Text>
                      </View>
                      <Text selectable style={styles.notificationDescription}>
                        {item.description}
                      </Text>
                      <View style={styles.notificationMetaRow}>
                        <Text selectable style={[styles.notificationMeta, { color: palette.accent }]}>
                          {notificationCategoryLabels[item.category] ?? 'Mensagem'}
                        </Text>
                        {isUnread ? <View style={styles.unreadDot} /> : null}
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))
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
    gap: 12,
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
    letterSpacing: -0.9,
    color: mobileTheme.text,
    lineHeight: 30,
  },
  heroAction: {
    alignSelf: 'flex-start',
    minHeight: 46,
    borderRadius: 18,
    paddingHorizontal: 16,
    backgroundColor: mobileTheme.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroActionDisabled: {
    opacity: 0.55,
  },
  heroActionText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },
  loadingCard: {
    minHeight: 140,
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
  section: {
    gap: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: mobileTheme.subtleText,
    textTransform: 'uppercase',
  },
  sectionDivider: {
    flex: 1,
    height: 1,
    backgroundColor: mobileTheme.border,
    opacity: 0.45,
  },
  list: {
    gap: 12,
  },
  notificationCard: {
    borderRadius: 24,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  notificationCardUnread: {
    borderWidth: 1,
    borderColor: mobileTheme.primarySoft,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationCopy: {
    flex: 1,
    gap: 6,
  },
  notificationTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  notificationTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: mobileTheme.text,
  },
  notificationTime: {
    fontSize: 11,
    fontWeight: '700',
    color: mobileTheme.subtleText,
  },
  notificationDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: mobileTheme.mutedText,
  },
  notificationMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationMeta: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: mobileTheme.primary,
  },
});
