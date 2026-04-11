import { PayrollRecordDetailView } from '@/features/payroll/components/payroll-record-detail-view';

const PayrollDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <PayrollRecordDetailView payrollId={id} />;
};

export default PayrollDetailPage;
