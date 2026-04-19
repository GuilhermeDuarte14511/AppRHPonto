import {
  createAttendancePolicy,
  createEmployeeAllowedLocation,
  createEmployeeAttendancePolicy,
  createWorkLocation,
} from '@attendance-policies/domain/entities/attendance-policy';
import { evaluateAttendanceLocation } from '@attendance-policies/application/services/evaluate-attendance-location';
import type { BadgeProps } from '@rh-ponto/ui';

import type { EmployeeAttendancePolicyViewData } from '@/features/employees/lib/employee-attendance-policy-contracts';

import type { TimeRecordListItem } from '../components/time-record-list-item';

export interface TimeRecordLocationComplianceViewModel {
  status: 'allowed' | 'pending_review' | 'blocked';
  reasonCode:
    | 'location_not_required'
    | 'location_missing'
    | 'allow_any_location'
    | 'within_allowed_area'
    | 'outside_allowed_area'
    | 'missing_allowed_locations';
  title: string;
  description: string;
  badgeLabel: string;
  badgeVariant: BadgeProps['variant'];
  policyName: string;
  matchedLocationName: string | null;
  nearestAllowedLocationName: string | null;
  distanceLabel: string | null;
}

const baseTimestamp = '2026-01-01T00:00:00.000Z';

const getBadgeVariant = (
  status: TimeRecordLocationComplianceViewModel['status'],
): BadgeProps['variant'] => {
  if (status === 'allowed') {
    return 'success';
  }

  if (status === 'pending_review') {
    return 'warning';
  }

  return 'danger';
};

const getBadgeLabel = (
  status: TimeRecordLocationComplianceViewModel['status'],
  reasonCode: TimeRecordLocationComplianceViewModel['reasonCode'],
) => {
  if (reasonCode === 'allow_any_location') {
    return 'Livre pela política';
  }

  if (reasonCode === 'location_not_required') {
    return 'Sem geolocalização obrigatória';
  }

  if (status === 'allowed') {
    return 'Dentro da regra';
  }

  if (status === 'pending_review') {
    return 'Exige revisão';
  }

  return 'Fora da regra';
};

export const resolveTimeRecordLocationCompliance = (
  record: TimeRecordListItem,
  policyData: EmployeeAttendancePolicyViewData,
): TimeRecordLocationComplianceViewModel | null => {
  const policyCatalogItem = policyData.policyCatalog.find(
    (item) => item.id === policyData.assignment.attendancePolicyId,
  );

  if (!policyCatalogItem) {
    return null;
  }

  const policy = createAttendancePolicy({
    id: policyCatalogItem.id,
    code: policyCatalogItem.code,
    name: policyCatalogItem.name,
    mode: policyCatalogItem.mode,
    validationStrategy: policyCatalogItem.validationStrategy,
    geolocationRequired: policyCatalogItem.geolocationRequired,
    photoRequired: policyCatalogItem.photoRequired,
    allowOffsiteClocking: policyCatalogItem.allowOffsiteClocking,
    requiresAllowedLocations: policyCatalogItem.requiresAllowedLocations,
    description: policyCatalogItem.description,
    isActive: policyCatalogItem.isActive,
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
  });

  const assignment = createEmployeeAttendancePolicy({
    id: policyData.assignment.assignmentId ?? `derived-${policyData.employeeId}`,
    employeeId: policyData.employeeId,
    attendancePolicyId: policyData.assignment.attendancePolicyId,
    mode: policyData.assignment.mode,
    validationStrategy: policyData.assignment.validationStrategy,
    geolocationRequired: policyData.assignment.geolocationRequired,
    photoRequired: policyData.assignment.photoRequired,
    allowAnyLocation: policyData.assignment.allowAnyLocation,
    blockOutsideAllowedLocations: policyData.assignment.blockOutsideAllowedLocations,
    notes: policyData.assignment.notes,
    startsAt: null,
    endsAt: null,
    isCurrent: true,
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
  });

  const allowedLocations = policyData.assignment.selectedLocations.map((item) =>
    createEmployeeAllowedLocation({
      id: `${assignment.id}-${item.id}`,
      employeeAttendancePolicyId: assignment.id,
      workLocationId: item.id,
      locationRole: item.locationRole,
      isRequired: item.isRequired,
      createdAt: baseTimestamp,
      updatedAt: baseTimestamp,
    }),
  );

  const locationCatalog = policyData.locationCatalog.map((item) =>
    createWorkLocation({
      id: item.id,
      code: item.code,
      name: item.name,
      type: item.type,
      addressLine: null,
      addressComplement: null,
      city: item.city,
      state: item.state,
      postalCode: null,
      latitude: item.latitude,
      longitude: item.longitude,
      radiusMeters: item.radiusMeters,
      isActive: item.isActive,
      createdAt: baseTimestamp,
      updatedAt: baseTimestamp,
    }),
  );

  const evaluation = evaluateAttendanceLocation({
    policy,
    policyAssignment: assignment,
    allowedLocations,
    locationCatalog,
    coordinates:
      record.latitude != null && record.longitude != null
        ? {
            latitude: record.latitude,
            longitude: record.longitude,
          }
        : null,
  });

  return {
    status: evaluation.status,
    reasonCode: evaluation.reasonCode,
    title: evaluation.title,
    description: evaluation.description,
    badgeLabel: getBadgeLabel(evaluation.status, evaluation.reasonCode),
    badgeVariant: getBadgeVariant(evaluation.status),
    policyName: policyCatalogItem.name,
    matchedLocationName: evaluation.matchedLocation?.name ?? null,
    nearestAllowedLocationName: evaluation.nearestAllowedLocation?.name ?? null,
    distanceLabel: evaluation.distanceMeters == null ? null : `${evaluation.distanceMeters} m`,
  };
};
