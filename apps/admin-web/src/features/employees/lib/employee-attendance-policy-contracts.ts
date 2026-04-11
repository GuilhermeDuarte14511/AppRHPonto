import type {
  AttendanceLocationRole,
  AttendancePolicyMode,
  AttendanceValidationStrategy,
  WorkLocationType,
} from '@rh-ponto/types';

export interface EmployeeAttendancePolicyCatalogItem {
  id: string;
  code: string;
  name: string;
  mode: AttendancePolicyMode;
  validationStrategy: AttendanceValidationStrategy;
  geolocationRequired: boolean;
  photoRequired: boolean;
  allowOffsiteClocking: boolean;
  requiresAllowedLocations: boolean;
  description: string | null;
  isActive: boolean;
}

export interface EmployeeAttendanceLocationCatalogItem {
  id: string;
  code: string;
  name: string;
  type: WorkLocationType;
  city: string | null;
  state: string | null;
  radiusMeters: number;
  isActive: boolean;
}

export interface EmployeeAttendancePolicyViewData {
  employeeId: string;
  employeeName: string;
  registrationNumber: string;
  inheritedFromDefault: boolean;
  defaultAttendancePolicyId: string | null;
  defaultAttendancePolicyName: string | null;
  policyCatalog: EmployeeAttendancePolicyCatalogItem[];
  locationCatalog: EmployeeAttendanceLocationCatalogItem[];
  assignment: {
    assignmentId: string | null;
    attendancePolicyId: string;
    mode: AttendancePolicyMode;
    validationStrategy: AttendanceValidationStrategy;
    geolocationRequired: boolean;
    photoRequired: boolean;
    allowAnyLocation: boolean;
    blockOutsideAllowedLocations: boolean;
    notes: string;
    selectedLocations: Array<{
      id: string;
      locationRole: AttendanceLocationRole;
      isRequired: boolean;
    }>;
  };
}
