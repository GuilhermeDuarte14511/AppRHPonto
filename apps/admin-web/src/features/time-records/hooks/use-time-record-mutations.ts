'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@rh-ponto/api-client';
import type { AdjustTimeRecordPayload, CreateTimeRecordPayload, TimeRecord, TimeRecordPhoto } from '@rh-ponto/time-records';

import { showActionErrorToast } from '@/shared/lib/mutation-feedback';
import { services } from '@/shared/lib/service-registry';

type CachedTimeRecordListItem = TimeRecord & {
  employeeName: string;
  department: string;
  photos: TimeRecordPhoto[];
};

const sortTimeRecordsByRecordedAt = (records: CachedTimeRecordListItem[]) =>
  [...records].sort((left, right) => {
    const leftTimestamp = new Date(left.recordedAt).getTime();
    const rightTimestamp = new Date(right.recordedAt).getTime();

    return rightTimestamp - leftTimestamp;
  });

const synchronizeAdjustedTimeRecordCache = (
  queryClient: ReturnType<typeof useQueryClient>,
  updatedRecord: TimeRecord,
) => {
  queryClient.setQueryData<CachedTimeRecordListItem[] | undefined>(queryKeys.timeRecords, (currentRecords) => {
    if (!currentRecords?.length) {
      return currentRecords;
    }

    let hasMatch = false;

    const nextRecords = currentRecords.map((record) => {
      if (record.id !== updatedRecord.id) {
        return record;
      }

      hasMatch = true;

      return {
        ...record,
        ...updatedRecord,
      };
    });

    return hasMatch ? sortTimeRecordsByRecordedAt(nextRecords) : currentRecords;
  });
};

const invalidateTimeRecordQueries = async (queryClient: ReturnType<typeof useQueryClient>) => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.timeRecords }),
    queryClient.invalidateQueries({ queryKey: queryKeys.timeRecordCatalog }),
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard }),
    queryClient.invalidateQueries({ queryKey: queryKeys.audit }),
    queryClient.invalidateQueries({ queryKey: queryKeys.payroll }),
  ]);
};

export const useCreateTimeRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTimeRecordPayload) => services.timeRecords.createTimeRecordUseCase.execute(payload),
    onSuccess: async () => {
      await invalidateTimeRecordQueries(queryClient);
    },
    onError: (error) => {
      showActionErrorToast(error, 'Não foi possível criar a marcação.');
    },
  });
};

export const useAdjustTimeRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdjustTimeRecordPayload) => services.timeRecords.adjustTimeRecordUseCase.execute(payload),
    onSuccess: async (updatedRecord) => {
      synchronizeAdjustedTimeRecordCache(queryClient, updatedRecord);
      await invalidateTimeRecordQueries(queryClient);
    },
    onError: (error) => {
      showActionErrorToast(error, 'Não foi possível ajustar a marcação.');
    },
  });
};
