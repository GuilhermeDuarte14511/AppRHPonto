import { resolveAppBackendMode, type AppBackendMode } from '@rh-ponto/config';
import {
  DataConnectAttendancePolicyRepository,
  GetEmployeeAttendancePolicyUseCase,
  MockAttendancePolicyRepository,
  type AttendancePolicyRepository,
} from '@rh-ponto/attendance-policies';
import {
  FirebaseAuthRepository,
  GetCurrentSessionUseCase,
  MockAuthRepository,
  SignInUseCase,
  SignOutUseCase,
  type AuthRepository,
} from '@rh-ponto/auth';
import {
  DataConnectEmployeeRepository,
  ListEmployeesUseCase,
  MockEmployeesRepository,
  type EmployeeRepository,
} from '@rh-ponto/employees';
import { BrowserFirebaseAuthClient, getFirebaseApp } from '@rh-ponto/firebase';
import {
  CreateJustificationUseCase,
  DataConnectJustificationRepository,
  GetJustificationByIdUseCase,
  ListJustificationAttachmentsByJustificationUseCase,
  ListJustificationsByEmployeeUseCase,
  MockJustificationsRepository,
  type JustificationRepository,
} from '@rh-ponto/justifications';
import {
  CreateTimeRecordUseCase,
  DataConnectTimeRecordRepository,
  ListEmployeeTimeRecordsUseCase,
  ListTimeRecordPhotosByRecordUseCase,
  MockTimeRecordsRepository,
  type TimeRecordRepository,
} from '@rh-ponto/time-records';

const runtimeEnv =
  (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};

const hasFirebaseConfiguration = (env: Record<string, string | undefined>) =>
  Boolean(
    (env.EXPO_PUBLIC_FIREBASE_API_KEY ?? env.NEXT_PUBLIC_FIREBASE_API_KEY) &&
      (env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) &&
      (env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) &&
      (env.EXPO_PUBLIC_FIREBASE_APP_ID ?? env.NEXT_PUBLIC_FIREBASE_APP_ID),
  );

const createAuthRepository = (backendMode: AppBackendMode): AuthRepository => {
  switch (backendMode) {
    case 'firebase':
      if (!hasFirebaseConfiguration(runtimeEnv)) {
        return new MockAuthRepository();
      }

      return new FirebaseAuthRepository(new BrowserFirebaseAuthClient(getFirebaseApp(runtimeEnv)));
    case 'mock':
    default:
      return new MockAuthRepository();
  }
};

const createAttendancePolicyRepository = (backendMode: AppBackendMode): AttendancePolicyRepository => {
  switch (backendMode) {
    case 'firebase':
      return new DataConnectAttendancePolicyRepository();
    case 'mock':
    default:
      return new MockAttendancePolicyRepository();
  }
};

const createEmployeeRepository = (backendMode: AppBackendMode): EmployeeRepository => {
  switch (backendMode) {
    case 'firebase':
      return new DataConnectEmployeeRepository();
    case 'mock':
    default:
      return new MockEmployeesRepository();
  }
};

const createTimeRecordRepository = (backendMode: AppBackendMode): TimeRecordRepository => {
  switch (backendMode) {
    case 'firebase':
      return new DataConnectTimeRecordRepository();
    case 'mock':
    default:
      return new MockTimeRecordsRepository();
  }
};

const createJustificationRepository = (backendMode: AppBackendMode): JustificationRepository => {
  switch (backendMode) {
    case 'firebase':
      return new DataConnectJustificationRepository();
    case 'mock':
    default:
      return new MockJustificationsRepository();
  }
};

export const createEmployeeAppServices = (backendMode = resolveAppBackendMode(runtimeEnv)) => {
  const effectiveBackendMode =
    backendMode === 'firebase' && !hasFirebaseConfiguration(runtimeEnv) ? 'mock' : backendMode;
  const authRepository = createAuthRepository(effectiveBackendMode);
  const attendancePolicyRepository = createAttendancePolicyRepository(effectiveBackendMode);
  const employeeRepository = createEmployeeRepository(effectiveBackendMode);
  const timeRecordRepository = createTimeRecordRepository(effectiveBackendMode);
  const justificationRepository = createJustificationRepository(effectiveBackendMode);

  return {
    runtime: {
      backendMode: effectiveBackendMode,
    },
    auth: {
      getCurrentSessionUseCase: new GetCurrentSessionUseCase(authRepository),
      signInUseCase: new SignInUseCase(authRepository),
      signOutUseCase: new SignOutUseCase(authRepository),
    },
    attendance: {
      getEmployeeAttendancePolicyUseCase: new GetEmployeeAttendancePolicyUseCase(attendancePolicyRepository),
    },
    employees: {
      listEmployeesUseCase: new ListEmployeesUseCase(employeeRepository),
    },
    timeRecords: {
      createTimeRecordUseCase: new CreateTimeRecordUseCase(timeRecordRepository),
      listEmployeeTimeRecordsUseCase: new ListEmployeeTimeRecordsUseCase(timeRecordRepository),
      listTimeRecordPhotosByRecordUseCase: new ListTimeRecordPhotosByRecordUseCase(timeRecordRepository),
    },
    justifications: {
      createJustificationUseCase: new CreateJustificationUseCase(justificationRepository),
      getJustificationByIdUseCase: new GetJustificationByIdUseCase(justificationRepository),
      listJustificationAttachmentsByJustificationUseCase: new ListJustificationAttachmentsByJustificationUseCase(
        justificationRepository,
      ),
      listJustificationsByEmployeeUseCase: new ListJustificationsByEmployeeUseCase(justificationRepository),
    },
  };
};

export type EmployeeAppServices = ReturnType<typeof createEmployeeAppServices>;

let cachedServices: EmployeeAppServices | null = null;

export const getEmployeeAppServices = (): EmployeeAppServices => {
  if (!cachedServices) {
    cachedServices = createEmployeeAppServices();
  }

  return cachedServices;
};
