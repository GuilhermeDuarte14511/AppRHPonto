'use client';

import Link from 'next/link';
import { CalendarCheck2, CalendarClock, CircleOff, Eye, Filter, Plus, Download } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button, Card, DataTable, Dialog, DialogContent, ErrorState, PageHeader } from '@rh-ponto/ui';

import { TablePageSkeleton } from '@/shared/components/page-skeletons';
import { getActionErrorMessage } from '@/shared/lib/mutation-feedback';
import { StatCard } from '@/shared/components/stat-card';

import { useVacationRequests } from '../hooks/use-vacation-requests';
import { formatVacationPeriod } from '../lib/vacation-helpers';
import { CreateVacationRequestDialog } from './create-vacation-request-dialog';
import { VacationStatusBadge } from './vacation-status-badge';

type VacationListFilter = 'all' | 'pending' | 'approved' | 'rejected' | 'on_leave' | 'low_balance';

const longDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'long',
});

const shortDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const filterLabels: Record<VacationListFilter, string> = {
  all: 'Todos os pedidos',
  pending: 'Pendentes',
  approved: 'Aprovados',
  rejected: 'Reprovados',
  on_leave: 'Em gozo hoje',
  low_balance: 'Saldo crítico',
};

export const VacationRequestListView = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<VacationListFilter>('all');
  const { data, error, isError, isLoading, refetch } = useVacationRequests();
  const today = useMemo(() => new Date(), []);
  const requests = useMemo(() => data ?? [], [data]);
  const pending = requests.filter((item) => item.status === 'pending').length;
  const approved = requests.filter((item) => item.status === 'approved').length;
  const rejected = requests.filter((item) => item.status === 'rejected').length;
  const todayLabel = longDateFormatter.format(today);
  const onLeave = requests.filter((item) => {
    const startDate = new Date(item.startDate);
    const endDate = new Date(item.endDate);

    return item.status === 'approved' && startDate <= today && endDate >= today;
  }).length;
  const upcomingExpirations = requests.filter((item) => item.availableDays <= 15).length;
  const filteredRequests = useMemo(() => {
    if (selectedFilter === 'all') {
      return requests;
    }

    if (selectedFilter === 'on_leave') {
      return requests.filter((item) => {
        const startDate = new Date(item.startDate);
        const endDate = new Date(item.endDate);

        return item.status === 'approved' && startDate <= today && endDate >= today;
      });
    }

    if (selectedFilter === 'low_balance') {
      return requests.filter((item) => item.availableDays <= 15);
    }

    return requests.filter((item) => item.status === selectedFilter);
  }, [requests, selectedFilter, today]);
  const nextApprovedRequest = useMemo(
    () =>
      requests
        .filter((item) => item.status === 'approved' && new Date(item.startDate) >= today)
        .sort((left, right) => new Date(left.startDate).getTime() - new Date(right.startDate).getTime())[0] ?? null,
    [requests, today],
  );
  const nextApprovedDaysUntilStart = nextApprovedRequest
    ? Math.max(
        Math.ceil(
          (new Date(nextApprovedRequest.startDate).getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24),
        ),
        0,
      )
    : null;

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

  const handleExport = () => {
    if (filteredRequests.length === 0) {
      return;
    }

    const csvRows = [
      ['Funcionário', 'Departamento', 'Status', 'Início', 'Fim', 'Total de dias', 'Saldo disponível'],
      ...filteredRequests.map((item) => [
        item.employeeName,
        item.department,
        item.status,
        shortDateFormatter.format(new Date(item.startDate)),
        shortDateFormatter.format(new Date(item.endDate)),
        String(item.totalDays),
        String(item.availableDays),
      ]),
    ];
    const csvContent = csvRows
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = objectUrl;
    anchor.download = `ferias-${selectedFilter}-${today.toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(objectUrl);
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      <PageHeader
        eyebrow="Férias / Gestão anual"
        title="Gestão de férias"
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
              {' '}
              Filtro ativo:
              {' '}
              <span className="font-semibold text-[var(--on-surface)]">{filterLabels[selectedFilter]}</span>
              .
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button className="w-full sm:w-auto" size="sm" variant="outline" onClick={() => setIsFilterDialogOpen(true)}>
              <Filter className="h-4 w-4" />
              Filtrar
            </Button>
            <Button
              className="w-full sm:w-auto"
              disabled={filteredRequests.length === 0}
              size="sm"
              variant="outline"
              onClick={handleExport}
            >
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
                    {item.totalDays} dias corridos - saldo {item.availableDays} dias - {item.operationalInsight.overlapCount} conflito(s) de cobertura
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
          items={filteredRequests}
          getRowKey={(item) => item.id}
        />
      </Card>

      <section className="grid gap-8 lg:grid-cols-2">
        <Card className="relative overflow-hidden p-5 sm:p-8">
          <div className="relative z-10">
            <h4 className="font-headline text-lg font-extrabold text-[var(--primary)]">Leitura do período</h4>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--primary)]/80">
              Em
              {' '}
              <span className="font-semibold">{todayLabel}</span>
              , o painel identifica
              {' '}
              <span className="font-semibold">{onLeave} colaborador(es)</span>
              {' '}
              em gozo e
              {' '}
              <span className="font-semibold">{upcomingExpirations} solicitação(ões)</span>
              {' '}
              com saldo crítico ou janela que merece atenção.
            </p>
          </div>
        </Card>

        <Card className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h4 className="font-headline text-lg font-extrabold text-[var(--on-surface)]">Próxima saída aprovada</h4>
            <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
              {nextApprovedRequest
                ? `${nextApprovedRequest.employeeName} · ${formatVacationPeriod(
                    nextApprovedRequest.startDate,
                    nextApprovedRequest.endDate,
                  )}`
                : 'Nenhum afastamento futuro aprovado na base atual.'}
            </p>
          </div>
          <div className="text-right">
            <p className="font-headline text-4xl font-extrabold text-[var(--primary)]">
              {nextApprovedDaysUntilStart == null ? '--' : `${nextApprovedDaysUntilStart} dias`}
            </p>
            <p className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Para o evento</p>
          </div>
        </Card>
      </section>

      <CreateVacationRequestDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="w-[min(96vw,34rem)] rounded-[2rem] p-0">
          <div className="space-y-6 p-6 sm:p-8">
            <div className="space-y-2">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--primary)]">
                Filtros da fila
              </p>
              <h4 className="font-headline text-2xl font-extrabold text-[var(--on-surface)]">Refinar solicitações</h4>
              <p className="text-sm text-[var(--on-surface-variant)]">
                Escolha o recorte que melhor ajuda o RH a decidir o próximo bloco de férias.
              </p>
            </div>

            <div className="grid gap-3">
              {(Object.entries(filterLabels) as Array<[VacationListFilter, string]>).map(([filterId, label]) => {
                const isActive = selectedFilter === filterId;

                return (
                  <button
                    key={filterId}
                    type="button"
                    onClick={() => setSelectedFilter(filterId)}
                    className={
                      isActive
                        ? 'rounded-[1.35rem] border border-[color:color-mix(in_srgb,var(--primary)_28%,transparent)] bg-[var(--primary-fixed)] px-4 py-4 text-left shadow-[var(--shadow-card)]'
                        : 'rounded-[1.35rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_18%,transparent)] bg-[var(--surface-container-lowest)] px-4 py-4 text-left transition hover:bg-[var(--surface-container-low)]'
                    }
                  >
                    <span className="block font-headline text-sm font-extrabold text-[var(--on-surface)]">{label}</span>
                    <span className="mt-1 block text-sm text-[var(--on-surface-variant)]">
                      {filterId === 'all' && 'Visualiza toda a carteira atual sem recorte.'}
                      {filterId === 'pending' && 'Prioriza decisões que ainda aguardam aceite do RH.'}
                      {filterId === 'approved' && 'Mostra apenas pedidos já liberados para comunicação.'}
                      {filterId === 'rejected' && 'Reúne recusas para auditoria e eventual reabertura.'}
                      {filterId === 'on_leave' && 'Exibe apenas colaboradores que estão em gozo hoje.'}
                      {filterId === 'low_balance' && 'Destaca solicitações com saldo disponível mais apertado.'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => setSelectedFilter('all')}>
                Limpar filtro
              </Button>
              <Button onClick={() => setIsFilterDialogOpen(false)}>Aplicar visualização</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
