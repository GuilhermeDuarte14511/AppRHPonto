import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { useController, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import type { z } from 'zod';

import { useCurrentEmployee } from '@/features/employee/hooks/use-current-employee';
import { AppIcon } from '@/shared/components/app-icon';
import { MobilePageHeader } from '@/shared/components/mobile-page-header';
import { useAppSession } from '@/shared/providers/app-providers';
import { mobileTheme } from '@/shared/theme/tokens';

import { useCreateEmployeeVacation, useEmployeeVacations } from '../hooks/use-employee-vacations';
import { buildVacationEntitlementSnapshot } from '../lib/vacation-entitlement';
import {
  getVacationTotalDays,
  vacationFormSchema,
  type VacationFormValues,
} from '../lib/vacation-form-schema';
import { formatVacationAllowance, formatVacationDate } from '../lib/vacations-mobile';

export const NewVacationScreen = () => {
  const { session } = useAppSession();
  const { employee } = useCurrentEmployee(session);
  const employeeId = employee?.id ?? null;
  const createVacation = useCreateEmployeeVacation(employeeId);
  const vacationsQuery = useEmployeeVacations(employeeId);
  const entitlement = useMemo(
    () => buildVacationEntitlementSnapshot(employee, vacationsQuery.data ?? []),
    [employee, vacationsQuery.data],
  );

  const form = useForm<z.input<typeof vacationFormSchema>, unknown, VacationFormValues>({
    resolver: zodResolver(vacationFormSchema),
    defaultValues: {
      startDate: '',
      endDate: '',
      coverageNotes: '',
      advanceThirteenthSalary: false,
      cashBonus: false,
    },
  });

  const startDateField = useController({ control: form.control, name: 'startDate' });
  const endDateField = useController({ control: form.control, name: 'endDate' });
  const coverageNotesField = useController({ control: form.control, name: 'coverageNotes' });
  const advanceThirteenthField = useController({ control: form.control, name: 'advanceThirteenthSalary' });
  const cashBonusField = useController({ control: form.control, name: 'cashBonus' });
  const watchedStartDate = form.watch('startDate');
  const watchedEndDate = form.watch('endDate');

  useEffect(() => {
    if (createVacation.isSuccess) {
      Alert.alert('Solicitação enviada', 'Seu pedido de férias foi registrado com sucesso.');
      router.replace(`/vacations/${createVacation.data.id}` as never);
    }
  }, [createVacation.data, createVacation.isSuccess]);

  const totalDays =
    watchedStartDate && watchedEndDate
      ? getVacationTotalDays({
          startDate: watchedStartDate,
          endDate: watchedEndDate,
        })
      : 0;
  const remainingAfterRequest = entitlement.remainingDaysAfterRequest(totalDays);

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!employeeId) {
      Alert.alert('Cadastro indisponível', 'Não encontramos seu vínculo para enviar a solicitação.');
      return;
    }

    if (!entitlement.isEligible) {
      Alert.alert(
        'Período ainda indisponível',
        entitlement.availabilityDate
          ? `Suas férias ficam elegíveis a partir de ${formatVacationDate(entitlement.availabilityDate)}.`
          : 'Ainda não foi possível validar sua elegibilidade para férias.',
      );
      return;
    }

    if (!entitlement.accrualPeriodLabel) {
      Alert.alert('Período não identificado', 'Não conseguimos definir o período aquisitivo atual para esta solicitação.');
      return;
    }

    if (totalDays <= 0) {
      Alert.alert('Período inválido', 'Informe um intervalo válido para calcular a quantidade de dias solicitados.');
      return;
    }

    if (totalDays > entitlement.availableDays) {
      Alert.alert(
        'Saldo insuficiente',
        `Você está solicitando ${formatVacationAllowance(totalDays)}, mas possui ${formatVacationAllowance(
          entitlement.availableDays,
        )} disponíveis no período atual.`,
      );
      return;
    }

    try {
      await createVacation.mutateAsync({
        employeeId,
        startDate: values.startDate,
        endDate: values.endDate,
        totalDays,
        availableDays: remainingAfterRequest,
        accrualPeriod: entitlement.accrualPeriodLabel,
        advanceThirteenthSalary: values.advanceThirteenthSalary,
        cashBonus: values.cashBonus,
        coverageNotes: values.coverageNotes || null,
      });
    } catch {
      Alert.alert('Não foi possível enviar', 'Tente novamente em alguns instantes.');
    }
  });

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        style={styles.container}
      >
        <MobilePageHeader
          title="Nova solicitação"
          subtitle="Informe o período desejado e compartilhe com o RH como a cobertura foi combinada."
          onBack={() => router.back()}
        />

        <View style={styles.hero}>
          <Text selectable style={styles.heroEyebrow}>
            Planeje com antecedência
          </Text>
          <Text selectable style={styles.heroTitle}>
            {entitlement.isEligible
              ? `${formatVacationAllowance(entitlement.availableDays)} disponíveis`
              : 'Elegibilidade em andamento'}
          </Text>
          <Text selectable style={styles.heroSubtitle}>
            {entitlement.isEligible
              ? `Período aquisitivo ${entitlement.accrualPeriodLabel ?? 'não identificado'} · reserva prevista de ${formatVacationAllowance(
                  totalDays,
                )}.`
              : entitlement.availabilityDate
                ? `Seu primeiro ciclo fica disponível em ${formatVacationDate(entitlement.availabilityDate)}.`
                : 'Ainda não foi possível validar seu período aquisitivo automaticamente.'}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Saldo e elegibilidade</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Período atual</Text>
              <Text style={styles.infoValue}>{entitlement.accrualPeriodLabel ?? 'Não identificado'}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Saldo disponível</Text>
              <Text style={styles.infoValue}>{formatVacationAllowance(entitlement.availableDays)}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Já reservado</Text>
              <Text style={styles.infoValue}>{formatVacationAllowance(entitlement.reservedDays)}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Após este pedido</Text>
              <Text style={styles.infoValue}>{formatVacationAllowance(remainingAfterRequest)}</Text>
            </View>
          </View>
          {!entitlement.isEligible && entitlement.availabilityDate ? (
            <Text style={styles.helperText}>
              Você poderá abrir o pedido a partir de {formatVacationDate(entitlement.availabilityDate)}.
            </Text>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Período solicitado</Text>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Data inicial</Text>
            <TextInput
              placeholder="2026-05-10"
              placeholderTextColor={mobileTheme.subtleText}
              value={startDateField.field.value}
              onBlur={startDateField.field.onBlur}
              onChangeText={startDateField.field.onChange}
              style={styles.input}
            />
            {startDateField.fieldState.error ? <Text style={styles.errorText}>{startDateField.fieldState.error.message}</Text> : null}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Data final</Text>
            <TextInput
              placeholder="2026-05-20"
              placeholderTextColor={mobileTheme.subtleText}
              value={endDateField.field.value}
              onBlur={endDateField.field.onBlur}
              onChangeText={endDateField.field.onChange}
              style={styles.input}
            />
            {endDateField.fieldState.error ? <Text style={styles.errorText}>{endDateField.fieldState.error.message}</Text> : null}
            <Text style={styles.helperText}>
              {totalDays > 0
                ? `O período selecionado representa ${formatVacationAllowance(totalDays)}.`
                : 'Use o formato AAAA-MM-DD para calcular automaticamente a quantidade de dias.'}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cobertura combinada</Text>
          <TextInput
            multiline
            placeholder="Explique como o time vai cobrir suas entregas durante o período."
            placeholderTextColor={mobileTheme.subtleText}
            value={coverageNotesField.field.value ?? ''}
            onBlur={coverageNotesField.field.onBlur}
            onChangeText={coverageNotesField.field.onChange}
            style={styles.textArea}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Preferências do pedido</Text>
          <View style={styles.toggleRow}>
            <View style={styles.toggleCopy}>
              <Text style={styles.toggleTitle}>Antecipar 13º salário</Text>
              <Text style={styles.toggleDescription}>Solicitar o adiantamento junto com as férias.</Text>
            </View>
            <Switch
              value={advanceThirteenthField.field.value}
              onValueChange={advanceThirteenthField.field.onChange}
              thumbColor="#ffffff"
              trackColor={{ false: mobileTheme.surfaceHigh, true: mobileTheme.primaryStrong }}
              ios_backgroundColor={mobileTheme.surfaceHigh}
            />
          </View>
          <View style={styles.toggleRow}>
            <View style={styles.toggleCopy}>
              <Text style={styles.toggleTitle}>Abono pecuniário</Text>
              <Text style={styles.toggleDescription}>Indicar interesse na conversão autorizada em abono.</Text>
            </View>
            <Switch
              value={cashBonusField.field.value}
              onValueChange={cashBonusField.field.onChange}
              thumbColor="#ffffff"
              trackColor={{ false: mobileTheme.surfaceHigh, true: mobileTheme.primaryStrong }}
              ios_backgroundColor={mobileTheme.surfaceHigh}
            />
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            disabled={createVacation.isPending || !entitlement.isEligible || vacationsQuery.isLoading}
            onPress={() => void handleSubmit()}
            style={[
              styles.primaryAction,
              (createVacation.isPending || !entitlement.isEligible || vacationsQuery.isLoading) && styles.actionDisabled,
            ]}
          >
            {createVacation.isPending || vacationsQuery.isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <AppIcon color="#ffffff" name="send-outline" size={18} />
            )}
            <Text style={styles.primaryActionText}>
              {createVacation.isPending
                ? 'Enviando...'
                : vacationsQuery.isLoading
                  ? 'Calculando saldo...'
                  : !entitlement.isEligible
                    ? 'Aguardando elegibilidade'
                    : 'Enviar solicitação'}
            </Text>
          </Pressable>
          <Pressable style={styles.secondaryAction} onPress={() => router.back()}>
            <Text style={styles.secondaryActionText}>Cancelar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: mobileTheme.background,
  },
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
  infoGrid: {
    gap: 12,
  },
  infoCard: {
    borderRadius: 18,
    backgroundColor: mobileTheme.surfaceLow,
    padding: 14,
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
    fontSize: 15,
    fontWeight: '700',
    color: mobileTheme.text,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: mobileTheme.text,
  },
  input: {
    minHeight: 52,
    borderRadius: 18,
    backgroundColor: mobileTheme.surfaceLow,
    paddingHorizontal: 16,
    fontSize: 15,
    color: mobileTheme.text,
  },
  textArea: {
    minHeight: 120,
    borderRadius: 18,
    backgroundColor: mobileTheme.surfaceLow,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 15,
    lineHeight: 22,
    color: mobileTheme.text,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    justifyContent: 'space-between',
  },
  toggleCopy: {
    flex: 1,
    gap: 4,
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: mobileTheme.text,
  },
  toggleDescription: {
    fontSize: 12,
    lineHeight: 19,
    color: mobileTheme.mutedText,
  },
  errorText: {
    fontSize: 12,
    color: mobileTheme.danger,
  },
  helperText: {
    fontSize: 12,
    lineHeight: 19,
    color: mobileTheme.mutedText,
  },
  actions: {
    gap: 12,
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
    backgroundColor: mobileTheme.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: '800',
    color: mobileTheme.text,
  },
  actionDisabled: {
    opacity: 0.7,
  },
});
