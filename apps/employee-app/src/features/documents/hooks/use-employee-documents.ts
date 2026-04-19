import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  acknowledgeEmployeeDocumentForEmployee,
  fetchEmployeeDocumentByIdForEmployee,
  fetchEmployeeDocuments,
  fetchPayrollStatementByIdForEmployee,
  fetchPayrollStatements,
} from '../../../shared/lib/employee-self-service-api';

const employeeDocumentsKey = (employeeId: string | null) => ['employee-app', 'documents', employeeId] as const;

const employeeDocumentDetailKey = (employeeId?: string | null, documentId?: string | null) =>
  ['employee-app', 'documents', 'detail', employeeId, documentId] as const;

export const useEmployeeDocuments = (employeeId: string | null) =>
  useQuery({
    queryKey: employeeDocumentsKey(employeeId),
    enabled: Boolean(employeeId),
    queryFn: () => fetchEmployeeDocuments(employeeId as string),
  });

export const useEmployeeDocumentDetail = (documentId?: string | null, employeeId?: string | null) =>
  useQuery({
    queryKey: employeeDocumentDetailKey(employeeId, documentId),
    enabled: Boolean(documentId && employeeId),
    queryFn: () => fetchEmployeeDocumentByIdForEmployee(documentId as string, employeeId as string),
  });

export const useAcknowledgeEmployeeDocument = (employeeId?: string | null, documentId?: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () =>
      acknowledgeEmployeeDocumentForEmployee(documentId as string, employeeId as string),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: employeeDocumentsKey(employeeId ?? null) }),
        queryClient.invalidateQueries({ queryKey: employeeDocumentDetailKey(employeeId, documentId) }),
        queryClient.invalidateQueries({ queryKey: ['employee-app', 'notifications'] }),
      ]);
    },
  });
};

export const usePayrollStatements = (employeeId: string | null) =>
  useQuery({
    queryKey: ['employee-app', 'payroll', employeeId],
    enabled: Boolean(employeeId),
    queryFn: () => fetchPayrollStatements(employeeId as string),
  });

export const usePayrollStatementDetail = (statementId?: string | null, employeeId?: string | null) =>
  useQuery({
    queryKey: ['employee-app', 'payroll', 'detail', employeeId, statementId],
    enabled: Boolean(statementId && employeeId),
    queryFn: () => fetchPayrollStatementByIdForEmployee(statementId as string, employeeId as string),
  });
