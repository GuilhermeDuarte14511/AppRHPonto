'use client';

import { useQuery } from '@tanstack/react-query';

import { evaluateAttendanceLocation, type AttendanceCoordinates } from '@rh-ponto/attendance-policies';

import { getEmployeeAppServices } from '@/shared/lib/service-registry';

import { resolveEmployeeAttendanceScenario } from '../lib/employee-attendance-scenarios';

export const useEmployeeAttendancePolicy = (email?: string | null, coordinates?: AttendanceCoordinates | null) => {
  const scenario = resolveEmployeeAttendanceScenario(email);

  const policyQuery = useQuery({
    queryKey: ['employee-attendance-policy', scenario?.employeeId],
    enabled: Boolean(scenario?.employeeId),
    queryFn: async () => getEmployeeAppServices().attendance.getEmployeeAttendancePolicyUseCase.execute(scenario!.employeeId),
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
    scenario,
    policyQuery,
    effectivePolicy,
    evaluation,
  };
};
