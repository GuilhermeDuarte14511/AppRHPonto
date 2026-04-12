'use client';

import { useQuery } from '@tanstack/react-query';

import { evaluateAttendanceLocation, type AttendanceCoordinates } from '@rh-ponto/attendance-policies';

import { getEmployeeAppServices } from '@/shared/lib/service-registry';

export const useEmployeeAttendancePolicy = (employeeId?: string | null, coordinates?: AttendanceCoordinates | null) => {
  const policyQuery = useQuery({
    queryKey: ['employee-app', 'attendance-policy', employeeId],
    enabled: Boolean(employeeId),
    queryFn: async () => getEmployeeAppServices().attendance.getEmployeeAttendancePolicyUseCase.execute(employeeId!),
  });

  const effectivePolicy =
    policyQuery.data?.policyCatalog.find((item) => item.id === policyQuery.data?.policyAssignment?.attendancePolicyId) ?? null;

  const evaluation =
    effectivePolicy && policyQuery.data
      ? evaluateAttendanceLocation({
          policy: effectivePolicy,
          policyAssignment: policyQuery.data.policyAssignment,
          allowedLocations: policyQuery.data.allowedLocations,
          locationCatalog: policyQuery.data.locationCatalog,
          coordinates: coordinates ?? null,
        })
      : null;

  return {
    policyQuery,
    effectivePolicy,
    evaluation,
  };
};
