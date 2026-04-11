import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { AttendanceCoordinates } from '@rh-ponto/attendance-policies';

import { useKioskAttendancePolicy } from '@/features/punch/hooks/use-kiosk-attendance-policy';
import { kioskEmployeeScenarios } from '@/features/punch/lib/kiosk-employee-scenarios';
import { useDeviceLocation } from '@/shared/hooks/use-device-location';
import { kioskTheme } from '@/shared/theme/tokens';

const simulationCoordinatesById: Record<string, AttendanceCoordinates> = {
  matriz: {
    latitude: -23.561684,
    longitude: -46.656139,
  },
  campinas: {
    latitude: -22.890986,
    longitude: -47.052382,
  },
  fora: {
    latitude: -23.5489,
    longitude: -46.6388,
  },
};

const statusPalette = {
  allowed: {
    backgroundColor: '#0f2f24',
    borderColor: '#34d399',
    textColor: '#d1fae5',
  },
  pending_review: {
    backgroundColor: '#3a2a10',
    borderColor: '#fbbf24',
    textColor: '#fde68a',
  },
  blocked: {
    backgroundColor: '#3b1114',
    borderColor: '#f87171',
    textColor: '#fecaca',
  },
} as const;

const formatCoordinates = (coordinates: AttendanceCoordinates | null) => {
  if (!coordinates) {
    return 'Localização ainda não coletada.';
  }

  return `${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}`;
};

export const PunchScreen = () => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(kioskEmployeeScenarios[0]?.employeeId ?? '');
  const [simulationCoordinates, setSimulationCoordinates] = useState<AttendanceCoordinates | null>(null);
  const selectedEmployee = useMemo(
    () => kioskEmployeeScenarios.find((employee) => employee.employeeId === selectedEmployeeId) ?? kioskEmployeeScenarios[0],
    [selectedEmployeeId],
  );
  const location = useDeviceLocation();
  const activeCoordinates = simulationCoordinates ?? location.coordinates;
  const { effectivePolicy, evaluation, policyQuery } = useKioskAttendancePolicy(selectedEmployee.employeeId, activeCoordinates);

  const palette = evaluation ? statusPalette[evaluation.status] : statusPalette.pending_review;

  const handleSubmitPunch = () => {
    if (!evaluation?.canSubmitPunch) {
      return;
    }

    router.push({
      pathname: '/(flow)/success',
      params: {
        employeeName: selectedEmployee.name,
        policyName: effectivePolicy?.name ?? 'Política atual',
        status: evaluation.status,
        title: evaluation.title,
        description: evaluation.description,
        coordinates: formatCoordinates(activeCoordinates),
      },
    });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
    >
      <View style={styles.hero}>
        <Text style={styles.title}>Registrar ponto</Text>
        <Text style={styles.subtitle}>
          O kiosk valida a localização do tablet e respeita a política de cada colaborador antes de concluir a batida.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Selecionar colaborador</Text>
        <View style={styles.employeeList}>
          {kioskEmployeeScenarios.map((employee) => {
            const isSelected = employee.employeeId === selectedEmployeeId;

            return (
              <Pressable
                key={employee.employeeId}
                style={[styles.employeeCard, isSelected && styles.employeeCardActive]}
                onPress={() => setSelectedEmployeeId(employee.employeeId)}
              >
                <Text style={styles.employeeName}>{employee.name}</Text>
                <Text style={styles.employeeMeta}>
                  {employee.roleLabel} · Matrícula {employee.registrationNumber}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Política aplicada</Text>
        <Text style={styles.policyName}>{effectivePolicy?.name ?? 'Carregando política'}</Text>
        <Text style={styles.policyDescription}>
          {effectivePolicy?.description ?? 'Buscando a política vinculada ao colaborador selecionado.'}
        </Text>
      </View>

      <View style={[styles.card, styles.resultCard, palette]}>
        <Text style={[styles.sectionTitle, { color: palette.textColor }]}>Resultado da validação</Text>
        <Text style={[styles.policyName, { color: palette.textColor }]}>
          {policyQuery.isLoading ? 'Validando política...' : evaluation?.title ?? 'Aguardando leitura'}
        </Text>
        <Text style={[styles.policyDescription, { color: palette.textColor }]}>
          {evaluation?.description ?? 'Use a localização atual do tablet ou um cenário de teste para validar a política.'}
        </Text>
        <Text selectable style={[styles.locationText, { color: palette.textColor }]}>
          {formatCoordinates(activeCoordinates)}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Localização do tablet</Text>
        <View style={styles.actionList}>
          <Pressable style={styles.primaryButton} onPress={() => void location.refreshLocation()}>
            <Text style={styles.primaryButtonText}>
              {location.isLoading ? 'Lendo localização...' : 'Usar localização atual'}
            </Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => setSimulationCoordinates(simulationCoordinatesById.matriz)}>
            <Text style={styles.secondaryButtonText}>Simular matriz</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => setSimulationCoordinates(simulationCoordinatesById.campinas)}>
            <Text style={styles.secondaryButtonText}>Simular filial Campinas</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => setSimulationCoordinates(simulationCoordinatesById.fora)}>
            <Text style={styles.secondaryButtonText}>Simular fora da área</Text>
          </Pressable>
        </View>
        {location.errorMessage ? <Text style={styles.errorText}>{location.errorMessage}</Text> : null}
      </View>

      <Pressable
        disabled={!evaluation?.canSubmitPunch}
        style={[styles.submitButton, !evaluation?.canSubmitPunch && styles.submitButtonDisabled]}
        onPress={handleSubmitPunch}
      >
        <Text style={styles.submitButtonText}>
          {evaluation?.status === 'pending_review' ? 'Registrar com revisão' : 'Confirmar batida'}
        </Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: kioskTheme.background,
  },
  content: {
    padding: 24,
    gap: 18,
  },
  hero: {
    gap: 8,
  },
  title: {
    fontSize: 38,
    fontWeight: '700',
    color: kioskTheme.text,
  },
  subtitle: {
    color: kioskTheme.mutedText,
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: kioskTheme.border,
    backgroundColor: kioskTheme.surface,
    padding: 22,
    gap: 14,
  },
  resultCard: {
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: kioskTheme.text,
  },
  employeeList: {
    gap: 10,
  },
  employeeCard: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: '#0b1820',
    gap: 4,
  },
  employeeCardActive: {
    borderWidth: 1,
    borderColor: kioskTheme.primary,
    backgroundColor: '#112632',
  },
  employeeName: {
    fontSize: 17,
    fontWeight: '700',
    color: kioskTheme.text,
  },
  employeeMeta: {
    color: kioskTheme.mutedText,
    fontSize: 14,
  },
  policyName: {
    fontSize: 24,
    fontWeight: '700',
    color: kioskTheme.text,
  },
  policyDescription: {
    color: kioskTheme.mutedText,
    lineHeight: 22,
    fontSize: 15,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionList: {
    gap: 10,
  },
  primaryButton: {
    borderRadius: 18,
    backgroundColor: '#14b8a6',
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    borderRadius: 18,
    backgroundColor: '#173243',
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#dbeafe',
    fontWeight: '700',
  },
  errorText: {
    color: '#fca5a5',
    lineHeight: 20,
  },
  submitButton: {
    borderRadius: 22,
    backgroundColor: kioskTheme.primary,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.45,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
  },
});
