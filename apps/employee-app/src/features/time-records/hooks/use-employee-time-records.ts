import { useQuery } from '@tanstack/react-query';

import { getEmployeeAppServices } from '@/shared/lib/service-registry';

import {
  calculateWorkedMinutes,
  getRecordsForDay,
  resolveNextTimeRecordType,
  sortTimeRecordsNewestFirst,
} from '../lib/time-record-mobile';

export const useEmployeeTimeRecords = (employeeId?: string | null) => {
  const timeRecordsQuery = useQuery({
    queryKey: ['employee-app', 'time-records', employeeId],
    enabled: Boolean(employeeId),
    queryFn: async () => getEmployeeAppServices().timeRecords.listEmployeeTimeRecordsUseCase.execute(employeeId!),
  });

  const records = sortTimeRecordsNewestFirst(timeRecordsQuery.data ?? []);
  const todayRecords = getRecordsForDay(records);
  const lastRecord = records[0] ?? null;
  const workedMinutesToday = calculateWorkedMinutes(records);
  const nextRecordType = resolveNextTimeRecordType(records);

  return {
    timeRecordsQuery,
    records,
    todayRecords,
    lastRecord,
    workedMinutesToday,
    nextRecordType,
  };
};
