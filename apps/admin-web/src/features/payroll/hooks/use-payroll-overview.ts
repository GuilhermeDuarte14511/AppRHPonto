'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@rh-ponto/api-client';

import { useAdminQueryGate } from '@/shared/hooks/use-admin-query-gate';
import { showActionErrorToast } from '@/shared/lib/mutation-feedback';
import { useSession } from '@/shared/providers/session-provider';

import {
  closePayrollCycle,
  getPayrollOverview,
  getPayrollRecordDetail,
  type PayrollRecordDetail,
  validateAllPayrollRecords,
  validatePayrollRecord,
} from '../lib/payroll-data-source';

export const usePayrollOverview = () => {
  const { enabled } = useAdminQueryGate();

  return useQuery({
    queryKey: queryKeys.payroll,
    queryFn: getPayrollOverview,
    enabled,
  });
};

export const usePayrollRecordDetail = (id: string) => {
  const { enabled } = useAdminQueryGate();

  return useQuery({
    queryKey: queryKeys.payrollDetail(id),
    queryFn: () => getPayrollRecordDetail(id),
    enabled: enabled && Boolean(id),
  });
};

const invalidatePayrollQueries = async (queryClient: ReturnType<typeof useQueryClient>, recordId?: string) => {
  await queryClient.invalidateQueries({ queryKey: queryKeys.payroll });

  if (recordId) {
    await queryClient.invalidateQueries({ queryKey: queryKeys.payrollDetail(recordId) });
  }
};

export const useValidateAllPayrollRecords = () => {
  const queryClient = useQueryClient();
  const { session } = useSession();

  return useMutation({
    mutationFn: (notes?: string) => validateAllPayrollRecords(notes, session?.user.id),
    onSuccess: async () => {
      await invalidatePayrollQueries(queryClient);
    },
    onError: (error) => {
      showActionErrorToast(error, 'Não foi possível validar todos os espelhos.');
    },
  });
};

export const useClosePayrollCycle = () => {
  const queryClient = useQueryClient();
  const { session } = useSession();

  return useMutation({
    mutationFn: (notes?: string) => closePayrollCycle(notes, session?.user.id),
    onSuccess: async () => {
      await invalidatePayrollQueries(queryClient);
    },
    onError: (error) => {
      showActionErrorToast(error, 'Não foi possível fechar a folha deste período.');
    },
  });
};

export const useValidatePayrollRecord = () => {
  const queryClient = useQueryClient();
  const { session } = useSession();

  return useMutation({
    mutationFn: (recordId: string) => validatePayrollRecord(recordId, session?.user.id),
    onSuccess: async (_data: PayrollRecordDetail | null, recordId) => {
      await invalidatePayrollQueries(queryClient, recordId);
    },
    onError: (error) => {
      showActionErrorToast(error, 'Não foi possível validar este espelho de ponto.');
    },
  });
};
