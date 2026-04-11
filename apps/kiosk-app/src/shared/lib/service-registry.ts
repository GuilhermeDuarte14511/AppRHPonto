import { resolveAppBackendMode, type AppBackendMode } from '@rh-ponto/config';
import {
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
import { BrowserFirebaseAuthClient, getFirebaseApp } from '@rh-ponto/firebase';

const runtimeEnv =
  (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};

const createAuthRepository = (backendMode: AppBackendMode): AuthRepository => {
  switch (backendMode) {
    case 'firebase':
      return new FirebaseAuthRepository(new BrowserFirebaseAuthClient(getFirebaseApp(runtimeEnv)));
    case 'mock':
    default:
      return new MockAuthRepository();
  }
};

const createAttendancePolicyRepository = (_backendMode: AppBackendMode): AttendancePolicyRepository =>
  new MockAttendancePolicyRepository();

export const createKioskAppServices = (backendMode = resolveAppBackendMode(runtimeEnv)) => {
  const authRepository = createAuthRepository(backendMode);
  const attendancePolicyRepository = createAttendancePolicyRepository(backendMode);

  return {
    runtime: {
      backendMode,
    },
    auth: {
      getCurrentSessionUseCase: new GetCurrentSessionUseCase(authRepository),
      signInUseCase: new SignInUseCase(authRepository),
      signOutUseCase: new SignOutUseCase(authRepository),
    },
    attendance: {
      getEmployeeAttendancePolicyUseCase: new GetEmployeeAttendancePolicyUseCase(attendancePolicyRepository),
    },
  };
};

export type KioskAppServices = ReturnType<typeof createKioskAppServices>;

let cachedServices: KioskAppServices | null = null;

export const getKioskAppServices = (): KioskAppServices => {
  if (!cachedServices) {
    cachedServices = createKioskAppServices();
  }

  return cachedServices;
};
