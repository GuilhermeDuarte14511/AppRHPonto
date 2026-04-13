import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

import type { AttendanceCoordinates } from '@rh-ponto/attendance-policies';
import type { TimeRecordType } from '@rh-ponto/types';

import { useEmployeeAttendancePolicy } from '@/features/attendance/hooks/use-employee-attendance-policy';
import { useCurrentEmployee } from '@/features/employee/hooks/use-current-employee';
import { PunchTypeSheet } from '@/features/home/components/punch-type-sheet';
import { useEmployeeTimeRecords } from '@/features/time-records/hooks/use-employee-time-records';
import { useRegisterTimeRecord } from '@/features/time-records/hooks/use-register-time-record';
import {
  formatDurationFromMinutes,
  formatTimeRecordDateTime,
  formatTimeRecordTime,
  timeRecordSourceLabels,
  timeRecordTypeLabels,
} from '@/features/time-records/lib/time-record-mobile';
import { AppIcon } from '@/shared/components/app-icon';
import { useDeviceLocation } from '@/shared/hooks/use-device-location';
import { useAppSession } from '@/shared/providers/app-providers';
import { mobileTheme } from '@/shared/theme/tokens';

const statusPalette = {
  allowed: {
    backgroundColor: mobileTheme.primary,
    highlight: '#22c55e',
    label: 'Permitido',
    description: 'Você está dentro do fluxo ideal para registrar o ponto agora.',
  },
  pending_review: {
    backgroundColor: '#ad6a00',
    highlight: '#facc15',
    label: 'Em revisão',
    description: 'O registro pode seguir, mas ficará sinalizado para conferência do RH.',
  },
  blocked: {
    backgroundColor: '#991b1b',
    highlight: '#fca5a5',
    label: 'Bloqueado',
    description: 'A localização atual não atende à política de marcação do seu cadastro.',
  },
} as const;

const statusTextByRecordStatus = {
  valid: 'Validado automaticamente',
  pending_review: 'Aguardando revisão do RH',
  adjusted: 'Ajustado pela operação',
  rejected: 'Rejeitado pela revisão',
} as const;

const describeDistance = (distanceMeters?: number | null) => {
  if (distanceMeters == null) {
    return null;
  }

  if (distanceMeters < 1000) {
    return `${distanceMeters} m do local autorizado mais próximo`;
  }

  return `${(distanceMeters / 1000).toFixed(1)} km do local autorizado mais próximo`;
};

const formatCoordinatesLabel = (coordinates?: AttendanceCoordinates | null) => {
  if (!coordinates) {
    return 'Aguardando leitura do GPS';
  }

  return `${coordinates.latitude.toFixed(5)}, ${coordinates.longitude.toFixed(5)}`;
};

const formatAccuracyLabel = (coordinates?: AttendanceCoordinates | null) => {
  if (!coordinates?.accuracyMeters) {
    return 'Precisão indisponível';
  }

  return `Precisão estimada de ${Math.round(coordinates.accuracyMeters)} m`;
};

const buildConfirmationParams = (
  recordedAt: string | Date,
  recordType: TimeRecordType,
  evaluationTitle?: string | null,
  matchedLocationName?: string | null,
  status?: 'valid' | 'pending_review' | 'adjusted' | 'rejected',
  coordinates?: AttendanceCoordinates | null,
) => ({
  recordedAt: typeof recordedAt === 'string' ? recordedAt : recordedAt.toISOString(),
  type: recordType,
  status: status ?? 'valid',
  reason: evaluationTitle ?? '',
  locationName: matchedLocationName ?? '',
  coordinates: formatCoordinatesLabel(coordinates),
});

export const HomeScreen = () => {
  const { session } = useAppSession();
  const { employee, identity, employeeQuery } = useCurrentEmployee(session);
  const employeeId = employee?.id ?? null;
  const location = useDeviceLocation();
  const { coordinates, errorMessage, isLoading: isLocationLoading, permissionStatus, refreshLocation } = location;
  const { records, nextRecordType, workedMinutesToday, todayRecords, timeRecordsQuery } = useEmployeeTimeRecords(employeeId);
  const { policyQuery, effectivePolicy, evaluation } = useEmployeeAttendancePolicy(employeeId, coordinates);
  const registerTimeRecord = useRegisterTimeRecord();

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [isTypeSheetVisible, setIsTypeSheetVisible] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [selectedRecordType, setSelectedRecordType] = useState<TimeRecordType>('entry');
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    setSelectedRecordType(nextRecordType);
  }, [nextRecordType]);

  useEffect(() => {
    if (permissionStatus === 'idle' && !coordinates && !isLocationLoading) {
      void refreshLocation();
    }
  }, [coordinates, isLocationLoading, permissionStatus, refreshLocation]);

  const activeCoordinates: AttendanceCoordinates | null = coordinates;
  const employeeName = identity.name;
  const recentRecords = records.slice(0, 3);
  const statusKey = evaluation?.status ?? 'pending_review';
  const palette = statusPalette[statusKey];
  const selectedRecordLabel = timeRecordTypeLabels[selectedRecordType];
  const recommendedRecordLabel = timeRecordTypeLabels[nextRecordType];
  const hoursTodayLabel = formatDurationFromMinutes(workedMinutesToday);
  const distanceLabel = describeDistance(evaluation?.distanceMeters);
  const canRegister =
    Boolean(employeeId) &&
    !employeeQuery.isLoading &&
    !policyQuery.isLoading &&
    !timeRecordsQuery.isLoading &&
    !registerTimeRecord.isPending &&
    Boolean(evaluation?.canSubmitPunch);

  const locationSummary = useMemo(
    () => ({
      title:
        evaluation?.matchedLocation?.name ??
        evaluation?.nearestAllowedLocation?.name ??
        'Aguardando localização validada',
      coordinates: formatCoordinatesLabel(activeCoordinates),
      accuracy: formatAccuracyLabel(activeCoordinates),
    }),
    [activeCoordinates, evaluation?.matchedLocation?.name, evaluation?.nearestAllowedLocation?.name],
  );

  const openCameraFlow = async () => {
    if (!employeeId) {
      Alert.alert('Cadastro indisponível', 'Não encontramos seu vínculo de colaborador para registrar o ponto.');
      return;
    }

    if (!evaluation?.canSubmitPunch) {
      Alert.alert('Registro bloqueado', evaluation?.description ?? 'Atualize a localização e tente novamente.');
      return;
    }

    if (!cameraPermission?.granted) {
      const permission = await requestCameraPermission();

      if (!permission.granted) {
        Alert.alert('Permissão necessária', 'É obrigatório permitir a câmera para registrar o ponto com foto.');
        return;
      }
    }

    setIsCameraActive(true);
  };

  const handleRegisterActionWithPhoto = async () => {
    if (isTakingPhoto) {
      return;
    }

    let photo: { uri: string; size?: number } | null = null;

    if (cameraRef.current) {
      setIsTakingPhoto(true);

      try {
        const picture = await cameraRef.current.takePictureAsync({
          quality: 0.5,
          skipProcessing: true,
        });

        if (picture) {
          photo = { uri: picture.uri, size: 0 };
        }
      } catch {
        Alert.alert('Erro', 'Não foi possível tirar a foto para registrar o ponto.');
        setIsTakingPhoto(false);
        return;
      }
    }

    if (!employeeId) {
      Alert.alert('Cadastro indisponível', 'Não encontramos seu vínculo de colaborador para registrar o ponto.');
      setIsTakingPhoto(false);
      setIsCameraActive(false);
      return;
    }

    try {
      const createdRecord = await registerTimeRecord.mutateAsync({
        employeeId,
        recordedByUserId: session?.user.id ?? null,
        recordType: selectedRecordType,
        evaluation,
        coordinates: activeCoordinates,
        photo,
      });

      setIsCameraActive(false);
      setIsTakingPhoto(false);

      router.push({
        pathname: '/punch-confirmation',
        params: buildConfirmationParams(
          createdRecord.recordedAt,
          selectedRecordType,
          evaluation?.title ?? evaluation?.description ?? null,
          evaluation?.matchedLocation?.name ?? evaluation?.nearestAllowedLocation?.name ?? null,
          createdRecord.status,
          activeCoordinates,
        ),
      });
    } catch (error) {
      setIsTakingPhoto(false);
      Alert.alert(
        'Não foi possível registrar o ponto',
        error instanceof Error ? error.message : 'Tente novamente em instantes.',
      );
    }
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        style={styles.container}
      >
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{employeeName.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>Jornada de hoje</Text>
            <Text style={styles.headerTitle}>Olá, {employeeName.split(' ')[0]}</Text>
            <Text style={styles.headerSubtitle}>
              Confira sua localização, selecione o tipo de batida e registre o ponto com foto.
            </Text>
          </View>
          <Pressable style={styles.notificationButton} onPress={() => router.push('/notifications' as never)}>
            <AppIcon color={mobileTheme.subtleText} name="notifications-outline" size={24} />
          </Pressable>
        </View>

        <View style={[styles.primaryCard, { backgroundColor: palette.backgroundColor }]}>
          <View style={styles.primaryBadge}>
            <View style={[styles.primaryDot, { backgroundColor: palette.highlight }]} />
            <Text style={styles.primaryBadgeText}>{palette.label}</Text>
          </View>

          <Text style={styles.primaryLabel}>Tipo escolhido para esta batida</Text>
          <Text style={styles.primaryTime}>{selectedRecordLabel}</Text>
          <Text style={styles.primaryType}>Sugestão do sistema: {recommendedRecordLabel}</Text>
          <Text style={styles.primaryDescription}>{evaluation?.description ?? palette.description}</Text>

          <View style={styles.primaryActionRow}>
            <Pressable style={styles.secondaryHeroAction} onPress={() => setIsTypeSheetVisible(true)}>
              <AppIcon color="#ffffff" name="swap-horizontal-outline" size={18} />
              <Text style={styles.secondaryHeroActionText}>Escolher tipo</Text>
            </Pressable>
            <Pressable
              disabled={!canRegister}
              onPress={() => void openCameraFlow()}
              style={[styles.primaryAction, (!canRegister || registerTimeRecord.isPending) && styles.primaryActionDisabled]}
            >
              {registerTimeRecord.isPending ? (
                <ActivityIndicator color={mobileTheme.primary} size="small" />
              ) : (
                <AppIcon color={mobileTheme.primary} name="camera-outline" size={18} />
              )}
              <Text style={styles.primaryActionText}>
                {registerTimeRecord.isPending ? 'Registrando...' : 'Registrar com foto'}
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.metricCard}>
            <View style={styles.metricIcon}>
              <AppIcon color={mobileTheme.primary} name="time-outline" size={20} />
            </View>
            <Text style={styles.metricEyebrow}>Horas do dia</Text>
            <Text style={styles.metricValue}>{hoursTodayLabel}</Text>
            <Text style={styles.metricHint}>
              {todayRecords.length > 0
                ? `${todayRecords.length} marcação(ões) registradas hoje.`
                : 'Nenhuma marcação registrada até agora.'}
            </Text>
          </View>

          <View style={styles.secondaryCard}>
            <Text style={styles.secondaryEyebrow}>Política aplicada</Text>
            <Text style={styles.secondaryValue}>{effectivePolicy?.name ?? 'Carregando política'}</Text>
            <Text style={styles.secondaryHint}>
              {effectivePolicy?.description ?? 'Buscando a regra operacional vinculada ao seu cadastro.'}
            </Text>
          </View>

          <View style={styles.shortcutsCard}>
            <Text style={styles.secondaryEyebrow}>Atalhos</Text>
            <View style={styles.shortcutsGrid}>
              <Pressable style={styles.shortcutButton} onPress={() => router.push('/(tabs)/time-records')}>
                <AppIcon color={mobileTheme.primary} name="receipt-outline" size={20} />
                <Text style={styles.shortcutLabel}>Ver histórico</Text>
              </Pressable>
              <Pressable style={styles.shortcutButton} onPress={() => router.push('/(tabs)/justifications')}>
                <AppIcon color={mobileTheme.tertiary} name="document-text-outline" size={20} />
                <Text style={styles.shortcutLabel}>Justificar</Text>
              </Pressable>
              <Pressable style={styles.shortcutButton} onPress={() => router.push('/vacations' as never)}>
                <AppIcon color={mobileTheme.success} name="airplane-outline" size={20} />
                <Text style={styles.shortcutLabel}>Férias</Text>
              </Pressable>
              <Pressable style={styles.shortcutButton} onPress={() => router.push('/documents' as never)}>
                <AppIcon color={mobileTheme.secondary} name="folder-open-outline" size={20} />
                <Text style={styles.shortcutLabel}>Documentos</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.locationCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sua localização agora</Text>
            <Pressable style={styles.inlinePill} onPress={() => void refreshLocation()}>
              <AppIcon color={mobileTheme.primary} name="locate-outline" size={16} />
              <Text style={styles.inlinePillText}>{isLocationLoading ? 'Atualizando' : 'Atualizar'}</Text>
            </Pressable>
          </View>
          <Text style={styles.sectionText}>
            {evaluation?.title ?? 'A validação da geofence usa os locais autorizados vinculados ao seu cadastro.'}
          </Text>

          <View style={styles.locationHero}>
            <View style={styles.locationHeroIcon}>
              <AppIcon color={mobileTheme.primary} name="navigate-outline" size={22} />
            </View>
            <View style={styles.locationHeroCopy}>
              <Text style={styles.locationHeroTitle}>{locationSummary.title}</Text>
              <Text style={styles.locationHeroText}>{locationSummary.coordinates}</Text>
              <Text style={styles.locationHeroHint}>{locationSummary.accuracy}</Text>
            </View>
          </View>

          <View style={styles.locationInfo}>
            <View style={styles.locationInfoRow}>
              <Text style={styles.locationInfoLabel}>Matrícula</Text>
              <Text style={styles.locationInfoValue}>{identity.registrationNumber}</Text>
            </View>
            <View style={styles.locationInfoRow}>
              <Text style={styles.locationInfoLabel}>Departamento</Text>
              <Text style={styles.locationInfoValue}>{identity.department}</Text>
            </View>
            <View style={styles.locationInfoRow}>
              <Text style={styles.locationInfoLabel}>Política</Text>
              <Text style={styles.locationInfoValue}>{effectivePolicy?.name ?? 'Carregando'}</Text>
            </View>
            {distanceLabel ? (
              <View style={styles.locationInfoRow}>
                <Text style={styles.locationInfoLabel}>Distância</Text>
                <Text style={styles.locationInfoValue}>{distanceLabel}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.locationActions}>
            <Pressable style={styles.inlineAction} onPress={() => setIsTypeSheetVisible(true)}>
              <AppIcon color={mobileTheme.primary} name="checkmark-done-outline" size={18} />
              <Text style={styles.inlineActionText}>Trocar tipo de batida</Text>
            </Pressable>
            <Pressable style={styles.inlineAction} onPress={() => router.push('/(tabs)/profile')}>
              <AppIcon color={mobileTheme.primary} name="shield-checkmark-outline" size={18} />
              <Text style={styles.inlineActionText}>Ver política e locais autorizados</Text>
            </Pressable>
          </View>

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        </View>

        <View style={styles.recordsCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Registros recentes</Text>
            <Pressable onPress={() => router.push('/(tabs)/time-records')}>
              <Text style={styles.sectionLink}>Ver todos</Text>
            </Pressable>
          </View>

          {timeRecordsQuery.isLoading ? (
            <View style={styles.recordsPlaceholder}>
              <ActivityIndicator color={mobileTheme.primary} />
              <Text style={styles.recordsPlaceholderText}>Carregando seu histórico...</Text>
            </View>
          ) : recentRecords.length === 0 ? (
            <View style={styles.recordsPlaceholder}>
              <AppIcon color={mobileTheme.subtleText} name="time-outline" size={22} />
              <Text style={styles.recordsPlaceholderText}>Sua primeira marcação aparecerá aqui.</Text>
            </View>
          ) : (
            <View style={styles.recordsList}>
              {recentRecords.map((record) => (
                <View key={record.id} style={styles.recordItem}>
                  <View style={styles.recordIcon}>
                    <AppIcon
                      color={mobileTheme.primary}
                      name={record.recordType.includes('break') ? 'restaurant-outline' : 'log-in-outline'}
                      size={18}
                    />
                  </View>
                  <View style={styles.recordContent}>
                    <Text style={styles.recordTitle}>
                      {timeRecordTypeLabels[record.recordType]} · {formatTimeRecordDateTime(record.recordedAt)}
                    </Text>
                    <Text style={styles.recordMeta}>
                      {timeRecordSourceLabels[record.source]} · {statusTextByRecordStatus[record.status]}
                    </Text>
                  </View>
                  <Text style={styles.recordStatus}>{formatTimeRecordTime(record.recordedAt)}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {employeeQuery.isLoading || policyQuery.isLoading ? (
          <View style={styles.footerInfo}>
            <ActivityIndicator color={mobileTheme.primary} />
            <Text style={styles.footerInfoText}>Preparando seu contexto operacional...</Text>
          </View>
        ) : null}
      </ScrollView>

      <PunchTypeSheet
        isVisible={isTypeSheetVisible}
        onClose={() => setIsTypeSheetVisible(false)}
        onConfirm={(value) => {
          setSelectedRecordType(value);
          setIsTypeSheetVisible(false);
        }}
        selectedType={selectedRecordType}
        recommendedType={nextRecordType}
      />

      <Modal visible={isCameraActive} animationType="slide" transparent={false} onRequestClose={() => setIsCameraActive(false)}>
        <View style={styles.cameraContainer}>
          <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="front" animateShutter />
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraHeader}>
              <Pressable style={styles.cameraCloseButton} onPress={() => setIsCameraActive(false)}>
                <AppIcon name="close" size={24} color="#fff" />
              </Pressable>
              <View style={styles.cameraHeaderCopy}>
                <Text style={styles.cameraTitle}>{selectedRecordLabel}</Text>
                <Text style={styles.cameraSubtitle}>
                  {evaluation?.matchedLocation?.name ?? evaluation?.nearestAllowedLocation?.name ?? 'Validando localização'}
                </Text>
              </View>
            </View>

            <View style={styles.cameraGuide}>
              <Text style={styles.cameraGuideTitle}>Enquadre seu rosto e confirme a batida</Text>
              <Text style={styles.cameraGuideText}>
                Sua foto e a localização atual serão vinculadas ao registro para auditoria operacional.
              </Text>
            </View>

            <View style={styles.cameraFooter}>
              <Pressable
                style={styles.cameraCaptureButton}
                onPress={() => void handleRegisterActionWithPhoto()}
                disabled={isTakingPhoto || registerTimeRecord.isPending}
              >
                {isTakingPhoto || registerTimeRecord.isPending ? (
                  <ActivityIndicator color={mobileTheme.primary} size="large" />
                ) : (
                  <View style={styles.cameraCaptureInner} />
                )}
              </Pressable>
              <Text style={styles.cameraHint}>Toque para registrar {selectedRecordLabel.toLowerCase()}</Text>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mobileTheme.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120,
    gap: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mobileTheme.primarySoft,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: mobileTheme.primary,
  },
  headerCopy: {
    flex: 1,
  },
  headerEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: mobileTheme.mutedText,
  },
  headerTitle: {
    marginTop: 2,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1.2,
    color: mobileTheme.text,
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: mobileTheme.mutedText,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mobileTheme.surfaceRaised,
  },
  primaryCard: {
    borderRadius: 28,
    padding: 24,
    shadowColor: mobileTheme.primary,
    shadowOpacity: 0.14,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 5,
  },
  primaryBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  primaryDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  primaryBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  primaryLabel: {
    marginTop: 20,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '600',
  },
  primaryTime: {
    marginTop: 4,
    color: '#ffffff',
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -1.6,
  },
  primaryType: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  primaryDescription: {
    marginTop: 12,
    color: 'rgba(255,255,255,0.84)',
    fontSize: 14,
    lineHeight: 21,
  },
  primaryActionRow: {
    marginTop: 24,
    gap: 12,
  },
  primaryAction: {
    minHeight: 52,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryActionDisabled: {
    opacity: 0.7,
  },
  primaryActionText: {
    color: mobileTheme.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryHeroAction: {
    minHeight: 48,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryHeroActionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  grid: {
    gap: 14,
  },
  metricCard: {
    borderRadius: 24,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 20,
  },
  metricIcon: {
    width: 46,
    height: 46,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#edf4ff',
  },
  metricEyebrow: {
    marginTop: 16,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: mobileTheme.mutedText,
  },
  metricValue: {
    marginTop: 6,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1.2,
    color: mobileTheme.text,
  },
  metricHint: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    color: mobileTheme.mutedText,
  },
  secondaryCard: {
    borderRadius: 24,
    backgroundColor: mobileTheme.surfaceLow,
    padding: 20,
    gap: 8,
  },
  secondaryEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: mobileTheme.mutedText,
  },
  secondaryValue: {
    fontSize: 24,
    fontWeight: '800',
    color: mobileTheme.text,
  },
  secondaryHint: {
    fontSize: 13,
    lineHeight: 20,
    color: mobileTheme.mutedText,
  },
  shortcutsCard: {
    borderRadius: 24,
    backgroundColor: mobileTheme.surfaceLow,
    padding: 20,
    gap: 12,
  },
  shortcutsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  shortcutButton: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 16,
    gap: 10,
  },
  shortcutLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: mobileTheme.text,
  },
  locationCard: {
    borderRadius: 24,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 20,
    gap: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: mobileTheme.text,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 21,
    color: mobileTheme.mutedText,
  },
  inlinePill: {
    minHeight: 34,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: mobileTheme.surfaceLow,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  inlinePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: mobileTheme.primary,
  },
  locationHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 20,
    backgroundColor: mobileTheme.surfaceLow,
    padding: 16,
  },
  locationHeroIcon: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#edf4ff',
  },
  locationHeroCopy: {
    flex: 1,
    gap: 2,
  },
  locationHeroTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: mobileTheme.text,
  },
  locationHeroText: {
    fontSize: 13,
    fontWeight: '700',
    color: mobileTheme.primary,
  },
  locationHeroHint: {
    fontSize: 12,
    color: mobileTheme.mutedText,
  },
  locationInfo: {
    borderRadius: 18,
    backgroundColor: mobileTheme.surfaceLow,
    padding: 14,
    gap: 10,
  },
  locationInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  locationInfoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: mobileTheme.mutedText,
  },
  locationInfoValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: '700',
    color: mobileTheme.text,
  },
  locationActions: {
    gap: 10,
  },
  inlineAction: {
    minHeight: 48,
    borderRadius: 18,
    backgroundColor: mobileTheme.surfaceLow,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inlineActionText: {
    color: mobileTheme.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 13,
    lineHeight: 19,
    color: mobileTheme.danger,
  },
  recordsCard: {
    borderRadius: 24,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 20,
    gap: 14,
  },
  sectionLink: {
    color: mobileTheme.primary,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  recordsList: {
    gap: 10,
  },
  recordsPlaceholder: {
    minHeight: 100,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mobileTheme.surfaceLow,
    gap: 10,
    paddingHorizontal: 24,
  },
  recordsPlaceholderText: {
    fontSize: 13,
    textAlign: 'center',
    color: mobileTheme.mutedText,
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
    backgroundColor: mobileTheme.surfaceLow,
    padding: 14,
  },
  recordIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mobileTheme.surfaceRaised,
  },
  recordContent: {
    flex: 1,
    gap: 4,
  },
  recordTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: mobileTheme.text,
  },
  recordMeta: {
    fontSize: 12,
    color: mobileTheme.mutedText,
  },
  recordStatus: {
    maxWidth: 92,
    textAlign: 'right',
    fontSize: 11,
    fontWeight: '700',
    color: mobileTheme.primary,
  },
  footerInfo: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: mobileTheme.surfaceLow,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  footerInfoText: {
    fontSize: 13,
    color: mobileTheme.mutedText,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 60,
    backgroundColor: 'rgba(0,0,0,0.24)',
  },
  cameraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cameraHeaderCopy: {
    flex: 1,
    gap: 4,
  },
  cameraCloseButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  cameraSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
  cameraGuide: {
    borderRadius: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.42)',
    padding: 18,
    gap: 6,
  },
  cameraGuideTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  cameraGuideText: {
    color: 'rgba(255,255,255,0.84)',
    fontSize: 14,
    lineHeight: 20,
  },
  cameraFooter: {
    alignItems: 'center',
    paddingBottom: 40,
    gap: 16,
  },
  cameraCaptureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  cameraCaptureInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffffff',
  },
  cameraHint: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
