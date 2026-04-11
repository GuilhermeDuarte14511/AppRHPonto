import type { AdminSettingsFormSchema } from '@rh-ponto/validations';

import type { SettingsOverviewData } from './settings-contracts';

const handleJsonResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;

    throw new Error(payload?.message ?? 'Não foi possível concluir a operação.');
  }

  return (await response.json()) as T;
};

export const fetchSettingsOverview = async (): Promise<SettingsOverviewData> => {
  const response = await fetch('/api/admin/settings', {
    credentials: 'include',
  });

  return handleJsonResponse<{ data: SettingsOverviewData }>(response).then((payload) => payload.data);
};

export const updateSettingsOverview = async (payload: AdminSettingsFormSchema): Promise<SettingsOverviewData> => {
  const response = await fetch('/api/admin/settings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  return handleJsonResponse<{ data: SettingsOverviewData }>(response).then((result) => result.data);
};
