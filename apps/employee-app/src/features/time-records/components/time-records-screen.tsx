import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useEmployeeAttendancePolicy } from '@/features/attendance/hooks/use-employee-attendance-policy';
import { useAppSession } from '@/shared/providers/app-providers';
import { mobileTheme } from '@/shared/theme/tokens';

export const EmployeeTimeRecordsScreen = () => {
  const { session } = useAppSession();
  const { scenario, effectivePolicy } = useEmployeeAttendancePolicy(session?.user.email);

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
    >
      <View style={styles.hero}>
        <Text style={styles.title}>Histórico de marcações</Text>
        <Text style={styles.subtitle}>
          Acompanhe as últimas batidas e como a política atual impacta a validação do seu ponto.
        </Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryEyebrow}>Política aplicada</Text>
        <Text style={styles.summaryTitle}>{effectivePolicy?.name ?? 'Carregando política'}</Text>
        <Text style={styles.summaryText}>
          {effectivePolicy?.description ?? 'Buscando a política operacional vinculada ao seu cadastro.'}
        </Text>
      </View>

      <View style={styles.list}>
        {scenario?.recentRecords.map((record) => (
          <View key={record.id} style={styles.recordCard}>
            <Text style={styles.recordTitle}>{record.label}</Text>
            <Text style={styles.recordMeta}>
              {record.typeLabel} · {record.statusLabel}
            </Text>
            <Text style={styles.recordMeta}>{record.sourceLabel}</Text>
            <Text style={styles.recordText}>{record.notes}</Text>
          </View>
        ))}
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
    padding: 20,
    gap: 16,
  },
  hero: {
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: mobileTheme.text,
  },
  subtitle: {
    color: mobileTheme.mutedText,
    lineHeight: 21,
  },
  summaryCard: {
    borderRadius: 24,
    backgroundColor: mobileTheme.surface,
    padding: 20,
    gap: 10,
  },
  summaryEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: mobileTheme.primary,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: mobileTheme.text,
  },
  summaryText: {
    color: mobileTheme.mutedText,
    lineHeight: 21,
  },
  list: {
    gap: 12,
  },
  recordCard: {
    borderRadius: 20,
    backgroundColor: '#fff',
    padding: 18,
    gap: 6,
    borderWidth: 1,
    borderColor: mobileTheme.border,
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
  recordText: {
    color: mobileTheme.mutedText,
    lineHeight: 20,
  },
});
