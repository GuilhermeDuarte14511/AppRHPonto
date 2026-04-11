import { EmployeeEditView } from '@/features/employees/components/employee-edit-view';

interface EmployeeEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EmployeeEditPage = async ({ params }: EmployeeEditPageProps) => {
  const { id } = await params;

  return <EmployeeEditView employeeId={id} />;
};

export default EmployeeEditPage;
