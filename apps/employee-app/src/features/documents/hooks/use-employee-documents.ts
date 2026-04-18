import { useQuery } from '@tanstack/react-query';

import {
  fetchEmployeeDocumentByIdForEmployee,
  fetchEmployeeDocuments,
  fetchPayrollStatementByIdForEmployee,
  fetchPayrollStatements,
} from '../../../shared/lib/employee-self-service-api';

export const useEmployeeDocuments = (employeeId: string | null) =>
  useQuery({
    queryKey: ['employee-app', 'documents', employeeId],
    enabled: Boolean(employeeId),
    queryFn: () => fetchEmployeeDocuments(employeeId as string),
  });

export const useEmployeeDocumentDetail = (documentId?: string | null, employeeId?: string | null) =>
  useQuery({
    queryKey: ['employee-app', 'documents', 'detail', employeeId, documentId],
    enabled: Boolean(documentId && employeeId),
    queryFn: () => fetchEmployeeDocumentByIdForEmployee(documentId as string, employeeId as string),
  });

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
