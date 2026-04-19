import type { EmployeeAttendancePolicyFormSchema } from '@rh-ponto/validations';

import { AppError } from '@rh-ponto/core';

import { executeAdminGraphql } from '@/shared/lib/admin-server-data-connect';

import type { EmployeeAttendancePolicyViewData } from './employee-attendance-policy-contracts';

const DEFAULT_SETTINGS_KEY = 'default';

interface EmployeeAttendancePolicyOverviewQueryData {
  employee: {
    id: string;
    fullName: string;
    registrationNumber: string;
  } | null;
  adminSettings: {
    defaultAttendancePolicy?: {
      id: string;
      name: string;
      mode: string;
      validationStrategy: string;
      geolocationRequired: boolean;
      photoRequired: boolean;
      requiresAllowedLocations: boolean;
    } | null;
  } | null;
  attendancePolicies: Array<{
    id: string;
    code: string;
    name: string;
    mode: string;
    validationStrategy: string;
    geolocationRequired: boolean;
    photoRequired: boolean;
    allowOffsiteClocking: boolean;
    requiresAllowedLocations: boolean;
    description?: string | null;
    isActive: boolean;
  }>;
  workLocations: Array<{
    id: string;
    code: string;
    name: string;
    type: string;
    city?: string | null;
    state?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    radiusMeters: number;
    isActive: boolean;
  }>;
  employeeAttendancePolicies: Array<{
    id: string;
    attendancePolicy: { id: string };
    mode: string;
    validationStrategy: string;
    geolocationRequired: boolean;
    photoRequired: boolean;
    allowAnyLocation: boolean;
    blockOutsideAllowedLocations: boolean;
    notes?: string | null;
  }>;
}

interface EmployeeAllowedLocationsQueryData {
  employeeAllowedLocations: Array<{
    id: string;
    workLocation: { id: string };
    locationRole: string;
    isRequired: boolean;
  }>;
}

interface EmployeeAttendancePolicyMutationData {
  employeeAttendancePolicy_insert?: { id: string } | null;
  employeeAttendancePolicy_update?: { id: string } | null;
}

const employeeAttendancePolicyOverviewQuery = `
  query GetEmployeeAttendancePolicyOverview($employeeId: UUID!, $settingsKey: String!) {
    employee(id: $employeeId) {
      id
      fullName
      registrationNumber
    }
    adminSettings(first: { where: { key: { eq: $settingsKey } } }) {
      defaultAttendancePolicy {
        id
        name
      mode
      validationStrategy
      geolocationRequired
      photoRequired
      requiresAllowedLocations
    }
    }
    attendancePolicies(orderBy: [{ name: ASC }], limit: 100) {
      id
      code
      name
      mode
      validationStrategy
      geolocationRequired
      photoRequired
      allowOffsiteClocking
      requiresAllowedLocations
      description
      isActive
    }
    workLocations(where: { isActive: { eq: true } }, orderBy: [{ name: ASC }], limit: 200) {
      id
      code
      name
      type
      city
      state
      latitude
      longitude
      radiusMeters
      isActive
    }
    employeeAttendancePolicies(
      where: { employeeId: { eq: $employeeId }, isCurrent: { eq: true } }
      orderBy: [{ createdAt: DESC }]
      limit: 1
    ) {
      id
      attendancePolicy {
        id
      }
      mode
      validationStrategy
      geolocationRequired
      photoRequired
      allowAnyLocation
      blockOutsideAllowedLocations
      notes
    }
  }
`;

const employeeAllowedLocationsQuery = `
  query GetEmployeeAllowedLocations($assignmentId: UUID!) {
    employeeAllowedLocations(
      where: { employeeAttendancePolicyId: { eq: $assignmentId } }
      orderBy: [{ createdAt: ASC }]
      limit: 100
    ) {
      id
      workLocation {
        id
      }
      locationRole
      isRequired
    }
  }
`;

const createEmployeeAttendancePolicyMutation = `
  mutation CreateEmployeeAttendancePolicy(
    $employeeId: UUID!
    $attendancePolicyId: UUID!
    $mode: String!
    $validationStrategy: String!
    $geolocationRequired: Boolean!
    $photoRequired: Boolean!
    $allowAnyLocation: Boolean!
    $blockOutsideAllowedLocations: Boolean!
    $notes: String
  ) {
    employeeAttendancePolicy_insert(
      data: {
        employee: { id: $employeeId }
        attendancePolicy: { id: $attendancePolicyId }
        mode: $mode
        validationStrategy: $validationStrategy
        geolocationRequired: $geolocationRequired
        photoRequired: $photoRequired
        allowAnyLocation: $allowAnyLocation
        blockOutsideAllowedLocations: $blockOutsideAllowedLocations
        notes: $notes
        isCurrent: true
        createdAt_expr: "request.time"
        updatedAt_expr: "request.time"
      }
    ) {
      id
    }
  }
`;

const updateEmployeeAttendancePolicyMutation = `
  mutation UpdateEmployeeAttendancePolicy(
    $id: UUID!
    $attendancePolicyId: UUID!
    $mode: String!
    $validationStrategy: String!
    $geolocationRequired: Boolean!
    $photoRequired: Boolean!
    $allowAnyLocation: Boolean!
    $blockOutsideAllowedLocations: Boolean!
    $notes: String
  ) {
    employeeAttendancePolicy_update(
      first: { where: { id: { eq: $id } } }
      data: {
        attendancePolicy: { id: $attendancePolicyId }
        mode: $mode
        validationStrategy: $validationStrategy
        geolocationRequired: $geolocationRequired
        photoRequired: $photoRequired
        allowAnyLocation: $allowAnyLocation
        blockOutsideAllowedLocations: $blockOutsideAllowedLocations
        notes: $notes
        updatedAt_expr: "request.time"
      }
    ) {
      id
    }
  }
`;

const deleteEmployeeAllowedLocationsMutation = `
  mutation DeleteEmployeeAllowedLocations($assignmentId: UUID!) {
    employeeAllowedLocation_deleteMany(where: { employeeAttendancePolicyId: { eq: $assignmentId } })
  }
`;

const insertEmployeeAllowedLocationMutation = `
  mutation InsertEmployeeAllowedLocation(
    $assignmentId: UUID!
    $workLocationId: UUID!
    $locationRole: String!
    $isRequired: Boolean!
  ) {
    employeeAllowedLocation_insert(
      data: {
        employeeAttendancePolicyId: $assignmentId
        workLocation: { id: $workLocationId }
        locationRole: $locationRole
        isRequired: $isRequired
        createdAt_expr: "request.time"
        updatedAt_expr: "request.time"
      }
    ) {
      id
    }
  }
`;

const mapEmployeeAttendancePolicyOverview = async (
  employeeId: string,
  overview: EmployeeAttendancePolicyOverviewQueryData,
): Promise<EmployeeAttendancePolicyViewData> => {
  if (!overview.employee) {
    throw new AppError('EMPLOYEE_NOT_FOUND', 'Funcionário não encontrado para a política de marcação.');
  }

  const explicitAssignment = overview.employeeAttendancePolicies[0] ?? null;
  const allowedLocations = explicitAssignment
    ? (
        await executeAdminGraphql<EmployeeAllowedLocationsQueryData>(employeeAllowedLocationsQuery, {
          assignmentId: explicitAssignment.id,
        })
      ).employeeAllowedLocations
    : [];

  const defaultAttendancePolicy =
    overview.adminSettings?.defaultAttendancePolicy ??
    overview.attendancePolicies.find((item) => item.isActive) ??
    overview.attendancePolicies[0] ??
    null;
  const effectivePolicy =
    overview.attendancePolicies.find((item) => item.id === explicitAssignment?.attendancePolicy.id) ?? defaultAttendancePolicy;

  if (!effectivePolicy) {
    throw new AppError('ATTENDANCE_POLICY_NOT_CONFIGURED', 'Nenhuma política de marcação ativa foi encontrada.');
  }

  return {
    employeeId: overview.employee.id,
    employeeName: overview.employee.fullName,
    registrationNumber: overview.employee.registrationNumber,
    inheritedFromDefault: explicitAssignment == null,
    defaultAttendancePolicyId: defaultAttendancePolicy?.id ?? null,
    defaultAttendancePolicyName: defaultAttendancePolicy?.name ?? null,
    policyCatalog: overview.attendancePolicies.map((item) => ({
      id: item.id,
      code: item.code,
      name: item.name,
      mode: item.mode as EmployeeAttendancePolicyViewData['assignment']['mode'],
      validationStrategy: item.validationStrategy as EmployeeAttendancePolicyViewData['assignment']['validationStrategy'],
      geolocationRequired: item.geolocationRequired,
      photoRequired: item.photoRequired,
      allowOffsiteClocking: item.allowOffsiteClocking,
      requiresAllowedLocations: item.requiresAllowedLocations,
      description: item.description ?? null,
      isActive: item.isActive,
    })),
    locationCatalog: overview.workLocations.map((item) => ({
      id: item.id,
      code: item.code,
      name: item.name,
      type: item.type as EmployeeAttendancePolicyViewData['locationCatalog'][number]['type'],
      city: item.city ?? null,
      state: item.state ?? null,
      latitude: item.latitude ?? null,
      longitude: item.longitude ?? null,
      radiusMeters: item.radiusMeters,
      isActive: item.isActive,
    })),
    assignment: {
      assignmentId: explicitAssignment?.id ?? null,
      attendancePolicyId: effectivePolicy.id,
      mode: (explicitAssignment?.mode ?? effectivePolicy.mode) as EmployeeAttendancePolicyViewData['assignment']['mode'],
      validationStrategy: (explicitAssignment?.validationStrategy ??
        effectivePolicy.validationStrategy) as EmployeeAttendancePolicyViewData['assignment']['validationStrategy'],
      geolocationRequired: explicitAssignment?.geolocationRequired ?? effectivePolicy.geolocationRequired,
      photoRequired: explicitAssignment?.photoRequired ?? effectivePolicy.photoRequired,
      allowAnyLocation: explicitAssignment?.allowAnyLocation ?? !effectivePolicy.requiresAllowedLocations,
      blockOutsideAllowedLocations: explicitAssignment?.blockOutsideAllowedLocations ?? true,
      notes: explicitAssignment?.notes ?? '',
      selectedLocations: allowedLocations.map((item) => ({
        id: item.workLocation.id,
        locationRole: item.locationRole as EmployeeAttendancePolicyViewData['assignment']['selectedLocations'][number]['locationRole'],
        isRequired: item.isRequired,
      })),
    },
  };
};

export const getEmployeeAttendancePolicyForAdmin = async (employeeId: string): Promise<EmployeeAttendancePolicyViewData> => {
  const overview = await executeAdminGraphql<EmployeeAttendancePolicyOverviewQueryData>(
    employeeAttendancePolicyOverviewQuery,
    {
      employeeId,
      settingsKey: DEFAULT_SETTINGS_KEY,
    },
  );

  return mapEmployeeAttendancePolicyOverview(employeeId, overview);
};

export const updateEmployeeAttendancePolicyForAdmin = async (
  employeeId: string,
  payload: EmployeeAttendancePolicyFormSchema,
) => {
  const current = await getEmployeeAttendancePolicyForAdmin(employeeId);
  const variables = {
    attendancePolicyId: payload.attendancePolicyId,
    mode: payload.mode,
    validationStrategy: payload.validationStrategy,
    geolocationRequired: payload.geolocationRequired,
    photoRequired: payload.photoRequired,
    allowAnyLocation: payload.allowAnyLocation,
    blockOutsideAllowedLocations: payload.blockOutsideAllowedLocations,
    notes: payload.notes ?? null,
  };

  const assignmentId = current.assignment.assignmentId
    ? (
        await executeAdminGraphql<EmployeeAttendancePolicyMutationData>(updateEmployeeAttendancePolicyMutation, {
          id: current.assignment.assignmentId,
          ...variables,
        })
      ).employeeAttendancePolicy_update?.id ?? current.assignment.assignmentId
    : (
        await executeAdminGraphql<EmployeeAttendancePolicyMutationData>(createEmployeeAttendancePolicyMutation, {
          employeeId,
          ...variables,
        })
      ).employeeAttendancePolicy_insert?.id;

  if (!assignmentId) {
    throw new AppError('EMPLOYEE_ATTENDANCE_POLICY_SAVE_FAILED', 'Não foi possível persistir a política do colaborador.');
  }

  await executeAdminGraphql(deleteEmployeeAllowedLocationsMutation, {
    assignmentId,
  });

  if (!payload.allowAnyLocation) {
    const uniqueLocationIds = [...new Set(payload.selectedLocationIds)];

    for (const locationId of uniqueLocationIds) {
      await executeAdminGraphql(insertEmployeeAllowedLocationMutation, {
        assignmentId,
        workLocationId: locationId,
        locationRole: payload.selectedLocationRoleById[locationId],
        isRequired: payload.selectedLocationRoleById[locationId] === 'home',
      });
    }
  }

  return getEmployeeAttendancePolicyForAdmin(employeeId);
};
