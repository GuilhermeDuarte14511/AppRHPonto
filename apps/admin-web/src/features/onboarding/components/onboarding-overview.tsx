'use client';

import Link from 'next/link';
import { useDeferredValue, useMemo, useState } from 'react';
import {
  ArrowRight,
  ClipboardList,
  LaptopMinimal,
  Search,
  Signature,
  UserPlus,
  UsersRound,
} from 'lucide-react';

import { Button, Card, DataTable, EmptyState, ErrorState, PageHeader } from '@rh-ponto/ui';

import { TablePageSkeleton } from '@/shared/components/page-skeletons';
import { StatCard } from '@/shared/components/stat-card';
import { getActionErrorMessage } from '@/shared/lib/mutation-feedback';

import { useOnboardingOverview } from '../hooks/use-onboarding-overview';
import type { OnboardingJourneyStatus } from '../lib/onboarding-contracts';
import { OnboardingJourneyStatusBadge, OnboardingTaskStatusBadge } from './onboarding-status-badge';

export const OnboardingOverview = () => {
  const { data, error, isError, isLoading, refetch } = useOnboardingOverview();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | OnboardingJourneyStatus>('todos');
  const [departmentFilter, setDepartmentFilter] = useState('todos');
  const deferredSearch = useDeferredValue(search);
  const normalizedSearch = deferredSearch.trim().toLowerCase();

  const filteredItems = useMemo(
    () => {
      const items = data?.items ?? [];

      return items.filter((item) => {
        const matchesSearch =
          normalizedSearch.length === 0 ||
          [item.employeeName, item.employeeEmail, item.department, item.position, item.ownerName, item.currentStageLabel]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(normalizedSearch);

        const matchesStatus = statusFilter === 'todos' || item.status === statusFilter;
        const matchesDepartment = departmentFilter === 'todos' || item.department === departmentFilter;

        return matchesSearch && matchesStatus && matchesDepartment;
      });
    },
    [data?.items, departmentFilter, normalizedSearch, statusFilter],
  );

  if (isLoading) {
    return <TablePageSkeleton />;
  }

  if (isError || !data) {
    return (
      <ErrorState
        title="Não foi possível carregar o onboarding"
        description={getActionErrorMessage(error, 'Tente novamente para consultar as jornadas de admissão.')}
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
        eyebrow="Onboarding / Jornada"
        title="Monitoramento de onboarding"
        description="Acompanhe a admissão passo a passo, com visão consolidada das etapas críticas de documentação, acessos, equipamentos e assinatura."
        actions={
          <Button asChild className="w-full sm:w-auto" size="lg">
            <Link href="/employees/new">
              <UserPlus className="h-4 w-4" />
              Novo colaborador
            </Link>
          </Button>
        }
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          badge="Jornadas abertas"
          hint="Processos de integração atualmente acompanhados pelo RH."
          icon={UsersRound}
          label="Total em onboarding"
          value={String(data.metrics.total)}
        />
        <StatCard
          badge="Ação imediata"
          hint="Tarefas documentais ainda pendentes para liberar o fluxo."
          icon={ClipboardList}
          label="Documentos pendentes"
          tone="tertiary"
          value={String(data.metrics.pendingDocuments)}
        />
        <StatCard
          badge="Infraestrutura"
          hint="Jornadas com pendência de equipamento ou entrega patrimonial."
          icon={LaptopMinimal}
          label="Equipamentos"
          tone="secondary"
          value={String(data.metrics.pendingEquipment)}
        />
        <StatCard
          badge="Aceite"
          hint="Jornadas que ainda não concluíram assinatura ou termos formais."
          icon={Signature}
          label="Assinaturas"
          tone="danger"
          value={String(data.metrics.pendingSignatures)}
        />
      </section>

      <Card className="p-5 sm:p-6">
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr_0.8fr_auto]">
          <label className="space-y-2">
            <span className="px-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
              Buscar colaborador
            </span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--on-surface-variant)]" />
              <input
                className="h-12 w-full rounded-[1rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_18%,transparent)] bg-[var(--surface-container-low)] pl-11 pr-4 text-sm text-[var(--on-surface)] outline-none transition focus:border-[var(--primary)]"
                placeholder="Nome, e-mail, etapa atual ou responsável"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </label>

          <label className="space-y-2">
            <span className="px-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
              Departamento
            </span>
            <select
              className="h-12 w-full rounded-[1rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_18%,transparent)] bg-[var(--surface-container-low)] px-4 text-sm text-[var(--on-surface)] outline-none transition focus:border-[var(--primary)]"
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
            >
              <option value="todos">Todos os departamentos</option>
              {data.departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="px-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
              Status
            </span>
            <select
              className="h-12 w-full rounded-[1rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_18%,transparent)] bg-[var(--surface-container-low)] px-4 text-sm text-[var(--on-surface)] outline-none transition focus:border-[var(--primary)]"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as 'todos' | OnboardingJourneyStatus)}
            >
              <option value="todos">Todos os status</option>
              <option value="pending">Pendente</option>
              <option value="in_progress">Em andamento</option>
              <option value="blocked">Bloqueado</option>
              <option value="completed">Concluído</option>
            </select>
          </label>

          <div className="flex items-end">
            <Button
              className="h-12 w-full justify-center xl:w-auto"
              variant="ghost"
              onClick={() => {
                setSearch('');
                setDepartmentFilter('todos');
                setStatusFilter('todos');
              }}
            >
              Limpar filtros
            </Button>
          </div>
        </div>
      </Card>

      {filteredItems.length === 0 ? (
        <EmptyState
          title="Nenhuma jornada encontrada"
          description="Nenhuma jornada combinou com os filtros atuais. Ajuste a busca ou limpe os filtros para continuar."
          actionLabel="Limpar filtros"
          onAction={() => {
            setSearch('');
            setDepartmentFilter('todos');
            setStatusFilter('todos');
          }}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] px-5 py-5 sm:px-8 sm:py-6">
            <div>
              <h3 className="font-headline text-xl font-extrabold text-[var(--on-surface)]">Jornadas em acompanhamento</h3>
              <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                {filteredItems.length} jornada(s) em exibição conforme os filtros aplicados.
              </p>
            </div>
          </div>

          <DataTable
            className="rounded-none border-0 shadow-none"
            columns={[
              {
                key: 'employeeName',
                label: 'Colaborador',
                render: (item) => (
                  <div className="space-y-1">
                    <p className="font-semibold text-[var(--on-surface)]">{item.employeeName}</p>
                    <p className="text-xs text-[var(--on-surface-variant)]">
                      {item.employeeEmail ?? 'Sem e-mail'} · {item.position}
                    </p>
                  </div>
                ),
              },
              {
                key: 'department',
                label: 'Departamento',
                render: (item) => (
                  <div className="space-y-1">
                    <p className="font-semibold text-[var(--on-surface)]">{item.department}</p>
                    <p className="text-xs text-[var(--on-surface-variant)]">Responsável RH: {item.ownerName}</p>
                  </div>
                ),
              },
              {
                key: 'progressPercent',
                label: 'Progresso',
                render: (item) => (
                  <div className="min-w-[10rem] space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-[var(--on-surface-variant)]">
                      <span>{item.currentStageLabel}</span>
                      <span>{item.progressPercent}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-container-high)]">
                      <div className="primary-gradient h-full rounded-full" style={{ width: `${item.progressPercent}%` }} />
                    </div>
                  </div>
                ),
              },
              {
                key: 'categorySummaries',
                label: 'Etapas-chave',
                render: (item) => (
                  <div className="flex flex-wrap gap-2">
                    <OnboardingTaskStatusBadge status={item.categorySummaries.documentation.status} />
                    <OnboardingTaskStatusBadge status={item.categorySummaries.equipment.status} />
                    <OnboardingTaskStatusBadge status={item.categorySummaries.signature.status} />
                  </div>
                ),
              },
              {
                key: 'status',
                label: 'Status',
                render: (item) => (
                  <div className="space-y-2">
                    <OnboardingJourneyStatusBadge status={item.status} />
                    <p className="text-xs text-[var(--on-surface-variant)]">
                      Início {item.startDateLabel} · previsão {item.expectedEndDateLabel}
                    </p>
                  </div>
                ),
              },
              {
                key: 'actions',
                label: 'Ações',
                headerClassName: 'text-right',
                cellClassName: 'text-right',
                render: (item) => (
                  <Button asChild className="w-full sm:w-auto" size="sm" variant="outline">
                    <Link href={`/onboarding/${item.id}`}>
                      Abrir checklist
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ),
              },
            ]}
            getRowKey={(item) => item.id}
            items={filteredItems}
          />
        </Card>
      )}
    </div>
  );
};
