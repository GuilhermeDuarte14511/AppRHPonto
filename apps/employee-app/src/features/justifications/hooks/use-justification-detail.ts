import { useQuery } from '@tanstack/react-query';

import { getEmployeeAppServices } from '@/shared/lib/service-registry';

export const useJustificationDetail = (justificationId?: string | null) => {
  const justificationQuery = useQuery({
    queryKey: ['employee-app', 'justification-detail', justificationId],
    enabled: Boolean(justificationId),
    queryFn: async () => getEmployeeAppServices().justifications.getJustificationByIdUseCase.execute(justificationId!),
  });

  const attachmentsQuery = useQuery({
    queryKey: ['employee-app', 'justification-attachments', justificationId],
    enabled: Boolean(justificationId),
    queryFn: async () =>
      getEmployeeAppServices().justifications.listJustificationAttachmentsByJustificationUseCase.execute(justificationId!),
  });

  return {
    justificationQuery,
    attachmentsQuery,
    justification: justificationQuery.data ?? null,
    attachments: attachmentsQuery.data ?? [],
  };
};
