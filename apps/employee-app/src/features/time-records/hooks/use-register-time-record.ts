import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AppError } from '@rh-ponto/core';
import { getBrowserFirebaseStorageClient } from '@rh-ponto/firebase';
import type { TimeRecord } from '@rh-ponto/time-records';
import type { TimeRecordType } from '@rh-ponto/types';
import type { AttendanceCoordinates, AttendanceLocationEvaluationResult } from '@rh-ponto/attendance-policies';

import { getEmployeeAppServices } from '@/shared/lib/service-registry';

interface RegisterTimeRecordInput {
  employeeId: string;
  recordedByUserId?: string | null;
  recordType: TimeRecordType;
  evaluation: AttendanceLocationEvaluationResult | null;
  coordinates: AttendanceCoordinates | null;
  photo?: { uri: string; type?: string; size?: number } | null;
}

const mapEvaluationToStatus = (evaluation: AttendanceLocationEvaluationResult) => {
  if (evaluation.status === 'allowed') {
    return 'valid' as const;
  }

  if (evaluation.status === 'pending_review') {
    return 'pending_review' as const;
  }

  throw new AppError('EMPLOYEE_TIME_RECORD_BLOCKED', 'A política atual bloqueia essa marcação.');
};

const buildPunchNotes = (evaluation: AttendanceLocationEvaluationResult) => {
  const fragments = ['Registro feito pelo aplicativo do colaborador.'];

  if (evaluation.matchedLocation) {
    fragments.push(`Local validado: ${evaluation.matchedLocation.name}.`);
  } else if (evaluation.nearestAllowedLocation) {
    fragments.push(`Local autorizado mais próximo: ${evaluation.nearestAllowedLocation.name}.`);
  }

  if (evaluation.status !== 'allowed' || evaluation.reasonCode !== 'within_allowed_area') {
    fragments.push(evaluation.description);
  }

  if (evaluation.requiresPhoto) {
    fragments.push('A política atual sinaliza exigência de foto para auditoria.');
  }

  return fragments.join(' ');
};

export const useRegisterTimeRecord = () => {
  const queryClient = useQueryClient();

  return useMutation<TimeRecord, Error, RegisterTimeRecordInput>({
    mutationFn: async (input) => {
      if (!input.evaluation) {
        throw new AppError(
          'EMPLOYEE_TIME_RECORD_POLICY_UNAVAILABLE',
          'Ainda não foi possível validar sua política de marcação. Atualize a localização e tente novamente.',
        );
      }

      if (!input.evaluation.canSubmitPunch) {
        throw new AppError('EMPLOYEE_TIME_RECORD_BLOCKED', input.evaluation.description);
      }

      const record = await getEmployeeAppServices().timeRecords.createTimeRecordUseCase.execute({
        employeeId: input.employeeId,
        recordedByUserId: input.recordedByUserId ?? null,
        recordType: input.recordType,
        source: 'employee_app',
        status: mapEvaluationToStatus(input.evaluation),
        recordedAt: new Date().toISOString(),
        originalRecordedAt: null,
        notes: buildPunchNotes(input.evaluation),
        isManual: false,
        referenceRecordId: null,
        latitude: input.coordinates?.latitude ?? null,
        longitude: input.coordinates?.longitude ?? null,
        ipAddress: null,
      });

      if (input.photo) {
        const storageClient = getBrowserFirebaseStorageClient();
        const response = await fetch(input.photo.uri);
        const blob = await response.blob();
        
        const timestamp = Date.now();
        const extension = input.photo.uri.split('.').pop() || 'jpg';
        const path = `time-records/${input.employeeId}/${record.id}/snapshot-${timestamp}.${extension}`;
        
        try {
          const fileUrl = await storageClient.uploadFile({
            path,
            file: blob,
            contentType: blob.type || 'image/jpeg',
          });
          
          await getEmployeeAppServices().timeRecords.createTimeRecordPhotoUseCase.execute({
            timeRecordId: record.id,
            fileUrl,
            fileName: `snapshot-${timestamp}.${extension}`,
            contentType: blob.type || 'image/jpeg',
            fileSizeBytes: input.photo.size ?? blob.size,
            isPrimary: true,
          });
        } catch (e) {
            console.warn('Failed to upload/attach photo', e);
        }
      }

      return record;
    },
    onSuccess: async (_record, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['employee-app', 'time-records', variables.employeeId],
      });
    },
  });
};
