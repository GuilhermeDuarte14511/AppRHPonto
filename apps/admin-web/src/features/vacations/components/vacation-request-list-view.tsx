'use client';

import Link from 'next/link';
import { CalendarCheck2, CalendarClock, CircleOff, Eye, Filter, Plus, Download } from 'lucide-react';
import { useState } from 'react';

import { Button, Card, DataTable, ErrorState, PageHeader } from '@rh-ponto/ui';

import { TablePageSkeleton } from '@/shared/components/page-skeletons';
import { getActionErrorMessage } from '@/shared/lib/mutation-feedback';
import { StatCard } from '@/shared/components/stat-card';

import { useVacationRequests } from '../hooks/use-vacation-requests';
import { formatVacationPeriod } from '../lib/vacation-helpers';
import { CreateVacationRequestDialog } from './create-vacation-request-dialog';
import { VacationStatusBadge } from './vacation-status-badge';

export const VacationRequestListView = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { data, error, isError, isLoading, refetch } = useVacationRequests();

  if (isLoading) {
    return <TablePageSkeleton />;
  }

  if (isError || !data) {
    return (
      <ErrorState
        title="Não foi possível carregar as férias"
        description={getActionErrorMessage(error, 'Tente novamente para abrir a fila de solicitações de férias.')}
        actionLabel="Tentar novamente"
        onAction={() => {
          void refetch();
        }}
      />
    );
  }

  const pending = data.filter((item) => item.status === 'pending').length;
  const approved = data.filter((item) => item.status === 'approved').length;
  const rejected = data.filter((item) => item.status === 'rejected').length;
  const today = new Date('2026-04-03T12:00:00.000Z');
  const onLeave = data.filter((item) => {
    const startDate = new Date(item.startDate);
    const endDate = new Date(item.endDate);

    return item.status === 'approved' && startDate <= today && endDate >= today;
  }).length;
  const upcomingExpirations = data.filter((item) => item.availableDays <= 15).length;

  return (
    <div className="space-y-8 sm:space-y-10">
      <PageHeader
        eyebrow="Férias / Gestao anual"
        title="Gestao de férias"
        description="Controle e aprovação de solicitações anuais, com contexto de saldo, aceite e cobertura operacional."
        actions={
          <Button size="lg" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Nova solicitação
          </Button>
        }
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        <StatCard badge="Fila ativa" hint="Solicitações aguardando aprovação final do RH" icon={CalendarClock} label="Pendentes" tone="tertiary" value={String(pending)} />
        <StatCard badge="Planejado" hint="Pedidos aprovados e comunicados ao colaborador" icon={CalendarCheck2} label="Aprovadas" tone="secondary" value={String(approved)} />
        <StatCard badge="Controle" hint="Solicitações negadas por saldo ou indisponibilidade" icon={CircleOff} label="Reprovadas" tone="danger" value={String(rejected)} />
        <StatCard badge="Hoje" hint="Colaboradores atualmente em gozo de férias" icon={CalendarCheck2} label="Em gozo" value={String(onLeave)} />
        <StatCard badge="Atencao" hint="Pedidos com saldo baixo ou janela próxima de vencimento" icon={CalendarClock} label="Vencimentos" tone="danger" value={String(upcomingExpirations)} />
      </section>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] px-5 py-5 sm:px-8 sm:py-6">
          <div>
            <h3 className="font-headline text-xl font-extrabold text-[var(--on-surface)]">Solicitações recentes</h3>
            <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
              Acompanhe os pedidos mais recentes e avance nas decisões pendentes do período.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button className="w-full sm:w-auto" size="sm" variant="outline">
              <Filter className="h-4 w-4" />
              Filtrar
            </Button>
            <Button className="w-full sm:w-auto" size="sm" variant="outline">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        <DataTable
          className="rounded-none border-0 shadow-none"
          columns={[
            {
              key: 'employeeName',
              label: 'Funcionário',
              render: (item) => (
                <div className="space-y-1">
                  <p className="font-semibold text-[var(--on-surface)]">{item.employeeName}</p>
                  <p className="text-xs text-[var(--on-surface-variant)]">{item.employeeEmail}</p>
                </div>
              ),
            },
            { key: 'department', label: 'Departamento' },
            {
              key: 'period',
              label: 'Período',
              render: (item) => (
                <div className="space-y-1">
                  <p className="font-semibold text-[var(--on-surface)]">{formatVacationPeriod(item.startDate, item.endDate)}</p>
                  <p className="text-xs text-[var(--on-surface-variant)]">
                    {item.totalDays} dias corridos - saldo {item.availableDays} dias
                  </p>
                </div>
              ),
            },
            {
              key: 'status',
              label: 'Status',
              render: (item) => <VacationStatusBadge status={item.status} />,
            },
            {
              key: 'actions',
              label: 'Ações',
              headerClassName: 'text-right',
              cellClassName: 'text-right',
              render: (item) => (
                <Button asChild className="h-9 w-9 rounded-full p-0" size="sm" variant="ghost">
                  <Link href={`/vacations/${item.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              ),
            },
          ]}
          items={data}
          getRowKey={(item) => item.id}
        />
      </Card>

      <section className="grid gap-8 lg:grid-cols-2">
        <Card className="relative overflow-hidden p-5 sm:p-8">
          <div className="relative z-10">
            <h4 className="font-headline text-lg font-extrabold text-[var(--primary)]">Dica de gestao</h4>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--primary)]/80">
              O periodo entre dezembro e marco costuma concentrar os maiores pedidos de férias. Planeje escalas de reserva com antecedencia para evitar gargalos operacionais.
            </p>
          </div>
        </Card>

        <Card className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h4 className="font-headline text-lg font-extrabold text-[var(--on-surface)]">Próximo feriado nacional</h4>
            <p className="mt-2 text-sm text-[var(--on-surface-variant)]">Corpus Christi - 04 de junho de 2026</p>
          </div>
          <div className="text-right">
            <p className="font-headline text-4xl font-extrabold text-[var(--primary)]">62 dias</p>
            <p className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Para o evento</p>
          </div>
        </Card>
      </section>

      <CreateVacationRequestDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>
  );
};
