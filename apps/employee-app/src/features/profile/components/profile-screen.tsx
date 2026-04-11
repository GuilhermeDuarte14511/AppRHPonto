import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useEmployeeAttendancePolicy } from '@/features/attendance/hooks/use-employee-attendance-policy';
import { useAppSession } from '@/shared/providers/app-providers';
import { mobileTheme } from '@/shared/theme/tokens';

export const ProfileScreen = () => {
  const { session, signOut } = useAppSession();
  const { scenario, effectivePolicy, policyQuery } = useEmployeeAttendancePolicy(session?.user.email);
  const allowedLocations = policyQuery.data?.locationCatalog.filter((locationItem) =>
    policyQuery.data?.allowedLocations.some((allowedLocation) => allowedLocation.workLocationId === locationItem.id),
  );

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
    >
      <View style={styles.card}>
        <Text selectable style={styles.name}>
          {scenario?.name ?? session?.user.name}
        </Text>
        <Text selectable style={styles.meta}>
          {session?.user.email}
        </Text>
        <Text style={styles.meta}>
          {scenario?.roleLabel ?? 'Colaborador'} · Matrícula {scenario?.registrationNumber ?? '-'}
        </Text>
        <Text style={styles.meta}>Departamento: {scenario?.department ?? 'Não informado'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Política de marcação</Text>
        <Text style={styles.metaStrong}>{effectivePolicy?.name ?? 'Carregando política'}</Text>
        <Text style={styles.meta}>{effectivePolicy?.description ?? 'Buscando a regra operacional vinculada ao seu cadastro.'}</Text>
        <Text style={styles.meta}>
          Foto: {effectivePolicy?.photoRequired ? 'obrigatória' : 'opcional'} · Geolocalização:{' '}
          {effectivePolicy?.geolocationRequired ? 'obrigatória' : 'opcional'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Locais autorizados</Text>
        <View style={styles.list}>
          {allowedLocations?.map((locationItem) => (
            <View key={locationItem.id} style={styles.listItem}>
              <Text style={styles.listTitle}>{locationItem.name}</Text>
              <Text style={styles.meta}>
                {locationItem.city} · {locationItem.radiusMeters} m
              </Text>
            </View>
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
    gap: 16,
  },
  card: {
    borderRadius: 20,
    backgroundColor: '#fff',
    padding: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: mobileTheme.border,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
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
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: mobileTheme.text,
    marginBottom: 4,
  },
  list: {
    gap: 10,
  },
  listItem: {
    borderRadius: 16,
    backgroundColor: mobileTheme.surface,
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
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
