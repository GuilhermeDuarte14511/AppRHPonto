export interface SettingsSummaryCard {
  activeEmployees: number;
  activeSchedules: number;
  activeDevices: number;
  pendingApprovals: number;
}

export interface SettingsCatalogOption {
  id: string;
  label: string;
  supportingText: string;
}

export interface SettingsScheduleDefinition {
  id: string;
  name: string;
  startTime: string;
  breakStartTime: string;
  breakEndTime: string;
  endTime: string;
  toleranceMinutes: number;
  expectedDailyMinutes: number;
  isActive: boolean;
}

export interface SettingsNotificationPreference {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export interface SettingsPolicyNote {
  id: string;
  title: string;
  description: string;
}

export interface SettingsIntegrityItem {
  id: string;
  label: string;
  value: string;
  hint: string;
}

export interface SettingsOverviewData {
  summary: SettingsSummaryCard;
  attendancePolicyOptions: SettingsCatalogOption[];
  scheduleOptions: SettingsCatalogOption[];
  scheduleDefinitions: SettingsScheduleDefinition[];
  deviceOptions: SettingsCatalogOption[];
  attendancePolicy: {
    defaultAttendancePolicyId: string;
    defaultAttendancePolicyName: string;
    activePoliciesCount: number;
    employeesWithExplicitPolicy: number;
  };
  workPolicy: {
    scheduleId: string;
    startTime: string;
    breakStartTime: string;
    breakEndTime: string;
    endTime: string;
    toleranceMinutes: number;
    expectedDailyMinutes: number;
    activeSchedulesCount: number;
    employeesWithoutSchedule: number;
  };
  geofence: {
    primaryDeviceId: string;
    mainArea: string;
    radiusMeters: number;
    blockingEnabled: boolean;
    inactiveDevices: number;
  };
  policies: SettingsPolicyNote[];
  integrity: SettingsIntegrityItem[];
  notifications: SettingsNotificationPreference[];
}
