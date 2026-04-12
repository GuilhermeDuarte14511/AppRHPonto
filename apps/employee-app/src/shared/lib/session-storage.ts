import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { Session } from '@rh-ponto/auth';

const EMPLOYEE_SESSION_STORAGE_KEY = 'rh-ponto-employee-session';

export const persistEmployeeSession = async (session: Session): Promise<void> => {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(EMPLOYEE_SESSION_STORAGE_KEY, JSON.stringify(session));
    }
  } else {
    await SecureStore.setItemAsync(EMPLOYEE_SESSION_STORAGE_KEY, JSON.stringify(session));
  }
};

export const clearEmployeeSession = async (): Promise<void> => {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(EMPLOYEE_SESSION_STORAGE_KEY);
    }
  } else {
    await SecureStore.deleteItemAsync(EMPLOYEE_SESSION_STORAGE_KEY);
  }
};

export const restoreEmployeeSession = async (): Promise<Session | null> => {
  let persistedSession: string | null = null;
  
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') {
      persistedSession = localStorage.getItem(EMPLOYEE_SESSION_STORAGE_KEY);
    }
  } else {
    persistedSession = await SecureStore.getItemAsync(EMPLOYEE_SESSION_STORAGE_KEY);
  }

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
