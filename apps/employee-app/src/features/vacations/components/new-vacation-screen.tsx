import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect } from 'react';
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

import { useCreateEmployeeVacation } from '../hooks/use-employee-vacations';
import {
  getVacationTotalDays,
  vacationFormSchema,
  type VacationFormValues,
} from '../lib/vacation-form-schema';

export const NewVacationScreen = () => {
  const { session } = useAppSession();
  const { employee } = useCurrentEmployee(session);
  const employeeId = employee?.id ?? null;
  const createVacation = useCreateEmployeeVacation(employeeId);

  const form = useForm<z.input<typeof vacationFormSchema>, unknown, VacationFormValues>({
    resolver: zodResolver(vacationFormSchema),
    defaultValues: {
      startDate: '',
      endDate: '',
      accrualPeriod: '2025/2026',
      coverageNotes: '',
      advanceThirteenthSalary: false,
      cashBonus: false,
    },
  });

  const startDateField = useController({ control: form.control, name: 'startDate' });
  const endDateField = useController({ control: form.control, name: 'endDate' });
  const accrualPeriodField = useController({ control: form.control, name: 'accrualPeriod' });
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

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!employeeId) {
      Alert.alert('Cadastro indisponível', 'Não encontramos seu vínculo para enviar a solicitação.');
      return;
    }

    try {
      await createVacation.mutateAsync({
        employeeId,
        startDate: values.startDate,
        endDate: values.endDate,
        totalDays,
        availableDays: 20,
        accrualPeriod: values.accrualPeriod || null,
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
            Pedido com {totalDays > 0 ? `${totalDays} dia(s)` : 'período em aberto'}
          </Text>
          <Text selectable style={styles.heroSubtitle}>
            Use o formato AAAA-MM-DD nas datas para facilitar a leitura no app.
          </Text>
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
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Período aquisitivo</Text>
            <TextInput
              placeholder="2025/2026"
              placeholderTextColor={mobileTheme.subtleText}
              value={accrualPeriodField.field.value ?? ''}
              onBlur={accrualPeriodField.field.onBlur}
              onChangeText={accrualPeriodField.field.onChange}
              style={styles.input}
            />
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
            disabled={createVacation.isPending}
            onPress={() => void handleSubmit()}
            style={[styles.primaryAction, createVacation.isPending && styles.actionDisabled]}
          >
            {createVacation.isPending ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <AppIcon color="#ffffff" name="send-outline" size={18} />
            )}
            <Text style={styles.primaryActionText}>
              {createVacation.isPending ? 'Enviando...' : 'Enviar solicitação'}
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
