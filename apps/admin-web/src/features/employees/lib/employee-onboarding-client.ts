import type { EmployeeOnboardingSnapshot } from '@/features/onboarding/lib/onboarding-contracts';

const handleJsonResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;

    throw new Error(payload?.message ?? 'Não foi possível concluir a operação.');
  }

  return (await response.json()) as T;
};

export const fetchEmployeeOnboarding = async (employeeId: string): Promise<EmployeeOnboardingSnapshot> => {
  const response = await fetch(`/api/admin/employees/${employeeId}/onboarding`, {
    credentials: 'include',
  });

  return handleJsonResponse<{ data: EmployeeOnboardingSnapshot }>(response).then((payload) => payload.data);
};

export const initializeEmployeeOnboarding = async (employeeId: string): Promise<EmployeeOnboardingSnapshot> => {
  const response = await fetch(`/api/admin/employees/${employeeId}/onboarding`, {
    method: 'POST',
    credentials: 'include',
  });

  return handleJsonResponse<{ data: EmployeeOnboardingSnapshot }>(response).then((payload) => payload.data);
};
