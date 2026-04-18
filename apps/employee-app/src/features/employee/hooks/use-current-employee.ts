import { useQuery } from '@tanstack/react-query';
import type { Session } from '@rh-ponto/auth';

import { fetchCurrentEmployee } from '../../../shared/lib/employee-self-service-api';
import { useAppSession } from '../../../shared/providers/app-providers';

export const useCurrentEmployee = (sessionOverride?: Session | null) => {
  const appSession = useAppSession();
  const session = sessionOverride ?? appSession.session;

  const employeeQuery = useQuery({
    queryKey: ['employee-app', 'current-employee', session?.user.id, session?.user.email],
    enabled: Boolean(session?.user.id || session?.user.email),
    queryFn: () =>
      fetchCurrentEmployee({
        userId: session?.user.id,
        email: session?.user.email,
      }),
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
