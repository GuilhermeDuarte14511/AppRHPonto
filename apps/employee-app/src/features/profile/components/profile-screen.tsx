import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useEmployeeAttendancePolicy } from '@/features/attendance/hooks/use-employee-attendance-policy';
import { useCurrentEmployee } from '@/features/employee/hooks/use-current-employee';
import { AppIcon } from '@/shared/components/app-icon';
import { useAppSession } from '@/shared/providers/app-providers';
import { mobileTheme } from '@/shared/theme/tokens';
import type { AttendanceLocationRole, AttendancePolicyMode, AttendanceValidationStrategy } from '@rh-ponto/types';

const shortcuts = [
  {
    title: 'Notificações',
    description: 'Mensagens e respostas do RH.',
    icon: 'notifications-outline',
    href: '/notifications',
  },
  {
    title: 'Férias',
    description: 'Pedidos e períodos aprovados.',
    icon: 'airplane-outline',
    href: '/vacations',
  },
  {
    title: 'Documentos',
    description: 'Termos, políticas e comprovantes.',
    icon: 'folder-open-outline',
    href: '/documents',
  },
  {
    title: 'Holerites',
    description: 'Comprovantes mensais da folha.',
    icon: 'wallet-outline',
    href: '/payroll',
  },
  {
    title: 'Preferências',
    description: 'Ajuste seus lembretes e alertas.',
    icon: 'settings-outline',
    href: '/notification-settings',
  },
] as const;

const policyModeLabels = {
  company_only: 'Presencial na empresa',
  home_only: 'Trabalho remoto',
  hybrid: 'Modelo híbrido',
  free: 'Regra flexível',
  field: 'Atuação externa',
} as const satisfies Record<AttendancePolicyMode, string>;

const validationStrategyLabels = {
  block: 'Bloqueia fora da política',
  pending_review: 'Permite e envia para revisão',
  allow: 'Permite sem travar',
} as const satisfies Record<AttendanceValidationStrategy, string>;

const locationRoleLabels = {
  primary_company: 'Local principal',
  home: 'Casa',
  optional: 'Opcional',
  client_site: 'Cliente',
} as const satisfies Record<AttendanceLocationRole, string>;

export const ProfileScreen = () => {
  const { session, signOut } = useAppSession();
  const { employee, identity, employeeQuery } = useCurrentEmployee(session);
  const employeeId = employee?.id ?? null;
  const { effectivePolicy, policyQuery } = useEmployeeAttendancePolicy(employeeId);
  const policyAssignment = policyQuery.data?.policyAssignment ?? null;
  const policyMode = policyAssignment?.mode ?? effectivePolicy?.mode ?? null;
  const validationStrategy = policyAssignment?.validationStrategy ?? effectivePolicy?.validationStrategy ?? null;
  const allowedLocationDetails =
    policyQuery.data?.allowedLocations.flatMap((allowedLocation) => {
        const locationItem = policyQuery.data?.locationCatalog.find((item) => item.id === allowedLocation.workLocationId);

        return locationItem ? [{ allowedLocation, locationItem }] : [];
      }) ?? [];
  const policyRuleSummary = [
    effectivePolicy?.photoRequired ? 'Foto obrigatória' : 'Foto opcional',
    effectivePolicy?.geolocationRequired ? 'Geolocalização obrigatória' : 'Geolocalização opcional',
    policyAssignment?.allowAnyLocation
      ? 'Qualquer local autorizado'
      : policyAssignment?.blockOutsideAllowedLocations
        ? 'Bloqueia fora da área'
        : 'Fora da área segue para revisão',
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
    >
      <View style={styles.heroCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{identity.name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text selectable style={styles.name}>
          {identity.name}
        </Text>
        <Text selectable style={styles.meta}>
          {identity.roleLabel}
        </Text>
        <Text selectable style={styles.meta}>
          {identity.department} · Matrícula {identity.registrationNumber}
        </Text>
        <Text selectable style={styles.meta}>
          {identity.email ?? session?.user.email}
        </Text>
        {identity.phone ? (
          <Text selectable style={styles.meta}>
            {identity.phone}
          </Text>
        ) : null}
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppIcon color={mobileTheme.primary} name="shield-checkmark-outline" size={18} />
          <Text style={styles.sectionTitle}>Política de marcação</Text>
        </View>
        {policyQuery.isLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={mobileTheme.primary} />
            <Text style={styles.meta}>Carregando a política operacional do seu cadastro.</Text>
          </View>
        ) : (
          <>
            <Text selectable style={styles.metaStrong}>
              {effectivePolicy?.name ?? 'Política indisponível'}
            </Text>
            <Text selectable style={styles.meta}>
              {effectivePolicy?.description ?? 'Ainda não encontramos uma política ativa para o seu vínculo atual.'}
            </Text>
            <View style={styles.tagRow}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>
                  {policyMode ? policyModeLabels[policyMode] : 'Modo indisponível'}
                </Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>
                  {validationStrategy ? validationStrategyLabels[validationStrategy] : 'Validação indisponível'}
                </Text>
              </View>
            </View>
            <Text selectable style={styles.meta}>
              {policyRuleSummary.join(' · ')}
            </Text>
            {policyAssignment?.notes ? <Text selectable style={styles.meta}>{policyAssignment.notes}</Text> : null}
          </>
        )}
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppIcon color={mobileTheme.primary} name="document-text-outline" size={18} />
          <Text style={styles.sectionTitle}>Como a regra funciona</Text>
        </View>
        {policyQuery.isLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={mobileTheme.primary} />
            <Text style={styles.meta}>Aguardando os detalhes da validação operacional.</Text>
          </View>
        ) : (
          <View style={styles.list}>
            <View style={styles.listItem}>
              <Text selectable style={styles.listTitle}>
                Foto e geolocalização
              </Text>
              <Text selectable style={styles.meta}>
                Foto: {effectivePolicy?.photoRequired ? 'obrigatória' : 'opcional'} · Geolocalização:{' '}
                {effectivePolicy?.geolocationRequired ? 'obrigatória' : 'opcional'}
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text selectable style={styles.listTitle}>
                Fora da área permitida
              </Text>
              <Text selectable style={styles.meta}>
                {policyAssignment?.blockOutsideAllowedLocations
                  ? 'A marcação é bloqueada fora da área configurada.'
                  : policyAssignment?.allowAnyLocation
                    ? 'A marcação pode seguir sem restrição de local específico.'
                    : 'A marcação pode seguir, mas entra para conferência do RH.'}
              </Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppIcon color={mobileTheme.primary} name="location-outline" size={18} />
          <Text style={styles.sectionTitle}>Locais autorizados</Text>
        </View>
        {employeeQuery.isLoading || policyQuery.isLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={mobileTheme.primary} />
            <Text style={styles.meta}>Buscando os locais vinculados à sua política.</Text>
          </View>
        ) : allowedLocationDetails.length > 0 ? (
          <View style={styles.list}>
            {allowedLocationDetails.map(({ allowedLocation, locationItem }) => (
              <View key={locationItem.id} style={styles.listItem}>
                <Text selectable style={styles.listTitle}>
                  {locationItem.name}
                </Text>
                <Text selectable style={styles.meta}>
                  {locationItem.city ?? 'Cidade não informada'} · raio de {locationItem.radiusMeters} m
                </Text>
                <Text selectable style={styles.meta}>
                  {locationRoleLabels[allowedLocation.locationRole]} ·{' '}
                  {allowedLocation.isRequired ? 'local obrigatório' : 'local de apoio'}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text selectable style={styles.meta}>
            Sua política atual não exige locais fixos vinculados.
          </Text>
        )}
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppIcon color={mobileTheme.primary} name="grid-outline" size={18} />
          <Text style={styles.sectionTitle}>Autosserviço</Text>
        </View>
        <View style={styles.shortcutList}>
          {shortcuts.map((item) => (
            <Pressable key={item.href} onPress={() => router.push(item.href as never)} style={styles.shortcutRow}>
              <View style={styles.shortcutIcon}>
                <AppIcon color={mobileTheme.primary} name={item.icon} size={18} />
              </View>
              <View style={styles.shortcutCopy}>
                <Text selectable style={styles.shortcutTitle}>
                  {item.title}
                </Text>
                <Text selectable style={styles.shortcutDescription}>
                  {item.description}
                </Text>
              </View>
              <AppIcon color={mobileTheme.subtleText} name="chevron-forward-outline" size={18} />
            </Pressable>
          ))}
        </View>
      </View>

      <Pressable style={styles.button} onPress={() => void signOut()}>
        <Text style={styles.buttonText}>Sair do app</Text>
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
    padding: 20,
    paddingBottom: 120,
    gap: 16,
  },
  heroCard: {
    borderRadius: 28,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 22,
    gap: 6,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mobileTheme.primarySoft,
    marginBottom: 4,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: mobileTheme.primary,
  },
  name: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.9,
    color: mobileTheme.text,
  },
  metaStrong: {
    fontSize: 16,
    fontWeight: '700',
    color: mobileTheme.text,
  },
  meta: {
    color: mobileTheme.mutedText,
    lineHeight: 20,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    borderRadius: 999,
    backgroundColor: mobileTheme.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '800',
    color: mobileTheme.primary,
  },
  card: {
    borderRadius: 26,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 20,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: mobileTheme.text,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  list: {
    gap: 10,
  },
  listItem: {
    borderRadius: 16,
    backgroundColor: mobileTheme.surfaceLow,
    padding: 14,
    gap: 4,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: mobileTheme.text,
  },
  shortcutList: {
    gap: 10,
  },
  shortcutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 20,
    backgroundColor: mobileTheme.surfaceLow,
    padding: 14,
  },
  shortcutIcon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mobileTheme.surfaceRaised,
  },
  shortcutCopy: {
    flex: 1,
    gap: 3,
  },
  shortcutTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: mobileTheme.text,
  },
  shortcutDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: mobileTheme.mutedText,
  },
  button: {
    backgroundColor: mobileTheme.primary,
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
});
