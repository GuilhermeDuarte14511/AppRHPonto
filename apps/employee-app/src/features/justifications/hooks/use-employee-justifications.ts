import { useQuery } from '@tanstack/react-query';

import { useCurrentEmployee } from '@/features/employee/hooks/use-current-employee';
import { getEmployeeAppServices } from '@/shared/lib/service-registry';
import { useAppSession } from '@/shared/providers/app-providers';

import { filterJustificationsByStatus, sortJustificationsNewestFirst } from '../lib/justification-mobile';

export const useEmployeeJustifications = (statusFilter: 'all' | 'pending' | 'approved' | 'rejected' = 'all') => {
  const { session } = useAppSession();
  const { employee, scenario } = useCurrentEmployee(session);
  const employeeId = employee?.id ?? scenario?.employeeId ?? null;

  const justificationsQuery = useQuery({
    queryKey: ['employee-app', 'justifications', employeeId],
    enabled: Boolean(employeeId),
    queryFn: async () => getEmployeeAppServices().justifications.listJustificationsByEmployeeUseCase.execute(employeeId!),
  });

  const allJustifications = sortJustificationsNewestFirst(justificationsQuery.data ?? []);
  const justifications = filterJustificationsByStatus(allJustifications, statusFilter);

  return {
    employeeId,
    justificationsQuery,
    allJustifications,
    justifications,
  };
};
