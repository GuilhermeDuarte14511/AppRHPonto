import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/shared/components/app-icon';
import { MobileEmptyState } from '@/shared/components/mobile-empty-state';
import { MobilePageHeader } from '@/shared/components/mobile-page-header';
import { mobileTheme } from '@/shared/theme/tokens';

import { useEmployeeDocumentDetail } from '../hooks/use-employee-documents';
import {
  documentCategoryLabels,
  documentStatusLabels,
  formatDocumentDate,
} from '../lib/documents-mobile';

export const DocumentDetailScreen = () => {
  const params = useLocalSearchParams<{ id?: string }>();
  const detailQuery = useEmployeeDocumentDetail(params.id);
  const document = detailQuery.data;

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
        <View style={styles.loadingCard}>
          <ActivityIndicator color={mobileTheme.primary} />
          <Text style={styles.loadingText}>Carregando o documento selecionado...</Text>
        </View>
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
                  {documentStatusLabels[document.status] ?? 'Disponível'}
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
            <Pressable style={styles.primaryAction} onPress={() => void Linking.openURL(document.fileUrl)}>
              <AppIcon color="#ffffff" name="download-outline" size={18} />
              <Text style={styles.primaryActionText}>Abrir arquivo</Text>
            </Pressable>
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
