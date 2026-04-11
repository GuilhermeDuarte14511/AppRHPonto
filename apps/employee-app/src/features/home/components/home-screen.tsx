import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { AttendanceCoordinates } from '@rh-ponto/attendance-policies';

import { useEmployeeAttendancePolicy } from '@/features/attendance/hooks/use-employee-attendance-policy';
import { useAppSession } from '@/shared/providers/app-providers';
import { useDeviceLocation } from '@/shared/hooks/use-device-location';
import { mobileTheme } from '@/shared/theme/tokens';

const simulationCoordinatesById: Record<string, AttendanceCoordinates> = {
  matriz: {
    latitude: -23.561684,
    longitude: -46.656139,
  },
  fora: {
    latitude: -23.5489,
    longitude: -46.6388,
  },
};

const statusPalette = {
  allowed: {
    backgroundColor: '#dcfce7',
    borderColor: '#86efac',
    titleColor: '#166534',
  },
  pending_review: {
    backgroundColor: '#fef3c7',
    borderColor: '#fcd34d',
    titleColor: '#92400e',
  },
  blocked: {
    backgroundColor: '#fee2e2',
    borderColor: '#fca5a5',
    titleColor: '#991b1b',
  },
} as const;

const formatCoordinates = (coordinates: AttendanceCoordinates | null) => {
  if (!coordinates) {
    return 'Localização ainda não coletada.';
  }

  return `${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}`;
};

export const HomeScreen = () => {
  const { session } = useAppSession();
  const location = useDeviceLocation();
  const [simulationCoordinates, setSimulationCoordinates] = useState<AttendanceCoordinates | null>(null);
  const [lastPunchMessage, setLastPunchMessage] = useState<string | null>(null);

  const activeCoordinates = simulationCoordinates ?? location.coordinates;
  const { scenario, policyQuery, effectivePolicy, evaluation } = useEmployeeAttendancePolicy(
    session?.user.email,
    activeCoordinates,
  );

  const palette = evaluation ? statusPalette[evaluation.status] : statusPalette.pending_review;

  const handleRegisterPunch = () => {
    if (!evaluation?.canSubmitPunch) {
      setLastPunchMessage('A marcação foi bloqueada porque você está fora da política de localização definida.');
      return;
    }

    setLastPunchMessage(
      evaluation.status === 'pending_review'
        ? 'Ponto enviado com revisão pendente do RH por divergência de localização.'
        : 'Ponto registrado com sucesso dentro das regras da política atual.',
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
    >
      <View style={styles.hero}>
        <Text selectable style={styles.title}>
          Olá, {scenario?.name ?? session?.user.name ?? 'colaborador'}
        </Text>
        <Text style={styles.subtitle}>
          Valide sua localização antes da batida e acompanhe como a política da jornada reage a cada cenário.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardEyebrow}>Política atual</Text>
        <Text selectable style={styles.cardTitle}>
          {effectivePolicy?.name ?? 'Carregando política'}
        </Text>
        <Text style={styles.cardText}>
          {effectivePolicy?.description ?? 'Buscando a regra operacional de marcação vinculada ao seu cadastro.'}
        </Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{effectivePolicy?.photoRequired ? 'Foto obrigatória' : 'Foto opcional'}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {effectivePolicy?.geolocationRequired ? 'Com geolocalização' : 'Sem geolocalização'}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.card, styles.statusCard, palette]}>
        <Text style={[styles.cardEyebrow, { color: palette.titleColor }]}>Validação da localização</Text>
        <Text style={[styles.cardTitle, { color: palette.titleColor }]}>
          {policyQuery.isLoading ? 'Carregando regra operacional...' : evaluation?.title ?? 'Aguardando validação'}
        </Text>
        <Text style={[styles.cardText, { color: palette.titleColor }]}>
          {evaluation?.description ??
            'Use sua localização atual ou uma simulação de teste para avaliar o comportamento da política.'}
        </Text>
        <Text selectable style={[styles.coordinatesText, { color: palette.titleColor }]}>
          {formatCoordinates(activeCoordinates)}
        </Text>
        {evaluation?.nearestAllowedLocation ? (
          <Text style={[styles.helperText, { color: palette.titleColor }]}>
            Local autorizado mais próximo: {evaluation.nearestAllowedLocation.name}
            {evaluation.distanceMeters ? ` · ${evaluation.distanceMeters} m` : ''}
          </Text>
        ) : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Validar localização</Text>
        <Text style={styles.cardText}>
          Você pode usar a posição real do aparelho ou simular cenários comuns para testar a política de marcação.
        </Text>
        <View style={styles.actionGrid}>
          <Pressable style={styles.primaryButton} onPress={() => void location.refreshLocation()}>
            <Text style={styles.primaryButtonText}>
              {location.isLoading ? 'Obtendo localização...' : 'Usar localização atual'}
            </Text>
          </Pressable>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => setSimulationCoordinates(simulationCoordinatesById.matriz)}
          >
            <Text style={styles.secondaryButtonText}>Simular matriz</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => setSimulationCoordinates(simulationCoordinatesById.fora)}>
            <Text style={styles.secondaryButtonText}>Simular fora da área</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => setSimulationCoordinates(null)}>
            <Text style={styles.secondaryButtonText}>Limpar simulação</Text>
          </Pressable>
        </View>
        {location.errorMessage ? <Text style={styles.errorText}>{location.errorMessage}</Text> : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Bater ponto</Text>
        <Text style={styles.cardText}>
          O registro segue a decisão da política. Fora da área, o sistema pode bloquear ou encaminhar para revisão.
        </Text>
        <Pressable
          disabled={!evaluation}
          style={[styles.primaryButton, !evaluation && styles.buttonDisabled]}
          onPress={handleRegisterPunch}
        >
          <Text style={styles.primaryButtonText}>Registrar ponto</Text>
        </Pressable>
        {lastPunchMessage ? <Text style={styles.helperText}>{lastPunchMessage}</Text> : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Locais autorizados</Text>
        <Text style={styles.cardText}>A lista abaixo espelha os locais aceitos pela política atual do seu cadastro.</Text>
        <View style={styles.list}>
          {policyQuery.data?.locationCatalog
            .filter((locationItem) =>
              policyQuery.data?.allowedLocations.some((allowedLocation) => allowedLocation.workLocationId === locationItem.id),
            )
            .map((locationItem) => (
              <View key={locationItem.id} style={styles.listItem}>
                <Text style={styles.listItemTitle}>{locationItem.name}</Text>
                <Text style={styles.listItemMeta}>
                  {locationItem.city} · {locationItem.radiusMeters} m
                </Text>
              </View>
            ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Marcações recentes</Text>
        <Text style={styles.cardText}>Resumo rápido do histórico recente para orientar o colaborador antes da nova batida.</Text>
        <View style={styles.list}>
          {scenario?.recentRecords.map((record) => (
            <View key={record.id} style={styles.listItem}>
              <Text style={styles.listItemTitle}>{record.label}</Text>
              <Text style={styles.listItemMeta}>
                {record.typeLabel} · {record.statusLabel} · {record.sourceLabel}
              </Text>
              <Text style={styles.listItemNote}>{record.notes}</Text>
            </View>
          ))}
        </View>
      </View>
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
  hero: {
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: mobileTheme.text,
  },
  subtitle: {
    color: mobileTheme.mutedText,
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    borderRadius: 24,
    backgroundColor: mobileTheme.surface,
    padding: 20,
    gap: 12,
  },
  statusCard: {
    borderWidth: 1,
  },
  cardEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: mobileTheme.primary,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: mobileTheme.text,
  },
  cardText: {
    color: mobileTheme.mutedText,
    lineHeight: 21,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#e2e8f0',
  },
  badgeText: {
    color: mobileTheme.text,
    fontSize: 12,
    fontWeight: '700',
  },
  coordinatesText: {
    fontSize: 13,
    fontWeight: '600',
  },
  actionGrid: {
    gap: 10,
  },
  primaryButton: {
    borderRadius: 18,
    backgroundColor: mobileTheme.primary,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryButton: {
    borderRadius: 18,
    backgroundColor: '#eff6ff',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#1d4ed8',
    fontWeight: '700',
    fontSize: 14,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  helperText: {
    color: mobileTheme.mutedText,
    lineHeight: 20,
  },
  errorText: {
    color: '#b91c1c',
    lineHeight: 20,
  },
  list: {
    gap: 10,
  },
  listItem: {
    borderRadius: 18,
    backgroundColor: '#fff',
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: mobileTheme.border,
  },
  listItemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: mobileTheme.text,
  },
  listItemMeta: {
    color: mobileTheme.mutedText,
    fontSize: 13,
  },
  listItemNote: {
    color: mobileTheme.mutedText,
    lineHeight: 19,
    fontSize: 13,
  },
});
