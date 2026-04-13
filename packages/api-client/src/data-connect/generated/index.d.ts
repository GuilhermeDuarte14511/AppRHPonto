import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddEmployeeAllowedLocationData {
  employeeAllowedLocation_insert: EmployeeAllowedLocation_Key;
}

export interface AddEmployeeAllowedLocationVariables {
  employeeAttendancePolicyId: UUIDString;
  workLocationId: UUIDString;
  locationRole: string;
  isRequired: boolean;
}

export interface AddJustificationAttachmentData {
  justificationAttachment_insert: JustificationAttachment_Key;
}

export interface AddJustificationAttachmentVariables {
  justificationId: UUIDString;
  fileName: string;
  fileUrl: string;
  contentType?: string | null;
  fileSizeBytes?: Int64String | null;
  uploadedByUserId?: UUIDString | null;
}

export interface AdjustTimeRecordData {
  timeRecord_update?: TimeRecord_Key | null;
}

export interface AdjustTimeRecordVariables {
  id: UUIDString;
  recordedAt: TimestampString;
  notes?: string | null;
}

export interface AdminNotification_Key {
  id: UUIDString;
  __typename?: 'AdminNotification_Key';
}

export interface AdminSettings_Key {
  id: UUIDString;
  __typename?: 'AdminSettings_Key';
}

export interface ApproveJustificationData {
  justification_update?: Justification_Key | null;
}

export interface ApproveJustificationVariables {
  id: UUIDString;
  reviewedByUserId: UUIDString;
  reviewNotes?: string | null;
}

export interface ApproveVacationRequestData {
  vacationRequest_update?: VacationRequest_Key | null;
}

export interface ApproveVacationRequestVariables {
  id: UUIDString;
  reviewNotes?: string | null;
  managerApprovalActor?: string | null;
  managerApprovalNotes?: string | null;
  hrApprovalActor?: string | null;
  hrApprovalNotes?: string | null;
}

export interface AssignWorkScheduleToEmployeeData {
  employeeScheduleHistory_insert: EmployeeScheduleHistory_Key;
}

export interface AssignWorkScheduleToEmployeeVariables {
  employeeId: UUIDString;
  workScheduleId: UUIDString;
  startDate: DateString;
  endDate?: DateString | null;
}

export interface AttendancePolicy_Key {
  id: UUIDString;
  __typename?: 'AttendancePolicy_Key';
}

export interface AuditLog_Key {
  id: UUIDString;
  __typename?: 'AuditLog_Key';
}

export interface CreateAttendancePolicyData {
  attendancePolicy_insert: AttendancePolicy_Key;
}

export interface CreateAttendancePolicyVariables {
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
}

export interface CreateAuditLogData {
  auditLog_insert: AuditLog_Key;
}

export interface CreateAuditLogVariables {
  userId?: UUIDString | null;
  entityName: string;
  entityId?: string | null;
  action: string;
  description?: string | null;
  ipAddress?: string | null;
  deviceInfo?: string | null;
}

export interface CreateDepartmentData {
  department_insert: Department_Key;
}

export interface CreateDepartmentVariables {
  code: string;
  name: string;
  managerEmployeeId?: UUIDString | null;
  description?: string | null;
  costCenter?: string | null;
  isActive: boolean;
}

export interface CreateDeviceData {
  device_insert: Device_Key;
}

export interface CreateDeviceVariables {
  name: string;
  identifier: string;
  type: string;
  locationName?: string | null;
  description?: string | null;
  isActive: boolean;
}

export interface CreateEmployeeAttendancePolicyData {
  employeeAttendancePolicy_insert: EmployeeAttendancePolicy_Key;
}

export interface CreateEmployeeAttendancePolicyVariables {
  employeeId: UUIDString;
  attendancePolicyId: UUIDString;
  mode: string;
  validationStrategy: string;
  geolocationRequired: boolean;
  photoRequired: boolean;
  allowAnyLocation: boolean;
  blockOutsideAllowedLocations: boolean;
  notes?: string | null;
  startsAt?: DateString | null;
  endsAt?: DateString | null;
}

export interface CreateEmployeeData {
  employee_insert: Employee_Key;
}

export interface CreateEmployeeVariables {
  registrationNumber: string;
  fullName: string;
  cpf?: string | null;
  email?: string | null;
  phone?: string | null;
  birthDate?: DateString | null;
  hireDate?: DateString | null;
  departmentId?: UUIDString | null;
  position?: string | null;
  profilePhotoUrl?: string | null;
  pinCode?: string | null;
  isActive: boolean;
}

export interface CreateJustificationData {
  justification_insert: Justification_Key;
}

export interface CreateJustificationVariables {
  employeeId: UUIDString;
  timeRecordId?: UUIDString | null;
  type: string;
  reason: string;
  requestedRecordType?: string | null;
  requestedRecordedAt?: TimestampString | null;
}

export interface CreateTimeRecordData {
  timeRecord_insert: TimeRecord_Key;
}

export interface CreateTimeRecordPhotoData {
  timeRecordPhoto_insert: TimeRecordPhoto_Key;
}

export interface CreateTimeRecordPhotoVariables {
  timeRecordId: UUIDString;
  fileUrl: string;
  fileName?: string | null;
  contentType?: string | null;
  fileSizeBytes?: Int64String | null;
  isPrimary: boolean;
}

export interface CreateTimeRecordVariables {
  employeeId: UUIDString;
  deviceId?: UUIDString | null;
  recordedByUserId?: UUIDString | null;
  recordType: string;
  source: string;
  status: string;
  recordedAt: TimestampString;
  originalRecordedAt?: TimestampString | null;
  notes?: string | null;
  isManual: boolean;
  referenceRecordId?: UUIDString | null;
  latitude?: number | null;
  longitude?: number | null;
  ipAddress?: string | null;
}

export interface CreateVacationRequestData {
  vacationRequest_insert: VacationRequest_Key;
}

export interface CreateVacationRequestVariables {
  employeeId: UUIDString;
  startDate: DateString;
  endDate: DateString;
  totalDays: number;
  availableDays: number;
  accrualPeriod?: string | null;
  advanceThirteenthSalary?: boolean | null;
  cashBonus?: boolean | null;
  attachmentFileName?: string | null;
  attachmentFileUrl?: string | null;
  coverageNotes?: string | null;
}

export interface CreateWorkLocationData {
  workLocation_insert: WorkLocation_Key;
}

export interface CreateWorkLocationVariables {
  code: string;
  name: string;
  type: string;
  addressLine?: string | null;
  addressComplement?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  radiusMeters: number;
  isActive: boolean;
}

export interface CreateWorkScheduleData {
  workSchedule_insert: WorkSchedule_Key;
}

export interface CreateWorkScheduleVariables {
  name: string;
  startTime: string;
  breakStartTime?: string | null;
  breakEndTime?: string | null;
  endTime: string;
  toleranceMinutes: number;
  expectedDailyMinutes?: number | null;
  isActive: boolean;
}

export interface DeactivateDeviceData {
  device_update?: Device_Key | null;
}

export interface DeactivateDeviceVariables {
  id: UUIDString;
}

export interface DeactivateEmployeeData {
  employee_update?: Employee_Key | null;
}

export interface DeactivateEmployeeVariables {
  id: UUIDString;
}

export interface DeleteDepartmentData {
  department_delete?: Department_Key | null;
}

export interface DeleteDepartmentVariables {
  id: UUIDString;
}

export interface Department_Key {
  id: UUIDString;
  __typename?: 'Department_Key';
}

export interface Device_Key {
  id: UUIDString;
  __typename?: 'Device_Key';
}

export interface EmployeeAllowedLocation_Key {
  id: UUIDString;
  __typename?: 'EmployeeAllowedLocation_Key';
}

export interface EmployeeAttendancePolicy_Key {
  employeeId: UUIDString;
  attendancePolicyId: UUIDString;
  createdAt: TimestampString;
  __typename?: 'EmployeeAttendancePolicy_Key';
}

export interface EmployeeDocument_Key {
  id: UUIDString;
  __typename?: 'EmployeeDocument_Key';
}

export interface EmployeeNotificationPreference_Key {
  id: UUIDString;
  __typename?: 'EmployeeNotificationPreference_Key';
}

export interface EmployeeScheduleHistory_Key {
  id: UUIDString;
  __typename?: 'EmployeeScheduleHistory_Key';
}

export interface Employee_Key {
  id: UUIDString;
  __typename?: 'Employee_Key';
}

export interface GetDepartmentByIdData {
  department?: {
    id: UUIDString;
    code: string;
    name: string;
    managerId?: UUIDString | null;
    manager?: {
      id: UUIDString;
      fullName: string;
    } & Employee_Key;
      description?: string | null;
      costCenter?: string | null;
      isActive: boolean;
      createdAt: TimestampString;
      updatedAt: TimestampString;
      employees_on_department: ({
        id: UUIDString;
      } & Employee_Key)[];
  } & Department_Key;
}

export interface GetDepartmentByIdVariables {
  id: UUIDString;
}

export interface GetDeviceByIdData {
  device?: {
    id: UUIDString;
    name: string;
    identifier: string;
    type: string;
    locationName?: string | null;
    description?: string | null;
    isActive: boolean;
    lastSyncAt?: TimestampString | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Device_Key;
}

export interface GetDeviceByIdVariables {
  id: UUIDString;
}

export interface GetEmployeeByIdData {
  employee?: {
    id: UUIDString;
    user?: {
      id: UUIDString;
    } & User_Key;
      registrationNumber: string;
      fullName: string;
      cpf?: string | null;
      email?: string | null;
      phone?: string | null;
      birthDate?: DateString | null;
      hireDate?: DateString | null;
      departmentId?: UUIDString | null;
      department?: {
        id: UUIDString;
        name: string;
      } & Department_Key;
        position?: string | null;
        profilePhotoUrl?: string | null;
        pinCode?: string | null;
        isActive: boolean;
        createdAt: TimestampString;
        updatedAt: TimestampString;
  } & Employee_Key;
}

export interface GetEmployeeByIdVariables {
  id: UUIDString;
}

export interface GetEmployeeDocumentByIdData {
  employeeDocument?: {
    id: UUIDString;
    employee: {
      id: UUIDString;
    } & Employee_Key;
      category: string;
      title: string;
      description?: string | null;
      status: string;
      fileName: string;
      fileUrl: string;
      issuedAt: TimestampString;
      acknowledgedAt?: TimestampString | null;
      expiresAt?: DateString | null;
      createdAt: TimestampString;
      updatedAt: TimestampString;
  } & EmployeeDocument_Key;
}

export interface GetEmployeeDocumentByIdVariables {
  id: UUIDString;
}

export interface GetEmployeeNotificationPreferencesData {
  employeeNotificationPreferences: ({
    id: UUIDString;
    user: {
      id: UUIDString;
    } & User_Key;
      notifyEntryReminder: boolean;
      notifyBreakReminder: boolean;
      notifyExitReminder: boolean;
      notifyJustificationStatus: boolean;
      notifyRhAdjustment: boolean;
      notifyCompanyCommunications: boolean;
      notifySystemAlerts: boolean;
      notifyVacationStatus: boolean;
      notifyDocuments: boolean;
      notifyPayroll: boolean;
      createdAt: TimestampString;
      updatedAt: TimestampString;
  } & EmployeeNotificationPreference_Key)[];
}

export interface GetEmployeeNotificationPreferencesVariables {
  userId: UUIDString;
}

export interface GetJustificationByIdData {
  justification?: {
    id: UUIDString;
    employee: {
      id: UUIDString;
    } & Employee_Key;
      timeRecord?: {
        id: UUIDString;
      } & TimeRecord_Key;
        type: string;
        reason: string;
        status: string;
        requestedRecordType?: string | null;
        requestedRecordedAt?: TimestampString | null;
        reviewedByUser?: {
          id: UUIDString;
        } & User_Key;
          reviewedAt?: TimestampString | null;
          reviewNotes?: string | null;
          createdAt: TimestampString;
          updatedAt: TimestampString;
  } & Justification_Key;
}

export interface GetJustificationByIdVariables {
  id: UUIDString;
}

export interface GetPayrollStatementByIdData {
  payrollStatement?: {
    id: UUIDString;
    employee: {
      id: UUIDString;
    } & Employee_Key;
      referenceLabel: string;
      referenceYear: number;
      referenceMonth: number;
      status: string;
      grossAmount: number;
      netAmount: number;
      fileName: string;
      fileUrl: string;
      issuedAt: TimestampString;
      createdAt: TimestampString;
      updatedAt: TimestampString;
  } & PayrollStatement_Key;
}

export interface GetPayrollStatementByIdVariables {
  id: UUIDString;
}

export interface GetTimeRecordByIdData {
  timeRecord?: {
    id: UUIDString;
    employee: {
      id: UUIDString;
    } & Employee_Key;
      device?: {
        id: UUIDString;
      } & Device_Key;
        recordedByUser?: {
          id: UUIDString;
        } & User_Key;
          recordType: string;
          source: string;
          status: string;
          recordedAt: TimestampString;
          originalRecordedAt?: TimestampString | null;
          notes?: string | null;
          isManual: boolean;
          referenceRecord?: {
            id: UUIDString;
          } & TimeRecord_Key;
            latitude?: number | null;
            longitude?: number | null;
            ipAddress?: string | null;
            createdAt: TimestampString;
            updatedAt: TimestampString;
  } & TimeRecord_Key;
}

export interface GetTimeRecordByIdVariables {
  id: UUIDString;
}

export interface GetUserByEmailData {
  users: ({
    id: UUIDString;
    firebaseUid: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    lastLoginAt?: TimestampString | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & User_Key)[];
}

export interface GetUserByEmailVariables {
  email: string;
}

export interface GetUserByFirebaseUidData {
  users: ({
    id: UUIDString;
    firebaseUid: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    lastLoginAt?: TimestampString | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & User_Key)[];
}

export interface GetUserByFirebaseUidVariables {
  firebaseUid: string;
}

export interface GetVacationRequestByIdData {
  vacationRequest?: {
    id: UUIDString;
    employee: {
      id: UUIDString;
    } & Employee_Key;
      requestedAt: TimestampString;
      startDate: DateString;
      endDate: DateString;
      totalDays: number;
      availableDays: number;
      accrualPeriod?: string | null;
      advanceThirteenthSalary: boolean;
      cashBonus: boolean;
      status: string;
      attachmentFileName?: string | null;
      attachmentFileUrl?: string | null;
      coverageNotes?: string | null;
      reviewNotes?: string | null;
      managerApprovalStatus: string;
      managerApprovalActor?: string | null;
      managerApprovalTimestamp?: TimestampString | null;
      managerApprovalNotes?: string | null;
      hrApprovalStatus: string;
      hrApprovalActor?: string | null;
      hrApprovalTimestamp?: TimestampString | null;
      hrApprovalNotes?: string | null;
      createdAt: TimestampString;
      updatedAt: TimestampString;
  } & VacationRequest_Key;
}

export interface GetVacationRequestByIdVariables {
  id: UUIDString;
}

export interface GetWorkScheduleByIdData {
  workSchedule?: {
    id: UUIDString;
    name: string;
    startTime: string;
    breakStartTime?: string | null;
    breakEndTime?: string | null;
    endTime: string;
    toleranceMinutes: number;
    expectedDailyMinutes?: number | null;
    isActive: boolean;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & WorkSchedule_Key;
}

export interface GetWorkScheduleByIdVariables {
  id: UUIDString;
}

export interface JustificationAttachment_Key {
  id: UUIDString;
  __typename?: 'JustificationAttachment_Key';
}

export interface Justification_Key {
  id: UUIDString;
  __typename?: 'Justification_Key';
}

export interface LinkUserFirebaseUidData {
  user_update?: User_Key | null;
}

export interface LinkUserFirebaseUidVariables {
  id: UUIDString;
  firebaseUid: string;
}

export interface ListAttendancePoliciesData {
  attendancePolicies: ({
    id: UUIDString;
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
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & AttendancePolicy_Key)[];
}

export interface ListAuditLogsData {
  auditLogs: ({
    id: UUIDString;
    user?: {
      id: UUIDString;
    } & User_Key;
      entityName: string;
      entityId?: string | null;
      action: string;
      description?: string | null;
      ipAddress?: string | null;
      deviceInfo?: string | null;
      createdAt: TimestampString;
  } & AuditLog_Key)[];
}

export interface ListDepartmentsData {
  departments: ({
    id: UUIDString;
    code: string;
    name: string;
    managerId?: UUIDString | null;
    manager?: {
      id: UUIDString;
      fullName: string;
    } & Employee_Key;
      description?: string | null;
      costCenter?: string | null;
      isActive: boolean;
      createdAt: TimestampString;
      updatedAt: TimestampString;
      employees_on_department: ({
        id: UUIDString;
      } & Employee_Key)[];
  } & Department_Key)[];
}

export interface ListDevicesData {
  devices: ({
    id: UUIDString;
    name: string;
    identifier: string;
    type: string;
    locationName?: string | null;
    description?: string | null;
    isActive: boolean;
    lastSyncAt?: TimestampString | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Device_Key)[];
}

export interface ListEmployeeAllowedLocationsData {
  employeeAllowedLocations: ({
    id: UUIDString;
    employeeAttendancePolicy: {
      id: UUIDString;
    };
      workLocation: {
        id: UUIDString;
      } & WorkLocation_Key;
        locationRole: string;
        isRequired: boolean;
        createdAt: TimestampString;
        updatedAt: TimestampString;
  } & EmployeeAllowedLocation_Key)[];
}

export interface ListEmployeeAttendancePoliciesData {
  employeeAttendancePolicies: ({
    id: UUIDString;
    employee: {
      id: UUIDString;
    } & Employee_Key;
      attendancePolicy: {
        id: UUIDString;
      } & AttendancePolicy_Key;
        mode: string;
        validationStrategy: string;
        geolocationRequired: boolean;
        photoRequired: boolean;
        allowAnyLocation: boolean;
        blockOutsideAllowedLocations: boolean;
        notes?: string | null;
        startsAt?: DateString | null;
        endsAt?: DateString | null;
        isCurrent: boolean;
        createdAt: TimestampString;
        updatedAt: TimestampString;
  })[];
}

export interface ListEmployeeDocumentsData {
  employeeDocuments: ({
    id: UUIDString;
    employee: {
      id: UUIDString;
    } & Employee_Key;
      category: string;
      title: string;
      description?: string | null;
      status: string;
      fileName: string;
      fileUrl: string;
      issuedAt: TimestampString;
      acknowledgedAt?: TimestampString | null;
      expiresAt?: DateString | null;
      createdAt: TimestampString;
      updatedAt: TimestampString;
  } & EmployeeDocument_Key)[];
}

export interface ListEmployeeDocumentsVariables {
  employeeId: UUIDString;
}

export interface ListEmployeeNotificationsData {
  adminNotifications: ({
    id: UUIDString;
    category: string;
    title: string;
    description: string;
    href?: string | null;
    entityName?: string | null;
    entityId?: string | null;
    severity: string;
    status: string;
    triggeredAt: TimestampString;
    readAt?: TimestampString | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & AdminNotification_Key)[];
}

export interface ListEmployeeNotificationsVariables {
  userId: UUIDString;
}

export interface ListEmployeeScheduleHistoryData {
  employeeScheduleHistories: ({
    id: UUIDString;
    employee: {
      id: UUIDString;
    } & Employee_Key;
      workSchedule: {
        id: UUIDString;
      } & WorkSchedule_Key;
        startDate: DateString;
        endDate?: DateString | null;
        isCurrent: boolean;
        createdAt: TimestampString;
        updatedAt: TimestampString;
  } & EmployeeScheduleHistory_Key)[];
}

export interface ListEmployeesData {
  employees: ({
    id: UUIDString;
    user?: {
      id: UUIDString;
    } & User_Key;
      registrationNumber: string;
      fullName: string;
      cpf?: string | null;
      email?: string | null;
      phone?: string | null;
      birthDate?: DateString | null;
      hireDate?: DateString | null;
      departmentId?: UUIDString | null;
      department?: {
        id: UUIDString;
        name: string;
      } & Department_Key;
        position?: string | null;
        profilePhotoUrl?: string | null;
        pinCode?: string | null;
        isActive: boolean;
        createdAt: TimestampString;
        updatedAt: TimestampString;
  } & Employee_Key)[];
}

export interface ListJustificationAttachmentsData {
  justificationAttachments: ({
    id: UUIDString;
    justification: {
      id: UUIDString;
    } & Justification_Key;
      fileName: string;
      fileUrl: string;
      contentType?: string | null;
      fileSizeBytes?: Int64String | null;
      uploadedByUser?: {
        id: UUIDString;
      } & User_Key;
        createdAt: TimestampString;
  } & JustificationAttachment_Key)[];
}

export interface ListJustificationsData {
  justifications: ({
    id: UUIDString;
    employee: {
      id: UUIDString;
    } & Employee_Key;
      timeRecord?: {
        id: UUIDString;
      } & TimeRecord_Key;
        type: string;
        reason: string;
        status: string;
        requestedRecordType?: string | null;
        requestedRecordedAt?: TimestampString | null;
        reviewedByUser?: {
          id: UUIDString;
        } & User_Key;
          reviewedAt?: TimestampString | null;
          reviewNotes?: string | null;
          createdAt: TimestampString;
          updatedAt: TimestampString;
  } & Justification_Key)[];
}

export interface ListPayrollStatementsData {
  payrollStatements: ({
    id: UUIDString;
    employee: {
      id: UUIDString;
    } & Employee_Key;
      referenceLabel: string;
      referenceYear: number;
      referenceMonth: number;
      status: string;
      grossAmount: number;
      netAmount: number;
      fileName: string;
      fileUrl: string;
      issuedAt: TimestampString;
      createdAt: TimestampString;
      updatedAt: TimestampString;
  } & PayrollStatement_Key)[];
}

export interface ListPayrollStatementsVariables {
  employeeId: UUIDString;
}

export interface ListTimeRecordPhotosData {
  timeRecordPhotos: ({
    id: UUIDString;
    timeRecord: {
      id: UUIDString;
    } & TimeRecord_Key;
      fileUrl: string;
      fileName?: string | null;
      contentType?: string | null;
      fileSizeBytes?: Int64String | null;
      isPrimary: boolean;
      createdAt: TimestampString;
  } & TimeRecordPhoto_Key)[];
}

export interface ListTimeRecordsData {
  timeRecords: ({
    id: UUIDString;
    employee: {
      id: UUIDString;
    } & Employee_Key;
      device?: {
        id: UUIDString;
      } & Device_Key;
        recordedByUser?: {
          id: UUIDString;
        } & User_Key;
          recordType: string;
          source: string;
          status: string;
          recordedAt: TimestampString;
          originalRecordedAt?: TimestampString | null;
          notes?: string | null;
          isManual: boolean;
          referenceRecord?: {
            id: UUIDString;
          } & TimeRecord_Key;
            latitude?: number | null;
            longitude?: number | null;
            ipAddress?: string | null;
            createdAt: TimestampString;
            updatedAt: TimestampString;
  } & TimeRecord_Key)[];
}

export interface ListVacationRequestsData {
  vacationRequests: ({
    id: UUIDString;
    employee: {
      id: UUIDString;
    } & Employee_Key;
      requestedAt: TimestampString;
      startDate: DateString;
      endDate: DateString;
      totalDays: number;
      availableDays: number;
      accrualPeriod?: string | null;
      advanceThirteenthSalary: boolean;
      cashBonus: boolean;
      status: string;
      attachmentFileName?: string | null;
      attachmentFileUrl?: string | null;
      coverageNotes?: string | null;
      reviewNotes?: string | null;
      managerApprovalStatus: string;
      managerApprovalActor?: string | null;
      managerApprovalTimestamp?: TimestampString | null;
      managerApprovalNotes?: string | null;
      hrApprovalStatus: string;
      hrApprovalActor?: string | null;
      hrApprovalTimestamp?: TimestampString | null;
      hrApprovalNotes?: string | null;
      createdAt: TimestampString;
      updatedAt: TimestampString;
  } & VacationRequest_Key)[];
}

export interface ListWorkLocationsData {
  workLocations: ({
    id: UUIDString;
    code: string;
    name: string;
    type: string;
    addressLine?: string | null;
    addressComplement?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    radiusMeters: number;
    isActive: boolean;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & WorkLocation_Key)[];
}

export interface ListWorkSchedulesData {
  workSchedules: ({
    id: UUIDString;
    name: string;
    startTime: string;
    breakStartTime?: string | null;
    breakEndTime?: string | null;
    endTime: string;
    toleranceMinutes: number;
    expectedDailyMinutes?: number | null;
    isActive: boolean;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & WorkSchedule_Key)[];
}

export interface MarkEmployeeNotificationAsReadData {
  adminNotification_update?: AdminNotification_Key | null;
}

export interface MarkEmployeeNotificationAsReadVariables {
  id: UUIDString;
}

export interface OnboardingJourney_Key {
  id: UUIDString;
  __typename?: 'OnboardingJourney_Key';
}

export interface OnboardingTask_Key {
  id: UUIDString;
  __typename?: 'OnboardingTask_Key';
}

export interface PayrollStatement_Key {
  id: UUIDString;
  __typename?: 'PayrollStatement_Key';
}

export interface RejectJustificationData {
  justification_update?: Justification_Key | null;
}

export interface RejectJustificationVariables {
  id: UUIDString;
  reviewedByUserId: UUIDString;
  reviewNotes?: string | null;
}

export interface RejectVacationRequestData {
  vacationRequest_update?: VacationRequest_Key | null;
}

export interface RejectVacationRequestVariables {
  id: UUIDString;
  reviewNotes?: string | null;
  managerApprovalActor?: string | null;
  managerApprovalNotes?: string | null;
  hrApprovalActor?: string | null;
  hrApprovalNotes?: string | null;
}

export interface SeedRhPontoDataData {
  user_upsertMany: User_Key[];
  departmentManagers_upsertMany: Department_Key[];
  employee_upsertMany: Employee_Key[];
  departmentLeads_upsertMany: Department_Key[];
  device_upsertMany: Device_Key[];
  workSchedule_upsertMany: WorkSchedule_Key[];
  employeeScheduleHistory_upsertMany: EmployeeScheduleHistory_Key[];
  timeRecord_upsertMany: TimeRecord_Key[];
  timeRecordPhoto_upsertMany: TimeRecordPhoto_Key[];
  justification_upsertMany: Justification_Key[];
  justificationAttachment_upsertMany: JustificationAttachment_Key[];
  auditLog_upsertMany: AuditLog_Key[];
  vacationRequest_upsertMany: VacationRequest_Key[];
  employeeDocument_upsertMany: EmployeeDocument_Key[];
  payrollStatement_upsertMany: PayrollStatement_Key[];
  workLocation_upsertMany: WorkLocation_Key[];
  attendancePolicy_upsertMany: AttendancePolicy_Key[];
  employeeAttendancePolicy_upsertMany: EmployeeAttendancePolicy_Key[];
  employeeAllowedLocation_upsertMany: EmployeeAllowedLocation_Key[];
  onboardingJourney_upsertMany: OnboardingJourney_Key[];
  onboardingTask_upsertMany: OnboardingTask_Key[];
  adminSettings_upsertMany: AdminSettings_Key[];
  employeeNotificationPreference_upsertMany: EmployeeNotificationPreference_Key[];
  adminNotification_upsertMany: AdminNotification_Key[];
}

export interface TimeRecordPhoto_Key {
  id: UUIDString;
  __typename?: 'TimeRecordPhoto_Key';
}

export interface TimeRecord_Key {
  id: UUIDString;
  __typename?: 'TimeRecord_Key';
}

export interface TouchUserLastLoginData {
  user_update?: User_Key | null;
}

export interface TouchUserLastLoginVariables {
  id: UUIDString;
}

export interface UpdateAttendancePolicyData {
  attendancePolicy_update?: AttendancePolicy_Key | null;
}

export interface UpdateAttendancePolicyVariables {
  id: UUIDString;
  name?: string | null;
  mode?: string | null;
  validationStrategy?: string | null;
  geolocationRequired?: boolean | null;
  photoRequired?: boolean | null;
  allowOffsiteClocking?: boolean | null;
  requiresAllowedLocations?: boolean | null;
  description?: string | null;
  isActive?: boolean | null;
}

export interface UpdateDepartmentData {
  department_update?: Department_Key | null;
}

export interface UpdateDepartmentVariables {
  id: UUIDString;
  code?: string | null;
  name?: string | null;
  managerEmployeeId?: UUIDString | null;
  description?: string | null;
  costCenter?: string | null;
  isActive?: boolean | null;
}

export interface UpdateDeviceData {
  device_update?: Device_Key | null;
}

export interface UpdateDeviceVariables {
  id: UUIDString;
  name?: string | null;
  identifier?: string | null;
  type?: string | null;
  locationName?: string | null;
  description?: string | null;
  isActive?: boolean | null;
}

export interface UpdateEmployeeAttendancePolicyData {
  employeeAttendancePolicy_update?: EmployeeAttendancePolicy_Key | null;
}

export interface UpdateEmployeeAttendancePolicyVariables {
  id: UUIDString;
  attendancePolicyId: UUIDString;
  mode: string;
  validationStrategy: string;
  geolocationRequired: boolean;
  photoRequired: boolean;
  allowAnyLocation: boolean;
  blockOutsideAllowedLocations: boolean;
  notes?: string | null;
  startsAt?: DateString | null;
  endsAt?: DateString | null;
}

export interface UpdateEmployeeData {
  employee_update?: Employee_Key | null;
}

export interface UpdateEmployeeNotificationPreferencesData {
  employeeNotificationPreference_update?: EmployeeNotificationPreference_Key | null;
}

export interface UpdateEmployeeNotificationPreferencesVariables {
  id: UUIDString;
  notifyEntryReminder: boolean;
  notifyBreakReminder: boolean;
  notifyExitReminder: boolean;
  notifyJustificationStatus: boolean;
  notifyRhAdjustment: boolean;
  notifyCompanyCommunications: boolean;
  notifySystemAlerts: boolean;
  notifyVacationStatus: boolean;
  notifyDocuments: boolean;
  notifyPayroll: boolean;
}

export interface UpdateEmployeeVariables {
  id: UUIDString;
  registrationNumber?: string | null;
  fullName?: string | null;
  cpf?: string | null;
  email?: string | null;
  phone?: string | null;
  birthDate?: DateString | null;
  hireDate?: DateString | null;
  departmentId?: UUIDString | null;
  position?: string | null;
  profilePhotoUrl?: string | null;
  pinCode?: string | null;
  isActive?: boolean | null;
}

export interface UpdateWorkScheduleData {
  workSchedule_update?: WorkSchedule_Key | null;
}

export interface UpdateWorkScheduleVariables {
  id: UUIDString;
  name?: string | null;
  startTime?: string | null;
  breakStartTime?: string | null;
  breakEndTime?: string | null;
  endTime?: string | null;
  toleranceMinutes?: number | null;
  expectedDailyMinutes?: number | null;
  isActive?: boolean | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

export interface VacationRequest_Key {
  id: UUIDString;
  __typename?: 'VacationRequest_Key';
}

export interface WorkLocation_Key {
  id: UUIDString;
  __typename?: 'WorkLocation_Key';
}

export interface WorkSchedule_Key {
  id: UUIDString;
  __typename?: 'WorkSchedule_Key';
}

interface ListAttendancePoliciesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAttendancePoliciesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAttendancePoliciesData, undefined>;
  operationName: string;
}
export const listAttendancePoliciesRef: ListAttendancePoliciesRef;

export function listAttendancePolicies(options?: ExecuteQueryOptions): QueryPromise<ListAttendancePoliciesData, undefined>;
export function listAttendancePolicies(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAttendancePoliciesData, undefined>;

interface ListWorkLocationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListWorkLocationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListWorkLocationsData, undefined>;
  operationName: string;
}
export const listWorkLocationsRef: ListWorkLocationsRef;

export function listWorkLocations(options?: ExecuteQueryOptions): QueryPromise<ListWorkLocationsData, undefined>;
export function listWorkLocations(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListWorkLocationsData, undefined>;

interface ListEmployeeAttendancePoliciesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListEmployeeAttendancePoliciesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListEmployeeAttendancePoliciesData, undefined>;
  operationName: string;
}
export const listEmployeeAttendancePoliciesRef: ListEmployeeAttendancePoliciesRef;

export function listEmployeeAttendancePolicies(options?: ExecuteQueryOptions): QueryPromise<ListEmployeeAttendancePoliciesData, undefined>;
export function listEmployeeAttendancePolicies(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListEmployeeAttendancePoliciesData, undefined>;

interface ListEmployeeAllowedLocationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListEmployeeAllowedLocationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListEmployeeAllowedLocationsData, undefined>;
  operationName: string;
}
export const listEmployeeAllowedLocationsRef: ListEmployeeAllowedLocationsRef;

export function listEmployeeAllowedLocations(options?: ExecuteQueryOptions): QueryPromise<ListEmployeeAllowedLocationsData, undefined>;
export function listEmployeeAllowedLocations(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListEmployeeAllowedLocationsData, undefined>;

interface CreateAttendancePolicyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAttendancePolicyVariables): MutationRef<CreateAttendancePolicyData, CreateAttendancePolicyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateAttendancePolicyVariables): MutationRef<CreateAttendancePolicyData, CreateAttendancePolicyVariables>;
  operationName: string;
}
export const createAttendancePolicyRef: CreateAttendancePolicyRef;

export function createAttendancePolicy(vars: CreateAttendancePolicyVariables): MutationPromise<CreateAttendancePolicyData, CreateAttendancePolicyVariables>;
export function createAttendancePolicy(dc: DataConnect, vars: CreateAttendancePolicyVariables): MutationPromise<CreateAttendancePolicyData, CreateAttendancePolicyVariables>;

interface UpdateAttendancePolicyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAttendancePolicyVariables): MutationRef<UpdateAttendancePolicyData, UpdateAttendancePolicyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateAttendancePolicyVariables): MutationRef<UpdateAttendancePolicyData, UpdateAttendancePolicyVariables>;
  operationName: string;
}
export const updateAttendancePolicyRef: UpdateAttendancePolicyRef;

export function updateAttendancePolicy(vars: UpdateAttendancePolicyVariables): MutationPromise<UpdateAttendancePolicyData, UpdateAttendancePolicyVariables>;
export function updateAttendancePolicy(dc: DataConnect, vars: UpdateAttendancePolicyVariables): MutationPromise<UpdateAttendancePolicyData, UpdateAttendancePolicyVariables>;

interface CreateWorkLocationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateWorkLocationVariables): MutationRef<CreateWorkLocationData, CreateWorkLocationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateWorkLocationVariables): MutationRef<CreateWorkLocationData, CreateWorkLocationVariables>;
  operationName: string;
}
export const createWorkLocationRef: CreateWorkLocationRef;

export function createWorkLocation(vars: CreateWorkLocationVariables): MutationPromise<CreateWorkLocationData, CreateWorkLocationVariables>;
export function createWorkLocation(dc: DataConnect, vars: CreateWorkLocationVariables): MutationPromise<CreateWorkLocationData, CreateWorkLocationVariables>;

interface CreateEmployeeAttendancePolicyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateEmployeeAttendancePolicyVariables): MutationRef<CreateEmployeeAttendancePolicyData, CreateEmployeeAttendancePolicyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateEmployeeAttendancePolicyVariables): MutationRef<CreateEmployeeAttendancePolicyData, CreateEmployeeAttendancePolicyVariables>;
  operationName: string;
}
export const createEmployeeAttendancePolicyRef: CreateEmployeeAttendancePolicyRef;

export function createEmployeeAttendancePolicy(vars: CreateEmployeeAttendancePolicyVariables): MutationPromise<CreateEmployeeAttendancePolicyData, CreateEmployeeAttendancePolicyVariables>;
export function createEmployeeAttendancePolicy(dc: DataConnect, vars: CreateEmployeeAttendancePolicyVariables): MutationPromise<CreateEmployeeAttendancePolicyData, CreateEmployeeAttendancePolicyVariables>;

interface UpdateEmployeeAttendancePolicyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEmployeeAttendancePolicyVariables): MutationRef<UpdateEmployeeAttendancePolicyData, UpdateEmployeeAttendancePolicyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateEmployeeAttendancePolicyVariables): MutationRef<UpdateEmployeeAttendancePolicyData, UpdateEmployeeAttendancePolicyVariables>;
  operationName: string;
}
export const updateEmployeeAttendancePolicyRef: UpdateEmployeeAttendancePolicyRef;

export function updateEmployeeAttendancePolicy(vars: UpdateEmployeeAttendancePolicyVariables): MutationPromise<UpdateEmployeeAttendancePolicyData, UpdateEmployeeAttendancePolicyVariables>;
export function updateEmployeeAttendancePolicy(dc: DataConnect, vars: UpdateEmployeeAttendancePolicyVariables): MutationPromise<UpdateEmployeeAttendancePolicyData, UpdateEmployeeAttendancePolicyVariables>;

interface AddEmployeeAllowedLocationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddEmployeeAllowedLocationVariables): MutationRef<AddEmployeeAllowedLocationData, AddEmployeeAllowedLocationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddEmployeeAllowedLocationVariables): MutationRef<AddEmployeeAllowedLocationData, AddEmployeeAllowedLocationVariables>;
  operationName: string;
}
export const addEmployeeAllowedLocationRef: AddEmployeeAllowedLocationRef;

export function addEmployeeAllowedLocation(vars: AddEmployeeAllowedLocationVariables): MutationPromise<AddEmployeeAllowedLocationData, AddEmployeeAllowedLocationVariables>;
export function addEmployeeAllowedLocation(dc: DataConnect, vars: AddEmployeeAllowedLocationVariables): MutationPromise<AddEmployeeAllowedLocationData, AddEmployeeAllowedLocationVariables>;

interface GetUserByFirebaseUidRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserByFirebaseUidVariables): QueryRef<GetUserByFirebaseUidData, GetUserByFirebaseUidVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserByFirebaseUidVariables): QueryRef<GetUserByFirebaseUidData, GetUserByFirebaseUidVariables>;
  operationName: string;
}
export const getUserByFirebaseUidRef: GetUserByFirebaseUidRef;

export function getUserByFirebaseUid(vars: GetUserByFirebaseUidVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserByFirebaseUidData, GetUserByFirebaseUidVariables>;
export function getUserByFirebaseUid(dc: DataConnect, vars: GetUserByFirebaseUidVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserByFirebaseUidData, GetUserByFirebaseUidVariables>;

interface GetUserByEmailRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserByEmailVariables): QueryRef<GetUserByEmailData, GetUserByEmailVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserByEmailVariables): QueryRef<GetUserByEmailData, GetUserByEmailVariables>;
  operationName: string;
}
export const getUserByEmailRef: GetUserByEmailRef;

export function getUserByEmail(vars: GetUserByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserByEmailData, GetUserByEmailVariables>;
export function getUserByEmail(dc: DataConnect, vars: GetUserByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserByEmailData, GetUserByEmailVariables>;

interface TouchUserLastLoginRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: TouchUserLastLoginVariables): MutationRef<TouchUserLastLoginData, TouchUserLastLoginVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: TouchUserLastLoginVariables): MutationRef<TouchUserLastLoginData, TouchUserLastLoginVariables>;
  operationName: string;
}
export const touchUserLastLoginRef: TouchUserLastLoginRef;

export function touchUserLastLogin(vars: TouchUserLastLoginVariables): MutationPromise<TouchUserLastLoginData, TouchUserLastLoginVariables>;
export function touchUserLastLogin(dc: DataConnect, vars: TouchUserLastLoginVariables): MutationPromise<TouchUserLastLoginData, TouchUserLastLoginVariables>;

interface LinkUserFirebaseUidRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: LinkUserFirebaseUidVariables): MutationRef<LinkUserFirebaseUidData, LinkUserFirebaseUidVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: LinkUserFirebaseUidVariables): MutationRef<LinkUserFirebaseUidData, LinkUserFirebaseUidVariables>;
  operationName: string;
}
export const linkUserFirebaseUidRef: LinkUserFirebaseUidRef;

export function linkUserFirebaseUid(vars: LinkUserFirebaseUidVariables): MutationPromise<LinkUserFirebaseUidData, LinkUserFirebaseUidVariables>;
export function linkUserFirebaseUid(dc: DataConnect, vars: LinkUserFirebaseUidVariables): MutationPromise<LinkUserFirebaseUidData, LinkUserFirebaseUidVariables>;

interface ListDepartmentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListDepartmentsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListDepartmentsData, undefined>;
  operationName: string;
}
export const listDepartmentsRef: ListDepartmentsRef;

export function listDepartments(options?: ExecuteQueryOptions): QueryPromise<ListDepartmentsData, undefined>;
export function listDepartments(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListDepartmentsData, undefined>;

interface GetDepartmentByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetDepartmentByIdVariables): QueryRef<GetDepartmentByIdData, GetDepartmentByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetDepartmentByIdVariables): QueryRef<GetDepartmentByIdData, GetDepartmentByIdVariables>;
  operationName: string;
}
export const getDepartmentByIdRef: GetDepartmentByIdRef;

export function getDepartmentById(vars: GetDepartmentByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetDepartmentByIdData, GetDepartmentByIdVariables>;
export function getDepartmentById(dc: DataConnect, vars: GetDepartmentByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetDepartmentByIdData, GetDepartmentByIdVariables>;

interface CreateDepartmentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateDepartmentVariables): MutationRef<CreateDepartmentData, CreateDepartmentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateDepartmentVariables): MutationRef<CreateDepartmentData, CreateDepartmentVariables>;
  operationName: string;
}
export const createDepartmentRef: CreateDepartmentRef;

export function createDepartment(vars: CreateDepartmentVariables): MutationPromise<CreateDepartmentData, CreateDepartmentVariables>;
export function createDepartment(dc: DataConnect, vars: CreateDepartmentVariables): MutationPromise<CreateDepartmentData, CreateDepartmentVariables>;

interface UpdateDepartmentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateDepartmentVariables): MutationRef<UpdateDepartmentData, UpdateDepartmentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateDepartmentVariables): MutationRef<UpdateDepartmentData, UpdateDepartmentVariables>;
  operationName: string;
}
export const updateDepartmentRef: UpdateDepartmentRef;

export function updateDepartment(vars: UpdateDepartmentVariables): MutationPromise<UpdateDepartmentData, UpdateDepartmentVariables>;
export function updateDepartment(dc: DataConnect, vars: UpdateDepartmentVariables): MutationPromise<UpdateDepartmentData, UpdateDepartmentVariables>;

interface DeleteDepartmentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteDepartmentVariables): MutationRef<DeleteDepartmentData, DeleteDepartmentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteDepartmentVariables): MutationRef<DeleteDepartmentData, DeleteDepartmentVariables>;
  operationName: string;
}
export const deleteDepartmentRef: DeleteDepartmentRef;

export function deleteDepartment(vars: DeleteDepartmentVariables): MutationPromise<DeleteDepartmentData, DeleteDepartmentVariables>;
export function deleteDepartment(dc: DataConnect, vars: DeleteDepartmentVariables): MutationPromise<DeleteDepartmentData, DeleteDepartmentVariables>;

interface ListDevicesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListDevicesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListDevicesData, undefined>;
  operationName: string;
}
export const listDevicesRef: ListDevicesRef;

export function listDevices(options?: ExecuteQueryOptions): QueryPromise<ListDevicesData, undefined>;
export function listDevices(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListDevicesData, undefined>;

interface GetDeviceByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetDeviceByIdVariables): QueryRef<GetDeviceByIdData, GetDeviceByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetDeviceByIdVariables): QueryRef<GetDeviceByIdData, GetDeviceByIdVariables>;
  operationName: string;
}
export const getDeviceByIdRef: GetDeviceByIdRef;

export function getDeviceById(vars: GetDeviceByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetDeviceByIdData, GetDeviceByIdVariables>;
export function getDeviceById(dc: DataConnect, vars: GetDeviceByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetDeviceByIdData, GetDeviceByIdVariables>;

interface CreateDeviceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateDeviceVariables): MutationRef<CreateDeviceData, CreateDeviceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateDeviceVariables): MutationRef<CreateDeviceData, CreateDeviceVariables>;
  operationName: string;
}
export const createDeviceRef: CreateDeviceRef;

export function createDevice(vars: CreateDeviceVariables): MutationPromise<CreateDeviceData, CreateDeviceVariables>;
export function createDevice(dc: DataConnect, vars: CreateDeviceVariables): MutationPromise<CreateDeviceData, CreateDeviceVariables>;

interface UpdateDeviceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateDeviceVariables): MutationRef<UpdateDeviceData, UpdateDeviceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateDeviceVariables): MutationRef<UpdateDeviceData, UpdateDeviceVariables>;
  operationName: string;
}
export const updateDeviceRef: UpdateDeviceRef;

export function updateDevice(vars: UpdateDeviceVariables): MutationPromise<UpdateDeviceData, UpdateDeviceVariables>;
export function updateDevice(dc: DataConnect, vars: UpdateDeviceVariables): MutationPromise<UpdateDeviceData, UpdateDeviceVariables>;

interface DeactivateDeviceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeactivateDeviceVariables): MutationRef<DeactivateDeviceData, DeactivateDeviceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeactivateDeviceVariables): MutationRef<DeactivateDeviceData, DeactivateDeviceVariables>;
  operationName: string;
}
export const deactivateDeviceRef: DeactivateDeviceRef;

export function deactivateDevice(vars: DeactivateDeviceVariables): MutationPromise<DeactivateDeviceData, DeactivateDeviceVariables>;
export function deactivateDevice(dc: DataConnect, vars: DeactivateDeviceVariables): MutationPromise<DeactivateDeviceData, DeactivateDeviceVariables>;

interface ListTimeRecordsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListTimeRecordsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListTimeRecordsData, undefined>;
  operationName: string;
}
export const listTimeRecordsRef: ListTimeRecordsRef;

export function listTimeRecords(options?: ExecuteQueryOptions): QueryPromise<ListTimeRecordsData, undefined>;
export function listTimeRecords(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListTimeRecordsData, undefined>;

interface GetTimeRecordByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTimeRecordByIdVariables): QueryRef<GetTimeRecordByIdData, GetTimeRecordByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetTimeRecordByIdVariables): QueryRef<GetTimeRecordByIdData, GetTimeRecordByIdVariables>;
  operationName: string;
}
export const getTimeRecordByIdRef: GetTimeRecordByIdRef;

export function getTimeRecordById(vars: GetTimeRecordByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetTimeRecordByIdData, GetTimeRecordByIdVariables>;
export function getTimeRecordById(dc: DataConnect, vars: GetTimeRecordByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetTimeRecordByIdData, GetTimeRecordByIdVariables>;

interface ListTimeRecordPhotosRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListTimeRecordPhotosData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListTimeRecordPhotosData, undefined>;
  operationName: string;
}
export const listTimeRecordPhotosRef: ListTimeRecordPhotosRef;

export function listTimeRecordPhotos(options?: ExecuteQueryOptions): QueryPromise<ListTimeRecordPhotosData, undefined>;
export function listTimeRecordPhotos(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListTimeRecordPhotosData, undefined>;

interface CreateTimeRecordRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTimeRecordVariables): MutationRef<CreateTimeRecordData, CreateTimeRecordVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateTimeRecordVariables): MutationRef<CreateTimeRecordData, CreateTimeRecordVariables>;
  operationName: string;
}
export const createTimeRecordRef: CreateTimeRecordRef;

export function createTimeRecord(vars: CreateTimeRecordVariables): MutationPromise<CreateTimeRecordData, CreateTimeRecordVariables>;
export function createTimeRecord(dc: DataConnect, vars: CreateTimeRecordVariables): MutationPromise<CreateTimeRecordData, CreateTimeRecordVariables>;

interface AdjustTimeRecordRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdjustTimeRecordVariables): MutationRef<AdjustTimeRecordData, AdjustTimeRecordVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdjustTimeRecordVariables): MutationRef<AdjustTimeRecordData, AdjustTimeRecordVariables>;
  operationName: string;
}
export const adjustTimeRecordRef: AdjustTimeRecordRef;

export function adjustTimeRecord(vars: AdjustTimeRecordVariables): MutationPromise<AdjustTimeRecordData, AdjustTimeRecordVariables>;
export function adjustTimeRecord(dc: DataConnect, vars: AdjustTimeRecordVariables): MutationPromise<AdjustTimeRecordData, AdjustTimeRecordVariables>;

interface CreateTimeRecordPhotoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTimeRecordPhotoVariables): MutationRef<CreateTimeRecordPhotoData, CreateTimeRecordPhotoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateTimeRecordPhotoVariables): MutationRef<CreateTimeRecordPhotoData, CreateTimeRecordPhotoVariables>;
  operationName: string;
}
export const createTimeRecordPhotoRef: CreateTimeRecordPhotoRef;

export function createTimeRecordPhoto(vars: CreateTimeRecordPhotoVariables): MutationPromise<CreateTimeRecordPhotoData, CreateTimeRecordPhotoVariables>;
export function createTimeRecordPhoto(dc: DataConnect, vars: CreateTimeRecordPhotoVariables): MutationPromise<CreateTimeRecordPhotoData, CreateTimeRecordPhotoVariables>;

interface ListVacationRequestsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListVacationRequestsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListVacationRequestsData, undefined>;
  operationName: string;
}
export const listVacationRequestsRef: ListVacationRequestsRef;

export function listVacationRequests(options?: ExecuteQueryOptions): QueryPromise<ListVacationRequestsData, undefined>;
export function listVacationRequests(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListVacationRequestsData, undefined>;

interface GetVacationRequestByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetVacationRequestByIdVariables): QueryRef<GetVacationRequestByIdData, GetVacationRequestByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetVacationRequestByIdVariables): QueryRef<GetVacationRequestByIdData, GetVacationRequestByIdVariables>;
  operationName: string;
}
export const getVacationRequestByIdRef: GetVacationRequestByIdRef;

export function getVacationRequestById(vars: GetVacationRequestByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetVacationRequestByIdData, GetVacationRequestByIdVariables>;
export function getVacationRequestById(dc: DataConnect, vars: GetVacationRequestByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetVacationRequestByIdData, GetVacationRequestByIdVariables>;

interface CreateVacationRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateVacationRequestVariables): MutationRef<CreateVacationRequestData, CreateVacationRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateVacationRequestVariables): MutationRef<CreateVacationRequestData, CreateVacationRequestVariables>;
  operationName: string;
}
export const createVacationRequestRef: CreateVacationRequestRef;

export function createVacationRequest(vars: CreateVacationRequestVariables): MutationPromise<CreateVacationRequestData, CreateVacationRequestVariables>;
export function createVacationRequest(dc: DataConnect, vars: CreateVacationRequestVariables): MutationPromise<CreateVacationRequestData, CreateVacationRequestVariables>;

interface ApproveVacationRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ApproveVacationRequestVariables): MutationRef<ApproveVacationRequestData, ApproveVacationRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ApproveVacationRequestVariables): MutationRef<ApproveVacationRequestData, ApproveVacationRequestVariables>;
  operationName: string;
}
export const approveVacationRequestRef: ApproveVacationRequestRef;

export function approveVacationRequest(vars: ApproveVacationRequestVariables): MutationPromise<ApproveVacationRequestData, ApproveVacationRequestVariables>;
export function approveVacationRequest(dc: DataConnect, vars: ApproveVacationRequestVariables): MutationPromise<ApproveVacationRequestData, ApproveVacationRequestVariables>;

interface RejectVacationRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RejectVacationRequestVariables): MutationRef<RejectVacationRequestData, RejectVacationRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RejectVacationRequestVariables): MutationRef<RejectVacationRequestData, RejectVacationRequestVariables>;
  operationName: string;
}
export const rejectVacationRequestRef: RejectVacationRequestRef;

export function rejectVacationRequest(vars: RejectVacationRequestVariables): MutationPromise<RejectVacationRequestData, RejectVacationRequestVariables>;
export function rejectVacationRequest(dc: DataConnect, vars: RejectVacationRequestVariables): MutationPromise<RejectVacationRequestData, RejectVacationRequestVariables>;

interface ListWorkSchedulesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListWorkSchedulesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListWorkSchedulesData, undefined>;
  operationName: string;
}
export const listWorkSchedulesRef: ListWorkSchedulesRef;

export function listWorkSchedules(options?: ExecuteQueryOptions): QueryPromise<ListWorkSchedulesData, undefined>;
export function listWorkSchedules(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListWorkSchedulesData, undefined>;

interface GetWorkScheduleByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetWorkScheduleByIdVariables): QueryRef<GetWorkScheduleByIdData, GetWorkScheduleByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetWorkScheduleByIdVariables): QueryRef<GetWorkScheduleByIdData, GetWorkScheduleByIdVariables>;
  operationName: string;
}
export const getWorkScheduleByIdRef: GetWorkScheduleByIdRef;

export function getWorkScheduleById(vars: GetWorkScheduleByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetWorkScheduleByIdData, GetWorkScheduleByIdVariables>;
export function getWorkScheduleById(dc: DataConnect, vars: GetWorkScheduleByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetWorkScheduleByIdData, GetWorkScheduleByIdVariables>;

interface ListEmployeeScheduleHistoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListEmployeeScheduleHistoryData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListEmployeeScheduleHistoryData, undefined>;
  operationName: string;
}
export const listEmployeeScheduleHistoryRef: ListEmployeeScheduleHistoryRef;

export function listEmployeeScheduleHistory(options?: ExecuteQueryOptions): QueryPromise<ListEmployeeScheduleHistoryData, undefined>;
export function listEmployeeScheduleHistory(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListEmployeeScheduleHistoryData, undefined>;

interface CreateWorkScheduleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateWorkScheduleVariables): MutationRef<CreateWorkScheduleData, CreateWorkScheduleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateWorkScheduleVariables): MutationRef<CreateWorkScheduleData, CreateWorkScheduleVariables>;
  operationName: string;
}
export const createWorkScheduleRef: CreateWorkScheduleRef;

export function createWorkSchedule(vars: CreateWorkScheduleVariables): MutationPromise<CreateWorkScheduleData, CreateWorkScheduleVariables>;
export function createWorkSchedule(dc: DataConnect, vars: CreateWorkScheduleVariables): MutationPromise<CreateWorkScheduleData, CreateWorkScheduleVariables>;

interface UpdateWorkScheduleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateWorkScheduleVariables): MutationRef<UpdateWorkScheduleData, UpdateWorkScheduleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateWorkScheduleVariables): MutationRef<UpdateWorkScheduleData, UpdateWorkScheduleVariables>;
  operationName: string;
}
export const updateWorkScheduleRef: UpdateWorkScheduleRef;

export function updateWorkSchedule(vars: UpdateWorkScheduleVariables): MutationPromise<UpdateWorkScheduleData, UpdateWorkScheduleVariables>;
export function updateWorkSchedule(dc: DataConnect, vars: UpdateWorkScheduleVariables): MutationPromise<UpdateWorkScheduleData, UpdateWorkScheduleVariables>;

interface AssignWorkScheduleToEmployeeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AssignWorkScheduleToEmployeeVariables): MutationRef<AssignWorkScheduleToEmployeeData, AssignWorkScheduleToEmployeeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AssignWorkScheduleToEmployeeVariables): MutationRef<AssignWorkScheduleToEmployeeData, AssignWorkScheduleToEmployeeVariables>;
  operationName: string;
}
export const assignWorkScheduleToEmployeeRef: AssignWorkScheduleToEmployeeRef;

export function assignWorkScheduleToEmployee(vars: AssignWorkScheduleToEmployeeVariables): MutationPromise<AssignWorkScheduleToEmployeeData, AssignWorkScheduleToEmployeeVariables>;
export function assignWorkScheduleToEmployee(dc: DataConnect, vars: AssignWorkScheduleToEmployeeVariables): MutationPromise<AssignWorkScheduleToEmployeeData, AssignWorkScheduleToEmployeeVariables>;

interface ListAuditLogsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAuditLogsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAuditLogsData, undefined>;
  operationName: string;
}
export const listAuditLogsRef: ListAuditLogsRef;

export function listAuditLogs(options?: ExecuteQueryOptions): QueryPromise<ListAuditLogsData, undefined>;
export function listAuditLogs(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAuditLogsData, undefined>;

interface CreateAuditLogRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAuditLogVariables): MutationRef<CreateAuditLogData, CreateAuditLogVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateAuditLogVariables): MutationRef<CreateAuditLogData, CreateAuditLogVariables>;
  operationName: string;
}
export const createAuditLogRef: CreateAuditLogRef;

export function createAuditLog(vars: CreateAuditLogVariables): MutationPromise<CreateAuditLogData, CreateAuditLogVariables>;
export function createAuditLog(dc: DataConnect, vars: CreateAuditLogVariables): MutationPromise<CreateAuditLogData, CreateAuditLogVariables>;

interface ListEmployeeNotificationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListEmployeeNotificationsVariables): QueryRef<ListEmployeeNotificationsData, ListEmployeeNotificationsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListEmployeeNotificationsVariables): QueryRef<ListEmployeeNotificationsData, ListEmployeeNotificationsVariables>;
  operationName: string;
}
export const listEmployeeNotificationsRef: ListEmployeeNotificationsRef;

export function listEmployeeNotifications(vars: ListEmployeeNotificationsVariables, options?: ExecuteQueryOptions): QueryPromise<ListEmployeeNotificationsData, ListEmployeeNotificationsVariables>;
export function listEmployeeNotifications(dc: DataConnect, vars: ListEmployeeNotificationsVariables, options?: ExecuteQueryOptions): QueryPromise<ListEmployeeNotificationsData, ListEmployeeNotificationsVariables>;

interface MarkEmployeeNotificationAsReadRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkEmployeeNotificationAsReadVariables): MutationRef<MarkEmployeeNotificationAsReadData, MarkEmployeeNotificationAsReadVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: MarkEmployeeNotificationAsReadVariables): MutationRef<MarkEmployeeNotificationAsReadData, MarkEmployeeNotificationAsReadVariables>;
  operationName: string;
}
export const markEmployeeNotificationAsReadRef: MarkEmployeeNotificationAsReadRef;

export function markEmployeeNotificationAsRead(vars: MarkEmployeeNotificationAsReadVariables): MutationPromise<MarkEmployeeNotificationAsReadData, MarkEmployeeNotificationAsReadVariables>;
export function markEmployeeNotificationAsRead(dc: DataConnect, vars: MarkEmployeeNotificationAsReadVariables): MutationPromise<MarkEmployeeNotificationAsReadData, MarkEmployeeNotificationAsReadVariables>;

interface GetEmployeeNotificationPreferencesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetEmployeeNotificationPreferencesVariables): QueryRef<GetEmployeeNotificationPreferencesData, GetEmployeeNotificationPreferencesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetEmployeeNotificationPreferencesVariables): QueryRef<GetEmployeeNotificationPreferencesData, GetEmployeeNotificationPreferencesVariables>;
  operationName: string;
}
export const getEmployeeNotificationPreferencesRef: GetEmployeeNotificationPreferencesRef;

export function getEmployeeNotificationPreferences(vars: GetEmployeeNotificationPreferencesVariables, options?: ExecuteQueryOptions): QueryPromise<GetEmployeeNotificationPreferencesData, GetEmployeeNotificationPreferencesVariables>;
export function getEmployeeNotificationPreferences(dc: DataConnect, vars: GetEmployeeNotificationPreferencesVariables, options?: ExecuteQueryOptions): QueryPromise<GetEmployeeNotificationPreferencesData, GetEmployeeNotificationPreferencesVariables>;

interface UpdateEmployeeNotificationPreferencesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEmployeeNotificationPreferencesVariables): MutationRef<UpdateEmployeeNotificationPreferencesData, UpdateEmployeeNotificationPreferencesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateEmployeeNotificationPreferencesVariables): MutationRef<UpdateEmployeeNotificationPreferencesData, UpdateEmployeeNotificationPreferencesVariables>;
  operationName: string;
}
export const updateEmployeeNotificationPreferencesRef: UpdateEmployeeNotificationPreferencesRef;

export function updateEmployeeNotificationPreferences(vars: UpdateEmployeeNotificationPreferencesVariables): MutationPromise<UpdateEmployeeNotificationPreferencesData, UpdateEmployeeNotificationPreferencesVariables>;
export function updateEmployeeNotificationPreferences(dc: DataConnect, vars: UpdateEmployeeNotificationPreferencesVariables): MutationPromise<UpdateEmployeeNotificationPreferencesData, UpdateEmployeeNotificationPreferencesVariables>;

interface ListEmployeeDocumentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListEmployeeDocumentsVariables): QueryRef<ListEmployeeDocumentsData, ListEmployeeDocumentsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListEmployeeDocumentsVariables): QueryRef<ListEmployeeDocumentsData, ListEmployeeDocumentsVariables>;
  operationName: string;
}
export const listEmployeeDocumentsRef: ListEmployeeDocumentsRef;

export function listEmployeeDocuments(vars: ListEmployeeDocumentsVariables, options?: ExecuteQueryOptions): QueryPromise<ListEmployeeDocumentsData, ListEmployeeDocumentsVariables>;
export function listEmployeeDocuments(dc: DataConnect, vars: ListEmployeeDocumentsVariables, options?: ExecuteQueryOptions): QueryPromise<ListEmployeeDocumentsData, ListEmployeeDocumentsVariables>;

interface GetEmployeeDocumentByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetEmployeeDocumentByIdVariables): QueryRef<GetEmployeeDocumentByIdData, GetEmployeeDocumentByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetEmployeeDocumentByIdVariables): QueryRef<GetEmployeeDocumentByIdData, GetEmployeeDocumentByIdVariables>;
  operationName: string;
}
export const getEmployeeDocumentByIdRef: GetEmployeeDocumentByIdRef;

export function getEmployeeDocumentById(vars: GetEmployeeDocumentByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetEmployeeDocumentByIdData, GetEmployeeDocumentByIdVariables>;
export function getEmployeeDocumentById(dc: DataConnect, vars: GetEmployeeDocumentByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetEmployeeDocumentByIdData, GetEmployeeDocumentByIdVariables>;

interface ListPayrollStatementsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListPayrollStatementsVariables): QueryRef<ListPayrollStatementsData, ListPayrollStatementsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListPayrollStatementsVariables): QueryRef<ListPayrollStatementsData, ListPayrollStatementsVariables>;
  operationName: string;
}
export const listPayrollStatementsRef: ListPayrollStatementsRef;

export function listPayrollStatements(vars: ListPayrollStatementsVariables, options?: ExecuteQueryOptions): QueryPromise<ListPayrollStatementsData, ListPayrollStatementsVariables>;
export function listPayrollStatements(dc: DataConnect, vars: ListPayrollStatementsVariables, options?: ExecuteQueryOptions): QueryPromise<ListPayrollStatementsData, ListPayrollStatementsVariables>;

interface GetPayrollStatementByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPayrollStatementByIdVariables): QueryRef<GetPayrollStatementByIdData, GetPayrollStatementByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPayrollStatementByIdVariables): QueryRef<GetPayrollStatementByIdData, GetPayrollStatementByIdVariables>;
  operationName: string;
}
export const getPayrollStatementByIdRef: GetPayrollStatementByIdRef;

export function getPayrollStatementById(vars: GetPayrollStatementByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetPayrollStatementByIdData, GetPayrollStatementByIdVariables>;
export function getPayrollStatementById(dc: DataConnect, vars: GetPayrollStatementByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetPayrollStatementByIdData, GetPayrollStatementByIdVariables>;

interface ListEmployeesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListEmployeesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListEmployeesData, undefined>;
  operationName: string;
}
export const listEmployeesRef: ListEmployeesRef;

export function listEmployees(options?: ExecuteQueryOptions): QueryPromise<ListEmployeesData, undefined>;
export function listEmployees(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListEmployeesData, undefined>;

interface GetEmployeeByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetEmployeeByIdVariables): QueryRef<GetEmployeeByIdData, GetEmployeeByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetEmployeeByIdVariables): QueryRef<GetEmployeeByIdData, GetEmployeeByIdVariables>;
  operationName: string;
}
export const getEmployeeByIdRef: GetEmployeeByIdRef;

export function getEmployeeById(vars: GetEmployeeByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetEmployeeByIdData, GetEmployeeByIdVariables>;
export function getEmployeeById(dc: DataConnect, vars: GetEmployeeByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetEmployeeByIdData, GetEmployeeByIdVariables>;

interface CreateEmployeeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateEmployeeVariables): MutationRef<CreateEmployeeData, CreateEmployeeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateEmployeeVariables): MutationRef<CreateEmployeeData, CreateEmployeeVariables>;
  operationName: string;
}
export const createEmployeeRef: CreateEmployeeRef;

export function createEmployee(vars: CreateEmployeeVariables): MutationPromise<CreateEmployeeData, CreateEmployeeVariables>;
export function createEmployee(dc: DataConnect, vars: CreateEmployeeVariables): MutationPromise<CreateEmployeeData, CreateEmployeeVariables>;

interface UpdateEmployeeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEmployeeVariables): MutationRef<UpdateEmployeeData, UpdateEmployeeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateEmployeeVariables): MutationRef<UpdateEmployeeData, UpdateEmployeeVariables>;
  operationName: string;
}
export const updateEmployeeRef: UpdateEmployeeRef;

export function updateEmployee(vars: UpdateEmployeeVariables): MutationPromise<UpdateEmployeeData, UpdateEmployeeVariables>;
export function updateEmployee(dc: DataConnect, vars: UpdateEmployeeVariables): MutationPromise<UpdateEmployeeData, UpdateEmployeeVariables>;

interface DeactivateEmployeeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeactivateEmployeeVariables): MutationRef<DeactivateEmployeeData, DeactivateEmployeeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeactivateEmployeeVariables): MutationRef<DeactivateEmployeeData, DeactivateEmployeeVariables>;
  operationName: string;
}
export const deactivateEmployeeRef: DeactivateEmployeeRef;

export function deactivateEmployee(vars: DeactivateEmployeeVariables): MutationPromise<DeactivateEmployeeData, DeactivateEmployeeVariables>;
export function deactivateEmployee(dc: DataConnect, vars: DeactivateEmployeeVariables): MutationPromise<DeactivateEmployeeData, DeactivateEmployeeVariables>;

interface ListJustificationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListJustificationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListJustificationsData, undefined>;
  operationName: string;
}
export const listJustificationsRef: ListJustificationsRef;

export function listJustifications(options?: ExecuteQueryOptions): QueryPromise<ListJustificationsData, undefined>;
export function listJustifications(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListJustificationsData, undefined>;

interface GetJustificationByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetJustificationByIdVariables): QueryRef<GetJustificationByIdData, GetJustificationByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetJustificationByIdVariables): QueryRef<GetJustificationByIdData, GetJustificationByIdVariables>;
  operationName: string;
}
export const getJustificationByIdRef: GetJustificationByIdRef;

export function getJustificationById(vars: GetJustificationByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetJustificationByIdData, GetJustificationByIdVariables>;
export function getJustificationById(dc: DataConnect, vars: GetJustificationByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetJustificationByIdData, GetJustificationByIdVariables>;

interface ListJustificationAttachmentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListJustificationAttachmentsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListJustificationAttachmentsData, undefined>;
  operationName: string;
}
export const listJustificationAttachmentsRef: ListJustificationAttachmentsRef;

export function listJustificationAttachments(options?: ExecuteQueryOptions): QueryPromise<ListJustificationAttachmentsData, undefined>;
export function listJustificationAttachments(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListJustificationAttachmentsData, undefined>;

interface CreateJustificationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateJustificationVariables): MutationRef<CreateJustificationData, CreateJustificationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateJustificationVariables): MutationRef<CreateJustificationData, CreateJustificationVariables>;
  operationName: string;
}
export const createJustificationRef: CreateJustificationRef;

export function createJustification(vars: CreateJustificationVariables): MutationPromise<CreateJustificationData, CreateJustificationVariables>;
export function createJustification(dc: DataConnect, vars: CreateJustificationVariables): MutationPromise<CreateJustificationData, CreateJustificationVariables>;

interface ApproveJustificationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ApproveJustificationVariables): MutationRef<ApproveJustificationData, ApproveJustificationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ApproveJustificationVariables): MutationRef<ApproveJustificationData, ApproveJustificationVariables>;
  operationName: string;
}
export const approveJustificationRef: ApproveJustificationRef;

export function approveJustification(vars: ApproveJustificationVariables): MutationPromise<ApproveJustificationData, ApproveJustificationVariables>;
export function approveJustification(dc: DataConnect, vars: ApproveJustificationVariables): MutationPromise<ApproveJustificationData, ApproveJustificationVariables>;

interface RejectJustificationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RejectJustificationVariables): MutationRef<RejectJustificationData, RejectJustificationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RejectJustificationVariables): MutationRef<RejectJustificationData, RejectJustificationVariables>;
  operationName: string;
}
export const rejectJustificationRef: RejectJustificationRef;

export function rejectJustification(vars: RejectJustificationVariables): MutationPromise<RejectJustificationData, RejectJustificationVariables>;
export function rejectJustification(dc: DataConnect, vars: RejectJustificationVariables): MutationPromise<RejectJustificationData, RejectJustificationVariables>;

interface AddJustificationAttachmentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddJustificationAttachmentVariables): MutationRef<AddJustificationAttachmentData, AddJustificationAttachmentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddJustificationAttachmentVariables): MutationRef<AddJustificationAttachmentData, AddJustificationAttachmentVariables>;
  operationName: string;
}
export const addJustificationAttachmentRef: AddJustificationAttachmentRef;

export function addJustificationAttachment(vars: AddJustificationAttachmentVariables): MutationPromise<AddJustificationAttachmentData, AddJustificationAttachmentVariables>;
export function addJustificationAttachment(dc: DataConnect, vars: AddJustificationAttachmentVariables): MutationPromise<AddJustificationAttachmentData, AddJustificationAttachmentVariables>;

interface SeedRhPontoDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<SeedRhPontoDataData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<SeedRhPontoDataData, undefined>;
  operationName: string;
}
export const seedRhPontoDataRef: SeedRhPontoDataRef;

export function seedRhPontoData(): MutationPromise<SeedRhPontoDataData, undefined>;
export function seedRhPontoData(dc: DataConnect): MutationPromise<SeedRhPontoDataData, undefined>;

