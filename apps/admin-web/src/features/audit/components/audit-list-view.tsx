'use client';

import Link from 'next/link';
import { useDeferredValue, useState } from 'react';
import { Download, Eye, RefreshCw, ShieldCheck, TriangleAlert } from 'lucide-react';

import { Badge, Button, Card, DataTable, ErrorState, PageHeader } from '@rh-ponto/ui';

import { AppAvatar } from '@/shared/components/app-avatar';
import { TablePageSkeleton } from '@/shared/components/page-skeletons';
import { getActionErrorMessage } from '@/shared/lib/mutation-feedback';
import { StatCard } from '@/shared/components/stat-card';

import { useAuditOverview } from '../hooks/use-audit-overview';
import { downloadAuditRecordsCsv } from '../lib/audit-export';
import type { AuditSeverity } from '../types/audit-view-model';

const severityBadgeVariant: Record<AuditSeverity, 'neutral' | 'warning' | 'danger'> = {
  baixa: 'neutral',
  média: 'warning',
  alta: 'danger',
};

export const AuditListView = () => {
  const { data, error, isError, isLoading, refetch } = useAuditOverview();
  const [search, setSearch] = useState('');
  const [selectedActor, setSelectedActor] = useState('todos');
  const [selectedEntity, setSelectedEntity] = useState('todas');
  const [selectedSeverity, setSelectedSeverity] = useState<AuditSeverity | 'todas'>('todas');
  const deferredSearch = useDeferredValue(search);

  if (isLoading) {
    return <TablePageSkeleton />;
  }

  if (isError || !data) {
    return (
      <ErrorState
        title="Não foi possível carregar a auditoria"
        description={getActionErrorMessage(error, 'Tente novamente para consultar a trilha completa do sistema.')}
        actionLabel="Tentar novamente"
        onAction={() => {
          void refetch();
        }}
      />
    );
  }

  const normalizedSearch = deferredSearch.trim().toLowerCase();
  const filteredRecords = data.records.filter((record) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      [
        record.actorName,
        record.actorRole,
        record.actionLabel,
        record.entityLabel,
        record.summary,
        record.targetLabel,
        record.auditCode,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch);

    const matchesActor = selectedActor === 'todos' || record.actorName === selectedActor;
    const matchesEntity = selectedEntity === 'todas' || record.entityLabel === selectedEntity;
    const matchesSeverity = selectedSeverity === 'todas' || record.severity === selectedSeverity;

    return matchesSearch && matchesActor && matchesEntity && matchesSeverity;
  });

  return (
    <div className="space-y-8 sm:space-y-10">
      <PageHeader
        eyebrow="Auditoria / Registro"
        title="Registro de auditoria"
        description="Histórico completo de alterações feitas por usuários no sistema, com rastreabilidade, filtros operacionais e acesso ao detalhe de cada evento."
        actions={
          <>
            <Button
              className="shrink-0 whitespace-nowrap"
              size="lg"
              variant="outline"
              onClick={() => downloadAuditRecordsCsv(filteredRecords)}
            >
              <Download className="h-4 w-4" />
              Exportar relatório
            </Button>
            <Button className="shrink-0 whitespace-nowrap" size="lg" variant="outline" onClick={() => void refetch()}>
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
          </>
        }
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card className="primary-gradient p-6 text-white sm:p-8">
          <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.16em] text-white/76">Eventos</p>
          <p className="mt-3 font-headline text-4xl font-extrabold sm:text-5xl">{data.metrics.total}</p>
          <p className="mt-4 text-sm text-white/82">
            Eventos que ajudam o RH a entender quem fez cada alteração e quando isso aconteceu.
          </p>
        </Card>
        <StatCard
          badge="Aprovações"
          hint="Eventos concluídos com aceite formal do RH ou encerramento operacional."
          icon={ShieldCheck}
          label="Concluídos"
          tone="secondary"
          value={String(data.metrics.approvals)}
        />
        <StatCard
          badge="Correções"
          hint="Ocorrências com ajuste manual ou sinalização de revisão."
          icon={RefreshCw}
          label="Ajustes e revisões"
          tone="tertiary"
          value={String(data.metrics.manualAdjustments)}
        />
        <StatCard
          badge="Atenção"
          hint="Eventos com impacto alto para rastreabilidade, configuração ou fechamento."
          icon={TriangleAlert}
          label="Eventos críticos"
          tone="danger"
          value={String(data.metrics.criticalEvents)}
        />
      </section>

      <Card className="p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_auto]">
          <label className="space-y-2">
            <span className="px-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
              Buscar evento
            </span>
            <input
              className="h-12 w-full rounded-[1rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_18%,transparent)] bg-[var(--surface-container-low)] px-4 text-sm text-[var(--on-surface)] outline-none transition focus:border-[var(--primary)]"
              placeholder="Buscar por usuário, ação, registro ou resumo"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <label className="space-y-2">
            <span className="px-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
              Usuário
            </span>
            <select
              className="h-12 w-full rounded-[1rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_18%,transparent)] bg-[var(--surface-container-low)] px-4 text-sm text-[var(--on-surface)] outline-none transition focus:border-[var(--primary)]"
              value={selectedActor}
              onChange={(event) => setSelectedActor(event.target.value)}
            >
              <option value="todos">Todos os usuários</option>
              {data.actors.map((actor) => (
                <option key={actor.id} value={actor.label}>
                  {actor.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="px-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
              Entidade
            </span>
            <select
              className="h-12 w-full rounded-[1rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_18%,transparent)] bg-[var(--surface-container-low)] px-4 text-sm text-[var(--on-surface)] outline-none transition focus:border-[var(--primary)]"
              value={selectedEntity}
              onChange={(event) => setSelectedEntity(event.target.value)}
            >
              <option value="todas">Todas as entidades</option>
              {data.entities.map((entity) => (
                <option key={entity} value={entity}>
                  {entity}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="px-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
              Severidade
            </span>
            <select
              className="h-12 w-full rounded-[1rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_18%,transparent)] bg-[var(--surface-container-low)] px-4 text-sm text-[var(--on-surface)] outline-none transition focus:border-[var(--primary)]"
              value={selectedSeverity}
              onChange={(event) => setSelectedSeverity(event.target.value as AuditSeverity | 'todas')}
            >
              <option value="todas">Todas as severidades</option>
              <option value="baixa">Baixa</option>
              <option value="média">Média</option>
              <option value="alta">Alta</option>
            </select>
          </label>

          <div className="flex items-end sm:col-span-2 xl:col-span-1">
            <Button
              className="h-12 w-full justify-center"
              variant="ghost"
              onClick={() => {
                setSearch('');
                setSelectedActor('todos');
                setSelectedEntity('todas');
                setSelectedSeverity('todas');
              }}
            >
              Limpar filtros
            </Button>
          </div>
        </div>
      </Card>

      <DataTable
        columns={[
          {
            key: 'occurredAtLabel',
            label: 'Data e hora',
            render: (item) => (
              <div className="space-y-1">
                <p className="font-semibold text-[var(--on-surface)]">{item.occurredAtLabel}</p>
                <p className="text-xs text-[var(--on-surface-variant)]">{item.auditCode}</p>
              </div>
            ),
          },
          {
            key: 'actorName',
            label: 'Usuário',
            render: (item) => <AppAvatar className="items-start" email={item.actorRole} name={item.actorName} />,
          },
          {
            key: 'actionLabel',
            label: 'Alteração',
            render: (item) => (
              <div className="space-y-2">
                <p className="font-semibold text-[var(--on-surface)]">{item.actionLabel}</p>
                <p className="max-w-md text-sm text-[var(--on-surface-variant)]">{item.summary}</p>
              </div>
            ),
          },
          {
            key: 'entityLabel',
            label: 'Entidade',
            render: (item) => (
              <div className="space-y-2">
                <Badge variant="neutral">{item.entityLabel}</Badge>
                <p className="text-xs text-[var(--on-surface-variant)]">Registro: {item.targetLabel}</p>
              </div>
            ),
          },
          {
            key: 'originLabel',
            label: 'Origem',
            render: (item) => (
              <div className="space-y-1">
                <p className="font-semibold text-[var(--on-surface)]">{item.originLabel}</p>
                <p className="text-xs text-[var(--on-surface-variant)]">IP {item.ipAddress}</p>
              </div>
            ),
          },
          {
            key: 'severity',
            label: 'Severidade',
            render: (item) => <Badge variant={severityBadgeVariant[item.severity]}>{item.severityLabel}</Badge>,
          },
          {
            key: 'actions',
            label: 'Ações',
            headerClassName: 'text-right',
            cellClassName: 'text-right',
            render: (item) => (
              <Button asChild className="w-full justify-center whitespace-nowrap" size="sm" variant="outline">
                <Link href={`/audit/${item.id}`}>
                  <Eye className="h-4 w-4" />
                  Ver detalhes
                </Link>
              </Button>
            ),
          },
        ]}
        items={filteredRecords}
        getRowKey={(item) => item.id}
        emptyState="Nenhum evento encontrado para os filtros atuais."
      />
    </div>
  );
};
