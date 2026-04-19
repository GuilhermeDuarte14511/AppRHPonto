import { beforeEach, describe, expect, it, vi } from 'vitest';

const { executeAdminGraphqlMock } = vi.hoisted(() => ({
  executeAdminGraphqlMock: vi.fn(),
}));

vi.mock('@/shared/lib/admin-server-data-connect', () => ({
  executeAdminGraphql: executeAdminGraphqlMock,
}));

import { updateSettingsForAdmin } from './settings-server';

describe('updateSettingsForAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('atualiza a jornada sem solicitar subcampos inválidos de workSchedule_update', async () => {
    executeAdminGraphqlMock.mockImplementation(async (query: string) => {
      if (query.includes('query GetAdminSettingsOverview')) {
        return {
          adminSettings: {
            id: 'settings-1',
            key: 'default',
            defaultAttendancePolicy: { id: 'policy-1', name: 'Política padrão' },
            defaultWorkSchedule: { id: 'schedule-1' },
            primaryDevice: { id: 'device-1' },
            geofenceMainArea: 'Matriz',
            geofenceRadiusMeters: 120,
            geofenceBlockingEnabled: true,
            notifyOvertimeSummary: true,
            notifyPendingVacations: true,
            notifyDeviceSync: true,
            notifyAuditSummary: true,
            createdAt: '2026-04-19T12:00:00.000Z',
            updatedAt: '2026-04-19T12:00:00.000Z',
          },
          attendancePolicies: [
            {
              id: 'policy-1',
              name: 'Política padrão',
              mode: 'office',
              validationStrategy: 'block',
              requiresAllowedLocations: true,
              isActive: true,
            },
          ],
          employees: [{ id: 'employee-1', isActive: true }],
          employeeAttendancePolicies: [],
          workSchedules: [
            {
              id: 'schedule-1',
              name: 'Administrativo',
              startTime: '08:00',
              breakStartTime: '12:00',
              breakEndTime: '13:00',
              endTime: '17:00',
              toleranceMinutes: 10,
              expectedDailyMinutes: 480,
              isActive: true,
            },
          ],
          devices: [
            {
              id: 'device-1',
              name: 'Totem recepção',
              identifier: 'TOTEM-01',
              type: 'kiosk',
              locationName: 'Recepção',
              isActive: true,
            },
          ],
          justifications: [],
          vacationRequests: [],
          employeeScheduleHistories: [],
          timeRecordPhotos: [],
          auditLogs: [],
        };
      }

      if (query.includes('mutation UpdateSettingsWorkSchedule')) {
        return { workSchedule_update: true };
      }

      if (query.includes('mutation UpdateAdminSettings')) {
        return { adminSettings_update: { id: 'settings-1' } };
      }

      if (query.includes('mutation CreateSettingsAuditLog')) {
        return { auditLog_insert: { id: 'audit-1' } };
      }

      return {};
    });

    await updateSettingsForAdmin(
      {
        defaultAttendancePolicyId: 'policy-1',
        scheduleId: 'schedule-1',
        startTime: '08:00',
        breakStartTime: '12:00',
        breakEndTime: '13:00',
        endTime: '17:00',
        toleranceMinutes: 10,
        expectedDailyMinutes: 480,
        primaryDeviceId: 'device-1',
        geofenceMainArea: 'Matriz',
        geofenceRadiusMeters: 120,
        geofenceBlockingEnabled: true,
        notifyOvertimeSummary: true,
        notifyPendingVacations: true,
        notifyDeviceSync: true,
        notifyAuditSummary: true,
      },
      'user-1',
    );

    const workScheduleMutation = executeAdminGraphqlMock.mock.calls.find(([query]) =>
      String(query).includes('mutation UpdateSettingsWorkSchedule'),
    )?.[0];

    expect(workScheduleMutation).toBeDefined();
    expect(String(workScheduleMutation)).not.toMatch(/workSchedule_update\s*\([\s\S]*?\)\s*\{/);
  });
});
