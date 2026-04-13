import { router } from 'expo-router';
import { ActivityIndicator, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useCurrentEmployee } from '@/features/employee/hooks/use-current-employee';
import { AppIcon } from '@/shared/components/app-icon';
import { MobileEmptyState } from '@/shared/components/mobile-empty-state';
import { MobilePageHeader } from '@/shared/components/mobile-page-header';
import { useAppSession } from '@/shared/providers/app-providers';
import { mobileTheme } from '@/shared/theme/tokens';

import { usePayrollStatements } from '../hooks/use-employee-documents';
import { buildPayrollEyebrow, formatMoney, payrollStatusLabels } from '../lib/documents-mobile';

export const PayrollScreen = () => {
  const { session } = useAppSession();
  const { employee } = useCurrentEmployee(session);
  const employeeId = employee?.id ?? null;
  const statementsQuery = usePayrollStatements(employeeId);
  const statements = statementsQuery.data ?? [];

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
    >
      <MobilePageHeader
        title="Holerites"
        subtitle="Acompanhe os comprovantes mensais liberados para a sua folha."
        onBack={() => router.back()}
      />

      <View style={styles.hero}>
        <Text selectable style={styles.heroEyebrow}>
          Folha pessoal
        </Text>
        <Text selectable style={styles.heroTitle}>
          {statements.length} competência(s) disponíveis
        </Text>
        <Text selectable style={styles.heroSubtitle}>
          Consulte valores líquidos, valores brutos e abra o PDF original sempre que precisar.
        </Text>
      </View>

      {statementsQuery.isLoading ? (
        <View style={styles.loadingCard}>
          <ActivityIndicator color={mobileTheme.primary} />
          <Text style={styles.loadingText}>Buscando seus holerites...</Text>
        </View>
      ) : statements.length === 0 ? (
        <MobileEmptyState
          iconName="wallet-outline"
          title="Nenhum holerite disponível"
          description="Assim que a folha for publicada para o seu vínculo, os comprovantes aparecerão aqui."
        />
      ) : (
        <View style={styles.list}>
          {statements.map((item) => (
            <Pressable key={item.id} onPress={() => router.push(`/payroll/${item.id}` as never)} style={styles.card}>
              <View style={styles.iconWrap}>
                <AppIcon color={mobileTheme.primary} name="wallet-outline" size={22} />
              </View>

              <View style={styles.copy}>
                <Text selectable style={styles.eyebrow}>
                  {buildPayrollEyebrow(item)}
                </Text>
                <Text selectable style={styles.title}>
                  {item.referenceLabel}
                </Text>
                <View style={styles.valuesRow}>
                  <View style={styles.valueChip}>
                    <Text style={styles.valueLabel}>Líquido</Text>
                    <Text selectable style={styles.valueAmount}>
                      {formatMoney(item.netAmount)}
                    </Text>
                  </View>
                  <View style={styles.valueChip}>
                    <Text style={styles.valueLabel}>Bruto</Text>
                    <Text selectable style={styles.valueAmount}>
                      {formatMoney(item.grossAmount)}
                    </Text>
                  </View>
                </View>
                <View style={styles.metaRow}>
                  <Text selectable style={styles.statusText}>
                    {payrollStatusLabels[item.status] ?? 'Disponível'}
                  </Text>
                  <Pressable onPress={() => void Linking.openURL(item.fileUrl)} style={styles.inlineLink}>
                    <Text style={styles.inlineLinkText}>Abrir PDF</Text>
                  </Pressable>
                </View>
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 18,
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
    backgroundColor: mobileTheme.primarySoft,
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
  valuesRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  valueChip: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: mobileTheme.surfaceLow,
    padding: 12,
    gap: 4,
  },
  valueLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: mobileTheme.subtleText,
    textTransform: 'uppercase',
  },
  valueAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: mobileTheme.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: mobileTheme.primary,
  },
  inlineLink: {
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineLinkText: {
    fontSize: 12,
    fontWeight: '800',
    color: mobileTheme.primary,
  },
});
