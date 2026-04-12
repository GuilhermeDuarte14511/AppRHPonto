import { useQuery } from '@tanstack/react-query';

import { useCurrentEmployee } from '@/features/employee/hooks/use-current-employee';
import { getEmployeeAppServices } from '@/shared/lib/service-registry';
import { useAppSession } from '@/shared/providers/app-providers';

import { useEmployeeTimeRecords } from './use-employee-time-records';

export const useTimeRecordDetail = (recordId?: string | null) => {
  const { session } = useAppSession();
  const { employee, scenario } = useCurrentEmployee(session);
  const employeeId = employee?.id ?? scenario?.employeeId ?? null;
  const { records, timeRecordsQuery } = useEmployeeTimeRecords(employeeId);

  const record = recordId ? records.find((item) => item.id === recordId) ?? null : null;

  const photosQuery = useQuery({
    queryKey: ['employee-app', 'time-record-photos', recordId],
    enabled: Boolean(recordId),
    queryFn: async () => getEmployeeAppServices().timeRecords.listTimeRecordPhotosByRecordUseCase.execute(recordId!),
  });

  return {
    employeeId,
    record,
    records,
    timeRecordsQuery,
    photosQuery,
  };
};
