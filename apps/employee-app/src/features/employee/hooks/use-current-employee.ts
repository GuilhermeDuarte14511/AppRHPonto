import { useQuery } from '@tanstack/react-query';
import type { Session } from '@rh-ponto/auth';

import { getEmployeeAppServices } from '@/shared/lib/service-registry';
import { useAppSession } from '@/shared/providers/app-providers';

const normalizeEmail = (value?: string | null) => value?.trim().toLowerCase() ?? null;

export const useCurrentEmployee = (sessionOverride?: Session | null) => {
  const appSession = useAppSession();
  const session = sessionOverride ?? appSession.session;

  const employeeQuery = useQuery({
    queryKey: ['employee-app', 'current-employee', session?.user.id, session?.user.email],
    enabled: Boolean(session?.user.id || session?.user.email),
    queryFn: async () => {
      const employees = await getEmployeeAppServices().employees.listEmployeesUseCase.execute();
      const sessionEmail = normalizeEmail(session?.user.email);

      return (
        employees.find((employee) => employee.userId === session?.user.id) ??
        employees.find((employee) => normalizeEmail(employee.email) === sessionEmail) ??
        null
      );
    },
  });

  const employee = employeeQuery.data ?? null;

  return {
    employeeQuery,
    employee,
    identity: {
      employeeId: employee?.id ?? null,
      name: employee?.fullName ?? session?.user.name ?? 'Colaborador',
      registrationNumber: employee?.registrationNumber ?? '-',
      department: employee?.department ?? 'Não informado',
      roleLabel: employee?.position ?? 'Colaborador',
      email: employee?.email ?? session?.user.email ?? null,
      phone: employee?.phone ?? null,
      cpf: employee?.cpf ?? null,
    },
  };
};
