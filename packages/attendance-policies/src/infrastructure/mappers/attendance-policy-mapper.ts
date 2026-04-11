import type {
  AttendancePolicyDto,
  EmployeeAttendancePolicyDto,
  WorkLocationDto,
} from '../../application/dto/attendance-policy-dto';
import type { EmployeeAttendancePolicyDetails } from '../../domain/repositories/attendance-policy-repository';

export const toAttendancePolicyDetailsDto = (
  employeeId: string,
  details: EmployeeAttendancePolicyDetails,
): {
  policyCatalog: AttendancePolicyDto[];
  locationCatalog: WorkLocationDto[];
  assignment: EmployeeAttendancePolicyDto;
} => ({
  policyCatalog: details.policyCatalog.map((item) => ({
    id: item.id,
    code: item.code,
    name: item.name,
    mode: item.mode,
    validationStrategy: item.validationStrategy,
    geolocationRequired: item.geolocationRequired,
    photoRequired: item.photoRequired,
    allowOffsiteClocking: item.allowOffsiteClocking,
    requiresAllowedLocations: item.requiresAllowedLocations,
    description: item.description,
    isActive: item.isActive,
  })),
  locationCatalog: details.locationCatalog.map((item) => ({
    id: item.id,
    code: item.code,
    name: item.name,
    type: item.type,
    city: item.city,
    state: item.state,
    radiusMeters: item.radiusMeters,
    isActive: item.isActive,
  })),
  assignment: {
    assignmentId: details.policyAssignment?.id ?? null,
    employeeId,
    attendancePolicyId: details.policyAssignment?.attendancePolicyId ?? null,
    mode: details.policyAssignment?.mode ?? null,
    validationStrategy: details.policyAssignment?.validationStrategy ?? null,
    geolocationRequired: details.policyAssignment?.geolocationRequired ?? true,
    photoRequired: details.policyAssignment?.photoRequired ?? false,
    allowAnyLocation: details.policyAssignment?.allowAnyLocation ?? false,
    blockOutsideAllowedLocations: details.policyAssignment?.blockOutsideAllowedLocations ?? true,
    notes: details.policyAssignment?.notes ?? null,
    selectedLocations: details.allowedLocations.map((item) => ({
      id: item.workLocationId,
      locationRole: item.locationRole,
      isRequired: item.isRequired,
    })),
  },
});
