import { router } from 'expo-router';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useCurrentEmployee } from '@/features/employee/hooks/use-current-employee';
import { AppIcon } from '@/shared/components/app-icon';
import { MobileEmptyState } from '@/shared/components/mobile-empty-state';
import { MobilePageHeader } from '@/shared/components/mobile-page-header';
import { MobileListSkeleton } from '@/shared/components/mobile-skeleton';
import { useAppSession } from '@/shared/providers/app-providers';
import { mobileTheme } from '@/shared/theme/tokens';

import { useEmployeeDocuments } from '../hooks/use-employee-documents';
import { resolveEmployeeDocumentAttention } from '../lib/document-attention';
import {
  buildDocumentEyebrow,
} from '../lib/documents-mobile';

const statusPalette: Record<string, { accent: string; soft: string }> = {
  available: {
    accent: mobileTheme.primary,
    soft: mobileTheme.primarySoft,
  },
  pending_signature: {
    accent: mobileTheme.warning,
    soft: mobileTheme.warningSoft,
  },
  archived: {
    accent: mobileTheme.subtleText,
    soft: mobileTheme.surfaceLow,
  },
};

export const DocumentsScreen = () => {
  const { session } = useAppSession();
  const { employee } = useCurrentEmployee(session);
  const employeeId = employee?.id ?? null;
  const documentsQuery = useEmployeeDocuments(employeeId);
  const documents = documentsQuery.data ?? [];
  const pendingDocuments = documents.filter((item) => item.status === 'pending_signature').length;

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
    >
      <MobilePageHeader
        title="Documentos"
        subtitle="Consulte termos, políticas e comprovantes publicados para o seu vínculo."
        onBack={() => router.back()}
      />

      <View style={styles.hero}>
        <Text selectable style={styles.heroEyebrow}>
          Arquivo digital
        </Text>
        <Text selectable style={styles.heroTitle}>
          {documents.length} documento(s) disponíveis
        </Text>
        <Text selectable style={styles.heroSubtitle}>
          {pendingDocuments > 0
            ? `${pendingDocuments} item(ns) ainda aguardam sua leitura ou ciência.`
            : 'Sua pasta está organizada e sem pendências de ciência no momento.'}
        </Text>
      </View>

      {documentsQuery.isLoading ? (
        <MobileListSkeleton itemCount={3} showHero={false} />
      ) : documents.length === 0 ? (
        <MobileEmptyState
          iconName="folder-open-outline"
          title="Sem documentos publicados"
          description="Quando o RH liberar contratos, políticas ou comprovantes para você, eles aparecerão aqui."
        />
      ) : (
        <View style={styles.list}>
          {documents.map((item) => {
            const palette = statusPalette[item.status] ?? statusPalette.available;
            const attention = resolveEmployeeDocumentAttention(item);

            return (
              <Pressable
                key={item.id}
                onPress={() => router.push(`/documents/${item.id}` as never)}
                style={styles.card}
              >
                <View style={[styles.iconWrap, { backgroundColor: palette.soft }]}>
                  <AppIcon color={palette.accent} name="document-text-outline" size={22} />
                </View>

                <View style={styles.copy}>
                  <Text selectable style={styles.eyebrow}>
                    {buildDocumentEyebrow(item)}
                  </Text>
                  <Text selectable style={styles.title}>
                    {item.title}
                  </Text>
                  <Text numberOfLines={2} selectable style={styles.description}>
                    {item.description ?? 'Documento institucional disponível para consulta.'}
                  </Text>
                  <View style={styles.metaRow}>
                    <Text selectable style={[styles.statusPill, { color: palette.accent, backgroundColor: palette.soft }]}>
                      {attention.statusHeadline}
                    </Text>
                    <Pressable onPress={() => void Linking.openURL(item.fileUrl)} style={styles.inlineLink}>
                      <Text style={styles.inlineLinkText}>
                        {attention.requiresAcknowledgement ? 'Ler agora' : 'Abrir arquivo'}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            );
          })}
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
  description: {
    fontSize: 13,
    lineHeight: 20,
    color: mobileTheme.mutedText,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 2,
  },
  statusPill: {
    overflow: 'hidden',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 11,
    fontWeight: '800',
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
