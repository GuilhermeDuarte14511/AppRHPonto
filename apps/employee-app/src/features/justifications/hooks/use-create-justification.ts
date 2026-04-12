import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateJustificationPayload, Justification } from '@rh-ponto/justifications';

import { getEmployeeAppServices } from '@/shared/lib/service-registry';

export const useCreateJustification = () => {
  const queryClient = useQueryClient();

  return useMutation<Justification, Error, CreateJustificationPayload>({
    mutationFn: async (payload) => getEmployeeAppServices().justifications.createJustificationUseCase.execute(payload),
    onSuccess: async (_justification, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['employee-app', 'justifications', variables.employeeId],
      });
    },
  });
};
