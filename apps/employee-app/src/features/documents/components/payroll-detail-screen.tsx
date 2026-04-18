import { router, useLocalSearchParams } from 'expo-router';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/shared/components/app-icon';
import { MobileEmptyState } from '@/shared/components/mobile-empty-state';
import { MobilePageHeader } from '@/shared/components/mobile-page-header';
import { MobileDetailSkeleton } from '@/shared/components/mobile-skeleton';
import { useAppSession } from '@/shared/providers/app-providers';
import { mobileTheme } from '@/shared/theme/tokens';
import { useCurrentEmployee } from '@/features/employee/hooks/use-current-employee';

import { usePayrollStatementDetail } from '../hooks/use-employee-documents';
import { formatDocumentDate, formatMoney, payrollStatusLabels } from '../lib/documents-mobile';

export const PayrollDetailScreen = () => {
  const params = useLocalSearchParams<{ id?: string }>();
  const { session } = useAppSession();
  const { employee } = useCurrentEmployee(session);
  const detailQuery = usePayrollStatementDetail(params.id, employee?.id);
  const statement = detailQuery.data;

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
    >
      <MobilePageHeader
        title="Holerite"
        subtitle="Confira o resumo da competência e abra o comprovante em PDF."
        onBack={() => router.back()}
      />

      {detailQuery.isLoading ? (
        <MobileDetailSkeleton sectionCount={2} />
      ) : !statement ? (
        <MobileEmptyState
          iconName="wallet-outline"
          title="Holerite não encontrado"
          description="Esse comprovante não está mais disponível para o seu perfil."
          actionLabel="Voltar"
          onAction={() => router.replace('/payroll' as never)}
        />
      ) : (
        <>
          <View style={styles.hero}>
            <Text selectable style={styles.heroEyebrow}>
              Competência
            </Text>
            <Text selectable style={styles.heroTitle}>
              {statement.referenceLabel}
            </Text>
            <Text selectable style={styles.heroSubtitle}>
              Arquivo publicado em {formatDocumentDate(statement.issuedAt)}.
            </Text>
          </View>

          <View style={styles.valuesCard}>
            <View style={styles.valueBlock}>
              <Text style={styles.valueLabel}>Líquido</Text>
              <Text selectable style={styles.valueAmount}>
                {formatMoney(statement.netAmount)}
              </Text>
            </View>
            <View style={styles.valueBlock}>
              <Text style={styles.valueLabel}>Bruto</Text>
              <Text selectable style={styles.valueAmount}>
                {formatMoney(statement.grossAmount)}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Detalhes</Text>
            <View style={styles.infoList}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Status</Text>
                <Text selectable style={styles.infoValue}>
                  {payrollStatusLabels[statement.status] ?? 'Disponível'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Arquivo</Text>
                <Text selectable style={styles.infoValue}>
                  {statement.fileName}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Referência</Text>
                <Text selectable style={styles.infoValue}>
                  {statement.referenceMonth.toString().padStart(2, '0')}/{statement.referenceYear}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Ações</Text>
            <Pressable style={styles.primaryAction} onPress={() => void Linking.openURL(statement.fileUrl)}>
              <AppIcon color="#ffffff" name="download-outline" size={18} />
              <Text style={styles.primaryActionText}>Abrir comprovante</Text>
            </Pressable>
            <Pressable style={styles.secondaryAction} onPress={() => router.replace('/payroll' as never)}>
              <Text style={styles.secondaryActionText}>Voltar para holerites</Text>
            </Pressable>
          </View>
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
  valuesCard: {
    borderRadius: 26,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 20,
    flexDirection: 'row',
    gap: 12,
  },
  valueBlock: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: mobileTheme.surfaceLow,
    padding: 16,
    gap: 4,
  },
  valueLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: mobileTheme.subtleText,
    textTransform: 'uppercase',
  },
  valueAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: mobileTheme.text,
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
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
  secondaryAction: {
    minHeight: 52,
    borderRadius: 20,
    backgroundColor: mobileTheme.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: '800',
    color: mobileTheme.text,
  },
});
