import * as SecureStore from 'expo-secure-store';

import type { Session } from '@rh-ponto/auth';

const KIOSK_SESSION_STORAGE_KEY = 'rh-ponto:kiosk-session';

export const persistKioskSession = async (session: Session): Promise<void> => {
  await SecureStore.setItemAsync(KIOSK_SESSION_STORAGE_KEY, JSON.stringify(session));
};

export const clearKioskSession = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(KIOSK_SESSION_STORAGE_KEY);
};

export const restoreKioskSession = async (): Promise<Session | null> => {
  const persistedSession = await SecureStore.getItemAsync(KIOSK_SESSION_STORAGE_KEY);

  if (!persistedSession) {
    return null;
  }

  try {
    return JSON.parse(persistedSession) as Session;
  } catch {
    await clearKioskSession();
    return null;
  }
};
