'use client';

import { formatDateTime } from '@rh-ponto/core';
import type { TimeRecord } from '@rh-ponto/time-records';
import { Badge, Button, Card, DataTable, EmptyState, ErrorState, PageHeader } from '@rh-ponto/ui';
import { useDeferredValue, useMemo, useState } from 'react';
import {
  Camera,
  Clock3,
  Download,
  PencilLine,
  Plus,
  Search,
  ShieldAlert,
  TimerReset,
} from 'lucide-react';

import { StatCard } from '@/shared/components/stat-card';
import { useCurrentUser } from '@/shared/hooks/use-current-user';
import { TablePageSkeleton } from '@/shared/components/page-skeletons';
import {
  formatTimeRecordSourceLabel,
  formatTimeRecordStatusLabel,
  formatTimeRecordTypeLabel,
} from '@/shared/lib/admin-formatters';
import { getActionErrorMessage } from '@/shared/lib/mutation-feedback';

import { useTimeRecordCatalog } from '../hooks/use-time-record-catalog';
import { useTimeRecords } from '../hooks/use-time-records';
import { CreateTimeRecordDialog } from './create-time-record-dialog';

type StatusFilter = 'todos' | 'valid' | 'pending_review' | 'adjusted' | 'rejected';
type TypeFilter = 'todos' | 'entry' | 'break_start' | 'break_end' | 'exit';

const getTimeRecordStatusVariant = (status: StatusFilter) => {
  switch (status) {
    case 'valid':
      return 'success';
    case 'pending_review':
      return 'warning';
    case 'adjusted':
      return 'info';
    case 'rejected':
      return 'danger';
    default:
      return 'neutral';
  }
};

const exportTimeRecordsCsv = (
  records: Array<{
    employeeName: string;
    department: string;
    recordedAt: string | Date;
    recordType: string;
    source: string;
    status: string;
    notes: string | null;
  }>,
) => {
  if (typeof window === 'undefined') {
    return;
  }

  const headers = ['Funcionário', 'Departamento', 'Horário', 'Tipo', 'Origem', 'Status', 'Observações'];
  const lines = records.map((record) =>
    [
      record.employeeName,
      record.department,
      formatDateTime(record.recordedAt),
      formatTimeRecordTypeLabel(record.recordType as never),
      formatTimeRecordSourceLabel(record.source as never),
      formatTimeRecordStatusLabel(record.status as never),
      record.notes ?? '',
    ]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(','),
  );

  const blob = new Blob([[headers.join(','), ...lines].join('\n')], {
    type: 'text/csv;charset=utf-8;',
  });
  const link = document.createElement('a');
  const fileName = `marcacoes-${new Date().toISOString().slice(0, 10)}.csv`;

  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const TimeRecordsListView = () => {
  const { data, error, isError, isLoading, refetch } = useTimeRecords();
  const {
    data: catalog,
    error: catalogError,
    isError: isCatalogError,
    isLoading: isCatalogLoading,
    refetch: refetchCatalog,
  } = useTimeRecordCatalog();
  const currentUser = useCurrentUser();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('todos');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<TimeRecord | null>(null);
  const deferredSearch = useDeferredValue(search);

  const timeRecords = useMemo(() => data ?? [], [data]);
  const normalizedSearch = deferredSearch.trim().toLowerCase();

  const filteredRecords = useMemo(
    () =>
      timeRecords.filter((record) => {
        const matchesStatus = statusFilter === 'todos' || record.status === statusFilter;
        const matchesType = typeFilter === 'todos' || record.recordType === typeFilter;
        const matchesSearch =
          normalizedSearch.length === 0 ||
          [
            record.employeeName,
            record.department,
            record.notes,
            formatTimeRecordTypeLabel(record.recordType),
            formatTimeRecordSourceLabel(record.source),
            formatTimeRecordStatusLabel(record.status),
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(normalizedSearch);

        return matchesStatus && matchesType && matchesSearch;
      }),
    [normalizedSearch, statusFilter, timeRecords, typeFilter],
  );

  const stats = useMemo(() => {
    const pending = timeRecords.filter((item) => item.status === 'pending_review').length;
    const adjusted = timeRecords.filter((item) => item.status === 'adjusted').length;
    const rejected = timeRecords.filter((item) => item.status === 'rejected').length;
    const manual = timeRecords.filter((item) => item.source === 'admin_adjustment').length;

    return {
      total: timeRecords.length,
      pending,
      adjusted,
      rejected,
      manual,
    };
  }, [timeRecords]);

  if (isLoading || isCatalogLoading) {
    return <TablePageSkeleton />;
  }

  if (isError || isCatalogError) {
    return (
      <ErrorState
        title="Não foi possível carregar as marcações"
        description={getActionErrorMessage(
          error ?? catalogError,
          'Os dados de marcação ou o catálogo operacional não responderam como esperado.',
        )}
        actionLabel="Tentar novamente"
        onAction={() => {
          void Promise.all([refetch(), refetchCatalog()]);
        }}
      />
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      <PageHeader
        eyebrow="Marcações / Operação"
        title="Registro de marcações"
        description="Acompanhe a jornada registrada, localize exceções e crie ajustes administrativos com rastreabilidade."
        actions={
          <>
            <Button size="lg" variant="outline" onClick={() => exportTimeRecordsCsv(filteredRecords)}>
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
            <Button size="lg" onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Nova marcação
            </Button>
          </>
        }
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          badge="Janela atual"
          hint="Registros de jornada retornados pela base operacional."
          icon={Clock3}
          label="Marcações totais"
          value={String(stats.total)}
        />
        <StatCard
          badge="Fila ativa"
          hint="Registros que ainda exigem validação manual do RH."
          icon={ShieldAlert}
          label="Em revisão"
          tone="tertiary"
          value={String(stats.pending)}
        />
        <StatCard
          badge="Correções"
          hint="Marcações que já receberam ajuste administrativo."
          icon={TimerReset}
          label="Ajustadas"
          tone="secondary"
          value={String(stats.adjusted)}
        />
        <StatCard
          badge="Admin"
          hint="Lançamentos feitos manualmente por um usuário administrativo."
          icon={PencilLine}
          label="Origem manual"
          tone="danger"
          value={String(stats.manual)}
        />
      </section>

      <Card className="p-5 sm:p-6">
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr_0.8fr_auto]">
          <label className="space-y-2">
            <span className="px-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
              Buscar marcação
            </span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--on-surface-variant)]" />
              <input
                className="h-12 w-full rounded-[1rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_18%,transparent)] bg-[var(--surface-container-low)] pl-11 pr-4 text-sm text-[var(--on-surface)] outline-none transition focus:border-[var(--primary)]"
                placeholder="Funcionário, departamento, tipo ou observação"
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
              <option value="todos">Todos os status</option>
              <option value="valid">Válido</option>
              <option value="pending_review">Em revisão</option>
              <option value="adjusted">Ajustado</option>
              <option value="rejected">Rejeitado</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="px-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
              Tipo
            </span>
            <select
              className="h-12 w-full rounded-[1rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_18%,transparent)] bg-[var(--surface-container-low)] px-4 text-sm text-[var(--on-surface)] outline-none transition focus:border-[var(--primary)]"
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value as TypeFilter)}
            >
              <option value="todos">Todos os tipos</option>
              <option value="entry">Entrada</option>
              <option value="break_start">Início do intervalo</option>
              <option value="break_end">Fim do intervalo</option>
              <option value="exit">Saída</option>
            </select>
          </label>

          <div className="flex items-end">
            <Button
              className="h-12 w-full justify-center xl:w-auto"
              variant="ghost"
              onClick={() => {
                setSearch('');
                setStatusFilter('todos');
                setTypeFilter('todos');
              }}
            >
              Limpar filtros
            </Button>
          </div>
        </div>
      </Card>

      {filteredRecords.length === 0 ? (
        <EmptyState
          title="Nenhuma marcação encontrada"
          description="Nenhum registro apareceu com os filtros atuais. Você pode limpar os filtros ou criar uma marcação manual."
          actionLabel="Limpar filtros"
          onAction={() => {
            setSearch('');
            setStatusFilter('todos');
            setTypeFilter('todos');
          }}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] px-5 py-5 sm:px-8 sm:py-6">
            <div>
              <h3 className="font-headline text-xl font-extrabold text-[var(--on-surface)]">
                Marcações recentes
              </h3>
              <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                Registros mais recentes da operação atual, com origem, status e evidências vinculadas.
              </p>
            </div>
            <Badge variant={stats.rejected > 0 ? 'danger' : 'neutral'}>
              {filteredRecords.length} registro(s) visível(is)
            </Badge>
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
                    <p className="text-xs text-[var(--on-surface-variant)]">{item.department}</p>
                  </div>
                ),
              },
              {
                key: 'recordedAt',
                label: 'Horário',
                render: (item) => (
                  <div className="space-y-1">
                    <p className="font-semibold text-[var(--on-surface)]">{formatDateTime(item.recordedAt)}</p>
                    <p className="text-xs text-[var(--on-surface-variant)]">
                      {formatTimeRecordSourceLabel(item.source)}
                    </p>
                  </div>
                ),
              },
              {
                key: 'recordType',
                label: 'Tipo',
                render: (item) => <Badge variant="info">{formatTimeRecordTypeLabel(item.recordType)}</Badge>,
              },
              {
                key: 'status',
                label: 'Status',
                render: (item) => (
                  <div className="space-y-2">
                    <Badge variant={getTimeRecordStatusVariant(item.status)}>
                      {formatTimeRecordStatusLabel(item.status)}
                    </Badge>
                    <p className="max-w-[16rem] text-xs text-[var(--on-surface-variant)]">
                      {item.notes ?? 'Sem observações complementares.'}
                    </p>
                  </div>
                ),
              },
              {
                key: 'photos',
                label: 'Verificação',
                render: (item) => (
                  <div className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-container-low)] px-3 py-2 text-xs font-semibold text-[var(--on-surface-variant)]">
                    <Camera className="h-4 w-4 text-[var(--primary)]" />
                    {item.photos.length > 0
                      ? `${item.photos.length} evidência(s)`
                      : 'Sem foto vinculada'}
                  </div>
                ),
              },
              {
                key: 'actions',
                label: 'Ações',
                headerClassName: 'text-right',
                cellClassName: 'text-right',
                render: (item) => (
                  <Button size="sm" variant="outline" onClick={() => setSelectedRecord(item)}>
                    <PencilLine className="h-4 w-4" />
                    Ajustar
                  </Button>
                ),
              },
            ]}
            emptyState="Nenhuma marcação combina com os filtros escolhidos."
            getRowKey={(item) => item.id}
            items={filteredRecords}
          />
        </Card>
      )}

      {catalog ? (
        <>
          <CreateTimeRecordDialog
            devices={catalog.devices}
            employees={catalog.employees}
            mode="create"
            open={isCreateDialogOpen}
            recordedByUserId={currentUser?.id ?? null}
            onOpenChange={setIsCreateDialogOpen}
          />
          <CreateTimeRecordDialog
            devices={catalog.devices}
            employees={catalog.employees}
            mode="adjust"
            open={selectedRecord != null}
            record={selectedRecord}
            recordedByUserId={currentUser?.id ?? null}
            onOpenChange={(open) => {
              if (!open) {
                setSelectedRecord(null);
              }
            }}
          />
        </>
      ) : null}
    </div>
  );
};
