import { describe, expect, it } from 'vitest';

import type { EmployeeAttendancePolicyViewData } from '@/features/employees/lib/employee-attendance-policy-contracts';

import type { TimeRecordListItem } from '../components/time-record-list-item';
import { resolveTimeRecordLocationCompliance } from './time-record-location-compliance';

const createPolicyData = (
  overrides: Partial<EmployeeAttendancePolicyViewData> = {},
): EmployeeAttendancePolicyViewData => ({
  employeeId: 'employee-1',
  employeeName: 'Ana Souza',
  registrationNumber: '1001',
  inheritedFromDefault: false,
  defaultAttendancePolicyId: 'policy-1',
  defaultAttendancePolicyName: 'Híbrido',
  policyCatalog: [
    {
      id: 'policy-1',
      code: 'HYB',
      name: 'Híbrido',
      mode: 'hybrid',
      validationStrategy: 'block',
      geolocationRequired: true,
      photoRequired: false,
      allowOffsiteClocking: false,
      requiresAllowedLocations: true,
      description: 'Exige local autorizado.',
      isActive: true,
    },
  ],
  locationCatalog: [
    {
      id: 'location-1',
      code: 'MAT',
      name: 'Matriz Paulista',
      type: 'company',
      city: 'São Paulo',
      state: 'SP',
      latitude: -23.55052,
      longitude: -46.633308,
      radiusMeters: 150,
      isActive: true,
    },
  ],
  assignment: {
    assignmentId: 'assignment-1',
    attendancePolicyId: 'policy-1',
    mode: 'hybrid',
    validationStrategy: 'block',
    geolocationRequired: true,
    photoRequired: false,
    allowAnyLocation: false,
    blockOutsideAllowedLocations: true,
    notes: '',
    selectedLocations: [
      {
        id: 'location-1',
        locationRole: 'primary_company',
        isRequired: false,
      },
    ],
  },
  ...overrides,
});

const createRecord = (overrides: Partial<TimeRecordListItem> = {}): TimeRecordListItem => ({
  id: 'record-1',
  employeeId: 'employee-1',
  employeeName: 'Ana Souza',
  department: 'RH',
  deviceId: null,
  recordedByUserId: null,
  recordType: 'entry',
  source: 'employee_app',
  status: 'valid',
  recordedAt: '2026-04-19T11:00:00.000Z',
  originalRecordedAt: null,
  notes: null,
  isManual: false,
  referenceRecordId: null,
  latitude: -23.55052,
  longitude: -46.633308,
  resolvedAddress: 'Av. Paulista, 1000',
  ipAddress: null,
  createdAt: '2026-04-19T11:00:00.000Z',
  updatedAt: '2026-04-19T11:00:00.000Z',
  photos: [],
  ...overrides,
});

describe('resolveTimeRecordLocationCompliance', () => {
  it('indica quando a marcação está dentro da área autorizada', () => {
    const result = resolveTimeRecordLocationCompliance(createRecord(), createPolicyData());

    expect(result).toMatchObject({
      status: 'allowed',
      reasonCode: 'within_allowed_area',
      badgeLabel: 'Dentro da regra',
      matchedLocationName: 'Matriz Paulista',
    });
  });

  it('indica quando a política libera marcação sem geofence específica', () => {
    const result = resolveTimeRecordLocationCompliance(
      createRecord({
        latitude: -22.9009,
        longitude: -43.2096,
      }),
      createPolicyData({
        assignment: {
          assignmentId: 'assignment-1',
          attendancePolicyId: 'policy-1',
          mode: 'free',
          validationStrategy: 'allow',
          geolocationRequired: true,
          photoRequired: false,
          allowAnyLocation: true,
          blockOutsideAllowedLocations: false,
          notes: '',
          selectedLocations: [],
        },
      }),
    );

    expect(result).toMatchObject({
      status: 'allowed',
      reasonCode: 'allow_any_location',
      badgeLabel: 'Livre pela política',
    });
  });

  it('continua liberando marcações livres mesmo quando a policy pede revisão para outros fluxos', () => {
    const result = resolveTimeRecordLocationCompliance(
      createRecord({
        latitude: -22.9009,
        longitude: -43.2096,
      }),
      createPolicyData({
        policyCatalog: [
          {
            id: 'policy-1',
            code: 'HYB',
            name: 'Híbrido',
            mode: 'hybrid',
            validationStrategy: 'pending_review',
            geolocationRequired: true,
            photoRequired: false,
            allowOffsiteClocking: false,
            requiresAllowedLocations: false,
            description: 'Permite registrar sem geofence fixa.',
            isActive: true,
          },
        ],
        assignment: {
          assignmentId: 'assignment-1',
          attendancePolicyId: 'policy-1',
          mode: 'free',
          validationStrategy: 'pending_review',
          geolocationRequired: true,
          photoRequired: false,
          allowAnyLocation: true,
          blockOutsideAllowedLocations: false,
          notes: '',
          selectedLocations: [],
        },
      }),
    );

    expect(result).toMatchObject({
      status: 'allowed',
      reasonCode: 'allow_any_location',
      badgeLabel: 'Livre pela política',
    });
  });
});
