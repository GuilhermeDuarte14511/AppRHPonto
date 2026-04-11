import { EmployeeDetailView } from '@/features/employees/components/employee-detail-view';

const EmployeeDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <EmployeeDetailView employeeId={id} />;
};

export default EmployeeDetailPage;
