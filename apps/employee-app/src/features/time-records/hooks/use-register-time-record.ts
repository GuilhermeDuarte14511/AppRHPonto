import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AttendanceCoordinates, AttendanceLocationEvaluationResult } from '@rh-ponto/attendance-policies';
import { AppError } from '@rh-ponto/core';
import { getBrowserFirebaseStorageClient } from '@rh-ponto/firebase';
import type { TimeRecord } from '@rh-ponto/time-records';
import type { TimeRecordType } from '@rh-ponto/types';

import { getEmployeeAppServices } from '@/shared/lib/service-registry';

interface RegisterTimeRecordInput {
  employeeId: string;
  recordedByUserId?: string | null;
  recordType: TimeRecordType;
  evaluation: AttendanceLocationEvaluationResult | null;
  coordinates: AttendanceCoordinates | null;
  resolvedAddress: string | null;
  photo?: { uri: string; type?: string; size?: number } | null;
}

const sortTimeRecordsNewestFirst = (records: TimeRecord[]) =>
  [...records].sort((left, right) => new Date(right.recordedAt).getTime() - new Date(left.recordedAt).getTime());

const mapEvaluationToStatus = (evaluation: AttendanceLocationEvaluationResult) => {
  if (evaluation.status === 'allowed') {
    return 'valid' as const;
  }

  if (evaluation.status === 'pending_review') {
    return 'pending_review' as const;
  }

  throw new AppError('EMPLOYEE_TIME_RECORD_BLOCKED', 'A política atual bloqueia essa marcação.');
};

const buildPunchNotes = (
  evaluation: AttendanceLocationEvaluationResult,
  resolvedAddress: string,
  coordinates: AttendanceCoordinates,
) => {
  const fragments = ['Registro feito pelo aplicativo do colaborador.'];

  if (evaluation.matchedLocation) {
    fragments.push(`Local validado: ${evaluation.matchedLocation.name}.`);
  } else if (evaluation.nearestAllowedLocation) {
    fragments.push(`Local autorizado mais próximo: ${evaluation.nearestAllowedLocation.name}.`);
  }

  fragments.push(`Endereço confirmado no envio: ${resolvedAddress}.`);
  fragments.push(
    `Coordenadas capturadas: ${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}.`,
  );

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

      if (!input.coordinates) {
        throw new AppError(
          'EMPLOYEE_TIME_RECORD_LOCATION_REQUIRED',
          'Só é possível registrar o ponto depois que a localização for confirmada.',
        );
      }

      if (!input.resolvedAddress) {
        throw new AppError(
          'EMPLOYEE_TIME_RECORD_ADDRESS_REQUIRED',
          'Só é possível registrar o ponto depois que o endereço da localização for identificado.',
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
        notes: buildPunchNotes(input.evaluation, input.resolvedAddress, input.coordinates),
        isManual: false,
        referenceRecordId: null,
        latitude: input.coordinates.latitude,
        longitude: input.coordinates.longitude,
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
        } catch (error) {
          console.warn('Failed to upload/attach photo', error);
        }
      }

      return record;
    },
    onSuccess: async (record, variables) => {
      queryClient.setQueryData<TimeRecord[] | undefined>(
        ['employee-app', 'time-records', variables.employeeId],
        (currentRecords) => {
          if (!currentRecords?.length) {
            return [record];
          }

          const nextRecords = currentRecords.some((currentRecord) => currentRecord.id === record.id)
            ? currentRecords.map((currentRecord) => (currentRecord.id === record.id ? record : currentRecord))
            : [record, ...currentRecords];

          return sortTimeRecordsNewestFirst(nextRecords);
        },
      );

      await queryClient.invalidateQueries({
        queryKey: ['employee-app', 'time-records', variables.employeeId],
      });
    },
  });
};
