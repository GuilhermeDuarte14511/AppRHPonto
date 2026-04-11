'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@rh-ponto/api-client';

import { useAdminQueryGate } from '@/shared/hooks/use-admin-query-gate';
import { services } from '@/shared/lib/service-registry';

export const useTimeRecords = () => {
  const { enabled } = useAdminQueryGate();

  return useQuery({
    queryKey: queryKeys.timeRecords,
    queryFn: async () => {
      const [records, employees] = await Promise.all([
        services.timeRecords.listTimeRecordsUseCase.execute(),
        services.employees.listEmployeesUseCase.execute(),
      ]);

      const employeeMap = new Map(employees.map((employee) => [employee.id, employee]));

      const recordsWithPhotos = await Promise.all(
        records.map(async (record) => ({
          ...record,
          employeeName: employeeMap.get(record.employeeId)?.fullName ?? 'Colaborador sem cadastro',
          department: employeeMap.get(record.employeeId)?.department ?? 'Sem departamento',
          photos: await services.timeRecords.listTimeRecordPhotosByRecordUseCase.execute(record.id),
        })),
      );

      return recordsWithPhotos;
    },
    enabled,
  });
};
