import type {
  AttendanceLocationRole,
  AttendancePolicyMode,
  AttendanceValidationStrategy,
  Nullable,
  WorkLocationType,
} from '@rh-ponto/types';

export interface AttendancePolicyDto {
  id: string;
  code: string;
  name: string;
  mode: AttendancePolicyMode;
  validationStrategy: AttendanceValidationStrategy;
  geolocationRequired: boolean;
  photoRequired: boolean;
  allowOffsiteClocking: boolean;
  requiresAllowedLocations: boolean;
  description: Nullable<string>;
  isActive: boolean;
}

export interface WorkLocationDto {
  id: string;
  code: string;
  name: string;
  type: WorkLocationType;
  city: Nullable<string>;
  state: Nullable<string>;
  radiusMeters: number;
  isActive: boolean;
}

export interface EmployeeAttendancePolicyDto {
  assignmentId: string | null;
  employeeId: string;
  attendancePolicyId: string | null;
  mode: AttendancePolicyMode | null;
  validationStrategy: AttendanceValidationStrategy | null;
  geolocationRequired: boolean;
  photoRequired: boolean;
  allowAnyLocation: boolean;
  blockOutsideAllowedLocations: boolean;
  notes: Nullable<string>;
  selectedLocations: Array<{
    id: string;
    locationRole: AttendanceLocationRole;
    isRequired: boolean;
  }>;
}
