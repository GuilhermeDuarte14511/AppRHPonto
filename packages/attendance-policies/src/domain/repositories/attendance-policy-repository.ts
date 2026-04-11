import type {
  AttendanceLocationRole,
  AttendancePolicyMode,
  AttendanceValidationStrategy,
  DateValue,
  Nullable,
} from '@rh-ponto/types';

import type {
  AttendancePolicy,
  EmployeeAllowedLocation,
  EmployeeAttendancePolicy,
  WorkLocation,
} from '../entities/attendance-policy';

export interface UpsertEmployeeAttendancePolicyPayload {
  employeeId: string;
  attendancePolicyId: string;
  mode: AttendancePolicyMode;
  validationStrategy: AttendanceValidationStrategy;
  geolocationRequired: boolean;
  photoRequired: boolean;
  allowAnyLocation: boolean;
  blockOutsideAllowedLocations: boolean;
  notes?: Nullable<string>;
  startsAt?: Nullable<DateValue>;
  endsAt?: Nullable<DateValue>;
  selectedLocations: Array<{
    workLocationId: string;
    locationRole: AttendanceLocationRole;
    isRequired: boolean;
  }>;
}

export interface EmployeeAttendancePolicyDetails {
  policyAssignment: EmployeeAttendancePolicy | null;
  policyCatalog: AttendancePolicy[];
  allowedLocations: EmployeeAllowedLocation[];
  locationCatalog: WorkLocation[];
}

export interface AttendancePolicyRepository {
  listPolicies(): Promise<AttendancePolicy[]>;
  listLocations(): Promise<WorkLocation[]>;
  getEmployeePolicy(employeeId: string): Promise<EmployeeAttendancePolicyDetails>;
  upsertEmployeePolicy(payload: UpsertEmployeeAttendancePolicyPayload): Promise<EmployeeAttendancePolicyDetails>;
}
