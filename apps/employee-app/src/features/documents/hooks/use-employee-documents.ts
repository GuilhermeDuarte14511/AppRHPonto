import { useQuery } from '@tanstack/react-query';

import {
  fetchEmployeeDocumentById,
  fetchEmployeeDocuments,
  fetchPayrollStatementById,
  fetchPayrollStatements,
} from '@/shared/lib/employee-self-service-api';

export const useEmployeeDocuments = (employeeId: string | null) =>
  useQuery({
    queryKey: ['employee-app', 'documents', employeeId],
    enabled: Boolean(employeeId),
    queryFn: () => fetchEmployeeDocuments(employeeId as string),
  });

export const useEmployeeDocumentDetail = (documentId?: string | null) =>
  useQuery({
    queryKey: ['employee-app', 'documents', 'detail', documentId],
    enabled: Boolean(documentId),
    queryFn: () => fetchEmployeeDocumentById(documentId as string),
  });

export const usePayrollStatements = (employeeId: string | null) =>
  useQuery({
    queryKey: ['employee-app', 'payroll', employeeId],
    enabled: Boolean(employeeId),
    queryFn: () => fetchPayrollStatements(employeeId as string),
  });

export const usePayrollStatementDetail = (statementId?: string | null) =>
  useQuery({
    queryKey: ['employee-app', 'payroll', 'detail', statementId],
    enabled: Boolean(statementId),
    queryFn: () => fetchPayrollStatementById(statementId as string),
  });
