import {
  createAttendancePolicy,
  createEmployeeAllowedLocation,
  createEmployeeAttendancePolicy,
  createWorkLocation,
} from '../../domain/entities/attendance-policy';
import type {
  AttendancePolicyRepository,
  EmployeeAttendancePolicyDetails,
  UpsertEmployeeAttendancePolicyPayload,
} from '../../domain/repositories/attendance-policy-repository';

const now = '2026-04-10T00:00:00.000Z';

const policyCatalog = [
  createAttendancePolicy({
    id: 'b2b2b2b2-b2b2-42b2-82b2-b2b2b2b2b201',
    code: 'company-only',
    name: 'Presencial restrito',
    mode: 'company_only',
    validationStrategy: 'block',
    geolocationRequired: true,
    photoRequired: true,
    allowOffsiteClocking: false,
    requiresAllowedLocations: true,
    description: 'Aceita registro somente dentro das áreas autorizadas da empresa.',
    isActive: true,
    createdAt: now,
    updatedAt: now,
  }),
  createAttendancePolicy({
    id: 'b2b2b2b2-b2b2-42b2-82b2-b2b2b2b2b202',
    code: 'hybrid-home-company',
    name: 'Híbrido com casa e empresa',
    mode: 'hybrid',
    validationStrategy: 'pending_review',
    geolocationRequired: true,
    photoRequired: true,
    allowOffsiteClocking: false,
    requiresAllowedLocations: true,
    description: 'Aceita empresa e residência homologada. Fora disso, envia para revisão.',
    isActive: true,
    createdAt: now,
    updatedAt: now,
  }),
  createAttendancePolicy({
    id: 'b2b2b2b2-b2b2-42b2-82b2-b2b2b2b2b203',
    code: 'home-free',
    name: 'Home office livre',
    mode: 'free',
    validationStrategy: 'allow',
    geolocationRequired: true,
    photoRequired: false,
    allowOffsiteClocking: true,
    requiresAllowedLocations: false,
    description: 'Permite registrar em qualquer local com auditoria de coordenadas.',
    isActive: true,
    createdAt: now,
    updatedAt: now,
  }),
  createAttendancePolicy({
    id: 'b2b2b2b2-b2b2-42b2-82b2-b2b2b2b2b204',
    code: 'home-only',
    name: 'Home office com geofence',
    mode: 'home_only',
    validationStrategy: 'block',
    geolocationRequired: true,
    photoRequired: false,
    allowOffsiteClocking: false,
    requiresAllowedLocations: true,
    description: 'Permite registrar apenas dentro da residência autorizada.',
    isActive: true,
    createdAt: now,
    updatedAt: now,
  }),
  createAttendancePolicy({
    id: 'b2b2b2b2-b2b2-42b2-82b2-b2b2b2b2b205',
    code: 'field-mobile',
    name: 'Campo com revisão',
    mode: 'field',
    validationStrategy: 'pending_review',
    geolocationRequired: true,
    photoRequired: true,
    allowOffsiteClocking: true,
    requiresAllowedLocations: false,
    description: 'Libera ponto em campo com validação posterior do RH.',
    isActive: true,
    createdAt: now,
    updatedAt: now,
  }),
];

const locationCatalog = [
  createWorkLocation({
    id: 'c3c3c3c3-c3c3-43c3-83c3-c3c3c3c3c301',
    code: 'hq-sao-paulo',
    name: 'Matriz São Paulo',
    type: 'company',
    addressLine: 'Av. Paulista, 1500',
    addressComplement: null,
    city: 'São Paulo',
    state: 'SP',
    postalCode: '01310-200',
    latitude: -23.561684,
    longitude: -46.656139,
    radiusMeters: 160,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  }),
  createWorkLocation({
    id: 'c3c3c3c3-c3c3-43c3-83c3-c3c3c3c3c302',
    code: 'branch-campinas',
    name: 'Filial Campinas',
    type: 'branch',
    addressLine: 'Av. José de Souza Campos, 1100',
    addressComplement: null,
    city: 'Campinas',
    state: 'SP',
    postalCode: '13025-320',
    latitude: -22.890986,
    longitude: -47.052382,
    radiusMeters: 140,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  }),
  createWorkLocation({
    id: 'c3c3c3c3-c3c3-43c3-83c3-c3c3c3c3c303',
    code: 'home-beatriz',
    name: 'Residência Beatriz Santos',
    type: 'home',
    addressLine: 'Rua Serra de Bragança, 85',
    addressComplement: 'Apto 94',
    city: 'São Paulo',
    state: 'SP',
    postalCode: '03318-000',
    latitude: -23.559719,
    longitude: -46.563764,
    radiusMeters: 120,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  }),
  createWorkLocation({
    id: 'c3c3c3c3-c3c3-43c3-83c3-c3c3c3c3c304',
    code: 'home-lucas',
    name: 'Residência Lucas Ferreira',
    type: 'home',
    addressLine: 'Rua dos Pinheiros, 420',
    addressComplement: null,
    city: 'São Paulo',
    state: 'SP',
    postalCode: '05422-000',
    latitude: -23.567872,
    longitude: -46.693047,
    radiusMeters: 110,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  }),
  createWorkLocation({
    id: 'c3c3c3c3-c3c3-43c3-83c3-c3c3c3c3c305',
    code: 'home-ricardo',
    name: 'Residência Ricardo Almeida',
    type: 'home',
    addressLine: 'Rua Fernandes Moreira, 1022',
    addressComplement: null,
    city: 'São Paulo',
    state: 'SP',
    postalCode: '04716-003',
    latitude: -23.628161,
    longitude: -46.704749,
    radiusMeters: 130,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  }),
];

const assignmentsByEmployeeId = new Map(
  [
    createEmployeeAttendancePolicy({
      id: 'd4d4d4d4-d4d4-44d4-84d4-d4d4d4d4d401',
      employeeId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
      attendancePolicyId: 'b2b2b2b2-b2b2-42b2-82b2-b2b2b2b2b201',
      mode: 'company_only',
      validationStrategy: 'block',
      geolocationRequired: true,
      photoRequired: true,
      allowAnyLocation: false,
      blockOutsideAllowedLocations: true,
      notes: 'João só registra na matriz.',
      startsAt: '2026-01-01',
      endsAt: null,
      isCurrent: true,
      createdAt: now,
      updatedAt: now,
    }),
    createEmployeeAttendancePolicy({
      id: 'd4d4d4d4-d4d4-44d4-84d4-d4d4d4d4d402',
      employeeId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4',
      attendancePolicyId: 'b2b2b2b2-b2b2-42b2-82b2-b2b2b2b2b202',
      mode: 'hybrid',
      validationStrategy: 'pending_review',
      geolocationRequired: true,
      photoRequired: true,
      allowAnyLocation: false,
      blockOutsideAllowedLocations: false,
      notes: 'Beatriz pode registrar na matriz ou em casa.',
      startsAt: '2026-01-01',
      endsAt: null,
      isCurrent: true,
      createdAt: now,
      updatedAt: now,
    }),
    createEmployeeAttendancePolicy({
      id: 'd4d4d4d4-d4d4-44d4-84d4-d4d4d4d4d403',
      employeeId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa5',
      attendancePolicyId: 'b2b2b2b2-b2b2-42b2-82b2-b2b2b2b2b204',
      mode: 'home_only',
      validationStrategy: 'block',
      geolocationRequired: true,
      photoRequired: false,
      allowAnyLocation: false,
      blockOutsideAllowedLocations: true,
      notes: 'Lucas registra somente de casa.',
      startsAt: '2026-01-01',
      endsAt: null,
      isCurrent: true,
      createdAt: now,
      updatedAt: now,
    }),
    createEmployeeAttendancePolicy({
      id: 'd4d4d4d4-d4d4-44d4-84d4-d4d4d4d4d404',
      employeeId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa7',
      attendancePolicyId: 'b2b2b2b2-b2b2-42b2-82b2-b2b2b2b2b203',
      mode: 'free',
      validationStrategy: 'allow',
      geolocationRequired: true,
      photoRequired: false,
      allowAnyLocation: true,
      blockOutsideAllowedLocations: false,
      notes: 'Ricardo está em home office livre.',
      startsAt: '2026-01-01',
      endsAt: null,
      isCurrent: true,
      createdAt: now,
      updatedAt: now,
    }),
    createEmployeeAttendancePolicy({
      id: 'd4d4d4d4-d4d4-44d4-84d4-d4d4d4d4d405',
      employeeId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa12',
      attendancePolicyId: 'b2b2b2b2-b2b2-42b2-82b2-b2b2b2b2b205',
      mode: 'field',
      validationStrategy: 'pending_review',
      geolocationRequired: true,
      photoRequired: true,
      allowAnyLocation: true,
      blockOutsideAllowedLocations: false,
      notes: 'Diego registra em campo com revisão posterior.',
      startsAt: '2026-01-01',
      endsAt: null,
      isCurrent: true,
      createdAt: now,
      updatedAt: now,
    }),
  ].map((assignment) => [assignment.employeeId, assignment]),
);

let allowedLocationsByEmployeeId = new Map<string, ReturnType<typeof createEmployeeAllowedLocation>[]>(
  [
    [
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
      [
        createEmployeeAllowedLocation({
          id: 'e5e5e5e5-e5e5-45e5-85e5-e5e5e5e5e501',
          employeeAttendancePolicyId: 'd4d4d4d4-d4d4-44d4-84d4-d4d4d4d4d401',
          workLocationId: 'c3c3c3c3-c3c3-43c3-83c3-c3c3c3c3c301',
          locationRole: 'primary_company',
          isRequired: true,
          createdAt: now,
          updatedAt: now,
        }),
      ],
    ],
    [
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4',
      [
        createEmployeeAllowedLocation({
          id: 'e5e5e5e5-e5e5-45e5-85e5-e5e5e5e5e502',
          employeeAttendancePolicyId: 'd4d4d4d4-d4d4-44d4-84d4-d4d4d4d4d402',
          workLocationId: 'c3c3c3c3-c3c3-43c3-83c3-c3c3c3c3c301',
          locationRole: 'primary_company',
          isRequired: false,
          createdAt: now,
          updatedAt: now,
        }),
        createEmployeeAllowedLocation({
          id: 'e5e5e5e5-e5e5-45e5-85e5-e5e5e5e5e503',
          employeeAttendancePolicyId: 'd4d4d4d4-d4d4-44d4-84d4-d4d4d4d4d402',
          workLocationId: 'c3c3c3c3-c3c3-43c3-83c3-c3c3c3c3c303',
          locationRole: 'home',
          isRequired: false,
          createdAt: now,
          updatedAt: now,
        }),
      ],
    ],
    [
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa5',
      [
        createEmployeeAllowedLocation({
          id: 'e5e5e5e5-e5e5-45e5-85e5-e5e5e5e5e504',
          employeeAttendancePolicyId: 'd4d4d4d4-d4d4-44d4-84d4-d4d4d4d4d403',
          workLocationId: 'c3c3c3c3-c3c3-43c3-83c3-c3c3c3c3c304',
          locationRole: 'home',
          isRequired: true,
          createdAt: now,
          updatedAt: now,
        }),
      ],
    ],
  ],
);

export class MockAttendancePolicyRepository implements AttendancePolicyRepository {
  async listPolicies() {
    return policyCatalog;
  }

  async listLocations() {
    return locationCatalog;
  }

  async getEmployeePolicy(employeeId: string): Promise<EmployeeAttendancePolicyDetails> {
    const policyAssignment = assignmentsByEmployeeId.get(employeeId) ?? null;

    return {
      policyAssignment,
      policyCatalog,
      allowedLocations: policyAssignment ? allowedLocationsByEmployeeId.get(employeeId) ?? [] : [],
      locationCatalog,
    };
  }

  async upsertEmployeePolicy(payload: UpsertEmployeeAttendancePolicyPayload): Promise<EmployeeAttendancePolicyDetails> {
    const existingAssignment = assignmentsByEmployeeId.get(payload.employeeId);
    const assignmentId = existingAssignment?.id ?? `employee-attendance-policy-${payload.employeeId}`;
    const previousCreatedAt = existingAssignment?.createdAt ?? now;

    const nextAssignment = createEmployeeAttendancePolicy({
      id: assignmentId,
      employeeId: payload.employeeId,
      attendancePolicyId: payload.attendancePolicyId,
      mode: payload.mode,
      validationStrategy: payload.validationStrategy,
      geolocationRequired: payload.geolocationRequired,
      photoRequired: payload.photoRequired,
      allowAnyLocation: payload.allowAnyLocation,
      blockOutsideAllowedLocations: payload.blockOutsideAllowedLocations,
      notes: payload.notes ?? null,
      startsAt: payload.startsAt ?? null,
      endsAt: payload.endsAt ?? null,
      isCurrent: true,
      createdAt: previousCreatedAt,
      updatedAt: new Date().toISOString(),
    });

    assignmentsByEmployeeId.set(payload.employeeId, nextAssignment);

    allowedLocationsByEmployeeId.set(
      payload.employeeId,
      payload.selectedLocations.map((item, index) =>
        createEmployeeAllowedLocation({
          id: `${assignmentId}-allowed-location-${index + 1}`,
          employeeAttendancePolicyId: assignmentId,
          workLocationId: item.workLocationId,
          locationRole: item.locationRole,
          isRequired: item.isRequired,
          createdAt: now,
          updatedAt: new Date().toISOString(),
        }),
      ),
    );

    return this.getEmployeePolicy(payload.employeeId);
  }
}
