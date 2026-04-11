'use client';

import { EmptyState, ErrorState } from '@rh-ponto/ui';

import { DetailPageSkeleton } from '@/shared/components/page-skeletons';
import { getActionErrorMessage } from '@/shared/lib/mutation-feedback';
import { useEmployeeDetail } from '../hooks/use-employee-detail';
import { EmployeeForm } from './employee-form';

export const EmployeeEditView = ({ employeeId }: { employeeId: string }) => {
  const { data, error, isError, isLoading, refetch } = useEmployeeDetail(employeeId);

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Não foi possível carregar o colaborador"
        description={getActionErrorMessage(error, 'Tente novamente para abrir o cadastro para edição.')}
        actionLabel="Tentar novamente"
        onAction={() => {
          void refetch();
        }}
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        title="Funcionário não encontrado"
        description="Não foi possível localizar o cadastro para edição na base atual."
      />
    );
  }

  return <EmployeeForm employee={data} mode="edit" />;
};
