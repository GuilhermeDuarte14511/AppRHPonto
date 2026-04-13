import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getBrowserFirebaseStorageClient } from '@rh-ponto/firebase';

import { getEmployeeAppServices } from '@/shared/lib/service-registry';

interface AddJustificationAttachmentInput {
  justificationId: string;
  employeeId: string;
  uploadedByUserId?: string | null;
  file: {
    uri: string;
    name: string;
    mimeType?: string | null;
    size?: number | null;
  };
}

const sanitizeFileName = (value: string) => value.replace(/[^\w.-]+/g, '-').toLowerCase();

export const useAddJustificationAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddJustificationAttachmentInput) => {
      const storageClient = getBrowserFirebaseStorageClient();
      const response = await fetch(input.file.uri);
      const blob = await response.blob();
      const sanitizedName = sanitizeFileName(input.file.name);
      const path = `justifications/${input.employeeId}/${input.justificationId}/${Date.now()}-${sanitizedName}`;
      const fileUrl = await storageClient.uploadFile({
        path,
        file: blob,
        contentType: input.file.mimeType ?? blob.type ?? 'application/octet-stream',
      });

      return getEmployeeAppServices().justifications.addJustificationAttachmentUseCase.execute({
        justificationId: input.justificationId,
        fileName: input.file.name,
        fileUrl,
        contentType: input.file.mimeType ?? blob.type ?? null,
        fileSizeBytes: input.file.size ?? blob.size,
        uploadedByUserId: input.uploadedByUserId ?? null,
      });
    },
    onSuccess: async (_attachment, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['employee-app', 'justification-detail', variables.justificationId],
      });
      await queryClient.invalidateQueries({
        queryKey: ['employee-app', 'justification-attachments', variables.justificationId],
      });
    },
  });
};
