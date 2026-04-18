'use client';

import { formatDateTime } from '@rh-ponto/core';
import type { TimeRecord } from '@rh-ponto/time-records';
import { Badge, Button, Card, DataTable, EmptyState, ErrorState, PageHeader } from '@rh-ponto/ui';
import { useDeferredValue, useMemo, useState } from 'react';
import {
  CalendarDays,
  Camera,
  Clock3,
  Download,
  Eye,
  MapPin,
  PencilLine,
  Plus,
  Search,
  ShieldAlert,
} from 'lucide-react';

import { StatCard } from '@/shared/components/stat-card';
import { TablePageSkeleton } from '@/shared/components/page-skeletons';
import { useCurrentUser } from '@/shared/hooks/use-current-user';
import {
  formatTimeRecordSourceLabel,
  formatTimeRecordStatusLabel,
  formatTimeRecordTypeLabel,
} from '@/shared/lib/admin-formatters';
import { getActionErrorMessage } from '@/shared/lib/mutation-feedback';

import { useTimeRecordCatalog } from '../hooks/use-time-record-catalog';
import { useTimeRecords } from '../hooks/use-time-records';
import { CreateTimeRecordDialog } from './create-time-record-dialog';
import { DailyTimeRecordSequence } from './daily-time-record-sequence';
import { TimeRecordDetailsDialog } from './time-record-details-dialog';
import type { TimeRecordListItem } from './time-record-list-item';

type StatusFilter = 'todos' | 'valid' | 'pending_review' | 'adjusted' | 'rejected';
type TypeFilter = 'todos' | 'entry' | 'break_start' | 'break_end' | 'exit';

const formatLocalDateInput = (value: string | Date) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const formatDayLabel = (value: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${value}T12:00:00`));

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
  const [dayFilter, setDayFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('todos');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [detailRecord, setDetailRecord] = useState<TimeRecordListItem | null>(null);
  const [recordBeingAdjusted, setRecordBeingAdjusted] = useState<TimeRecordListItem | null>(null);
  const deferredSearch = useDeferredValue(search);

  const synchronizeLocalRecordState = (updatedRecord: TimeRecord) => {
    const mergeRecord = (currentRecord: TimeRecordListItem | null) =>
      currentRecord?.id === updatedRecord.id
        ? {
            ...currentRecord,
            ...updatedRecord,
          }
        : currentRecord;

    setDetailRecord((currentRecord) => mergeRecord(currentRecord));
    setRecordBeingAdjusted((currentRecord) => mergeRecord(currentRecord));
  };

  const timeRecords = useMemo<TimeRecordListItem[]>(() => data ?? [], [data]);
  const normalizedSearch = deferredSearch.trim().toLowerCase();
  const selectedDayLabel = dayFilter ? formatDayLabel(dayFilter) : null;
  const availableDays = useMemo(
    () =>
      Array.from(new Set(timeRecords.map((record) => formatLocalDateInput(record.recordedAt)))).sort((left, right) =>
        right.localeCompare(left),
      ),
    [timeRecords],
  );
  const deviceMap = useMemo(
    () => new Map((catalog?.devices ?? []).map((device) => [device.id, device.name])),
    [catalog?.devices],
  );

  const filteredRecords = useMemo(
    () =>
      timeRecords.filter((record) => {
        const matchesDay = dayFilter.length === 0 || formatLocalDateInput(record.recordedAt) === dayFilter;
        const matchesStatus = statusFilter === 'todos' || record.status === statusFilter;
        const matchesType = typeFilter === 'todos' || record.recordType === typeFilter;
        const matchesSearch =
          normalizedSearch.length === 0 ||
          [
            record.employeeName,
            record.department,
            record.notes,
            record.resolvedAddress,
            formatTimeRecordTypeLabel(record.recordType),
            formatTimeRecordSourceLabel(record.source),
            formatTimeRecordStatusLabel(record.status),
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(normalizedSearch);

        return matchesDay && matchesStatus && matchesType && matchesSearch;
      }),
    [dayFilter, normalizedSearch, statusFilter, timeRecords, typeFilter],
  );

  const stats = useMemo(() => {
    const pending = filteredRecords.filter((item) => item.status === 'pending_review').length;
    const adjusted = filteredRecords.filter((item) => item.status === 'adjusted').length;
    const rejected = filteredRecords.filter((item) => item.status === 'rejected').length;
    const manual = filteredRecords.filter((item) => item.source === 'admin_adjustment').length;
    const withPhoto = filteredRecords.filter((item) => item.photos.length > 0).length;
    const withLocation = filteredRecords.filter((item) => item.latitude != null && item.longitude != null).length;

    return {
      total: filteredRecords.length,
      pending,
      adjusted,
      rejected,
      manual,
      withPhoto,
      withLocation,
    };
  }, [filteredRecords]);

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
        description="Filtre por dia operacional, acompanhe a sequência da jornada por funcionário e abra cada batida com foto, localização e contexto completo antes de qualquer ajuste."
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
          badge={dayFilter ? 'Dia filtrado' : 'Janela atual'}
          hint={
            dayFilter
              ? `Registros encontrados em ${selectedDayLabel ?? 'dia selecionado'}.`
              : 'Registros de jornada retornados pela base operacional.'
          }
          icon={Clock3}
          label="Marcações visíveis"
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
          badge="Geolocalização"
          hint="Marcações desta janela com coordenadas válidas."
          icon={MapPin}
          label="Com localização"
          tone="secondary"
          value={String(stats.withLocation)}
        />
        <StatCard
          badge="Evidências"
          hint="Registros com foto vinculada para conferência visual."
          icon={Camera}
          label="Com foto"
          tone="danger"
          value={String(stats.withPhoto)}
        />
      </section>

      <Card className="p-5 sm:p-6">
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.8fr_0.75fr_0.75fr_auto]">
          <label className="space-y-2">
            <span className="px-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
              Buscar marcação
            </span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--on-surface-variant)]" />
              <input
                className="h-12 w-full rounded-[1rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_18%,transparent)] bg-[var(--surface-container-low)] pl-11 pr-4 text-sm text-[var(--on-surface)] outline-none transition focus:border-[var(--primary)]"
                placeholder="Funcionário, departamento, endereço ou observação"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </label>

          <label className="space-y-2">
            <span className="px-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
              Dia da operação
            </span>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--on-surface-variant)]" />
              <input
                className="h-12 w-full rounded-[1rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_18%,transparent)] bg-[var(--surface-container-low)] pl-11 pr-4 text-sm text-[var(--on-surface)] outline-none transition focus:border-[var(--primary)]"
                type="date"
                value={dayFilter}
                onChange={(event) => setDayFilter(event.target.value)}
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
                setDayFilter('');
                setStatusFilter('todos');
                setTypeFilter('todos');
              }}
            >
              Limpar filtros
            </Button>
          </div>
        </div>

        {availableDays.length > 0 ? (
          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[color:color-mix(in_srgb,var(--outline-variant)_12%,transparent)] pt-5">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
              Acesso rápido por dia
            </span>
            {availableDays.slice(0, 5).map((day) => (
              <button
                key={day}
                className={`inline-flex items-center rounded-full px-3 py-2 text-xs font-semibold transition ${
                  dayFilter === day
                    ? 'bg-[var(--primary)] text-[var(--on-primary)]'
                    : 'bg-[var(--surface-container-low)] text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)]'
                }`}
                type="button"
                onClick={() => setDayFilter(day)}
              >
                {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(
                  new Date(`${day}T12:00:00`),
                )}
              </button>
            ))}
          </div>
        ) : null}
      </Card>

      {dayFilter ? (
        <>
          <Card className="overflow-hidden border-[color:color-mix(in_srgb,var(--primary)_20%,transparent)] bg-[linear-gradient(135deg,rgba(226,232,240,0.86),rgba(255,255,255,0.96))] p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
                  Dia operacional selecionado
                </p>
                <h3 className="mt-2 font-headline text-2xl font-extrabold text-[var(--on-surface)]">
                  {selectedDayLabel}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--on-surface-variant)]">
                  Use esta visão para revisar a sequência de entrada, intervalo e saída do dia com base em evidências,
                  endereço confirmado e contexto de cada marcação.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.25rem] bg-[rgba(255,255,255,0.8)] px-4 py-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                    Registros
                  </p>
                  <p className="mt-2 text-xl font-extrabold text-[var(--on-surface)]">{stats.total}</p>
                </div>
                <div className="rounded-[1.25rem] bg-[rgba(255,255,255,0.8)] px-4 py-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                    Em revisão
                  </p>
                  <p className="mt-2 text-xl font-extrabold text-[var(--on-surface)]">{stats.pending}</p>
                </div>
                <div className="rounded-[1.25rem] bg-[rgba(255,255,255,0.8)] px-4 py-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                    Ajustadas
                  </p>
                  <p className="mt-2 text-xl font-extrabold text-[var(--on-surface)]">{stats.adjusted}</p>
                </div>
              </div>
            </div>
          </Card>

          <DailyTimeRecordSequence
            records={filteredRecords}
            selectedDayLabel={selectedDayLabel ?? 'dia selecionado'}
            onAdjustRecord={setRecordBeingAdjusted}
            onViewRecord={setDetailRecord}
          />
        </>
      ) : null}

      {filteredRecords.length === 0 ? (
        <EmptyState
          title="Nenhuma marcação encontrada"
          description={
            dayFilter
              ? 'Nenhum registro apareceu para a data e os filtros selecionados. Você pode mudar o dia, limpar os filtros ou criar uma marcação manual.'
              : 'Nenhum registro apareceu com os filtros atuais. Você pode limpar os filtros ou criar uma marcação manual.'
          }
          actionLabel="Limpar filtros"
          onAction={() => {
            setSearch('');
            setDayFilter('');
            setStatusFilter('todos');
            setTypeFilter('todos');
          }}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] px-5 py-5 sm:px-8 sm:py-6">
            <div>
              <h3 className="font-headline text-xl font-extrabold text-[var(--on-surface)]">
                {dayFilter ? 'Marcações do dia selecionado' : 'Marcações recentes'}
              </h3>
              <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                {dayFilter
                  ? 'Visualize a operação do dia com acesso rápido a evidências, endereço confirmado e ações administrativas.'
                  : 'Registros recentes da operação, com origem, status, localização e evidências vinculadas.'}
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
                render: (item: TimeRecordListItem) => (
                  <div className="space-y-1">
                    <p className="font-semibold text-[var(--on-surface)]">{item.employeeName}</p>
                    <p className="text-xs text-[var(--on-surface-variant)]">{item.department}</p>
                  </div>
                ),
              },
              {
                key: 'recordedAt',
                label: 'Horário',
                render: (item: TimeRecordListItem) => (
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
                render: (item: TimeRecordListItem) => (
                  <Badge variant="info">{formatTimeRecordTypeLabel(item.recordType)}</Badge>
                ),
              },
              {
                key: 'status',
                label: 'Status',
                render: (item: TimeRecordListItem) => (
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
                key: 'context',
                label: 'Contexto',
                render: (item: TimeRecordListItem) => (
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-container-low)] px-3 py-2 text-xs font-semibold text-[var(--on-surface-variant)]">
                      <Camera className="h-4 w-4 text-[var(--primary)]" />
                      {item.photos.length > 0 ? `${item.photos.length} evidência(s)` : 'Sem foto vinculada'}
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-container-low)] px-3 py-2 text-xs font-semibold text-[var(--on-surface-variant)]">
                      <MapPin className="h-4 w-4 text-[var(--primary)]" />
                      {item.resolvedAddress ? 'Localização confirmada' : 'Sem endereço resolvido'}
                    </div>
                  </div>
                ),
              },
              {
                key: 'actions',
                label: 'Ações',
                headerClassName: 'text-right',
                cellClassName: 'text-right',
                render: (item: TimeRecordListItem) => (
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => setDetailRecord(item)}>
                      <Eye className="h-4 w-4" />
                      Ver detalhes
                    </Button>
                    <Button size="sm" onClick={() => setRecordBeingAdjusted(item)}>
                      <PencilLine className="h-4 w-4" />
                      Ajustar
                    </Button>
                  </div>
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
            onRecordSaved={synchronizeLocalRecordState}
            recordedByUserId={currentUser?.id ?? null}
            onOpenChange={setIsCreateDialogOpen}
          />
          <CreateTimeRecordDialog
            devices={catalog.devices}
            employees={catalog.employees}
            mode="adjust"
            open={recordBeingAdjusted != null}
            onRecordSaved={synchronizeLocalRecordState}
            record={recordBeingAdjusted}
            recordedByUserId={currentUser?.id ?? null}
            onOpenChange={(open) => {
              if (!open) {
                setRecordBeingAdjusted(null);
              }
            }}
          />
          <TimeRecordDetailsDialog
            deviceLabel={
              detailRecord?.deviceId
                ? deviceMap.get(detailRecord.deviceId) ?? 'Dispositivo não encontrado'
                : 'Sem dispositivo'
            }
            open={detailRecord != null}
            record={detailRecord}
            onAdjust={(record) => setRecordBeingAdjusted(record)}
            onOpenChange={(open) => {
              if (!open) {
                setDetailRecord(null);
              }
            }}
          />
        </>
      ) : null}
    </div>
  );
};
