import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useEmployeeAttendancePolicy } from '@/features/attendance/hooks/use-employee-attendance-policy';
import { useCurrentEmployee } from '@/features/employee/hooks/use-current-employee';
import { AppIcon } from '@/shared/components/app-icon';
import { useAppSession } from '@/shared/providers/app-providers';
import { mobileTheme } from '@/shared/theme/tokens';

export const ProfileScreen = () => {
  const { session, signOut } = useAppSession();
  const { employee, scenario, identity, employeeQuery } = useCurrentEmployee(session);
  const { effectivePolicy, policyQuery } = useEmployeeAttendancePolicy(employee?.id ?? scenario?.employeeId);
  const allowedLocations = policyQuery.data?.locationCatalog.filter((locationItem) =>
    policyQuery.data?.allowedLocations.some((allowedLocation) => allowedLocation.workLocationId === locationItem.id),
  );

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
          {identity.email ?? session?.user.email}
        </Text>
        <Text style={styles.meta}>
          {identity.roleLabel} · Matrícula {identity.registrationNumber}
        </Text>
        <Text style={styles.meta}>Departamento: {identity.department}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppIcon color={mobileTheme.primary} name="shield-checkmark-outline" size={18} />
          <Text style={styles.sectionTitle}>Política de marcação</Text>
        </View>
        {policyQuery.isLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={mobileTheme.primary} />
            <Text style={styles.meta}>Carregando a política operacional vinculada ao seu cadastro.</Text>
          </View>
        ) : (
          <>
            <Text style={styles.metaStrong}>{effectivePolicy?.name ?? 'Política indisponível'}</Text>
            <Text style={styles.meta}>
              {effectivePolicy?.description ?? 'Ainda não encontramos uma política ativa para o seu vínculo atual.'}
            </Text>
            <Text style={styles.meta}>
              Foto: {effectivePolicy?.photoRequired ? 'obrigatória' : 'opcional'} · Geolocalização:{' '}
              {effectivePolicy?.geolocationRequired ? 'obrigatória' : 'opcional'}
            </Text>
          </>
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
            <Text style={styles.meta}>Buscando locais vinculados à sua política.</Text>
          </View>
        ) : allowedLocations && allowedLocations.length > 0 ? (
          <View style={styles.list}>
            {allowedLocations.map((locationItem) => (
              <View key={locationItem.id} style={styles.listItem}>
                <Text style={styles.listTitle}>{locationItem.name}</Text>
                <Text style={styles.meta}>
                  {locationItem.city ?? 'Cidade não informada'} · Raio de {locationItem.radiusMeters} m
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.meta}>Sua política atual não exige locais fixos vinculados.</Text>
        )}
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
    borderRadius: 24,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 20,
    gap: 8,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mobileTheme.primarySoft,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: mobileTheme.primary,
  },
  card: {
    borderRadius: 24,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 20,
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  name: {
    marginTop: 4,
    fontSize: 24,
    fontWeight: '800',
    color: mobileTheme.text,
    letterSpacing: -0.8,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: mobileTheme.text,
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
  button: {
    backgroundColor: mobileTheme.primary,
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
