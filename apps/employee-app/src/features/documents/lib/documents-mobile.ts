import type { EmployeeDocumentItem, PayrollStatementItem } from '@/shared/lib/employee-self-service-api';

export const documentCategoryLabels: Record<string, string> = {
  contract: 'Contrato',
  policy: 'Política',
  receipt: 'Comprovante',
  onboarding: 'Onboarding',
};

export const documentStatusLabels: Record<string, string> = {
  available: 'Disponível',
  pending_signature: 'Aguardando ciência',
  archived: 'Arquivado',
};

export const payrollStatusLabels: Record<string, string> = {
  available: 'Disponível',
  processing: 'Processando',
};

export const formatDocumentDate = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date(value))
    : 'Não informado';

export const formatMoney = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

export const buildDocumentEyebrow = (item: EmployeeDocumentItem) =>
  `${documentCategoryLabels[item.category] ?? 'Documento'} · ${formatDocumentDate(item.issuedAt)}`;

export const buildPayrollEyebrow = (item: PayrollStatementItem) =>
  `${item.referenceLabel} · emitido em ${formatDocumentDate(item.issuedAt)}`;
