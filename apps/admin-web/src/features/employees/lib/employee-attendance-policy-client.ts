import type { EmployeeAttendancePolicyFormSchema } from '@rh-ponto/validations';

import type { EmployeeAttendancePolicyViewData } from './employee-attendance-policy-contracts';

const handleJsonResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;

    throw new Error(payload?.message ?? 'Não foi possível concluir a operação.');
  }

  return (await response.json()) as T;
};

export const fetchEmployeeAttendancePolicy = async (employeeId: string): Promise<EmployeeAttendancePolicyViewData> => {
  const response = await fetch(`/api/admin/employees/${employeeId}/attendance-policy`, {
    credentials: 'include',
  });

  return handleJsonResponse<{ data: EmployeeAttendancePolicyViewData }>(response).then((payload) => payload.data);
};

export const updateEmployeeAttendancePolicy = async (
  employeeId: string,
  payload: EmployeeAttendancePolicyFormSchema,
): Promise<EmployeeAttendancePolicyViewData> => {
  const response = await fetch(`/api/admin/employees/${employeeId}/attendance-policy`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  return handleJsonResponse<{ data: EmployeeAttendancePolicyViewData }>(response).then((payload) => payload.data);
};
