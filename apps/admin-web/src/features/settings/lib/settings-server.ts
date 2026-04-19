import type { AdminSettingsFormSchema } from '@rh-ponto/validations';

import { executeAdminGraphql } from '@/shared/lib/admin-server-data-connect';

import type { SettingsOverviewData } from './settings-contracts';

interface SettingsQueryData {
  adminSettings: {
    id: string;
    key: string;
    defaultAttendancePolicy?: { id: string; name: string } | null;
    defaultWorkSchedule?: { id: string } | null;
    primaryDevice?: { id: string } | null;
    geofenceMainArea?: string | null;
    geofenceRadiusMeters: number;
    geofenceBlockingEnabled: boolean;
    notifyOvertimeSummary: boolean;
    notifyPendingVacations: boolean;
    notifyDeviceSync: boolean;
    notifyAuditSummary: boolean;
    createdAt: string;
    updatedAt: string;
  } | null;
  attendancePolicies: Array<{
    id: string;
    name: string;
    mode: string;
    validationStrategy: string;
    requiresAllowedLocations: boolean;
    isActive: boolean;
  }>;
  employees: Array<{ id: string; isActive: boolean }>;
  employeeAttendancePolicies: Array<{
    id: string;
    employee: { id: string };
    isCurrent: boolean;
  }>;
  workSchedules: Array<{
    id: string;
    name: string;
    startTime: string;
    breakStartTime?: string | null;
    breakEndTime?: string | null;
    endTime: string;
    toleranceMinutes: number;
    expectedDailyMinutes?: number | null;
    isActive: boolean;
  }>;
  devices: Array<{
    id: string;
    name: string;
    identifier: string;
    type: string;
    locationName?: string | null;
    isActive: boolean;
  }>;
  justifications: Array<{ id: string }>;
  vacationRequests: Array<{ id: string }>;
  employeeScheduleHistories: Array<{
    id: string;
    employee: { id: string };
    isCurrent: boolean;
  }>;
  timeRecordPhotos: Array<{ id: string }>;
  auditLogs: Array<{ id: string }>;
}

interface SettingsMutationData {
  adminSettings_insert?: { id: string } | null;
  adminSettings_update?: { id: string } | null;
  workSchedule_update?: unknown;
  auditLog_insert?: { id: string } | null;
}

const DEFAULT_SETTINGS_KEY = 'default';

const settingsOverviewQuery = `
  query GetAdminSettingsOverview($key: String!) {
    adminSettings(first: { where: { key: { eq: $key } } }) {
      id
      key
      defaultAttendancePolicy {
        id
        name
      }
      defaultWorkSchedule {
        id
      }
      primaryDevice {
        id
      }
      geofenceMainArea
      geofenceRadiusMeters
      geofenceBlockingEnabled
      notifyOvertimeSummary
      notifyPendingVacations
      notifyDeviceSync
      notifyAuditSummary
      createdAt
      updatedAt
    }
    attendancePolicies(orderBy: [{ name: ASC }], limit: 100) {
      id
      name
      mode
      validationStrategy
      requiresAllowedLocations
      isActive
    }
    employees(limit: 500) {
      id
      isActive
    }
    employeeAttendancePolicies(where: { isCurrent: { eq: true } }, limit: 500) {
      id
      employee {
        id
      }
      isCurrent
    }
    workSchedules(orderBy: [{ createdAt: DESC }], limit: 100) {
      id
      name
      startTime
      breakStartTime
      breakEndTime
      endTime
      toleranceMinutes
      expectedDailyMinutes
      isActive
    }
    devices(orderBy: [{ createdAt: DESC }], limit: 100) {
      id
      name
      identifier
      type
      locationName
      isActive
    }
    justifications(where: { status: { eq: "pending" } }, limit: 100) {
      id
    }
    vacationRequests(where: { status: { eq: "pending" } }, limit: 100) {
      id
    }
    employeeScheduleHistories(limit: 500) {
      id
      employee {
        id
      }
      isCurrent
    }
    timeRecordPhotos(limit: 500) {
      id
    }
    auditLogs(orderBy: [{ createdAt: DESC }], limit: 50) {
      id
    }
  }
`;

const createSettingsMutation = `
  mutation CreateAdminSettings(
    $key: String!
    $defaultAttendancePolicyId: UUID
    $defaultWorkScheduleId: UUID
    $primaryDeviceId: UUID
    $geofenceMainArea: String
    $geofenceRadiusMeters: Int!
    $geofenceBlockingEnabled: Boolean!
    $notifyOvertimeSummary: Boolean!
    $notifyPendingVacations: Boolean!
    $notifyDeviceSync: Boolean!
    $notifyAuditSummary: Boolean!
  ) {
    adminSettings_insert(
      data: {
        key: $key
        defaultAttendancePolicy: { id: $defaultAttendancePolicyId }
        defaultWorkSchedule: { id: $defaultWorkScheduleId }
        primaryDevice: { id: $primaryDeviceId }
        geofenceMainArea: $geofenceMainArea
        geofenceRadiusMeters: $geofenceRadiusMeters
        geofenceBlockingEnabled: $geofenceBlockingEnabled
        notifyOvertimeSummary: $notifyOvertimeSummary
        notifyPendingVacations: $notifyPendingVacations
        notifyDeviceSync: $notifyDeviceSync
        notifyAuditSummary: $notifyAuditSummary
        createdAt_expr: "request.time"
        updatedAt_expr: "request.time"
      }
    ) {
      id
    }
  }
`;

const updateSettingsMutation = `
  mutation UpdateAdminSettings(
    $id: UUID!
    $defaultAttendancePolicyId: UUID
    $defaultWorkScheduleId: UUID
    $primaryDeviceId: UUID
    $geofenceMainArea: String
    $geofenceRadiusMeters: Int!
    $geofenceBlockingEnabled: Boolean!
    $notifyOvertimeSummary: Boolean!
    $notifyPendingVacations: Boolean!
    $notifyDeviceSync: Boolean!
    $notifyAuditSummary: Boolean!
  ) {
    adminSettings_update(
      id: $id
      data: {
        defaultAttendancePolicy: { id: $defaultAttendancePolicyId }
        defaultWorkSchedule: { id: $defaultWorkScheduleId }
        primaryDevice: { id: $primaryDeviceId }
        geofenceMainArea: $geofenceMainArea
        geofenceRadiusMeters: $geofenceRadiusMeters
        geofenceBlockingEnabled: $geofenceBlockingEnabled
        notifyOvertimeSummary: $notifyOvertimeSummary
        notifyPendingVacations: $notifyPendingVacations
        notifyDeviceSync: $notifyDeviceSync
        notifyAuditSummary: $notifyAuditSummary
        updatedAt_expr: "request.time"
      }
    ) {
      id
    }
  }
`;

const updateWorkScheduleMutation = `
  mutation UpdateSettingsWorkSchedule(
    $id: UUID!
    $startTime: String!
    $breakStartTime: String
    $breakEndTime: String
    $endTime: String!
    $toleranceMinutes: Int!
    $expectedDailyMinutes: Int!
  ) {
    workSchedule_update(
      id: $id
      data: {
        startTime: $startTime
        breakStartTime: $breakStartTime
        breakEndTime: $breakEndTime
        endTime: $endTime
        toleranceMinutes: $toleranceMinutes
        expectedDailyMinutes: $expectedDailyMinutes
        updatedAt_expr: "request.time"
      }
    )
  }
`;

const createAuditLogMutation = `
  mutation CreateSettingsAuditLog(
    $userId: UUID!
    $description: String!
  ) {
    auditLog_insert(
      data: {
        user: { id: $userId }
        entityName: "settings"
        action: "settings.updated"
        description: $description
        createdAt_expr: "request.time"
      }
    ) {
      id
    }
  }
`;

const ensureSettingsRecord = async (data: SettingsQueryData) => {
  const currentSettings = data.adminSettings;

  if (currentSettings) {
    return currentSettings;
  }

  const defaultWorkScheduleId = data.workSchedules.find((schedule) => schedule.isActive)?.id ?? data.workSchedules[0]?.id ?? null;
  const defaultAttendancePolicyId =
    data.attendancePolicies.find((policy) => policy.isActive)?.id ?? data.attendancePolicies[0]?.id ?? null;
  const primaryDeviceId = data.devices.find((device) => device.isActive)?.id ?? data.devices[0]?.id ?? null;
  const primaryDevice = data.devices.find((device) => device.id === primaryDeviceId);
  const created = await executeAdminGraphql<SettingsMutationData>(createSettingsMutation, {
    key: DEFAULT_SETTINGS_KEY,
    defaultAttendancePolicyId,
    defaultWorkScheduleId,
    primaryDeviceId,
    geofenceMainArea: primaryDevice?.locationName ?? 'Área principal',
    geofenceRadiusMeters: 120,
    geofenceBlockingEnabled: true,
    notifyOvertimeSummary: true,
    notifyPendingVacations: true,
    notifyDeviceSync: true,
    notifyAuditSummary: true,
  });

  return {
    id: created.adminSettings_insert?.id ?? '',
    key: DEFAULT_SETTINGS_KEY,
    defaultAttendancePolicy:
      defaultAttendancePolicyId != null
        ? {
            id: defaultAttendancePolicyId,
            name: data.attendancePolicies.find((policy) => policy.id === defaultAttendancePolicyId)?.name ?? 'Política padrão',
          }
        : null,
    defaultWorkSchedule: defaultWorkScheduleId ? { id: defaultWorkScheduleId } : null,
    primaryDevice: primaryDeviceId ? { id: primaryDeviceId } : null,
    geofenceMainArea: primaryDevice?.locationName ?? 'Área principal',
    geofenceRadiusMeters: 120,
    geofenceBlockingEnabled: true,
    notifyOvertimeSummary: true,
    notifyPendingVacations: true,
    notifyDeviceSync: true,
    notifyAuditSummary: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const mapOverview = (data: SettingsQueryData, settings: Awaited<ReturnType<typeof ensureSettingsRecord>>): SettingsOverviewData => {
  const activeEmployees = data.employees.filter((employee) => employee.isActive);
  const activeAttendancePolicies = data.attendancePolicies.filter((policy) => policy.isActive);
  const activeSchedules = data.workSchedules.filter((schedule) => schedule.isActive);
  const activeDevices = data.devices.filter((device) => device.isActive);
  const selectedSchedule =
    data.workSchedules.find((schedule) => schedule.id === settings.defaultWorkSchedule?.id) ??
    activeSchedules[0] ??
    data.workSchedules[0];
  const selectedDevice =
    data.devices.find((device) => device.id === settings.primaryDevice?.id) ??
    activeDevices[0] ??
    data.devices[0];
  const selectedAttendancePolicy =
    data.attendancePolicies.find((policy) => policy.id === settings.defaultAttendancePolicy?.id) ??
    activeAttendancePolicies[0] ??
    data.attendancePolicies[0];
  const employeesWithoutSchedule = activeEmployees.filter(
    (employee) =>
      !data.employeeScheduleHistories.some((history) => history.employee.id === employee.id && history.isCurrent),
  );

  return {
    summary: {
      activeEmployees: activeEmployees.length,
      activeSchedules: activeSchedules.length,
      activeDevices: activeDevices.length,
      pendingApprovals: data.justifications.length + data.vacationRequests.length,
    },
    attendancePolicyOptions: data.attendancePolicies.map((policy) => ({
      id: policy.id,
      label: policy.name,
      supportingText: `${policy.mode} • ${policy.validationStrategy}${policy.requiresAllowedLocations ? ' • exige local autorizado' : ''}`,
    })),
    scheduleOptions: data.workSchedules.map((schedule) => ({
      id: schedule.id,
      label: schedule.name,
      supportingText: `${schedule.startTime} às ${schedule.endTime}${schedule.isActive ? ' • ativa' : ' • inativa'}`,
    })),
    scheduleDefinitions: data.workSchedules.map((schedule) => ({
      id: schedule.id,
      name: schedule.name,
      startTime: schedule.startTime,
      breakStartTime: schedule.breakStartTime ?? '12:00',
      breakEndTime: schedule.breakEndTime ?? '13:00',
      endTime: schedule.endTime,
      toleranceMinutes: schedule.toleranceMinutes,
      expectedDailyMinutes: schedule.expectedDailyMinutes ?? 480,
      isActive: schedule.isActive,
    })),
    deviceOptions: data.devices.map((device) => ({
      id: device.id,
      label: device.name,
      supportingText: `${device.locationName ?? 'Sem localidade'} • ${device.type}${device.isActive ? '' : ' • inativo'}`,
    })),
    attendancePolicy: {
      defaultAttendancePolicyId: selectedAttendancePolicy?.id ?? '',
      defaultAttendancePolicyName: selectedAttendancePolicy?.name ?? 'Sem política padrão',
      activePoliciesCount: activeAttendancePolicies.length,
      employeesWithExplicitPolicy: data.employeeAttendancePolicies.filter((item) => item.isCurrent).length,
    },
    workPolicy: {
      scheduleId: selectedSchedule?.id ?? '',
      startTime: selectedSchedule?.startTime ?? '08:00',
      breakStartTime: selectedSchedule?.breakStartTime ?? '12:00',
      breakEndTime: selectedSchedule?.breakEndTime ?? '13:00',
      endTime: selectedSchedule?.endTime ?? '17:00',
      toleranceMinutes: selectedSchedule?.toleranceMinutes ?? 10,
      expectedDailyMinutes: selectedSchedule?.expectedDailyMinutes ?? 480,
      activeSchedulesCount: activeSchedules.length,
      employeesWithoutSchedule: employeesWithoutSchedule.length,
    },
    geofence: {
      primaryDeviceId: selectedDevice?.id ?? '',
      mainArea: settings.geofenceMainArea ?? selectedDevice?.locationName ?? 'Área principal',
      radiusMeters: settings.geofenceRadiusMeters,
      blockingEnabled: settings.geofenceBlockingEnabled,
      inactiveDevices: data.devices.filter((device) => !device.isActive).length,
    },
    policies: [
      {
        id: 'policy-attendance',
        title: 'Política padrão de marcação',
        description: `${selectedAttendancePolicy?.name ?? 'Nenhuma política definida'} está configurada como padrão para novos vínculos.`,
      },
      {
        id: 'policy-tolerance',
        title: 'Tolerância operacional',
        description: `O ambiente utiliza ${selectedSchedule?.toleranceMinutes ?? 0} minuto(s) de tolerância antes de gerar exceção de jornada.`,
      },
      {
        id: 'policy-approvals',
        title: 'Aprovações do RH',
        description: `${data.justifications.length + data.vacationRequests.length} solicitação(ões) aguardam algum tipo de decisão administrativa no momento.`,
      },
      {
        id: 'policy-devices',
        title: 'Cobertura de dispositivos',
        description: `${activeDevices.length} dispositivo(s) ativos sustentam a captura principal de ponto na operação atual.`,
      },
    ],
    integrity: [
      {
        id: 'integrity-photos',
        label: 'Fotos de marcação',
        value: String(data.timeRecordPhotos.length),
        hint: 'Registros de evidência disponíveis para rastreabilidade operacional.',
      },
      {
        id: 'integrity-devices',
        label: 'Dispositivos inativos',
        value: String(data.devices.filter((device) => !device.isActive).length),
        hint: 'Terminais que podem impactar a captura de jornada ou o kiosk.',
      },
      {
        id: 'integrity-audit',
        label: 'Eventos auditáveis',
        value: String(data.auditLogs.length),
        hint: 'Eventos administrativos recentes com trilha persistida no Data Connect.',
      },
    ],
    notifications: [
      {
        id: 'notification-overtime',
        title: 'Exceções de ponto e horas extras',
        description: 'Sinaliza registros pendentes de revisão e jornadas acima do fluxo esperado.',
        enabled: settings.notifyOvertimeSummary,
      },
      {
        id: 'notification-vacations',
        title: 'Solicitações pendentes do RH',
        description: 'Agrupa férias e justificativas aguardando decisão do time administrativo.',
        enabled: settings.notifyPendingVacations,
      },
      {
        id: 'notification-devices',
        title: 'Sincronização de dispositivos',
        description: 'Notifica quando algum terminal fica inativo ou sem localidade principal.',
        enabled: settings.notifyDeviceSync,
      },
      {
        id: 'notification-audit',
        title: 'Resumo de auditoria sensível',
        description: 'Aponta ações críticas como aprovações, reprovações e alterações de cadastro.',
        enabled: settings.notifyAuditSummary,
      },
    ],
  };
};

export const getSettingsOverviewForAdmin = async (): Promise<SettingsOverviewData> => {
  const data = await executeAdminGraphql<SettingsQueryData>(settingsOverviewQuery, {
    key: DEFAULT_SETTINGS_KEY,
  });
  const settings = await ensureSettingsRecord(data);

  return mapOverview(data, settings);
};

export const updateSettingsForAdmin = async (payload: AdminSettingsFormSchema, actorUserId: string) => {
  const initialData = await executeAdminGraphql<SettingsQueryData>(settingsOverviewQuery, {
    key: DEFAULT_SETTINGS_KEY,
  });
  const settings = await ensureSettingsRecord(initialData);

  await executeAdminGraphql<SettingsMutationData>(updateWorkScheduleMutation, {
    id: payload.scheduleId,
    startTime: payload.startTime,
    breakStartTime: payload.breakStartTime,
    breakEndTime: payload.breakEndTime,
    endTime: payload.endTime,
    toleranceMinutes: payload.toleranceMinutes,
    expectedDailyMinutes: payload.expectedDailyMinutes,
  });

  await executeAdminGraphql<SettingsMutationData>(updateSettingsMutation, {
    id: settings.id,
    defaultAttendancePolicyId: payload.defaultAttendancePolicyId,
    defaultWorkScheduleId: payload.scheduleId,
    primaryDeviceId: payload.primaryDeviceId,
    geofenceMainArea: payload.geofenceMainArea,
    geofenceRadiusMeters: payload.geofenceRadiusMeters,
    geofenceBlockingEnabled: payload.geofenceBlockingEnabled,
    notifyOvertimeSummary: payload.notifyOvertimeSummary,
    notifyPendingVacations: payload.notifyPendingVacations,
    notifyDeviceSync: payload.notifyDeviceSync,
    notifyAuditSummary: payload.notifyAuditSummary,
  });

  await executeAdminGraphql<SettingsMutationData>(createAuditLogMutation, {
    userId: actorUserId,
    description: 'Parâmetros operacionais, geofence e preferências de notificação foram atualizados.',
  }).catch(() => undefined);

  return getSettingsOverviewForAdmin();
};
