import { resolveAppBackendMode, type AppBackendMode } from '@rh-ponto/config';
import { AppError } from '@rh-ponto/core';
import {
  AccessControlService,
  GetCurrentSessionUseCase,
  SignInUseCase,
  SignOutUseCase,
  type Session,
  type SignInPayload,
  type AuthRepository,
  type User,
} from '@rh-ponto/auth';
import {
  CreateAuditLogUseCase,
  DataConnectAuditLogRepository,
  ListAuditLogsUseCase,
  type AuditLogRepository,
} from '@rh-ponto/audit';
import {
  CreateDepartmentUseCase,
  DataConnectDepartmentRepository,
  DeleteDepartmentUseCase,
  GetDepartmentByIdUseCase,
  ListDepartmentsUseCase,
  UpdateDepartmentUseCase,
  type DepartmentRepository,
} from '@rh-ponto/departments';
import {
  CreateEmployeeUseCase,
  DeactivateEmployeeUseCase,
  DataConnectEmployeeRepository,
  GetEmployeeByIdUseCase,
  ListEmployeesUseCase,
  UpdateEmployeeUseCase,
  type EmployeeRepository,
} from '@rh-ponto/employees';
import {
  CreateJustificationUseCase,
  DataConnectJustificationRepository,
  ListJustificationsUseCase,
  ReviewJustificationUseCase,
  type JustificationRepository,
} from '@rh-ponto/justifications';
import {
  AdjustTimeRecordUseCase,
  CreateTimeRecordUseCase,
  DataConnectTimeRecordRepository,
  ListTimeRecordPhotosByRecordUseCase,
  ListTimeRecordsUseCase,
  type TimeRecordRepository,
} from '@rh-ponto/time-records';
import {
  AssignWorkScheduleToEmployeeUseCase,
  CreateWorkScheduleUseCase,
  DataConnectWorkScheduleRepository,
  ListWorkSchedulesUseCase,
  UpdateWorkScheduleUseCase,
  type WorkScheduleRepository,
} from '@rh-ponto/work-schedules';
import {
  DataConnectDeviceRepository,
  CreateDeviceUseCase,
  DeactivateDeviceUseCase,
  GetDeviceByIdUseCase,
  ListDevicesUseCase,
  UpdateDeviceUseCase,
  type DeviceRepository,
} from '@rh-ponto/devices';

interface AdminRepositories {
  auth: AuthRepository;
  employees: EmployeeRepository;
  departments: DepartmentRepository;
  timeRecords: TimeRecordRepository;
  justifications: JustificationRepository;
  audit: AuditLogRepository;
  workSchedules: WorkScheduleRepository;
  devices: DeviceRepository;
}

class UnsupportedAdminAuthRepository implements AuthRepository {
  private createError() {
    return new AppError(
      'ADMIN_AUTH_ROUTE_ONLY',
      'O painel administrativo usa autenticação real via rotas HTTP com Firebase Auth.',
    );
  }

  signIn(payload: SignInPayload): Promise<Session> {
    void payload;
    return Promise.reject(this.createError());
  }

  signOut(): Promise<void> {
    return Promise.reject(this.createError());
  }

  getCurrentUser(): Promise<User | null> {
    return Promise.reject(this.createError());
  }

  getSession(): Promise<Session | null> {
    return Promise.reject(this.createError());
  }

  refreshSession(): Promise<Session | null> {
    return Promise.reject(this.createError());
  }
}

const createRepositories = (backendMode: AppBackendMode): AdminRepositories => {
  if (backendMode !== 'firebase') {
    throw new AppError(
      'ADMIN_BACKEND_MODE_UNSUPPORTED',
      'O admin-web deve ser executado com NEXT_PUBLIC_APP_BACKEND_MODE=firebase.',
    );
  }

  return {
    auth: new UnsupportedAdminAuthRepository(),
    employees: new DataConnectEmployeeRepository(),
    departments: new DataConnectDepartmentRepository(),
    timeRecords: new DataConnectTimeRecordRepository(),
    justifications: new DataConnectJustificationRepository(),
    audit: new DataConnectAuditLogRepository(),
    workSchedules: new DataConnectWorkScheduleRepository(),
    devices: new DataConnectDeviceRepository(),
  };
};

export const createAdminServices = (backendMode = resolveAppBackendMode(process.env)) => {
  const repositories = createRepositories(backendMode);

  return {
    runtime: {
      backendMode,
    },
    auth: {
      accessControlService: new AccessControlService(),
      getCurrentSessionUseCase: new GetCurrentSessionUseCase(repositories.auth),
      signInUseCase: new SignInUseCase(repositories.auth),
      signOutUseCase: new SignOutUseCase(repositories.auth),
    },
    employees: {
      createEmployeeUseCase: new CreateEmployeeUseCase(repositories.employees),
      deactivateEmployeeUseCase: new DeactivateEmployeeUseCase(repositories.employees),
      getEmployeeByIdUseCase: new GetEmployeeByIdUseCase(repositories.employees),
      listEmployeesUseCase: new ListEmployeesUseCase(repositories.employees),
      updateEmployeeUseCase: new UpdateEmployeeUseCase(repositories.employees),
    },
    departments: {
      createDepartmentUseCase: new CreateDepartmentUseCase(repositories.departments),
      deleteDepartmentUseCase: new DeleteDepartmentUseCase(repositories.departments),
      getDepartmentByIdUseCase: new GetDepartmentByIdUseCase(repositories.departments),
      listDepartmentsUseCase: new ListDepartmentsUseCase(repositories.departments),
      updateDepartmentUseCase: new UpdateDepartmentUseCase(repositories.departments),
    },
    timeRecords: {
      adjustTimeRecordUseCase: new AdjustTimeRecordUseCase(repositories.timeRecords),
      createTimeRecordUseCase: new CreateTimeRecordUseCase(repositories.timeRecords),
      listTimeRecordPhotosByRecordUseCase: new ListTimeRecordPhotosByRecordUseCase(repositories.timeRecords),
      listTimeRecordsUseCase: new ListTimeRecordsUseCase(repositories.timeRecords),
    },
    justifications: {
      createJustificationUseCase: new CreateJustificationUseCase(repositories.justifications),
      listJustificationsUseCase: new ListJustificationsUseCase(repositories.justifications),
      reviewJustificationUseCase: new ReviewJustificationUseCase(repositories.justifications),
    },
    audit: {
      createAuditLogUseCase: new CreateAuditLogUseCase(repositories.audit),
      listAuditLogsUseCase: new ListAuditLogsUseCase(repositories.audit),
    },
    workSchedules: {
      assignWorkScheduleToEmployeeUseCase: new AssignWorkScheduleToEmployeeUseCase(repositories.workSchedules),
      createWorkScheduleUseCase: new CreateWorkScheduleUseCase(repositories.workSchedules),
      listWorkSchedulesUseCase: new ListWorkSchedulesUseCase(repositories.workSchedules),
      updateWorkScheduleUseCase: new UpdateWorkScheduleUseCase(repositories.workSchedules),
    },
    devices: {
      createDeviceUseCase: new CreateDeviceUseCase(repositories.devices),
      deactivateDeviceUseCase: new DeactivateDeviceUseCase(repositories.devices),
      getDeviceByIdUseCase: new GetDeviceByIdUseCase(repositories.devices),
      listDevicesUseCase: new ListDevicesUseCase(repositories.devices),
      updateDeviceUseCase: new UpdateDeviceUseCase(repositories.devices),
    },
  };
};

export type AdminServices = ReturnType<typeof createAdminServices>;

let cachedServices: AdminServices | null = null;

export const getAdminServices = (): AdminServices => {
  if (!cachedServices) {
    cachedServices = createAdminServices();
  }

  return cachedServices;
};

export const services = getAdminServices();
