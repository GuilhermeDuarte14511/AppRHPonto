import { resolveAppBackendMode, type AppBackendMode } from '@rh-ponto/config';
import {
  DataConnectAttendancePolicyRepository,
  GetEmployeeAttendancePolicyUseCase,
} from '@rh-ponto/attendance-policies';
import {
  FirebaseAuthRepository,
  GetCurrentSessionUseCase,
  SignInUseCase,
  SignOutUseCase,
} from '@rh-ponto/auth';
import { AppError } from '@rh-ponto/core';
import {
  DataConnectEmployeeRepository,
  ListEmployeesUseCase,
} from '@rh-ponto/employees';
import { BrowserFirebaseAuthClient, getFirebaseApp } from '@rh-ponto/firebase';
import {
  AddJustificationAttachmentUseCase,
  CreateJustificationUseCase,
  DataConnectJustificationRepository,
  GetJustificationByIdUseCase,
  ListJustificationAttachmentsByJustificationUseCase,
  ListJustificationsByEmployeeUseCase,
} from '@rh-ponto/justifications';
import {
  CreateTimeRecordUseCase,
  CreateTimeRecordPhotoUseCase,
  DataConnectTimeRecordRepository,
  ListEmployeeTimeRecordsUseCase,
  ListTimeRecordPhotosByRecordUseCase,
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

const assertFirebaseBackend = (backendMode: AppBackendMode) => {
  if (backendMode !== 'firebase') {
    throw new AppError(
      'EMPLOYEE_APP_REQUIRES_FIREBASE',
      'O aplicativo do colaborador opera apenas com autenticação e dados reais do Firebase.',
    );
  }
};

const assertFirebaseConfiguration = () => {
  if (!hasFirebaseConfiguration(runtimeEnv)) {
    throw new AppError(
      'EMPLOYEE_APP_FIREBASE_CONFIG_MISSING',
      'As variáveis do Firebase não estão configuradas para o aplicativo do colaborador.',
    );
  }
};

export const createEmployeeAppServices = (backendMode = resolveAppBackendMode(runtimeEnv)) => {
  assertFirebaseBackend(backendMode);
  assertFirebaseConfiguration();

  const authRepository = new FirebaseAuthRepository(new BrowserFirebaseAuthClient(getFirebaseApp(runtimeEnv)));
  const attendancePolicyRepository = new DataConnectAttendancePolicyRepository();
  const employeeRepository = new DataConnectEmployeeRepository();
  const timeRecordRepository = new DataConnectTimeRecordRepository();
  const justificationRepository = new DataConnectJustificationRepository();

  return {
    runtime: {
      backendMode: 'firebase' as const,
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
      createTimeRecordPhotoUseCase: new CreateTimeRecordPhotoUseCase(timeRecordRepository),
      listEmployeeTimeRecordsUseCase: new ListEmployeeTimeRecordsUseCase(timeRecordRepository),
      listTimeRecordPhotosByRecordUseCase: new ListTimeRecordPhotosByRecordUseCase(timeRecordRepository),
    },
    justifications: {
      addJustificationAttachmentUseCase: new AddJustificationAttachmentUseCase(justificationRepository),
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
