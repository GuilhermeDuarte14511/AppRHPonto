import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { AttendanceCoordinates } from '@rh-ponto/attendance-policies';
import type { TimeRecordType } from '@rh-ponto/types';

import { useEmployeeAttendancePolicy } from '@/features/attendance/hooks/use-employee-attendance-policy';
import { useCurrentEmployee } from '@/features/employee/hooks/use-current-employee';
import { PunchTypeSheet } from '@/features/home/components/punch-type-sheet';
import { useEmployeeTimeRecords } from '@/features/time-records/hooks/use-employee-time-records';
import { useRegisterTimeRecord } from '@/features/time-records/hooks/use-register-time-record';
import {
  buildPunchPolicyExperience,
  buildPunchReadinessSummary,
  formatDurationFromMinutes,
  formatTimeRecordDateTime,
  formatTimeRecordTime,
  orderedTimeRecordTypes,
  timeRecordSourceLabels,
  timeRecordTypeLabels,
} from '@/features/time-records/lib/time-record-mobile';
import { AppIcon } from '@/shared/components/app-icon';
import { MobileDetailSkeleton, MobileListSkeleton } from '@/shared/components/mobile-skeleton';
import { useDeviceLocation } from '@/shared/hooks/use-device-location';
import { useAppSession } from '@/shared/providers/app-providers';
import { mobileTheme } from '@/shared/theme/tokens';

const statusPalette = {
  allowed: { backgroundColor: mobileTheme.primary, label: 'Permitido' },
  pending_review: { backgroundColor: '#ad6a00', label: 'Em revisão' },
  blocked: { backgroundColor: '#991b1b', label: 'Bloqueado' },
} as const;

const statusTextByRecordStatus = {
  valid: 'Validado automaticamente',
  pending_review: 'Aguardando revisão do RH',
  adjusted: 'Ajustado pela operação',
  rejected: 'Rejeitado pela revisão',
} as const;

const evaluationDetailPalette = {
  allowed: {
    accent: '#0f766e',
    surface: '#ecfdf5',
    border: '#99f6e4',
    titleColor: '#115e59',
    textColor: '#134e4a',
    icon: 'shield-checkmark-outline' as const,
  },
  pending_review: {
    accent: '#b45309',
    surface: '#fff7ed',
    border: '#fdba74',
    titleColor: '#9a3412',
    textColor: '#7c2d12',
    icon: 'time-outline' as const,
  },
  blocked: {
    accent: '#b91c1c',
    surface: '#fef2f2',
    border: '#fca5a5',
    titleColor: '#991b1b',
    textColor: '#7f1d1d',
    icon: 'alert-circle-outline' as const,
  },
} as const;

const formatCoordinatesLabel = (coordinates?: AttendanceCoordinates | null) =>
  coordinates ? `${coordinates.latitude.toFixed(5)}, ${coordinates.longitude.toFixed(5)}` : 'Aguardando GPS';

const formatAccuracyLabel = (coordinates?: AttendanceCoordinates | null) =>
  coordinates?.accuracyMeters ? `Precisão estimada de ${Math.round(coordinates.accuracyMeters)} m` : 'Precisão indisponível';

const buildConfirmationParams = (
  recordedAt: string | Date,
  recordType: TimeRecordType,
  evaluationTitle?: string | null,
  matchedLocationName?: string | null,
  status?: 'valid' | 'pending_review' | 'adjusted' | 'rejected',
  coordinates?: AttendanceCoordinates | null,
  resolvedAddress?: string | null,
  reviewReasonTitle?: string | null,
  reviewReasonDescription?: string | null,
  nextStepLabel?: string | null,
) => ({
  recordedAt: typeof recordedAt === 'string' ? recordedAt : recordedAt.toISOString(),
  type: recordType,
  status: status ?? 'valid',
  reason: evaluationTitle ?? '',
  locationName: matchedLocationName ?? '',
  coordinates: formatCoordinatesLabel(coordinates),
  address: resolvedAddress ?? '',
  reviewReasonTitle: reviewReasonTitle ?? '',
  reviewReasonDescription: reviewReasonDescription ?? '',
  nextStepLabel: nextStepLabel ?? '',
});

export const HomeScreen = () => {
  const { session } = useAppSession();
  const { employee, identity, employeeQuery } = useCurrentEmployee(session);
  const employeeId = employee?.id ?? null;
  const { address, coordinates, errorMessage, isLoading: isLocationLoading, permissionStatus, refreshLocation } =
    useDeviceLocation();
  const { dayFlow, records, nextRecordType, workedMinutesToday, todayRecords, timeRecordsQuery } =
    useEmployeeTimeRecords(employeeId);
  const { policyQuery, effectivePolicy, evaluation } = useEmployeeAttendancePolicy(employeeId, coordinates);
  const registerTimeRecord = useRegisterTimeRecord();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [isTypeSheetVisible, setIsTypeSheetVisible] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isReviewVisible, setIsReviewVisible] = useState(false);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<{ uri: string; size?: number } | null>(null);
  const [selectedRecordType, setSelectedRecordType] = useState<TimeRecordType | null>(null);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    setSelectedRecordType(nextRecordType);
  }, [nextRecordType]);

  useEffect(() => {
    if (permissionStatus === 'idle' && !coordinates && !isLocationLoading) {
      void refreshLocation();
    }
  }, [coordinates, isLocationLoading, permissionStatus, refreshLocation]);

  const employeeName = identity.name;
  const recentRecords = records.slice(0, 3);
  const activeCoordinates = coordinates;
  const resolvedAddress = address?.displayAddress ?? null;
  const hasResolvedLocation = Boolean(activeCoordinates && resolvedAddress);
  const statusKey = evaluation?.status ?? 'pending_review';
  const policyExperience = buildPunchPolicyExperience(evaluation);
  const readinessSummary = buildPunchReadinessSummary({
    evaluation,
    hasCoordinates: Boolean(activeCoordinates),
    hasResolvedAddress: hasResolvedLocation,
    selectedRecordType,
  });
  const evaluationPalette = evaluationDetailPalette[statusKey];
  const selectedRecordLabel = selectedRecordType ? timeRecordTypeLabels[selectedRecordType] : 'Escolha manualmente';
  const recommendedRecordLabel = nextRecordType ? timeRecordTypeLabels[nextRecordType] : 'Jornada concluída';
  const canRegister = Boolean(employeeId) && readinessSummary.canProceed && !registerTimeRecord.isPending;

  if (employeeQuery.isLoading || policyQuery.isLoading || timeRecordsQuery.isLoading) {
    return (
      <ScrollView contentContainerStyle={styles.content} style={styles.container}>
        <MobileDetailSkeleton sectionCount={2} />
        <MobileListSkeleton itemCount={2} showHero={false} />
      </ScrollView>
    );
  }

  const openCameraFlow = async () => {
    if (!employeeId) {
      Alert.alert('Cadastro indisponível', 'Não encontramos seu vínculo de colaborador para registrar o ponto.');
      return;
    }

    if (!selectedRecordType) {
      Alert.alert('Selecione a batida', 'Escolha o tipo de ponto antes de continuar.');
      return;
    }

    if (!hasResolvedLocation) {
      Alert.alert(
        'Confirme sua localização',
        'Atualize o GPS e aguarde o endereço aparecer antes de seguir para a foto.',
      );
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

  const handleCapturePhoto = async () => {
    if (isTakingPhoto || !cameraRef.current) {
      return;
    }

    setIsTakingPhoto(true);

    try {
      const picture = await cameraRef.current.takePictureAsync({ quality: 0.5, skipProcessing: true });

      if (!picture) {
        Alert.alert('Foto obrigatória', 'Não foi possível capturar a foto. Tente novamente.');
        return;
      }

      setCapturedPhoto({ uri: picture.uri, size: 0 });
      setIsCameraActive(false);
      setIsReviewVisible(true);
    } catch {
      Alert.alert('Erro', 'Não foi possível tirar a foto para registrar o ponto.');
    } finally {
      setIsTakingPhoto(false);
    }
  };

  const handleConfirmPunch = async () => {
    if (!employeeId || !selectedRecordType || !capturedPhoto) {
      Alert.alert('Dados incompletos', 'Confirme foto, tipo e localização antes de enviar.');
      return;
    }

    try {
      const createdRecord = await registerTimeRecord.mutateAsync({
        employeeId,
        recordedByUserId: session?.user.id ?? null,
        recordType: selectedRecordType,
        evaluation,
        coordinates: activeCoordinates,
        resolvedAddress,
        photo: capturedPhoto,
      });

      setIsReviewVisible(false);
      setCapturedPhoto(null);

      router.push({
        pathname: '/punch-confirmation',
        params: buildConfirmationParams(
          createdRecord.recordedAt,
          selectedRecordType,
          policyExperience.headline,
          evaluation?.matchedLocation?.name ?? evaluation?.nearestAllowedLocation?.name ?? null,
          createdRecord.status,
          activeCoordinates,
          resolvedAddress,
          policyExperience.reviewReasonTitle,
          policyExperience.reviewReasonDescription,
          policyExperience.nextStepLabel,
        ),
      });
    } catch (error) {
      Alert.alert(
        'Não foi possível registrar o ponto',
        error instanceof Error ? error.message : 'Tente novamente em instantes.',
      );
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.content} style={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{employeeName.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>Jornada de hoje</Text>
            <Text style={styles.headerTitle}>Olá, {employeeName.split(' ')[0]}</Text>
            <Text style={styles.headerSubtitle}>
              O envio do ponto só acontece depois da confirmação da foto, das coordenadas e do endereço.
            </Text>
          </View>
        </View>

        <View style={[styles.heroCard, { backgroundColor: statusPalette[statusKey].backgroundColor }]}>
          <Text style={styles.heroBadge}>{statusPalette[statusKey].label}</Text>
          <Text style={styles.heroTitle}>{selectedRecordLabel}</Text>
          <Text style={styles.heroText}>Próxima etapa sugerida: {recommendedRecordLabel}</Text>
          <Text style={styles.heroText}>{dayFlow.currentStepLabel}</Text>
          <Text style={styles.heroText}>{policyExperience.nextStepLabel}</Text>
          <View style={styles.chipRow}>
            {orderedTimeRecordTypes.map((recordType) => (
              <View key={recordType} style={styles.chip}>
                <Text style={styles.chipText}>{timeRecordTypeLabels[recordType]}</Text>
              </View>
            ))}
          </View>
          <View style={styles.buttonStack}>
            <Pressable style={styles.secondaryButton} onPress={() => setIsTypeSheetVisible(true)}>
              <Text style={styles.secondaryButtonText}>Escolher tipo</Text>
            </Pressable>
            <Pressable
              style={[styles.primaryButton, !canRegister && styles.buttonDisabled]}
              disabled={!canRegister}
              onPress={() => void openCameraFlow()}
            >
              <Text style={styles.primaryButtonText}>
                {registerTimeRecord.isPending ? 'Enviando...' : canRegister ? 'Capturar foto' : 'Revise os requisitos'}
              </Text>
            </Pressable>
          </View>
        </View>

        <View
          style={[
            styles.policyFeedbackCard,
            {
              backgroundColor: evaluationPalette.surface,
              borderColor: evaluationPalette.border,
            },
          ]}
        >
          <View style={styles.policyFeedbackHeader}>
            <View
              style={[
                styles.policyFeedbackIcon,
                {
                  backgroundColor: evaluationPalette.accent,
                },
              ]}
            >
              <AppIcon color="#fff" name={evaluationPalette.icon} size={18} />
            </View>
            <View style={styles.policyFeedbackCopy}>
              <Text style={[styles.policyFeedbackEyebrow, { color: evaluationPalette.accent }]}>
                Resultado da política
              </Text>
              <Text style={[styles.policyFeedbackTitle, { color: evaluationPalette.titleColor }]}>
                {policyExperience.headline}
              </Text>
            </View>
          </View>
          <Text style={[styles.policyFeedbackDescription, { color: evaluationPalette.textColor }]}>
            {policyExperience.description}
          </Text>
          <Text style={[styles.policyFeedbackHelper, { color: evaluationPalette.textColor }]}>
            {policyExperience.helper}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Antes de registrar</Text>
            <Text style={styles.cardLink}>{readinessSummary.canProceed ? 'Pronto' : 'Ajustar'}</Text>
          </View>
          {readinessSummary.checklist.map((item) => (
            <View key={item.id} style={styles.readinessRow}>
              <View
                style={[
                  styles.readinessDot,
                  item.state === 'ready'
                    ? styles.readinessDotReady
                    : item.state === 'warning'
                      ? styles.readinessDotWarning
                      : styles.readinessDotBlocked,
                ]}
              />
              <View style={styles.readinessCopy}>
                <Text style={styles.readinessTitle}>{item.label}</Text>
                <Text style={styles.readinessText}>{item.description}</Text>
              </View>
            </View>
          ))}
          <Text style={styles.cardText}>{readinessSummary.helperText}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resumo do dia</Text>
          <Text style={styles.cardText}>Horas trabalhadas hoje: {formatDurationFromMinutes(workedMinutesToday)}</Text>
          <Text style={styles.cardText}>Marcações de hoje: {todayRecords.length}</Text>
          <Text style={styles.cardText}>Política aplicada: {effectivePolicy?.name ?? 'Carregando política'}</Text>
        </View>

        <Pressable style={styles.actionCenterCard} onPress={() => router.push('/action-center' as never)}>
          <View style={styles.actionCenterHeader}>
            <View style={styles.actionCenterCopy}>
              <Text style={styles.actionCenterEyebrow}>Central de pendências</Text>
              <Text style={styles.actionCenterTitle}>Acompanhe documentos, férias e devolutivas do RH</Text>
            </View>
            <View style={styles.actionCenterIconWrap}>
              <AppIcon color={mobileTheme.primary} name="layers-outline" size={22} />
            </View>
          </View>

          <Text style={styles.actionCenterText}>
            Abra uma fila única com o que depende da sua ação e com o que ainda está em análise.
          </Text>

          <View style={styles.actionCenterFooter}>
            <Text style={styles.actionCenterLink}>Abrir central</Text>
            <AppIcon color={mobileTheme.primary} name="arrow-forward-outline" size={16} />
          </View>
        </Pressable>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Localização confirmada</Text>
            <Pressable onPress={() => void refreshLocation()}>
              <Text style={styles.cardLink}>{isLocationLoading ? 'Atualizando...' : 'Atualizar'}</Text>
            </Pressable>
          </View>
          <Text style={styles.cardText}>{evaluation?.title ?? 'Validação de geofence em andamento.'}</Text>
          {policyExperience.reviewReasonTitle ? (
            <>
              <Text style={styles.infoLabel}>Leitura operacional</Text>
              <Text style={styles.infoValue}>{policyExperience.reviewReasonTitle}</Text>
              {policyExperience.reviewReasonDescription ? (
                <Text style={styles.cardText}>{policyExperience.reviewReasonDescription}</Text>
              ) : null}
            </>
          ) : null}
          <Text style={styles.infoLabel}>Coordenadas</Text>
          <Text style={styles.infoValue}>{formatCoordinatesLabel(activeCoordinates)}</Text>
          <Text style={styles.infoLabel}>Endereço</Text>
          <Text style={styles.infoValue}>{resolvedAddress ?? 'Endereço ainda não confirmado'}</Text>
          <Text style={styles.infoLabel}>Precisão</Text>
          <Text style={styles.infoValue}>{formatAccuracyLabel(activeCoordinates)}</Text>
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Registros recentes</Text>
            <Pressable onPress={() => router.push('/(tabs)/time-records')}>
              <Text style={styles.cardLink}>Ver todos</Text>
            </Pressable>
          </View>
          {recentRecords.length === 0 ? (
            <Text style={styles.cardText}>Sua primeira marcação aparecerá aqui.</Text>
          ) : (
            recentRecords.map((record) => (
              <View key={record.id} style={styles.recordRow}>
                <View style={styles.recordCopy}>
                  <Text style={styles.recordTitle}>
                    {timeRecordTypeLabels[record.recordType]} • {formatTimeRecordDateTime(record.recordedAt)}
                  </Text>
                  <Text style={styles.recordMeta}>
                    {timeRecordSourceLabels[record.source]} • {statusTextByRecordStatus[record.status]}
                  </Text>
                </View>
                <Text style={styles.recordTime}>{formatTimeRecordTime(record.recordedAt)}</Text>
              </View>
            ))
          )}
        </View>
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

      <Modal visible={isReviewVisible} animationType="slide" transparent onRequestClose={() => setIsReviewVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={styles.modalEyebrow}>Confirmação da marcação</Text>
              <Text style={styles.modalTitle}>{selectedRecordLabel}</Text>
              <Text style={styles.cardText}>Revise todos os dados antes de enviar ao banco.</Text>

              {capturedPhoto ? <Image source={{ uri: capturedPhoto.uri }} style={styles.previewImage} /> : null}

              <View style={styles.summaryBox}>
                <Text style={styles.infoLabel}>Resultado da política</Text>
                <Text style={styles.infoValue}>{policyExperience.headline}</Text>
                <Text style={styles.infoLabel}>Tipo</Text>
                <Text style={styles.infoValue}>{selectedRecordLabel}</Text>
                <Text style={styles.infoLabel}>O que acontece depois</Text>
                <Text style={styles.infoValue}>{policyExperience.nextStepLabel}</Text>
                {policyExperience.reviewReasonTitle ? (
                  <>
                    <Text style={styles.infoLabel}>Motivo operacional</Text>
                    <Text style={styles.infoValue}>{policyExperience.reviewReasonTitle}</Text>
                  </>
                ) : null}
                <Text style={styles.infoLabel}>Coordenadas</Text>
                <Text style={styles.infoValue}>{formatCoordinatesLabel(activeCoordinates)}</Text>
                <Text style={styles.infoLabel}>Endereço</Text>
                <Text style={styles.infoValue}>{resolvedAddress ?? 'Endereço ainda não confirmado'}</Text>
              </View>

              <Pressable
                style={styles.secondaryModalButton}
                onPress={() => {
                  setIsReviewVisible(false);
                  setIsCameraActive(true);
                }}
              >
                <Text style={styles.secondaryModalButtonText}>Tirar outra foto</Text>
              </Pressable>
              <Pressable style={styles.secondaryModalButton} onPress={() => void refreshLocation()}>
                <Text style={styles.secondaryModalButtonText}>Atualizar localização</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmButton, registerTimeRecord.isPending && styles.buttonDisabled]}
                onPress={() => void handleConfirmPunch()}
                disabled={registerTimeRecord.isPending}
              >
                {registerTimeRecord.isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.confirmButtonText}>Confirmar e enviar</Text>}
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={isCameraActive} animationType="slide" onRequestClose={() => setIsCameraActive(false)}>
        <View style={styles.cameraContainer}>
          <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="front" animateShutter />
          <View style={styles.cameraOverlay}>
            <Pressable style={styles.cameraClose} onPress={() => setIsCameraActive(false)}>
              <AppIcon color="#fff" name="close" size={24} />
            </Pressable>
            <View style={styles.cameraGuide}>
              <Text style={styles.cameraTitle}>{selectedRecordLabel}</Text>
              <Text style={styles.cameraText}>Depois da foto, você ainda confirma endereço e coordenadas.</Text>
            </View>
            <Pressable style={styles.cameraButton} onPress={() => void handleCapturePhoto()} disabled={isTakingPhoto}>
              {isTakingPhoto ? <ActivityIndicator color={mobileTheme.primary} /> : <View style={styles.cameraButtonInner} />}
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: mobileTheme.background },
  content: { padding: 20, gap: 16, paddingBottom: 120 },
  header: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mobileTheme.primarySoft,
  },
  avatarText: { fontSize: 18, fontWeight: '800', color: mobileTheme.primary },
  headerCopy: { flex: 1 },
  headerEyebrow: { fontSize: 11, fontWeight: '800', color: mobileTheme.mutedText, textTransform: 'uppercase' },
  headerTitle: { fontSize: 30, fontWeight: '900', color: mobileTheme.text },
  headerSubtitle: { marginTop: 4, fontSize: 14, lineHeight: 20, color: mobileTheme.mutedText },
  heroCard: { borderRadius: 28, padding: 24, gap: 10 },
  heroBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    color: '#fff',
    fontWeight: '800',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  heroTitle: { color: '#fff', fontSize: 36, fontWeight: '900' },
  heroText: { color: '#fff', fontSize: 14, lineHeight: 20 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.14)' },
  chipText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  buttonStack: { gap: 10, marginTop: 8 },
  primaryButton: { minHeight: 50, borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: mobileTheme.primary, fontWeight: '800', fontSize: 14 },
  secondaryButton: {
    minHeight: 48,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  buttonDisabled: { opacity: 0.6 },
  policyFeedbackCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    gap: 10,
  },
  policyFeedbackHeader: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  policyFeedbackIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  policyFeedbackCopy: { flex: 1, gap: 2 },
  policyFeedbackEyebrow: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  policyFeedbackTitle: { fontSize: 18, fontWeight: '900' },
  policyFeedbackDescription: { fontSize: 14, lineHeight: 20, fontWeight: '700' },
  policyFeedbackHelper: { fontSize: 13, lineHeight: 19 },
  card: { borderRadius: 24, backgroundColor: mobileTheme.surfaceRaised, padding: 18, gap: 8 },
  actionCenterCard: {
    borderRadius: 24,
    backgroundColor: mobileTheme.surfaceRaised,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: mobileTheme.primarySoft,
  },
  actionCenterHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  actionCenterCopy: { flex: 1, gap: 4 },
  actionCenterEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: mobileTheme.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  actionCenterTitle: { fontSize: 20, fontWeight: '900', color: mobileTheme.text, lineHeight: 25 },
  actionCenterIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mobileTheme.primarySoft,
  },
  actionCenterText: { fontSize: 14, lineHeight: 20, color: mobileTheme.mutedText },
  actionCenterFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  actionCenterLink: { fontSize: 13, fontWeight: '800', color: mobileTheme.primary },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: mobileTheme.text },
  cardLink: { fontSize: 12, fontWeight: '800', color: mobileTheme.primary, textTransform: 'uppercase' },
  cardText: { fontSize: 14, lineHeight: 20, color: mobileTheme.mutedText },
  infoLabel: { marginTop: 6, fontSize: 11, fontWeight: '800', color: mobileTheme.mutedText, textTransform: 'uppercase' },
  infoValue: { fontSize: 14, lineHeight: 20, fontWeight: '700', color: mobileTheme.text },
  readinessRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  readinessDot: { width: 12, height: 12, borderRadius: 999, marginTop: 4 },
  readinessDotReady: { backgroundColor: mobileTheme.success },
  readinessDotWarning: { backgroundColor: mobileTheme.warning },
  readinessDotBlocked: { backgroundColor: mobileTheme.danger },
  readinessCopy: { flex: 1, gap: 2 },
  readinessTitle: { fontSize: 13, fontWeight: '800', color: mobileTheme.text },
  readinessText: { fontSize: 13, lineHeight: 19, color: mobileTheme.mutedText },
  errorText: { fontSize: 13, lineHeight: 19, color: mobileTheme.danger },
  recordRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: mobileTheme.surfaceLow,
  },
  recordCopy: { flex: 1, gap: 4 },
  recordTitle: { fontSize: 14, fontWeight: '700', color: mobileTheme.text },
  recordMeta: { fontSize: 12, color: mobileTheme.mutedText },
  recordTime: { fontSize: 12, fontWeight: '700', color: mobileTheme.primary },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,0.56)', justifyContent: 'flex-end' },
  modalCard: {
    maxHeight: '90%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: mobileTheme.background,
    padding: 20,
  },
  modalContent: { gap: 14, paddingBottom: 12 },
  modalEyebrow: { fontSize: 11, fontWeight: '800', color: mobileTheme.primary, textTransform: 'uppercase' },
  modalTitle: { fontSize: 24, fontWeight: '900', color: mobileTheme.text },
  previewImage: { width: '100%', height: 220, borderRadius: 22, backgroundColor: mobileTheme.surfaceLow },
  summaryBox: { borderRadius: 20, backgroundColor: mobileTheme.surfaceRaised, padding: 16, gap: 4 },
  secondaryModalButton: {
    minHeight: 50,
    borderRadius: 18,
    backgroundColor: mobileTheme.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryModalButtonText: { fontSize: 14, fontWeight: '800', color: mobileTheme.text },
  confirmButton: {
    minHeight: 52,
    borderRadius: 18,
    backgroundColor: mobileTheme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  cameraContainer: { flex: 1, backgroundColor: '#000' },
  cameraOverlay: { flex: 1, justifyContent: 'space-between', padding: 24, paddingTop: 56, backgroundColor: 'rgba(0,0,0,0.24)' },
  cameraClose: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.36)',
  },
  cameraGuide: { borderRadius: 22, backgroundColor: 'rgba(15,23,42,0.46)', padding: 18, gap: 6 },
  cameraTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  cameraText: { color: 'rgba(255,255,255,0.84)', fontSize: 14, lineHeight: 20 },
  cameraButton: {
    alignSelf: 'center',
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  cameraButtonInner: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#fff' },
});
