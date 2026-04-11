import type {
  OnboardingTaskCreateSchema,
  OnboardingTaskStatusSchema,
} from '@rh-ponto/validations';

import type {
  OnboardingJourneyDetailData,
  OnboardingOverviewData,
} from './onboarding-contracts';

const handleJsonResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;

    throw new Error(payload?.message ?? 'Não foi possível concluir a operação.');
  }

  return (await response.json()) as T;
};

export const fetchOnboardingOverview = async (): Promise<OnboardingOverviewData> => {
  const response = await fetch('/api/admin/onboarding', {
    credentials: 'include',
  });

  return handleJsonResponse<{ data: OnboardingOverviewData }>(response).then((payload) => payload.data);
};

export const fetchOnboardingJourneyDetail = async (
  journeyId: string,
): Promise<OnboardingJourneyDetailData> => {
  const response = await fetch(`/api/admin/onboarding/${journeyId}`, {
    credentials: 'include',
  });

  return handleJsonResponse<{ data: OnboardingJourneyDetailData }>(response).then((payload) => payload.data);
};

export const createOnboardingTask = async (
  journeyId: string,
  payload: OnboardingTaskCreateSchema,
): Promise<OnboardingJourneyDetailData> => {
  const response = await fetch(`/api/admin/onboarding/${journeyId}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  return handleJsonResponse<{ data: OnboardingJourneyDetailData }>(response).then((payload) => payload.data);
};

export const updateOnboardingTaskStatus = async (
  journeyId: string,
  taskId: string,
  payload: OnboardingTaskStatusSchema,
): Promise<OnboardingJourneyDetailData> => {
  const response = await fetch(`/api/admin/onboarding/${journeyId}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  return handleJsonResponse<{ data: OnboardingJourneyDetailData }>(response).then((payload) => payload.data);
};
