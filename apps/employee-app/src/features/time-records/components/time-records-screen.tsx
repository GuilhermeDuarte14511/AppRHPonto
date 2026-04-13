import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useEmployeeAttendancePolicy } from '@/features/attendance/hooks/use-employee-attendance-policy';
import { useCurrentEmployee } from '@/features/employee/hooks/use-current-employee';
import { useEmployeeTimeRecords } from '@/features/time-records/hooks/use-employee-time-records';
import {
  filterTimeRecordsByPreset,
  formatDurationFromMinutes,
  formatTimeRecordDate,
  formatTimeRecordTime,
  timeRecordSourceLabels,
  timeRecordStatusLabels,
  timeRecordTypeLabels,
} from '@/features/time-records/lib/time-record-mobile';
import { AppIcon } from '@/shared/components/app-icon';
import { useAppSession } from '@/shared/providers/app-providers';
import { mobileTheme } from '@/shared/theme/tokens';

const statusColorByRecordStatus = {
  valid: mobileTheme.success,
  pending_review: mobileTheme.warning,
  adjusted: mobileTheme.primary,
  rejected: mobileTheme.danger,
} as const;

const filterOptions = [
  { id: 'all', label: 'Tudo' },
  { id: 'today', label: 'Hoje' },
  { id: 'week', label: '7 dias' },
  { id: 'pending_review', label: 'Em revisão' },
] as const;

type TimeRecordFilterPreset = (typeof filterOptions)[number]['id'];

export const EmployeeTimeRecordsScreen = () => {
  const { session } = useAppSession();
  const { employee, identity } = useCurrentEmployee(session);
  const employeeId = employee?.id ?? null;
  const { effectivePolicy } = useEmployeeAttendancePolicy(employeeId);
  const { records, todayRecords, workedMinutesToday, nextRecordType, timeRecordsQuery } = useEmployeeTimeRecords(employeeId);
  const [activeFilter, setActiveFilter] = useState<TimeRecordFilterPreset>('all');

  const filteredRecords = filterTimeRecordsByPreset(records, activeFilter);

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
    >
      <View style={styles.hero}>
        <Text style={styles.title}>Histórico de marcações</Text>
        <Text style={styles.subtitle}>
          Veja suas batidas, filtre o período que importa e abra qualquer registro para conferir o contexto completo.
        </Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryEyebrow}>Visão do dia</Text>
        <View style={styles.summaryHeader}>
          <View style={styles.summaryMetric}>
            <Text style={styles.summaryMetricLabel}>Horas de hoje</Text>
            <Text style={styles.summaryMetricValue}>{formatDurationFromMinutes(workedMinutesToday)}</Text>
          </View>
          <View style={styles.summaryMetric}>
            <Text style={styles.summaryMetricLabel}>Próxima batida</Text>
            <Text style={styles.summaryMetricValue}>{timeRecordTypeLabels[nextRecordType]}</Text>
          </View>
        </View>
        <Text style={styles.summaryText}>
          {effectivePolicy?.name ?? 'Carregando política'} · {todayRecords.length} marcação(ões) no período atual.
        </Text>
        <Text style={styles.summaryHint}>
          {identity.roleLabel} · Matrícula {identity.registrationNumber} · {identity.department}
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Registros</Text>
        <Pressable onPress={() => router.push('/(tabs)/profile')}>
          <Text style={styles.sectionLink}>Ver política</Text>
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {filterOptions.map((filter) => {
          const isActive = filter.id === activeFilter;

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

      {timeRecordsQuery.isLoading ? (
        <View style={styles.placeholderCard}>
          <ActivityIndicator color={mobileTheme.primary} />
          <Text style={styles.placeholderText}>Carregando suas marcações...</Text>
        </View>
      ) : timeRecordsQuery.isError ? (
        <View style={styles.placeholderCard}>
          <AppIcon color={mobileTheme.danger} name="alert-circle-outline" size={22} />
          <Text style={styles.placeholderText}>
            Não foi possível consultar seu histórico agora. Tente novamente em instantes.
          </Text>
        </View>
      ) : filteredRecords.length === 0 ? (
        <View style={styles.placeholderCard}>
          <AppIcon color={mobileTheme.subtleText} name="time-outline" size={22} />
          <Text style={styles.placeholderText}>Nenhum registro encontrado para esse filtro.</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {filteredRecords.map((record) => (
            <Pressable
              key={record.id}
              onPress={() => router.push(`/time-records/${record.id}`)}
              style={styles.recordCard}
            >
              <View style={styles.recordHeader}>
                <View style={styles.recordIcon}>
                  <AppIcon
                    color={mobileTheme.primary}
                    name={record.recordType.includes('break') ? 'restaurant-outline' : 'time-outline'}
                    size={18}
                  />
                </View>
                <View style={styles.recordHeaderCopy}>
                  <Text style={styles.recordTitle}>{timeRecordTypeLabels[record.recordType]}</Text>
                  <Text style={styles.recordMeta}>
                    {formatTimeRecordDate(record.recordedAt)} · {formatTimeRecordTime(record.recordedAt)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: `${statusColorByRecordStatus[record.status]}22`,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      {
                        color: statusColorByRecordStatus[record.status],
                      },
                    ]}
                  >
                    {timeRecordStatusLabels[record.status]}
                  </Text>
                </View>
              </View>
              <Text style={styles.recordSource}>{timeRecordSourceLabels[record.source]}</Text>
              <Text style={styles.recordText}>{record.notes ?? 'Registro sem observações adicionais.'}</Text>
              <View style={styles.recordFooter}>
                <Text style={styles.recordFooterText}>Abrir detalhes</Text>
                <AppIcon color={mobileTheme.primary} name="arrow-forward-outline" size={16} />
              </View>
            </Pressable>
          ))}
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
    padding: 20,
    paddingBottom: 120,
    gap: 16,
  },
  hero: {
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
    lineHeight: 21,
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
  summaryHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryMetric: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: mobileTheme.surfaceLow,
    padding: 14,
    gap: 4,
  },
  summaryMetricLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: mobileTheme.mutedText,
  },
  summaryMetricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: mobileTheme.text,
  },
  summaryText: {
    color: mobileTheme.text,
    lineHeight: 21,
    fontWeight: '600',
  },
  summaryHint: {
    color: mobileTheme.mutedText,
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: mobileTheme.text,
  },
  sectionLink: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: mobileTheme.primary,
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
    minHeight: 140,
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
    gap: 12,
  },
  recordCard: {
    borderRadius: 20,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 18,
    gap: 10,
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recordHeaderCopy: {
    flex: 1,
    gap: 3,
  },
  recordIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mobileTheme.surfaceLow,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: mobileTheme.text,
  },
  recordMeta: {
    color: mobileTheme.mutedText,
    fontSize: 13,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  recordSource: {
    color: mobileTheme.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  recordText: {
    color: mobileTheme.mutedText,
    lineHeight: 20,
  },
  recordFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  recordFooterText: {
    fontSize: 13,
    fontWeight: '700',
    color: mobileTheme.primary,
  },
});
