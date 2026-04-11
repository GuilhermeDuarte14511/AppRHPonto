import { pdf } from '@react-pdf/renderer';

import { PayrollPdfDocument } from './payroll-pdf-document';
import { getPayrollRecordDetail, type PayrollRecordDetail } from './payroll-data-source';

export const getPayrollPdfHref = (payrollId: string) => `/payroll/${payrollId}/pdf`;

const openBlobInNewTab = (blob: Blob) => {
  const blobUrl = URL.createObjectURL(blob);
  const popup = window.open(blobUrl, '_blank', 'noopener,noreferrer');

  if (!popup) {
    window.location.href = blobUrl;
  }

  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
};

export const openPayrollPdfForRecord = async (record: PayrollRecordDetail) => {
  const document = PayrollPdfDocument({ record });
  const blob = await pdf(document).toBlob();

  openBlobInNewTab(blob);
};

export const openPayrollPdfById = async (payrollId: string) => {
  const record = await getPayrollRecordDetail(payrollId);

  if (!record) {
    throw new Error('Não foi possível localizar a folha solicitada.');
  }

  await openPayrollPdfForRecord(record);
};
