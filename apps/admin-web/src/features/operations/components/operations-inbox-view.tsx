'use client';

import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  BellRing,
  BriefcaseBusiness,
  CalendarClock,
  ClipboardList,
  FileClock,
  HardDriveDownload,
  TimerReset,
} from 'lucide-react';

import { formatDateTime } from '@rh-ponto/core';
import { Badge, Button, Card, EmptyState, ErrorState, PageHeader } from '@rh-ponto/ui';

import { TablePageSkeleton } from '@/shared/components/page-skeletons';
import { StatCard } from '@/shared/components/stat-card';
import { getActionErrorMessage } from '@/shared/lib/mutation-feedback';

import { useOperationsInbox } from '../hooks/use-operations-inbox';
import type { OperationsInboxCategory, OperationsInboxItem, OperationsInboxPriority } from '../lib/operations-inbox-service';

const categoryMeta: Record<
  OperationsInboxCategory,
  {
    title: string;
    description: string;
    icon: typeof ClipboardList;
  }
> = {
  'time-record': {
    title: 'Marcações em revisão',
    description: 'Exceções de jornada que precisam de conferência antes do fechamento.',
    icon: TimerReset,
  },
  justification: {
    title: 'Justificativas pendentes',
    description: 'Solicitações aguardando leitura e decisão administrativa.',
    icon: ClipboardList,
  },
  vacation: {
    title: 'Férias aguardando decisão',
    description: 'Pedidos que afetam cobertura e planejamento do time.',
    icon: CalendarClock,
  },
  document: {
    title: 'Ciências documentais pendentes',
    description: 'Documentos oficiais publicados que ainda aguardam confirmação do colaborador.',
    icon: FileClock,
  },
  onboarding: {
    title: 'Onboarding com bloqueios',
    description: 'Jornadas com entraves ou prazos críticos para continuidade.',
    icon: BriefcaseBusiness,
  },
  device: {
    title: 'Dispositivos com atenção',
    description: 'Pontos de captura que exigem verificação operacional.',
    icon: HardDriveDownload,
  },
};

const priorityBadgeVariant: Record<OperationsInboxPriority, 'danger' | 'warning' | 'neutral'> = {
  high: 'danger',
  medium: 'warning',
  low: 'neutral',
};

const priorityLabel: Record<OperationsInboxPriority, string> = {
  high: 'Alta prioridade',
  medium: 'Prioridade moderada',
  low: 'Monitoramento',
};

const OperationsInboxItemCard = ({ item }: { item: OperationsInboxItem }) => (
  <Card className="p-5 sm:p-6">
    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={priorityBadgeVariant[item.priority]}>{priorityLabel[item.priority]}</Badge>
          <Badge variant="neutral">{formatDateTime(item.occurredAt)}</Badge>
        </div>
        <div>
          <h3 className="font-headline text-xl font-extrabold text-[var(--on-surface)]">{item.title}</h3>
          <p className="mt-2 text-sm leading-7 text-[var(--on-surface-variant)]">{item.description}</p>
        </div>
      </div>

      <div className="flex lg:justify-end">
        <Button asChild className="w-full sm:w-auto" variant="outline">
          <Link href={item.href}>
            Abrir contexto
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  </Card>
);

export const OperationsInboxView = () => {
  const { data, error, isError, isLoading, refetch } = useOperationsInbox();

  if (isLoading) {
    return <TablePageSkeleton />;
  }

  if (isError || !data) {
    return (
      <ErrorState
        title="Não foi possível carregar o inbox operacional"
        description={getActionErrorMessage(error, 'Tente novamente para abrir a fila unificada de exceções do RH.')}
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
        eyebrow="Operação / Inbox"
        title="Inbox operacional do RH"
        description="Fila única das exceções que exigem decisão humana antes do fechamento, do atendimento ou da continuidade da jornada."
      />

      <section className="grid gap-6 md:grid-cols-3">
        <StatCard
          hint="Total consolidado de exceções aguardando alguma ação administrativa."
          icon={BellRing}
          label="Total pendente"
          value={String(data.summary.total)}
        />
        <StatCard
          hint="Itens com impacto direto na continuidade da operação ou no fechamento."
          icon={AlertTriangle}
          label="Alta prioridade"
          tone="danger"
          value={String(data.summary.highPriority)}
        />
        <StatCard
          hint="Casos com gatilho temporal próximo, principalmente férias e onboarding."
          icon={CalendarClock}
          label="Com prazo vencendo"
          tone="tertiary"
          value={String(data.summary.dueSoon)}
        />
      </section>

      {data.items.length === 0 ? (
        <EmptyState
          title="Nenhuma exceção no inbox"
          description="A fila operacional está vazia neste momento. Novas exceções aparecerão aqui assim que exigirem ação humana."
        />
      ) : (
        <div className="space-y-6">
          {data.groups.map((group) => {
            const meta = categoryMeta[group.category];
            const Icon = meta.icon;
            const items = data.items.filter((item) => item.category === group.category);

            return (
              <section key={group.category} className="space-y-4">
                <Card className="p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="rounded-[1.25rem] bg-[var(--primary-fixed)] p-3 text-[var(--primary)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="font-headline text-xl font-extrabold text-[var(--on-surface)]">{meta.title}</h2>
                        <p className="mt-2 text-sm leading-7 text-[var(--on-surface-variant)]">{meta.description}</p>
                      </div>
                    </div>
                    <Badge variant="info">{group.count} item(ns)</Badge>
                  </div>
                </Card>

                <div className="grid gap-4">
                  {items.map((item) => (
                    <OperationsInboxItemCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};
