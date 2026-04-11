'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button, EmptyState, ErrorState, PageHeader } from '@rh-ponto/ui';

import { ActionConfirmationDialog } from '@/shared/components/action-confirmation-dialog';
import { DetailPageSkeleton } from '@/shared/components/page-skeletons';
import { formatRegistrationNumber } from '@/shared/lib/admin-formatters';
import { getActionErrorMessage } from '@/shared/lib/mutation-feedback';

import { EmployeeDetailTabs } from './employee-detail-tabs';
import { useDeactivateEmployee } from '../hooks/use-deactivate-employee';
import { useEmployeeDetail } from '../hooks/use-employee-detail';
import { useEmployeeOnboarding, useInitializeEmployeeOnboarding } from '../hooks/use-employee-onboarding';

export const EmployeeDetailView = ({ employeeId }: { employeeId: string }) => {
  const router = useRouter();
  const { data, error, isError, isLoading, refetch } = useEmployeeDetail(employeeId);
  const deactivateEmployee = useDeactivateEmployee();
  const employeeOnboarding = useEmployeeOnboarding(employeeId);
  const initializeEmployeeOnboarding = useInitializeEmployeeOnboarding(employeeId);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Não foi possível carregar a ficha do colaborador"
        description={getActionErrorMessage(error, 'Tente recarregar para consultar os dados do colaborador.')}
        actionLabel="Tentar novamente"
        onAction={() => {
          void refetch();
        }}
      />
    );
  }

  if (!data) {
    return <EmptyState title="Funcionário não encontrado" description="Não encontramos essa ficha. Volte para a listagem e escolha outro colaborador." />;
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      <PageHeader
        eyebrow="Funcionários / Detalhe"
        title={data.fullName}
        description={`Matrícula ${formatRegistrationNumber(data.registrationNumber)} - ${data.department ?? 'Departamento pendente'}`}
        actions={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="outline">
              <Link href={`/employees/${data.id}/edit`}>Editar cadastro</Link>
            </Button>
            {employeeOnboarding.data?.journeyId ? (
              <Button asChild size="lg" variant="outline">
                <Link href={`/onboarding/${employeeOnboarding.data.journeyId}`}>
                  Abrir onboarding
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button
                disabled={employeeOnboarding.isLoading || initializeEmployeeOnboarding.isPending}
                size="lg"
                onClick={async () => {
                  const snapshot = await initializeEmployeeOnboarding.mutateAsync();

                  toast.success('Onboarding inicial criado com sucesso.');

                  if (snapshot.journeyId) {
                    router.push(`/onboarding/${snapshot.journeyId}`);
                  }
                }}
              >
                <Sparkles className="h-4 w-4" />
                {initializeEmployeeOnboarding.isPending ? 'Iniciando onboarding...' : 'Iniciar onboarding'}
              </Button>
            )}
            {data.isActive ? (
              <Button
                disabled={deactivateEmployee.isPending}
                size="lg"
                variant="destructive"
                onClick={() => setIsDeactivateDialogOpen(true)}
              >
                {deactivateEmployee.isPending ? 'Desativando...' : 'Desativar'}
              </Button>
            ) : null}
            <Button asChild size="lg" variant="outline">
              <Link href="/employees">Voltar para listagem</Link>
            </Button>
          </div>
        }
      />

      <EmployeeDetailTabs employee={data} employeeId={employeeId} />

      <ActionConfirmationDialog
        confirmLabel="Desativar colaborador"
        confirmVariant="destructive"
        description="Confirme a desativação do cadastro. O colaborador deixa de aparecer nos fluxos operacionais ativos do painel."
        isPending={deactivateEmployee.isPending}
        onConfirm={async () => {
          await deactivateEmployee.mutateAsync(data.id);
          toast.success('Funcionário desativado com sucesso.');
        }}
        onOpenChange={setIsDeactivateDialogOpen}
        open={isDeactivateDialogOpen}
        summary={[
          { label: 'Colaborador', value: data.fullName },
          { label: 'Matrícula', value: formatRegistrationNumber(data.registrationNumber) },
          { label: 'Departamento', value: data.department ?? 'Sem departamento' },
          { label: 'Cargo', value: data.position ?? 'Cargo não informado' },
        ]}
        title="Desativar colaborador"
      />
    </div>
  );
};
