import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/shared/components/app-icon';
import { MobileEmptyState } from '@/shared/components/mobile-empty-state';
import { MobilePageHeader } from '@/shared/components/mobile-page-header';
import { MobileDetailSkeleton } from '@/shared/components/mobile-skeleton';
import { useAppSession } from '@/shared/providers/app-providers';
import { mobileTheme } from '@/shared/theme/tokens';
import { useCurrentEmployee } from '@/features/employee/hooks/use-current-employee';

import { useAcknowledgeEmployeeDocument, useEmployeeDocumentDetail } from '../hooks/use-employee-documents';
import { resolveEmployeeDocumentAttention } from '../lib/document-attention';
import {
  documentCategoryLabels,
  formatDocumentDate,
} from '../lib/documents-mobile';

export const DocumentDetailScreen = () => {
  const params = useLocalSearchParams<{ id?: string }>();
  const { session } = useAppSession();
  const { employee } = useCurrentEmployee(session);
  const detailQuery = useEmployeeDocumentDetail(params.id, employee?.id);
  const acknowledgeDocument = useAcknowledgeEmployeeDocument(employee?.id, params.id);
  const document = detailQuery.data;
  const attention = document ? resolveEmployeeDocumentAttention(document) : null;

  const handleOpenDocument = async () => {
    if (!document) {
      return;
    }

    await Linking.openURL(document.fileUrl);
  };

  const handleAcknowledgeDocument = async () => {
    if (!document || !attention?.requiresAcknowledgement) {
      return;
    }

    try {
      await acknowledgeDocument.mutateAsync();
      Alert.alert(
        'Ciência registrada',
        'Atualizamos o documento no seu histórico e ele já saiu da fila de pendências.',
      );
    } catch {
      Alert.alert(
        'Não foi possível registrar a ciência',
        'Tente novamente em instantes. Se o problema continuar, fale com o RH.',
      );
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
    >
      <MobilePageHeader
        title="Documento"
        subtitle="Detalhes do arquivo liberado para o seu cadastro."
        onBack={() => router.back()}
      />

      {detailQuery.isLoading ? (
        <MobileDetailSkeleton sectionCount={2} />
      ) : !document ? (
        <MobileEmptyState
          iconName="document-text-outline"
          title="Documento não encontrado"
          description="Esse item pode ter sido removido ou não estar mais disponível para a sua conta."
          actionLabel="Voltar"
          onAction={() => router.replace('/documents' as never)}
        />
      ) : (
        <>
          <View style={styles.hero}>
            <Text selectable style={styles.heroEyebrow}>
              {documentCategoryLabels[document.category] ?? 'Documento'}
            </Text>
            <Text selectable style={styles.heroTitle}>
              {document.title}
            </Text>
            <Text selectable style={styles.heroSubtitle}>
              {document.description ?? 'Documento institucional disponível para consulta e download.'}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Resumo</Text>
            <View style={styles.infoList}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Status</Text>
                <Text selectable style={styles.infoValue}>
                  {attention?.statusHeadline ?? 'Documento disponível'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Emitido em</Text>
                <Text selectable style={styles.infoValue}>
                  {formatDocumentDate(document.issuedAt)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Ciência</Text>
                <Text selectable style={styles.infoValue}>
                  {formatDocumentDate(document.acknowledgedAt)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Validade</Text>
                <Text selectable style={styles.infoValue}>
                  {formatDocumentDate(document.expiresAt)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Arquivo</Text>
                <Text selectable style={styles.infoValue}>
                  {document.fileName}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Ações</Text>
            <View style={styles.highlightCard}>
              <Text style={styles.highlightTitle}>{attention?.statusHeadline ?? 'Documento disponível'}</Text>
              <Text style={styles.highlightText}>
                {attention?.statusDescription ?? 'Esse arquivo já está disponível para consulta no seu portal.'}
              </Text>
            </View>
            <Pressable style={styles.secondaryOutlineAction} onPress={() => void handleOpenDocument()}>
              <AppIcon color={mobileTheme.primary} name="download-outline" size={18} />
              <Text style={styles.secondaryOutlineActionText}>{attention?.openActionLabel ?? 'Abrir arquivo'}</Text>
            </Pressable>
            {attention?.requiresAcknowledgement ? (
              <Pressable
                disabled={acknowledgeDocument.isPending}
                style={[
                  styles.primaryAction,
                  acknowledgeDocument.isPending ? styles.primaryActionDisabled : null,
                ]}
                onPress={() => {
                  void handleAcknowledgeDocument();
                }}
              >
                <AppIcon color="#ffffff" name="checkmark-done-outline" size={18} />
                <Text style={styles.primaryActionText}>
                  {acknowledgeDocument.isPending ? 'Registrando...' : attention.acknowledgeActionLabel}
                </Text>
              </Pressable>
            ) : null}
            <Pressable style={styles.secondaryAction} onPress={() => router.replace('/documents' as never)}>
              <Text style={styles.secondaryActionText}>Voltar para documentos</Text>
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
  highlightCard: {
    borderRadius: 20,
    backgroundColor: mobileTheme.primarySoft,
    padding: 16,
    gap: 6,
  },
  highlightTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: mobileTheme.primary,
  },
  highlightText: {
    fontSize: 13,
    lineHeight: 20,
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
  primaryActionDisabled: {
    opacity: 0.72,
  },
  primaryActionText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
  secondaryOutlineAction: {
    minHeight: 52,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: mobileTheme.primary,
    backgroundColor: mobileTheme.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  secondaryOutlineActionText: {
    fontSize: 14,
    fontWeight: '800',
    color: mobileTheme.primary,
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
