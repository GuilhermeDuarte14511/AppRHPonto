import { initializeApp, getApps } from 'firebase-admin/app';
import { getDataConnect } from 'firebase-admin/data-connect';

import { AppError } from '@rh-ponto/core';

const DEFAULT_DATA_CONNECT_LOCATION = 'southamerica-east1';
const DEFAULT_DATA_CONNECT_SERVICE_ID = 'myrh-32b0a-service';

const getRequiredValue = (value: string | undefined, fallback: string): string => value?.trim() || fallback;

const getServerDataConnect = () => {
  if (getApps().length === 0) {
    initializeApp();
  }

  return getDataConnect({
    serviceId: getRequiredValue(process.env.FIREBASE_DATA_CONNECT_SERVICE_ID, DEFAULT_DATA_CONNECT_SERVICE_ID),
    location: getRequiredValue(process.env.FIREBASE_DATA_CONNECT_LOCATION, DEFAULT_DATA_CONNECT_LOCATION),
  });
};

export const executeAdminGraphql = async <T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> => {
  try {
    const response = await getServerDataConnect().executeGraphql(query, {
      variables,
    });

    if (!response.data) {
      throw new AppError('DATA_CONNECT_EMPTY_RESPONSE', 'O Data Connect não retornou dados válidos.');
    }

    return response.data as T;
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Não foi possível consultar o Data Connect.';

    throw new AppError('DATA_CONNECT_REQUEST_FAILED', message);
  }
};
