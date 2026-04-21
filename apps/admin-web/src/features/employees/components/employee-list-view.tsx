'use client';

import Link from 'next/link';
import { useDeferredValue, useMemo, useState } from 'react';
import {
  Building2,
  Eye,
  PencilLine,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  UserRoundMinus,
  UsersRound,
} from 'lucide-react';

import { Badge, Button, Card, DataTable, EmptyState, ErrorState, PageHeader } from '@rh-ponto/ui';

import { AppAvatar } from '@/shared/components/app-avatar';
import { TablePageSkeleton } from '@/shared/components/page-skeletons';
import { StatCard } from '@/shared/components/stat-card';
import {
  formatPhoneCompact,
  formatRegistrationNumber,
} from '@/shared/lib/admin-formatters';
import { getActionErrorMessage } from '@/shared/lib/mutation-feedback';

import { useEmployees } from '../hooks/use-employees';

type StatusFilter = 'todos' | 'ativos' | 'inativos';

export const EmployeeListView = () => {
  const { data, error, isError, isLoading, refetch } = useEmployees();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos');
  const deferredSearch = useDeferredValue(search);

  const employees = useMemo(() => data ?? [], [data]);
  const normalizedSearch = deferredSearch.trim().toLowerCase();

  const filteredEmployees = useMemo(
    () =>
      employees.filter((employee) => {
        const matchesStatus =
          statusFilter === 'todos' ||
          (statusFilter === 'ativos' ? employee.isActive : !employee.isActive);

        const matchesSearch =
          normalizedSearch.length === 0 ||
          [
            employee.fullName,
            employee.email,
            employee.department,
            employee.position,
            employee.registrationNumber,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(normalizedSearch);

        return matchesStatus && matchesSearch;
      }),
    [employees, normalizedSearch, statusFilter],
  );

  const stats = useMemo(() => {
    const activeEmployees = employees.filter((employee) => employee.isActive).length;
    const inactiveEmployees = employees.length - activeEmployees;
    const mappedDepartments = new Set(
      employees.map((employee) => employee.department).filter((department): department is string => Boolean(department)),
    );

    return {
      total: employees.length,
      active: activeEmployees,
      inactive: inactiveEmployees,
      departments: mappedDepartments.size,
    };
  }, [employees]);

  if (isLoading) {
    return <TablePageSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Não foi possível carregar a base de colaboradores"
        description={getActionErrorMessage(error, 'Revise a conexão com os dados e tente novamente.')}
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
        eyebrow="Funcionários / Operação"
        title="Base de colaboradores"
        description="Acompanhe a base ativa, revise vínculo organizacional e entre rapidamente no detalhe de cada ficha."
        actions={
          <Button asChild className="w-full sm:w-auto" size="lg">
            <Link href="/employees/new">
              <Plus className="h-4 w-4" />
              Novo funcionário
            </Link>
          </Button>
        }
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          badge="Base atual"
          hint="Cadastros disponíveis para operação administrativa."
          icon={UsersRound}
          label="Total de funcionários"
          value={String(stats.total)}
        />
        <StatCard
          badge="Operação"
          hint="Colaboradores ativos e aptos para jornada, férias e justificativas."
          icon={ShieldCheck}
          label="Funcionários ativos"
          tone="secondary"
          value={String(stats.active)}
        />
        <StatCard
          badge="Atenção"
          hint="Cadastros desativados que não entram no fluxo operacional diário."
          icon={UserRoundMinus}
          label="Funcionários inativos"
          tone="danger"
          value={String(stats.inactive)}
        />
        <StatCard
          badge="Estrutura"
          hint="Departamentos com colaboradores vinculados na base atual."
          icon={Building2}
          label="Departamentos"
          tone="tertiary"
          value={String(stats.departments)}
        />
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="p-5 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr_auto]">
            <label className="space-y-2">
              <span className="px-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                Buscar colaborador
              </span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--on-surface-variant)]" />
                <input
                  className="h-12 w-full rounded-[1rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_18%,transparent)] bg-[var(--surface-container-low)] pl-11 pr-4 text-sm text-[var(--on-surface)] outline-none transition focus:border-[var(--primary)]"
                  placeholder="Nome, e-mail, matrícula ou departamento"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </label>

            <label className="space-y-2">
              <span className="px-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                Status
              </span>
              <select
                className="h-12 w-full rounded-[1rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_18%,transparent)] bg-[var(--surface-container-low)] px-4 text-sm text-[var(--on-surface)] outline-none transition focus:border-[var(--primary)]"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
              >
                <option value="todos">Todos os cadastros</option>
                <option value="ativos">Somente ativos</option>
                <option value="inativos">Somente inativos</option>
              </select>
            </label>

            <div className="flex items-end">
              <Button
                className="h-12 w-full justify-center lg:w-auto"
                variant="ghost"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('todos');
                }}
              >
                Limpar filtros
              </Button>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden p-6 sm:p-7">
          <div className="absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--primary),transparent)] opacity-80" />
          <div className="flex items-start gap-4">
            <div className="rounded-[1.25rem] bg-[var(--primary-fixed)] p-3 text-[var(--primary)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="space-y-3">
              <div>
                <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
                  Leitura da base
                </p>
                <h3 className="mt-2 font-headline text-xl font-extrabold text-[var(--on-surface)]">
                  Painel pronto para triagem rápida
                </h3>
              </div>
              <p className="text-sm leading-7 text-[var(--on-surface-variant)]">
                A listagem foi organizada para o RH localizar cadastro, vínculo e status com menos rolagem e mais contexto por linha.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="info">Busca progressiva</Badge>
                <Badge variant="neutral">Leitura por contexto</Badge>
                <Badge variant="success">Acesso rápido ao detalhe</Badge>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {filteredEmployees.length === 0 ? (
        <EmptyState
          title="Nenhum colaborador encontrado"
          description="Nenhum cadastro combinou com os filtros atuais. Tente outro nome, matrícula, departamento ou status."
          actionLabel="Limpar filtros"
          onAction={() => {
            setSearch('');
            setStatusFilter('todos');
          }}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] px-5 py-5 sm:px-8 sm:py-6">
            <div>
              <h3 className="font-headline text-xl font-extrabold text-[var(--on-surface)]">
                Funcionários em operação
              </h3>
              <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                {filteredEmployees.length} registro(s) visível(is) conforme os filtros atuais.
              </p>
            </div>
            <Badge variant="neutral">
              {statusFilter === 'todos'
                ? 'Visão completa'
                : statusFilter === 'ativos'
                  ? 'Somente ativos'
                  : 'Somente inativos'}
            </Badge>
          </div>

          <DataTable
            className="rounded-none border-0 shadow-none"
            columns={[
              {
                key: 'fullName',
                label: 'Funcionário',
                render: (item) => (
                  <div className="flex items-center gap-4">
                    <AppAvatar name={item.fullName} email={item.email} />
                    <div className="min-w-0 space-y-1">
                      <p className="truncate font-semibold text-[var(--on-surface)]">{item.fullName}</p>
                      <p className="truncate text-xs text-[var(--on-surface-variant)]">
                        Matrícula {formatRegistrationNumber(item.registrationNumber)}
                      </p>
                    </div>
                  </div>
                ),
              },
              {
                key: 'department',
                label: 'Vínculo',
                render: (item) => (
                  <div className="space-y-1">
                    <p className="font-semibold text-[var(--on-surface)]">{item.department ?? 'Sem departamento'}</p>
                    <p className="text-xs text-[var(--on-surface-variant)]">{item.position ?? 'Cargo não informado'}</p>
                  </div>
                ),
              },
              {
                key: 'email',
                label: 'Contato',
                render: (item) => (
                  <div className="space-y-1">
                    <p className="text-sm text-[var(--on-surface)]">{item.email ?? 'E-mail não informado'}</p>
                    <p className="text-xs text-[var(--on-surface-variant)]">{formatPhoneCompact(item.phone)}</p>
                  </div>
                ),
              },
              {
                key: 'isActive',
                label: 'Status',
                render: (item) => (
                  <div className="space-y-2">
                    <Badge variant={item.isActive ? 'success' : 'neutral'}>
                      {item.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                    <p className="text-xs text-[var(--on-surface-variant)]">
                      {item.hireDate
                        ? `Admissão ${new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(item.hireDate))}`
                        : 'Admissão não informada'}
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
                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <Button asChild className="w-full sm:w-auto" size="sm" variant="outline">
                      <Link href={`/employees/${item.id}`}>
                        <Eye className="h-4 w-4" />
                        Ver ficha
                      </Link>
                    </Button>
                    <Button asChild className="h-9 w-full justify-center rounded-full p-0 sm:w-9" size="sm" variant="ghost">
                      <Link href={`/employees/${item.id}/edit`}>
                        <PencilLine className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ),
              },
            ]}
            emptyState="Nenhum colaborador combina com os filtros escolhidos."
            getRowKey={(item) => item.id}
            items={filteredEmployees}
          />
        </Card>
      )}
    </div>
  );
};
