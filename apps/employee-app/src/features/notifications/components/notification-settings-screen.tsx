import { router } from 'expo-router';
import { useEffect } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { MobileEmptyState } from '@/shared/components/mobile-empty-state';
import { MobilePageHeader } from '@/shared/components/mobile-page-header';
import { MobileDetailSkeleton } from '@/shared/components/mobile-skeleton';
import { useAppSession } from '@/shared/providers/app-providers';
import { mobileTheme } from '@/shared/theme/tokens';

import {
  useEmployeeNotificationPreferences,
  useUpdateEmployeeNotificationPreferences,
} from '../hooks/use-employee-notifications';

const sections = [
  {
    title: 'Lembretes de ponto',
    items: [
      {
        key: 'notifyEntryReminder',
        title: 'Entrada',
        description: 'Lembrar de registrar o início da jornada.',
      },
      {
        key: 'notifyBreakReminder',
        title: 'Pausa para almoço',
        description: 'Avisos para início e retorno do intervalo.',
      },
      {
        key: 'notifyExitReminder',
        title: 'Saída',
        description: 'Lembrar de concluir a jornada diária.',
      },
    ],
  },
  {
    title: 'Ocorrências e RH',
    items: [
      {
        key: 'notifyJustificationStatus',
        title: 'Retorno de justificativas',
        description: 'Quando o RH aprovar ou reprovar uma solicitação.',
      },
      {
        key: 'notifyRhAdjustment',
        title: 'Ações solicitadas pelo RH',
        description: 'Quando houver ajuste pendente da sua parte.',
      },
      {
        key: 'notifyVacationStatus',
        title: 'Férias',
        description: 'Andamento de solicitações e alertas do período.',
      },
    ],
  },
  {
    title: 'Comunicados',
    items: [
      {
        key: 'notifyDocuments',
        title: 'Documentos publicados',
        description: 'Novos arquivos, termos e comunicados do seu cadastro.',
      },
      {
        key: 'notifyPayroll',
        title: 'Holerites',
        description: 'Disponibilização de comprovantes mensais.',
      },
      {
        key: 'notifyCompanyCommunications',
        title: 'Comunicados da empresa',
        description: 'Informações gerais, políticas e avisos corporativos.',
      },
      {
        key: 'notifySystemAlerts',
        title: 'Alertas do sistema',
        description: 'Manutenções, indisponibilidades e avisos críticos.',
      },
    ],
  },
] as const;

export const NotificationSettingsScreen = () => {
  const { session } = useAppSession();
  const userId = session?.user.id ?? null;
  const preferencesQuery = useEmployeeNotificationPreferences(userId);
  const updatePreferences = useUpdateEmployeeNotificationPreferences(userId);

  useEffect(() => {
    if (updatePreferences.isSuccess) {
      Alert.alert('Preferências atualizadas', 'Suas notificações foram ajustadas com sucesso.');
      updatePreferences.reset();
    }
  }, [updatePreferences]);

  const preferences = preferencesQuery.data;

  const handleToggle = async (key: keyof NonNullable<typeof preferences>) => {
    if (!preferences) {
      return;
    }

    try {
      await updatePreferences.mutateAsync({
        ...preferences,
        [key]: !preferences[key],
      });
    } catch {
      Alert.alert('Não foi possível salvar', 'Tente novamente em alguns instantes.');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
    >
      <MobilePageHeader
        title="Configurações"
        subtitle="Personalize como o app avisa você sobre jornada, férias, documentos e respostas do RH."
        onBack={() => router.back()}
      />

      {preferencesQuery.isLoading ? (
        <MobileDetailSkeleton sectionCount={3} />
      ) : !preferences ? (
        <MobileEmptyState
          iconName="settings-outline"
          title="Preferências indisponíveis"
          description="Ainda não encontramos o conjunto de notificações do seu cadastro."
        />
      ) : (
        sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.card}>
              {section.items.map((item, index) => (
                <View
                  key={item.key}
                  style={[styles.preferenceRow, index < section.items.length - 1 && styles.preferenceRowBorder]}
                >
                  <View style={styles.preferenceCopy}>
                    <Text selectable style={styles.preferenceTitle}>
                      {item.title}
                    </Text>
                    <Text selectable style={styles.preferenceDescription}>
                      {item.description}
                    </Text>
                  </View>
                  <Switch
                    value={Boolean(preferences[item.key])}
                    onValueChange={() => void handleToggle(item.key)}
                    thumbColor="#ffffff"
                    trackColor={{
                      false: mobileTheme.surfaceHigh,
                      true: mobileTheme.primaryStrong,
                    }}
                    ios_backgroundColor={mobileTheme.surfaceHigh}
                  />
                </View>
              ))}
            </View>
          </View>
        ))
      )}

      <Pressable style={styles.secondaryAction} onPress={() => router.replace('/notifications' as never)}>
        <Text style={styles.secondaryActionText}>Voltar para mensagens</Text>
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
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: mobileTheme.subtleText,
    textTransform: 'uppercase',
    paddingHorizontal: 2,
  },
  card: {
    borderRadius: 26,
    backgroundColor: mobileTheme.surfaceRaised,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
  },
  preferenceRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: mobileTheme.border,
    opacity: 1,
  },
  preferenceCopy: {
    flex: 1,
    gap: 4,
  },
  preferenceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: mobileTheme.text,
  },
  preferenceDescription: {
    fontSize: 12,
    lineHeight: 19,
    color: mobileTheme.mutedText,
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
});
