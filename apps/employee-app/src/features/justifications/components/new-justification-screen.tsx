import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import type { JustificationType, TimeRecordType } from '@rh-ponto/types';
import type { z } from 'zod';

import { useCurrentEmployee } from '@/features/employee/hooks/use-current-employee';
import { useEmployeeTimeRecords } from '@/features/time-records/hooks/use-employee-time-records';
import { formatTimeRecordDateTime, timeRecordTypeLabels } from '@/features/time-records/lib/time-record-mobile';
import { AppIcon } from '@/shared/components/app-icon';
import { useAppSession } from '@/shared/providers/app-providers';
import { mobileTheme } from '@/shared/theme/tokens';

import { useCreateJustification } from '../hooks/use-create-justification';
import {
  employeeJustificationFormSchema,
  parseRequestedDateTime,
  type EmployeeJustificationFormValues,
} from '../lib/justification-form-schema';
import { justificationTypeLabels, requestedRecordTypeLabels } from '../lib/justification-mobile';

const justificationTypeOptions = [
  'missing_record',
  'late',
  'absence',
  'adjustment_request',
] as const satisfies readonly JustificationType[];

const requestedTypeOptions = ['entry', 'break_start', 'break_end', 'exit'] as const satisfies readonly TimeRecordType[];

export const NewJustificationScreen = () => {
  const { session } = useAppSession();
  const { employee, scenario } = useCurrentEmployee(session);
  const employeeId = employee?.id ?? scenario?.employeeId ?? null;
  const { records } = useEmployeeTimeRecords(employeeId);
  const createJustification = useCreateJustification();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<z.input<typeof employeeJustificationFormSchema>, unknown, EmployeeJustificationFormValues>({
    resolver: zodResolver(employeeJustificationFormSchema),
    defaultValues: {
      type: 'missing_record',
      timeRecordId: '',
      requestedRecordType: '',
      requestedRecordedAt: '',
      reason: '',
    },
  });

  const typeField = useController({
    control: form.control,
    name: 'type',
  });
  const timeRecordField = useController({
    control: form.control,
    name: 'timeRecordId',
  });
  const requestedRecordTypeField = useController({
    control: form.control,
    name: 'requestedRecordType',
  });
  const requestedRecordedAtField = useController({
    control: form.control,
    name: 'requestedRecordedAt',
  });
  const reasonField = useController({
    control: form.control,
    name: 'reason',
  });

  const recentRecords = useMemo(() => records.slice(0, 6), [records]);

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!employeeId) {
      Alert.alert('Cadastro indisponível', 'Não encontramos seu vínculo para enviar a justificativa.');
      return;
    }

    try {
      setSubmitError(null);

      const created = await createJustification.mutateAsync({
        employeeId,
        timeRecordId: values.timeRecordId ?? null,
        type: values.type,
        reason: values.reason.trim(),
        requestedRecordType: values.requestedRecordType ?? null,
        requestedRecordedAt: parseRequestedDateTime(values.requestedRecordedAt),
      });

      Alert.alert('Justificativa enviada', 'Sua solicitação foi registrada e já está aguardando análise do RH.');
      router.replace(`/justifications/${created.id}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Não foi possível enviar a justificativa.');
    }
  });

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        style={styles.container}
      >
        <View style={styles.topBar}>
          <Pressable style={styles.topBarButton} onPress={() => router.back()}>
            <AppIcon color={mobileTheme.text} name="arrow-back-outline" size={20} />
          </Pressable>
          <Text style={styles.topBarTitle}>Nova justificativa</Text>
          <View style={styles.topBarSpacer} />
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Explique a ocorrência</Text>
          <Text style={styles.heroSubtitle}>
            Descreva o motivo, relacione uma batida quando fizer sentido e deixe claro o horário que deseja ajustar.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Tipo da solicitação</Text>
          <View style={styles.chipGrid}>
            {justificationTypeOptions.map((option) => {
              const isActive = typeField.field.value === option;

              return (
                <Pressable
                  key={option}
                  onPress={() => typeField.field.onChange(option)}
                  style={[styles.selectionChip, isActive && styles.selectionChipActive]}
                >
                  <Text style={[styles.selectionChipText, isActive && styles.selectionChipTextActive]}>
                    {justificationTypeLabels[option]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {typeField.fieldState.error ? <Text style={styles.errorText}>{typeField.fieldState.error.message}</Text> : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Vincular uma marcação</Text>
          <Text style={styles.sectionHint}>Opcional. Escolha uma batida recente quando a solicitação estiver ligada a um registro específico.</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recordScroll}>
            <Pressable
              onPress={() => timeRecordField.field.onChange(undefined)}
              style={[styles.recordChip, !timeRecordField.field.value && styles.recordChipActive]}
            >
              <Text style={[styles.recordChipTitle, !timeRecordField.field.value && styles.recordChipTitleActive]}>Sem vínculo</Text>
            </Pressable>
            {recentRecords.map((record) => {
              const isActive = timeRecordField.field.value === record.id;

              return (
                <Pressable
                  key={record.id}
                  onPress={() => timeRecordField.field.onChange(record.id)}
                  style={[styles.recordChip, isActive && styles.recordChipActive]}
                >
                  <Text style={[styles.recordChipTitle, isActive && styles.recordChipTitleActive]}>
                    {timeRecordTypeLabels[record.recordType]}
                  </Text>
                  <Text style={[styles.recordChipText, isActive && styles.recordChipTextActive]}>
                    {formatTimeRecordDateTime(record.recordedAt)}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ajuste solicitado</Text>
          <Text style={styles.sectionHint}>Preencha se você estiver pedindo a criação ou correção de um horário específico.</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Tipo de batida</Text>
            <View style={styles.chipGrid}>
              <Pressable
                onPress={() => requestedRecordTypeField.field.onChange(undefined)}
                style={[styles.selectionChip, !requestedRecordTypeField.field.value && styles.selectionChipActive]}
              >
                <Text
                  style={[
                    styles.selectionChipText,
                    !requestedRecordTypeField.field.value && styles.selectionChipTextActive,
                  ]}
                >
                  Não informar
                </Text>
              </Pressable>
              {requestedTypeOptions.map((option) => {
                const isActive = requestedRecordTypeField.field.value === option;

                return (
                  <Pressable
                    key={option}
                    onPress={() => requestedRecordTypeField.field.onChange(option)}
                    style={[styles.selectionChip, isActive && styles.selectionChipActive]}
                  >
                    <Text style={[styles.selectionChipText, isActive && styles.selectionChipTextActive]}>
                      {requestedRecordTypeLabels[option]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Data e horário desejados</Text>
            <View style={styles.inputContainer}>
              <AppIcon color={mobileTheme.subtleText} name="calendar-outline" size={18} />
              <TextInput
                placeholder="Ex.: 12/04/2026 08:00"
                placeholderTextColor={mobileTheme.subtleText}
                style={styles.input}
                value={requestedRecordedAtField.field.value ?? ''}
                onBlur={requestedRecordedAtField.field.onBlur}
                onChangeText={requestedRecordedAtField.field.onChange}
              />
            </View>
            <Text style={styles.fieldHint}>Você também pode informar uma data ISO, se preferir.</Text>
            {requestedRecordedAtField.fieldState.error ? (
              <Text style={styles.errorText}>{requestedRecordedAtField.fieldState.error.message}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Motivo</Text>
          <View style={[styles.inputContainer, styles.textAreaContainer]}>
            <TextInput
              multiline
              placeholder="Explique o que aconteceu e, se possível, informe contexto suficiente para o RH analisar."
              placeholderTextColor={mobileTheme.subtleText}
              style={styles.textArea}
              textAlignVertical="top"
              value={reasonField.field.value}
              onBlur={reasonField.field.onBlur}
              onChangeText={reasonField.field.onChange}
            />
          </View>
          <Text style={styles.fieldHint}>{reasonField.field.value.length}/600 caracteres</Text>
          {reasonField.fieldState.error ? <Text style={styles.errorText}>{reasonField.fieldState.error.message}</Text> : null}
        </View>

        <View style={styles.card}>
          <View style={styles.inlineInfo}>
            <AppIcon color={mobileTheme.primary} name="information-circle-outline" size={18} />
            <Text style={styles.inlineInfoText}>
              O envio de anexos ficará disponível na próxima etapa. Se o RH já tiver um documento relacionado, ele aparecerá no detalhe.
            </Text>
          </View>
        </View>

        {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}

        <View style={styles.actions}>
          <Pressable
            disabled={createJustification.isPending}
            onPress={() => void handleSubmit()}
            style={[styles.primaryAction, createJustification.isPending && styles.actionDisabled]}
          >
            {createJustification.isPending ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <AppIcon color="#ffffff" name="send-outline" size={18} />
            )}
            <Text style={styles.primaryActionText}>
              {createJustification.isPending ? 'Enviando...' : 'Enviar justificativa'}
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
    paddingBottom: 48,
    gap: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mobileTheme.surfaceRaised,
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: mobileTheme.text,
  },
  topBarSpacer: {
    width: 40,
    height: 40,
  },
  hero: {
    borderRadius: 26,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 22,
    gap: 8,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: mobileTheme.text,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: mobileTheme.mutedText,
  },
  card: {
    borderRadius: 24,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 18,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: mobileTheme.text,
  },
  sectionHint: {
    fontSize: 13,
    lineHeight: 20,
    color: mobileTheme.mutedText,
  },
  fieldGroup: {
    gap: 10,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: mobileTheme.text,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  selectionChip: {
    minHeight: 42,
    borderRadius: 999,
    backgroundColor: mobileTheme.surfaceLow,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionChipActive: {
    backgroundColor: mobileTheme.primary,
  },
  selectionChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: mobileTheme.text,
  },
  selectionChipTextActive: {
    color: '#ffffff',
  },
  recordScroll: {
    gap: 12,
    paddingRight: 10,
  },
  recordChip: {
    width: 190,
    borderRadius: 18,
    backgroundColor: mobileTheme.surfaceLow,
    padding: 14,
    gap: 8,
  },
  recordChipActive: {
    backgroundColor: mobileTheme.primary,
  },
  recordChipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: mobileTheme.text,
  },
  recordChipTitleActive: {
    color: '#ffffff',
  },
  recordChipText: {
    fontSize: 12,
    lineHeight: 18,
    color: mobileTheme.mutedText,
  },
  recordChipTextActive: {
    color: 'rgba(255,255,255,0.84)',
  },
  inputContainer: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: mobileTheme.surfaceLow,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: mobileTheme.text,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    paddingVertical: 14,
  },
  textArea: {
    minHeight: 124,
    width: '100%',
    fontSize: 15,
    color: mobileTheme.text,
    lineHeight: 22,
  },
  fieldHint: {
    fontSize: 12,
    lineHeight: 18,
    color: mobileTheme.mutedText,
  },
  errorText: {
    fontSize: 12,
    lineHeight: 18,
    color: mobileTheme.danger,
  },
  inlineInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  inlineInfoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: mobileTheme.mutedText,
  },
  submitError: {
    fontSize: 13,
    lineHeight: 20,
    color: mobileTheme.danger,
  },
  actions: {
    gap: 12,
    paddingTop: 4,
  },
  primaryAction: {
    minHeight: 54,
    borderRadius: 20,
    backgroundColor: mobileTheme.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryActionText: {
    fontSize: 15,
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
    fontSize: 15,
    fontWeight: '800',
    color: mobileTheme.text,
  },
  actionDisabled: {
    opacity: 0.7,
  },
});
