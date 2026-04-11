import { fetchAdminLiveDataSnapshot } from '@/shared/lib/admin-live-data';

export const getSettingsOverview = async () => {
  const snapshot = await fetchAdminLiveDataSnapshot();
  const activeEmployees = snapshot.employees.filter((employee) => employee.isActive);
  const activeSchedules = snapshot.workSchedules.filter((schedule) => schedule.isActive);
  const activeDevices = snapshot.devices.filter((device) => device.isActive);
  const employeesWithoutSchedule = activeEmployees.filter(
    (employee) =>
      !snapshot.employeeScheduleHistories.some((history) => history.employeeId === employee.id && history.isCurrent),
  );
  const primarySchedule = activeSchedules[0] ?? snapshot.workSchedules[0];
  const geofenceDevices = snapshot.devices.filter((device) => device.locationName);
  const pendingJustifications = snapshot.justifications.filter((item) => item.status === 'pending').length;
  const pendingVacations = snapshot.vacationRequests.filter((item) => item.status === 'pending').length;

  return {
    summary: {
      activeEmployees: activeEmployees.length,
      activeSchedules: activeSchedules.length,
      activeDevices: activeDevices.length,
      pendingApprovals: pendingJustifications + pendingVacations,
    },
    workPolicy: {
      dailyHours: primarySchedule?.expectedDailyMinutes
        ? `${String(Math.floor(primarySchedule.expectedDailyMinutes / 60)).padStart(2, '0')}:${String(primarySchedule.expectedDailyMinutes % 60).padStart(2, '0')}`
        : 'Não definido',
      breakHours:
        primarySchedule?.breakStartTime && primarySchedule.breakEndTime
          ? `${primarySchedule.breakStartTime} - ${primarySchedule.breakEndTime}`
          : 'Não definido',
      toleranceMinutes: primarySchedule?.toleranceMinutes ?? 0,
      activeSchedulesCount: activeSchedules.length,
      employeesWithoutSchedule: employeesWithoutSchedule.length,
    },
    geofence: {
      mainArea: geofenceDevices[0]?.locationName ?? 'Sem localidade vinculada',
      radius: `${Math.max(90, geofenceDevices.length * 40)}m`,
      blockingEnabled: geofenceDevices.length > 0,
      extraAreas: geofenceDevices.slice(1, 4).map((device, index) => ({
        id: device.id,
        name: device.locationName ?? device.name,
        radius: `${120 - index * 15}m`,
      })),
      inactiveDevices: snapshot.devices.filter((device) => !device.isActive).length,
    },
    policies: [
      {
        id: 'policy-tolerance',
        title: 'Tolerância operacional',
        description: `A tolerância padrão atual é de ${primarySchedule?.toleranceMinutes ?? 0} minuto(s) antes da abertura de ocorrência.`,
      },
      {
        id: 'policy-adjustment',
        title: 'Ajustes manuais',
        description: `${snapshot.auditLogs.length} evento(s) de auditoria já registram alterações sensíveis e validações administrativas.`,
      },
      {
        id: 'policy-storage',
        title: 'Anexos vinculados',
        description: `${snapshot.justificationAttachments.length} anexo(s) de justificativas e ${snapshot.vacationRequests.filter((item) => item.attachmentFileName || item.attachmentFileUrl).length} documento(s) de férias já estão relacionados ao ambiente.`,
      },
    ],
    integrity: [
      {
        id: 'integrity-photos',
        label: 'Fotos de marcação',
        value: String(snapshot.timeRecordPhotos.length),
        hint: 'Registros de imagem disponíveis para rastreabilidade da jornada.',
      },
      {
        id: 'integrity-devices',
        label: 'Dispositivos inativos',
        value: String(snapshot.devices.filter((device) => !device.isActive).length),
        hint: 'Terminais que podem impactar a captura operacional.',
      },
      {
        id: 'integrity-links',
        label: 'Vínculos de escala',
        value: String(snapshot.employeeScheduleHistories.filter((history) => history.isCurrent).length),
        hint: 'Históricos atuais que sustentam a distribuição de jornadas.',
      },
    ],
    notifications: [
      {
        id: 'notification-overtime',
        title: 'Resumo diário de horas extras',
        description: 'Baseado nas marcações persistidas e refletido nas visões de analytics e folha.',
        enabled: snapshot.timeRecords.some((record) => record.status !== 'valid'),
      },
      {
        id: 'notification-vacations',
        title: 'Solicitações de férias pendentes',
        description: 'Ativa quando existe pedido aguardando aprovação final do RH.',
        enabled: pendingVacations > 0,
      },
      {
        id: 'notification-devices',
        title: 'Sincronização de dispositivos',
        description: 'Aponta quando algum kiosk ou terminal fica inativo.',
        enabled: snapshot.devices.some((device) => !device.isActive),
      },
      {
        id: 'notification-audit',
        title: 'Resumo de auditoria',
        description: 'Consolida eventos críticos de fechamento, ajustes e revisões sensíveis.',
        enabled: snapshot.auditLogs.length > 0,
      },
    ],
  };
};
