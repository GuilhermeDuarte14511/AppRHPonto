import * as SecureStore from 'expo-secure-store';

import type { Session } from '@rh-ponto/auth';

const EMPLOYEE_SESSION_STORAGE_KEY = 'rh-ponto:employee-session';

export const persistEmployeeSession = async (session: Session): Promise<void> => {
  await SecureStore.setItemAsync(EMPLOYEE_SESSION_STORAGE_KEY, JSON.stringify(session));
};

export const clearEmployeeSession = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(EMPLOYEE_SESSION_STORAGE_KEY);
};

export const restoreEmployeeSession = async (): Promise<Session | null> => {
  const persistedSession = await SecureStore.getItemAsync(EMPLOYEE_SESSION_STORAGE_KEY);

  if (!persistedSession) {
    return null;
  }

  try {
    return JSON.parse(persistedSession) as Session;
  } catch {
    await clearEmployeeSession();
    return null;
  }
};
