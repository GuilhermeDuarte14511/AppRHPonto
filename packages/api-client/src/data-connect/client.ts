import { connectDataConnectEmulator, getDataConnect, type DataConnect } from 'firebase/data-connect';

import { parseFirebaseEnv } from '@rh-ponto/config';
import { getFirebaseApp } from '@rh-ponto/firebase';

import { connectorConfig } from './generated';

let dataConnectInstance: DataConnect | null = null;
let emulatorAttached = false;
const defaultEnvInput: unknown =
  typeof globalThis === 'object' && 'process' in globalThis
    ? (globalThis as { process?: { env?: unknown } }).process?.env
    : undefined;

const resolveEmulatorConfig = (envInput: unknown) => {
  const inputEnv =
    envInput && typeof envInput === 'object' ? (envInput as Record<string, unknown>) : {};
  const env = parseFirebaseEnv({
    ...inputEnv,
    NEXT_PUBLIC_FIREBASE_DATA_CONNECT_EMULATOR_HOST: process.env.NEXT_PUBLIC_FIREBASE_DATA_CONNECT_EMULATOR_HOST,
    NEXT_PUBLIC_FIREBASE_DATA_CONNECT_EMULATOR_PORT: process.env.NEXT_PUBLIC_FIREBASE_DATA_CONNECT_EMULATOR_PORT
      ? Number(process.env.NEXT_PUBLIC_FIREBASE_DATA_CONNECT_EMULATOR_PORT)
      : undefined,
    EXPO_PUBLIC_FIREBASE_DATA_CONNECT_EMULATOR_HOST: process.env.EXPO_PUBLIC_FIREBASE_DATA_CONNECT_EMULATOR_HOST,
    EXPO_PUBLIC_FIREBASE_DATA_CONNECT_EMULATOR_PORT: process.env.EXPO_PUBLIC_FIREBASE_DATA_CONNECT_EMULATOR_PORT
      ? Number(process.env.EXPO_PUBLIC_FIREBASE_DATA_CONNECT_EMULATOR_PORT)
      : undefined,
  });

  const host =
    env.NEXT_PUBLIC_FIREBASE_DATA_CONNECT_EMULATOR_HOST ?? env.EXPO_PUBLIC_FIREBASE_DATA_CONNECT_EMULATOR_HOST;
  const port =
    env.NEXT_PUBLIC_FIREBASE_DATA_CONNECT_EMULATOR_PORT ?? env.EXPO_PUBLIC_FIREBASE_DATA_CONNECT_EMULATOR_PORT;

  if (!host || !port) {
    return null;
  }

  return {
    host,
    port,
  };
};

export const getAppDataConnect = (envInput: unknown = defaultEnvInput): DataConnect => {
  if (dataConnectInstance) {
    return dataConnectInstance;
  }

  getFirebaseApp(envInput);

  dataConnectInstance = getDataConnect(connectorConfig);

  const emulatorConfig = resolveEmulatorConfig(envInput);

  if (emulatorConfig && !emulatorAttached) {
    connectDataConnectEmulator(dataConnectInstance, emulatorConfig.host, emulatorConfig.port);
    emulatorAttached = true;
  }

  return dataConnectInstance;
};

export const resetAppDataConnect = (): void => {
  dataConnectInstance = null;
  emulatorAttached = false;
};
