import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/shared/components/app-icon';
import { MobileListSkeleton } from '@/shared/components/mobile-skeleton';
import { mobileTheme } from '@/shared/theme/tokens';

import { useEmployeeJustifications } from '../hooks/use-employee-justifications';
import {
  formatJustificationDate,
  justificationStatusDescriptions,
  justificationStatusLabels,
  justificationTypeLabels,
} from '../lib/justification-mobile';

const statusColorByStatus = {
  pending: mobileTheme.warning,
  approved: mobileTheme.success,
  rejected: mobileTheme.danger,
} as const;

const filterOptions = [
  { id: 'all', label: 'Todas' },
  { id: 'pending', label: 'Pendentes' },
  { id: 'approved', label: 'Aprovadas' },
  { id: 'rejected', label: 'Rejeitadas' },
] as const;

type JustificationFilterPreset = (typeof filterOptions)[number]['id'];

export const EmployeeJustificationsScreen = () => {
  const [activeFilter, setActiveFilter] = useState<JustificationFilterPreset>('all');
  const { allJustifications, justifications, justificationsQuery } = useEmployeeJustifications(activeFilter);

  const summary = useMemo(
    () => ({
      total: allJustifications.length,
      pending: allJustifications.filter((item) => item.status === 'pending').length,
    }),
    [allJustifications],
  );

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
    >
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.title}>Minhas justificativas</Text>
          <Text style={styles.subtitle}>
            Acompanhe atrasos, ausências e pedidos de ajuste sem perder o contexto de cada ocorrência.
          </Text>
        </View>
        <View style={styles.heroMetrics}>
          <View style={styles.metricPill}>
            <Text style={styles.metricValue}>{summary.total}</Text>
            <Text style={styles.metricLabel}>no período</Text>
          </View>
          <View style={styles.metricPill}>
            <Text style={[styles.metricValue, { color: mobileTheme.warning }]}>{summary.pending}</Text>
            <Text style={styles.metricLabel}>aguardando RH</Text>
          </View>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {filterOptions.map((filter) => {
          const isActive = activeFilter === filter.id;

          return (
            <Pressable
              key={filter.id}
              onPress={() => setActiveFilter(filter.id)}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>{filter.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {justificationsQuery.isLoading ? (
        <MobileListSkeleton itemCount={3} showHero={false} />
      ) : justificationsQuery.isError ? (
        <View style={styles.placeholderCard}>
          <AppIcon color={mobileTheme.danger} name="alert-circle-outline" size={22} />
          <Text style={styles.placeholderText}>Não foi possível consultar suas justificativas agora.</Text>
        </View>
      ) : justifications.length === 0 ? (
        <View style={styles.placeholderCard}>
          <AppIcon color={mobileTheme.subtleText} name="document-text-outline" size={22} />
          <Text style={styles.placeholderText}>Nenhuma justificativa encontrada para esse filtro.</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {justifications.map((item) => (
            <Pressable key={item.id} onPress={() => router.push(`/justifications/${item.id}`)} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderCopy}>
                  <Text style={styles.cardDate}>{formatJustificationDate(item.createdAt)}</Text>
                  <Text style={styles.cardTitle}>{justificationTypeLabels[item.type]}</Text>
                </View>
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: `${statusColorByStatus[item.status]}20`,
                    },
                  ]}
                >
                  <Text style={[styles.badgeText, { color: statusColorByStatus[item.status] }]}>
                    {justificationStatusLabels[item.status]}
                  </Text>
                </View>
              </View>

              <Text numberOfLines={3} style={styles.cardReason}>
                {item.reason}
              </Text>

              {item.reviewNotes ? (
                <View style={styles.reviewBox}>
                  <AppIcon color={mobileTheme.danger} name="chatbubble-ellipses-outline" size={16} />
                  <Text style={styles.reviewText}>{item.reviewNotes}</Text>
                </View>
              ) : null}

              <View style={styles.cardFooter}>
                <Text style={styles.cardFooterText}>{justificationStatusDescriptions[item.status]}</Text>
                <AppIcon color={mobileTheme.primary} name="arrow-forward-outline" size={16} />
              </View>
            </Pressable>
          ))}
        </View>
      )}

      <Pressable style={styles.fab} onPress={() => router.push('/justifications/new')}>
        <AppIcon color="#ffffff" name="add" size={28} />
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mobileTheme.background,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
    gap: 18,
  },
  hero: {
    borderRadius: 26,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 20,
    gap: 16,
  },
  heroCopy: {
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: mobileTheme.text,
    letterSpacing: -0.8,
  },
  subtitle: {
    color: mobileTheme.mutedText,
    fontSize: 14,
    lineHeight: 21,
  },
  heroMetrics: {
    flexDirection: 'row',
    gap: 12,
  },
  metricPill: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: mobileTheme.surfaceLow,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: mobileTheme.primary,
  },
  metricLabel: {
    fontSize: 12,
    color: mobileTheme.mutedText,
  },
  filterRow: {
    gap: 10,
    paddingRight: 12,
  },
  filterChip: {
    minHeight: 40,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: mobileTheme.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: mobileTheme.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: mobileTheme.text,
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  placeholderCard: {
    minHeight: 160,
    borderRadius: 24,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  placeholderText: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    color: mobileTheme.mutedText,
  },
  list: {
    gap: 14,
  },
  card: {
    borderRadius: 22,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 18,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardHeaderCopy: {
    flex: 1,
    gap: 4,
  },
  cardDate: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: mobileTheme.mutedText,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: mobileTheme.text,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  cardReason: {
    fontSize: 14,
    lineHeight: 21,
    color: mobileTheme.mutedText,
  },
  reviewBox: {
    borderRadius: 16,
    backgroundColor: mobileTheme.dangerSoft,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  reviewText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: mobileTheme.danger,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardFooterText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: mobileTheme.primary,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 58,
    height: 58,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mobileTheme.primary,
    shadowColor: mobileTheme.primary,
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
});
