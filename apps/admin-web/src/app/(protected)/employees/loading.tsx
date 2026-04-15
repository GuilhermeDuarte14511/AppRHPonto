import { EmployeesListSkeleton } from '@/shared/components/page-skeletons';

/**
 * Employees Loading State
 * Exibido durante o carregamento da página de colaboradores
 */
export default function EmployeesLoading() {
  return <EmployeesListSkeleton />;
}