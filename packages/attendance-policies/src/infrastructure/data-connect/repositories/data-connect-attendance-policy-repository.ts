import {
  addEmployeeAllowedLocation,
  createEmployeeAttendancePolicy as createEmployeeAttendancePolicyMutation,
  listAttendancePolicies,
  listEmployeeAllowedLocations,
  listEmployeeAttendancePolicies,
  listWorkLocations,
  updateEmployeeAttendancePolicy,
  type ListAttendancePoliciesData,
  type ListEmployeeAllowedLocationsData,
  type ListEmployeeAttendancePoliciesData,
  type ListWorkLocationsData,
} from '@rh-ponto/api-client/generated';
import { getAppDataConnect } from '@rh-ponto/api-client';
import { AppError } from '@rh-ponto/core';
import {
  attendanceLocationRoles,
  attendancePolicyModes,
  attendanceValidationStrategies,
  workLocationTypes,
  type AttendanceLocationRole,
  type AttendancePolicyMode,
  type AttendanceValidationStrategy,
  type WorkLocationType,
} from '@rh-ponto/types';

import {
  createAttendancePolicy,
  createEmployeeAllowedLocation,
  createEmployeeAttendancePolicy,
  createWorkLocation,
  type AttendancePolicy,
  type EmployeeAllowedLocation,
  type EmployeeAttendancePolicy,
  type WorkLocation,
} from '../../../domain/entities/attendance-policy';
import type {
  AttendancePolicyRepository,
  EmployeeAttendancePolicyDetails,
  UpsertEmployeeAttendancePolicyPayload,
} from '../../../domain/repositories/attendance-policy-repository';

const toDateString = (value: string | Date | null | undefined): string | null => {
  if (!value) {
    return null;
  }

  return typeof value === 'string' ? value : value.toISOString().slice(0, 10);
};

const assertAttendancePolicyMode = (value: string): AttendancePolicyMode => {
  if (!attendancePolicyModes.includes(value as AttendancePolicyMode)) {
    throw new AppError('ATTENDANCE_POLICY_INVALID_MODE', 'Modo de política de marcação inválido retornado pelo Data Connect.');
  }

  return value as AttendancePolicyMode;
};

const assertValidationStrategy = (value: string): AttendanceValidationStrategy => {
  if (!attendanceValidationStrategies.includes(value as AttendanceValidationStrategy)) {
    throw new AppError(
      'ATTENDANCE_POLICY_INVALID_VALIDATION_STRATEGY',
      'Estratégia de validação inválida retornada pelo Data Connect.',
    );
  }

  return value as AttendanceValidationStrategy;
};

const assertLocationRole = (value: string): AttendanceLocationRole => {
  if (!attendanceLocationRoles.includes(value as AttendanceLocationRole)) {
    throw new AppError('ATTENDANCE_POLICY_INVALID_LOCATION_ROLE', 'Papel do local autorizado inválido retornado pelo Data Connect.');
  }

  return value as AttendanceLocationRole;
};

const assertWorkLocationType = (value: string): WorkLocationType => {
  if (!workLocationTypes.includes(value as WorkLocationType)) {
    throw new AppError('ATTENDANCE_POLICY_INVALID_WORK_LOCATION_TYPE', 'Tipo de local inválido retornado pelo Data Connect.');
  }

  return value as WorkLocationType;
};

const mapPolicyRecord = (record: ListAttendancePoliciesData['attendancePolicies'][number]): AttendancePolicy =>
  createAttendancePolicy({
    id: record.id,
    code: record.code,
    name: record.name,
    mode: assertAttendancePolicyMode(record.mode),
    validationStrategy: assertValidationStrategy(record.validationStrategy),
    geolocationRequired: record.geolocationRequired,
    photoRequired: record.photoRequired,
    allowOffsiteClocking: record.allowOffsiteClocking,
    requiresAllowedLocations: record.requiresAllowedLocations,
    description: record.description ?? null,
    isActive: record.isActive,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  });

const mapWorkLocationRecord = (record: ListWorkLocationsData['workLocations'][number]): WorkLocation =>
  createWorkLocation({
    id: record.id,
    code: record.code,
    name: record.name,
    type: assertWorkLocationType(record.type),
    addressLine: record.addressLine ?? null,
    addressComplement: record.addressComplement ?? null,
    city: record.city ?? null,
    state: record.state ?? null,
    postalCode: record.postalCode ?? null,
    latitude: record.latitude ?? null,
    longitude: record.longitude ?? null,
    radiusMeters: record.radiusMeters,
    isActive: record.isActive,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  });

const mapEmployeeAttendancePolicyRecord = (
  record: ListEmployeeAttendancePoliciesData['employeeAttendancePolicies'][number],
): EmployeeAttendancePolicy =>
  createEmployeeAttendancePolicy({
    id: record.id,
    employeeId: record.employee.id,
    attendancePolicyId: record.attendancePolicy.id,
    mode: assertAttendancePolicyMode(record.mode),
    validationStrategy: assertValidationStrategy(record.validationStrategy),
    geolocationRequired: record.geolocationRequired,
    photoRequired: record.photoRequired,
    allowAnyLocation: record.allowAnyLocation,
    blockOutsideAllowedLocations: record.blockOutsideAllowedLocations,
    notes: record.notes ?? null,
    startsAt: record.startsAt ?? null,
    endsAt: record.endsAt ?? null,
    isCurrent: record.isCurrent,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  });

const mapAllowedLocationRecord = (
  record: ListEmployeeAllowedLocationsData['employeeAllowedLocations'][number],
): EmployeeAllowedLocation =>
  createEmployeeAllowedLocation({
    id: record.id,
    employeeAttendancePolicyId: record.employeeAttendancePolicy.id,
    workLocationId: record.workLocation.id,
    locationRole: assertLocationRole(record.locationRole),
    isRequired: record.isRequired,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  });

const resolveCurrentAssignment = (assignments: EmployeeAttendancePolicy[]): EmployeeAttendancePolicy | null => {
  const orderedAssignments = assignments
    .slice()
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());

  return orderedAssignments.find((assignment) => assignment.isCurrent) ?? orderedAssignments[0] ?? null;
};

export class DataConnectAttendancePolicyRepository implements AttendancePolicyRepository {
  async listPolicies(): Promise<AttendancePolicy[]> {
    const { data } = await listAttendancePolicies(getAppDataConnect());

    return data.attendancePolicies.map(mapPolicyRecord);
  }

  async listLocations(): Promise<WorkLocation[]> {
    const { data } = await listWorkLocations(getAppDataConnect());

    return data.workLocations.map(mapWorkLocationRecord);
  }

  async getEmployeePolicy(employeeId: string): Promise<EmployeeAttendancePolicyDetails> {
    const [policyResult, locationResult, assignmentResult, allowedLocationResult] = await Promise.all([
      listAttendancePolicies(getAppDataConnect()),
      listWorkLocations(getAppDataConnect()),
      listEmployeeAttendancePolicies(getAppDataConnect()),
      listEmployeeAllowedLocations(getAppDataConnect()),
    ]);

    const policyCatalog = policyResult.data.attendancePolicies.map(mapPolicyRecord);
    const locationCatalog = locationResult.data.workLocations.map(mapWorkLocationRecord);
    const assignments = assignmentResult.data.employeeAttendancePolicies
      .filter((record) => record.employee.id === employeeId)
      .map(mapEmployeeAttendancePolicyRecord);
    const policyAssignment = resolveCurrentAssignment(assignments);
    const allowedLocations = policyAssignment
      ? allowedLocationResult.data.employeeAllowedLocations
          .filter((record) => record.employeeAttendancePolicy.id === policyAssignment.id)
          .map(mapAllowedLocationRecord)
      : [];

    return {
      policyAssignment,
      policyCatalog,
      allowedLocations,
      locationCatalog,
    };
  }

  async upsertEmployeePolicy(payload: UpsertEmployeeAttendancePolicyPayload): Promise<EmployeeAttendancePolicyDetails> {
    const currentDetails = await this.getEmployeePolicy(payload.employeeId);
    const currentAssignment = currentDetails.policyAssignment;

    let assignmentId = currentAssignment?.id ?? null;

    if (currentAssignment) {
      await updateEmployeeAttendancePolicy(getAppDataConnect(), {
        id: currentAssignment.id,
        attendancePolicyId: payload.attendancePolicyId,
        mode: payload.mode,
        validationStrategy: payload.validationStrategy,
        geolocationRequired: payload.geolocationRequired,
        photoRequired: payload.photoRequired,
        allowAnyLocation: payload.allowAnyLocation,
        blockOutsideAllowedLocations: payload.blockOutsideAllowedLocations,
        notes: payload.notes ?? null,
        startsAt: toDateString(payload.startsAt),
        endsAt: toDateString(payload.endsAt),
      });

      assignmentId = currentAssignment.id;
    } else {
      await createEmployeeAttendancePolicyMutation(getAppDataConnect(), {
        employeeId: payload.employeeId,
        attendancePolicyId: payload.attendancePolicyId,
        mode: payload.mode,
        validationStrategy: payload.validationStrategy,
        geolocationRequired: payload.geolocationRequired,
        photoRequired: payload.photoRequired,
        allowAnyLocation: payload.allowAnyLocation,
        blockOutsideAllowedLocations: payload.blockOutsideAllowedLocations,
        notes: payload.notes ?? null,
        startsAt: toDateString(payload.startsAt),
        endsAt: toDateString(payload.endsAt),
      });

      const refreshedDetails = await this.getEmployeePolicy(payload.employeeId);
      assignmentId = refreshedDetails.policyAssignment?.id ?? null;
    }

    if (!assignmentId) {
      throw new AppError('EMPLOYEE_ATTENDANCE_POLICY_ASSIGNMENT_MISSING', 'Não foi possível identificar o vínculo atualizado da política.');
    }

    const existingLocationIds = new Set(currentDetails.allowedLocations.map((item) => item.workLocationId));
    const selectedLocations = payload.selectedLocations.filter((item) => !existingLocationIds.has(item.workLocationId));

    await Promise.all(
      selectedLocations.map((item) =>
        addEmployeeAllowedLocation(getAppDataConnect(), {
          employeeAttendancePolicyId: assignmentId as string,
          workLocationId: item.workLocationId,
          locationRole: item.locationRole,
          isRequired: item.isRequired,
        }),
      ),
    );

    return this.getEmployeePolicy(payload.employeeId);
  }
}
