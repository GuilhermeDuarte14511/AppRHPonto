'use client';

import { PencilLine, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import type { Department } from '@rh-ponto/departments';
import { Badge, Button, Card, DataTable, ErrorState, PageHeader } from '@rh-ponto/ui';

import { ActionConfirmationDialog } from '@/shared/components/action-confirmation-dialog';
import { TablePageSkeleton } from '@/shared/components/page-skeletons';
import { getActionErrorMessage } from '@/shared/lib/mutation-feedback';
import { StatCard } from '@/shared/components/stat-card';

import { DepartmentFormDialog } from './department-form-dialog';
import { useDepartments } from '../hooks/use-departments';
import { useDeleteDepartment } from '../hooks/use-department-mutations';
import { useEmployees } from '@/features/employees/hooks/use-employees';

export const DepartmentListView = () => {
  const { data: departments, error: departmentsError, isError: isDepartmentsError, isLoading, refetch } = useDepartments();
  const {
    data: employees,
    error: employeesError,
    isError: isEmployeesError,
    isLoading: isEmployeesLoading,
  } = useEmployees();
  const deleteDepartment = useDeleteDepartment();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [deletingDepartment, setDeletingDepartment] = useState<Department | null>(null);

  const activeDepartments = useMemo(
    () => departments?.filter((department) => department.isActive).length ?? 0,
    [departments],
  );
  const inactiveDepartments = (departments?.length ?? 0) - activeDepartments;
  const allocatedEmployees = useMemo(
    () => departments?.reduce((total, department) => total + department.employeeCount, 0) ?? 0,
    [departments],
  );

  if (isLoading || isEmployeesLoading) {
    return <TablePageSkeleton />;
  }

  if (isDepartmentsError || isEmployeesError || !departments || !employees) {
    return (
      <ErrorState
        title="Não foi possível carregar os departamentos"
        description={getActionErrorMessage(
          departmentsError ?? employeesError,
          'Tente novamente para montar a estrutura organizacional do RH.',
        )}
        actionLabel="Tentar novamente"
        onAction={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      <PageHeader
        eyebrow="Estrutura / Departamentos"
        title="Gestão de departamentos"
        description="Organize a estrutura interna, mantenha responsáveis claros e distribua os vínculos de colaboradores em tempo real."
        actions={
          <Button size="lg" onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Novo departamento
          </Button>
        }
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard badge="Estrutura ativa" hint="Departamentos disponíveis para novos vínculos" label="Ativos" value={String(activeDepartments)} />
        <StatCard badge="Atenção" hint="Departamentos desativados no cadastro" label="Inativos" tone="danger" value={String(inactiveDepartments)} />
        <StatCard badge="Cobertura" hint="Total de colaboradores vinculados a centros ativos" label="Colaboradores alocados" tone="secondary" value={String(allocatedEmployees)} />
        <Card className="primary-gradient p-6 text-white">
          <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/78">
            Estrutura organizacional
          </p>
          <h3 className="mt-3 font-headline text-2xl font-extrabold">Centros consistentes para cadastro e folha.</h3>
          <p className="mt-2 text-sm text-white/82">
            O vínculo dos funcionários passa a usar departamentos reais no banco, sem texto solto.
          </p>
        </Card>
      </section>

      <section className="rounded-[1.75rem] bg-[var(--surface-container-low)] p-4 shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full bg-[var(--surface-container-lowest)] px-4 py-3 text-sm font-semibold text-[var(--on-surface)] shadow-[var(--shadow-card)]">
            Estrutura completa do RH
          </div>
          <div className="rounded-full bg-[var(--surface-container-lowest)] px-4 py-3 text-sm font-semibold text-[var(--on-surface)] shadow-[var(--shadow-card)]">
            {departments.length} departamentos sincronizados
          </div>
          <div className="w-full text-sm text-[var(--on-surface-variant)] lg:ml-auto lg:w-auto">
            Exclusões removem o vínculo atual dos colaboradores ligados ao departamento.
          </div>
        </div>
      </section>

      <DataTable
        columns={[
          { key: 'code', label: 'Código' },
          { key: 'name', label: 'Departamento' },
          {
            key: 'managerName',
            label: 'Responsável',
            render: (item) => item.managerName ?? 'Não definido',
          },
          {
            key: 'employeeCount',
            label: 'Colaboradores',
            render: (item) => String(item.employeeCount),
          },
          {
            key: 'costCenter',
            label: 'Centro de custo',
            render: (item) => item.costCenter ?? 'Não informado',
          },
          {
            key: 'isActive',
            label: 'Status',
            render: (item) => <Badge variant={item.isActive ? 'success' : 'danger'}>{item.isActive ? 'Ativo' : 'Inativo'}</Badge>,
          },
          {
            key: 'actions',
            label: 'Ações',
            cellClassName: 'text-right',
            headerClassName: 'text-right',
            render: (item) => (
              <div className="flex items-center justify-end gap-2">
                <Button className="h-9 w-9 rounded-full p-0" size="sm" variant="ghost" onClick={() => setEditingDepartment(item)}>
                  <PencilLine className="h-4 w-4" />
                </Button>
                <Button className="h-9 w-9 rounded-full p-0" size="sm" variant="ghost" onClick={() => setDeletingDepartment(item)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ),
          },
        ]}
        getRowKey={(item) => item.id}
        items={departments}
      />

      <DepartmentFormDialog managers={employees} onOpenChange={setIsCreateOpen} open={isCreateOpen} />
      <DepartmentFormDialog
        department={editingDepartment}
        managers={employees}
        onOpenChange={(open) => !open && setEditingDepartment(null)}
        open={editingDepartment != null}
      />

      <ActionConfirmationDialog
        confirmLabel="Excluir departamento"
        confirmVariant="destructive"
        description="Ao excluir o departamento, os colaboradores vinculados permanecem ativos, mas perdem esse vínculo organizacional até uma nova definição."
        isPending={deleteDepartment.isPending}
        onConfirm={async () => {
          if (!deletingDepartment) {
            return;
          }

          await deleteDepartment.mutateAsync(deletingDepartment.id);
          toast.success('Departamento excluído com sucesso.');
          setDeletingDepartment(null);
        }}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingDepartment(null);
          }
        }}
        open={deletingDepartment != null}
        summary={[
          { label: 'Código', value: deletingDepartment?.code ?? '-' },
          { label: 'Departamento', value: deletingDepartment?.name ?? '-' },
          { label: 'Responsável', value: deletingDepartment?.managerName ?? 'Não definido' },
          {
            label: 'Impacto imediato',
            value: deletingDepartment ? `${deletingDepartment.employeeCount} colaboradores sem vínculo` : '-',
          },
        ]}
        title="Excluir departamento"
      />
    </div>
  );
};
