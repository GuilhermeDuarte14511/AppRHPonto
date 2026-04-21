'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
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

import { useTimeRecordCatalog } from '@/features/time-records/hooks/use-time-record-catalog';
import { useTimeRecords } from '@/features/time-records/hooks/use-time-records';
import { TablePageSkeleton } from '@/shared/components/page-skeletons';
import { StatCard } from '@/shared/components/stat-card';
import { getActionErrorMessage } from '@/shared/lib/mutation-feedback';
import { useSession } from '@/shared/providers/session-provider';

import { useAssistedReviewDecisions } from '../hooks/use-assisted-review-decisions';
import { useOperationsInbox } from '../hooks/use-operations-inbox';
import type { OperationsInboxCategory, OperationsInboxItem, OperationsInboxPriority } from '../lib/operations-inbox-service';
import { TimeAdjustmentBatchReviewBar } from './time-adjustment-batch-review-bar';
import { TimeAdjustmentCaseDetailDialog } from './time-adjustment-case-detail-dialog';
import { TimeAdjustmentCaseList } from './time-adjustment-case-list';

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
  const { data: timeRecords } = useTimeRecords();
  const { data: timeRecordCatalog } = useTimeRecordCatalog();
  const { session } = useSession();
  const searchParams = useSearchParams();
  const decisions = useAssistedReviewDecisions();
  const [selectedCaseIds, setSelectedCaseIds] = useState<string[]>([]);
  const [activeCase, setActiveCase] = useState<OperationsInboxItem | null>(null);

  const timeRecordMap = useMemo(() => new Map((timeRecords ?? []).map((item) => [item.id, item])), [timeRecords]);
  const deviceMap = useMemo(
    () => new Map((timeRecordCatalog?.devices ?? []).map((device) => [device.id, device.name])),
    [timeRecordCatalog?.devices],
  );
  const assistedReviewItems = useMemo(
    () => data?.items.filter((item) => item.category === 'time-record' && item.assistedReview) ?? [],
    [data?.items],
  );
  const selectedItems = useMemo(
    () => assistedReviewItems.filter((item) => selectedCaseIds.includes(item.id)),
    [assistedReviewItems, selectedCaseIds],
  );
  const selectedBatchGroupKey = selectedItems[0]?.assistedReview?.batchGroupKey ?? null;

  useEffect(() => {
    if (!data) {
      return;
    }

    const caseFromUrl = searchParams.get('case');

    if (!caseFromUrl) {
      return;
    }

    const targetItem = data.items.find((item) => item.id === caseFromUrl) ?? null;

    if (targetItem?.assistedReview) {
      setActiveCase(targetItem);
    }
  }, [data, searchParams]);

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

  const reviewerUserId = session?.user.id ?? null;
  const reviewerName = session?.user.name ?? null;

  const handleToggleCaseSelection = (item: OperationsInboxItem, selected: boolean) => {
    const batchGroupKey = item.assistedReview?.batchGroupKey ?? null;

    if (!selected) {
      setSelectedCaseIds((currentIds) => currentIds.filter((currentId) => currentId !== item.id));
      return;
    }

    if (selectedBatchGroupKey && batchGroupKey && selectedBatchGroupKey !== batchGroupKey) {
      setSelectedCaseIds([item.id]);
      return;
    }

    setSelectedCaseIds((currentIds) => (currentIds.includes(item.id) ? currentIds : [...currentIds, item.id]));
  };

  const handleApprove = async (item: OperationsInboxItem, notes: string) => {
    await decisions.approveSuggested.mutateAsync({
      item,
      notes,
      reviewerUserId,
      reviewerName,
    });
    setActiveCase(null);
    setSelectedCaseIds((currentIds) => currentIds.filter((currentId) => currentId !== item.id));
  };

  const handleReject = async (item: OperationsInboxItem, notes: string) => {
    await decisions.rejectSuggested.mutateAsync({
      item,
      notes,
      reviewerUserId,
      reviewerName,
    });
    setActiveCase(null);
    setSelectedCaseIds((currentIds) => currentIds.filter((currentId) => currentId !== item.id));
  };

  const handleRequestJustification = async (item: OperationsInboxItem, notes: string) => {
    await decisions.requestJustification.mutateAsync({
      item,
      notes,
      reviewerUserId,
      reviewerName,
    });
    setActiveCase(null);
    setSelectedCaseIds((currentIds) => currentIds.filter((currentId) => currentId !== item.id));
  };

  const handleEscalate = async (item: OperationsInboxItem, notes: string) => {
    await decisions.escalateCase.mutateAsync({
      item,
      notes,
      reviewerUserId,
      reviewerName,
    });
    setActiveCase(null);
    setSelectedCaseIds((currentIds) => currentIds.filter((currentId) => currentId !== item.id));
  };

  const handleApproveBatch = async () => {
    for (const item of selectedItems) {
      await decisions.approveSuggested.mutateAsync({
        item,
        notes: 'Aprovação em lote a partir do inbox assistido.',
        reviewerUserId,
        reviewerName,
      });
    }

    setSelectedCaseIds([]);
    setActiveCase(null);
  };

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

      <section className="grid gap-6 md:grid-cols-3">
        <StatCard
          hint="Casos previsíveis com sugestão forte o suficiente para revisão em lote."
          icon={TimerReset}
          label="Elegíveis para lote"
          tone="secondary"
          value={String(data.summary.batchEligible ?? 0)}
        />
        <StatCard
          hint="Casos com maior risco e baixa capacidade de automação assistida."
          icon={AlertTriangle}
          label="Baixa confiança"
          tone="danger"
          value={String(data.summary.lowConfidence ?? 0)}
        />
        <StatCard
          hint="Exceções com impacto direto no fechamento da folha ou em compliance."
          icon={BellRing}
          label="Impacto no fechamento"
          tone="tertiary"
          value={String(data.summary.closureImpact ?? 0)}
        />
      </section>

      {data.items.length === 0 ? (
        <EmptyState
          title="Nenhuma exceção no inbox"
          description="A fila operacional está vazia neste momento. Novas exceções aparecerão aqui assim que exigirem ação humana."
        />
      ) : (
        <div className="space-y-6">
          <section className="space-y-4">
            <Card className="p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="rounded-[1.25rem] bg-[var(--primary-fixed)] p-3 text-[var(--primary)]">
                    <TimerReset className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-headline text-xl font-extrabold text-[var(--on-surface)]">
                      Ajustes de ponto assistidos
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-[var(--on-surface-variant)]">
                      Casos de ponto preparados com classificação, confiança, sugestão e roteamento para reduzir
                      decisão manual repetitiva.
                    </p>
                  </div>
                </div>
                <Badge variant="info">{assistedReviewItems.length} caso(s)</Badge>
              </div>
            </Card>

            {selectedItems.length > 0 ? (
              <TimeAdjustmentBatchReviewBar
                disabled={decisions.isPending}
                selectedCount={selectedItems.length}
                onApprove={() => {
                  void handleApproveBatch();
                }}
                onClear={() => setSelectedCaseIds([])}
              />
            ) : null}

            <TimeAdjustmentCaseList
              items={assistedReviewItems}
              selectedIds={selectedCaseIds}
              onOpenCase={setActiveCase}
              onToggleSelect={handleToggleCaseSelection}
            />
          </section>

          {data.groups.map((group) => {
            if (group.category === 'time-record') {
              return null;
            }

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

      <TimeAdjustmentCaseDetailDialog
        deviceLabel={activeCase ? deviceMap.get(timeRecordMap.get(activeCase.id)?.deviceId ?? '') ?? null : null}
        isPending={decisions.isPending}
        item={activeCase}
        open={activeCase != null}
        timeRecord={activeCase ? timeRecordMap.get(activeCase.id) ?? null : null}
        onApprove={handleApprove}
        onEscalate={handleEscalate}
        onOpenChange={(open) => {
          if (!open) {
            setActiveCase(null);
          }
        }}
        onReject={handleReject}
        onRequestJustification={handleRequestJustification}
      />
    </div>
  );
};
