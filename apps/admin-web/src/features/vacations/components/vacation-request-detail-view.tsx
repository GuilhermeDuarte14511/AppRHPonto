'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ClipboardList,
  Database,
  FileText,
  Info,
  ShieldCheck,
  Workflow,
} from 'lucide-react';
import { toast } from 'sonner';

import { formatDateTime } from '@rh-ponto/core';
import { Button, Card, EmptyState, ErrorState, PageHeader } from '@rh-ponto/ui';

import { ReviewDecisionDialog } from '@/shared/components/review-decision-dialog';
import { DetailPageSkeleton } from '@/shared/components/page-skeletons';
import { getActionErrorMessage } from '@/shared/lib/mutation-feedback';
import { useSession } from '@/shared/providers/session-provider';

import { useReviewVacationRequest, useVacationRequestDetail } from '../hooks/use-vacation-requests';
import { formatVacationPeriod } from '../lib/vacation-helpers';
import { VacationStatusBadge } from './vacation-status-badge';
import {
  VacationRequestContextTabs,
  type VacationDetailTabId,
} from './vacation-request-context-tabs';

const coverageRiskMeta = {
  low: {
    label: 'Baixo',
    badgeClassName:
      'bg-[var(--secondary-fixed)] text-[var(--secondary)]',
  },
  medium: {
    label: 'Moderado',
    badgeClassName:
      'bg-[var(--tertiary-fixed)] text-[var(--on-tertiary-fixed-variant)]',
  },
  high: {
    label: 'Alto',
    badgeClassName:
      'bg-[var(--error-container)] text-[var(--on-error-container)]',
  },
} as const;

const DecisionPanel = ({
  disabled,
  onApprove,
  onReject,
}: {
  disabled: boolean;
  onApprove: () => void;
  onReject: () => void;
}) => (
  <Card className="p-5 sm:p-6">
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-container-low)] text-[var(--primary)]">
        <ClipboardList className="h-4 w-4" />
      </span>
      <div>
        <p className="font-headline text-xl font-extrabold text-[var(--on-surface)]">Decisão do RH</p>
        <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
          Registre a decisão final desta solicitação com a observação adequada para histórico.
        </p>
      </div>
    </div>

    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <Button className="w-full flex-1" disabled={disabled} onClick={onApprove}>
        Aprovar férias
      </Button>
      <Button className="w-full flex-1" disabled={disabled} variant="destructive" onClick={onReject}>
        Reprovar solicitação
      </Button>
    </div>
  </Card>
);

export const VacationRequestDetailView = ({ vacationId }: { vacationId: string }) => {
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<VacationDetailTabId>('summary');
  const { data, error, isError, isLoading, refetch } = useVacationRequestDetail(vacationId);
  const reviewVacationRequest = useReviewVacationRequest();
  const { session } = useSession();
  const tabsetId = useId();

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Não foi possível carregar a solicitação de férias"
        description={getActionErrorMessage(error, 'Tente novamente para abrir os detalhes do pedido selecionado.')}
        actionLabel="Tentar novamente"
        onAction={() => {
          void refetch();
        }}
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        title="Solicitação não encontrada"
        description="Esse pedido não está disponível. Volte para a lista e escolha outra solicitação."
      />
    );
  }

  const handleReview = async (status: 'approved' | 'rejected', notes: string) => {
    await reviewVacationRequest.mutateAsync({
      id: data.id,
      status,
      notes,
      actorName: session?.user.name,
    });
    toast.success(status === 'approved' ? 'Solicitação de férias aprovada.' : 'Solicitação de férias reprovada.');
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      <PageHeader
        eyebrow={`Férias / Solicitação ${data.id}`}
        title="Detalhes da solicitação"
        description="Consulta completa do pedido, aceite anexado e fluxo de aprovação da área de RH."
        actions={
          <Button asChild size="lg" variant="outline">
            <Link href="/vacations">
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[1fr_0.35fr]">
        <Card className="p-5 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <VacationStatusBadge status={data.status} />
                <span className="rounded-full bg-[var(--primary-fixed)] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--primary)]">
                  {data.id}
                </span>
              </div>
              <h2 className="mt-4 font-headline text-3xl font-extrabold text-[var(--on-surface)]">{data.employeeName}</h2>
              <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
                {data.position} · {data.department}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-[var(--surface-container-low)] px-5 py-4">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Solicitada em</p>
              <p className="mt-2 text-sm font-semibold text-[var(--on-surface)]">{formatDateTime(data.requestedAt)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Status atual</p>
          <div className="mt-4">
            <VacationStatusBadge status={data.status} />
          </div>
          <p className="mt-4 text-sm leading-6 text-[var(--on-surface-variant)]">
            Use as guias abaixo para revisar o pedido e registrar a decisão do RH com mais contexto.
          </p>
        </Card>
      </section>

      <VacationRequestContextTabs activeTab={activeTab} onChange={setActiveTab} tabsetId={tabsetId} />

      <div aria-labelledby={`${tabsetId}-${activeTab}-tab`} id={`${tabsetId}-${activeTab}-panel`} role="tabpanel" className="space-y-8">
        {activeTab === 'summary' ? (
          <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
            <Card className="p-5 sm:p-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2 rounded-[1.5rem] bg-[var(--surface-container-low)] p-5">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Período solicitado</p>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[var(--on-surface)]">
                    <CalendarDays className="h-4 w-4 text-[var(--primary)]" />
                    {formatVacationPeriod(data.startDate, data.endDate)}
                  </div>
                  <p className="text-xs text-[var(--on-surface-variant)]">Total de {data.totalDays} dias corridos</p>
                </div>
                <div className="space-y-2 rounded-[1.5rem] bg-[var(--surface-container-low)] p-5">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Saldo disponível</p>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[var(--on-surface)]">
                    <Database className="h-4 w-4 text-[var(--secondary)]" />
                    {data.availableDays} dias restantes
                  </div>
                  <p className="text-xs text-[var(--on-surface-variant)]">Período aquisitivo {data.accrualPeriod}</p>
                </div>
                <div className="space-y-2 rounded-[1.5rem] bg-[var(--surface-container-low)] p-5">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">13º adiantado</p>
                  <p className="text-sm font-semibold text-[var(--on-surface)]">
                    {data.advanceThirteenthSalary ? 'Solicitado junto às férias' : 'Não solicitado'}
                  </p>
                </div>
                <div className="space-y-2 rounded-[1.5rem] bg-[var(--surface-container-low)] p-5">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Abono pecuniário</p>
                  <p className="text-sm font-semibold text-[var(--on-surface)]">
                    {data.cashBonus ? 'Solicitado' : 'Não aplicável'}
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-6">
              <Card className="p-5 sm:p-6">
                <div className="flex items-start gap-3 rounded-[1.5rem] bg-[var(--tertiary-fixed)]/40 p-4">
                  <Info className="mt-0.5 h-4 w-4 text-[var(--on-tertiary-fixed-variant)]" />
                  <div>
                    <p className="font-headline text-sm font-extrabold text-[var(--on-surface)]">Observação operacional</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--on-surface-variant)]">
                      {data.coverageNotes ?? 'Sem observações adicionais para esta solicitação.'}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-headline text-lg font-extrabold text-[var(--on-surface)]">Impacto de cobertura</p>
                    <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                      Leitura automática da mesma área para o período solicitado.
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] ${coverageRiskMeta[data.operationalInsight.coverageRisk].badgeClassName}`}
                  >
                    Risco {coverageRiskMeta[data.operationalInsight.coverageRisk].label}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[1.5rem] bg-[var(--surface-container-low)] p-4">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Conflitos</p>
                    <p className="mt-2 font-headline text-3xl font-extrabold text-[var(--on-surface)]">
                      {data.operationalInsight.overlapCount}
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] bg-[var(--surface-container-low)] p-4">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Aprovados</p>
                    <p className="mt-2 font-headline text-3xl font-extrabold text-[var(--on-surface)]">
                      {data.operationalInsight.overlappingApprovedCount}
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] bg-[var(--surface-container-low)] p-4">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Pendentes</p>
                    <p className="mt-2 font-headline text-3xl font-extrabold text-[var(--on-surface)]">
                      {data.operationalInsight.overlappingPendingCount}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-6 text-[var(--on-surface-variant)]">
                  {data.operationalInsight.summary}
                </p>

                {data.operationalInsight.overlappingEmployeeNames.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {data.operationalInsight.overlappingEmployeeNames.map((employeeName) => (
                      <span
                        key={employeeName}
                        className="rounded-full bg-[var(--surface-container-low)] px-3 py-2 text-xs font-semibold text-[var(--on-surface)]"
                      >
                        {employeeName}
                      </span>
                    ))}
                  </div>
                ) : null}
              </Card>
            </div>
          </section>
        ) : null}

        {activeTab === 'workflow' ? (
          <Card className="p-5 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-container-low)] text-[var(--primary)]">
                <Workflow className="h-4 w-4" />
              </span>
              <div>
                <p className="font-headline text-xl font-extrabold text-[var(--on-surface)]">Fluxo de aprovação</p>
                <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                  Acompanhe as etapas já concluídas e o histórico administrativo desta solicitação.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-0">
              {[data.managerApproval, data.hrApproval].map((step, index, array) => (
                <div key={step.label} className="relative pl-8 pb-8 last:pb-0">
                  <div
                    className={
                      step.status === 'completed'
                        ? 'absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary-fixed)] text-[var(--primary)]'
                        : 'absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]'
                    }
                  >
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  {index < array.length - 1 ? (
                    <div className="absolute left-[11px] top-6 h-[calc(100%-1.25rem)] w-px bg-[color:color-mix(in_srgb,var(--outline-variant)_24%,transparent)]" />
                  ) : null}
                  <div>
                    <p className="text-sm font-bold text-[var(--on-surface)]">{step.label}</p>
                    <p className="mt-1 text-xs text-[var(--on-surface-variant)]">
                      {step.actor}
                      {step.timestamp ? ` · ${formatDateTime(step.timestamp)}` : ''}
                    </p>
                    <p className="mt-2 text-sm text-[var(--on-surface-variant)]">{step.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        {activeTab === 'document' ? (
          <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
            <Card className="p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-container-low)] text-[var(--primary)]">
                  <FileText className="h-4 w-4" />
                </span>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Documento de aceite</p>
              </div>
              <div className="mt-4 rounded-[1.5rem] bg-[var(--surface-container-low)] p-5 text-center">
                <div className="mx-auto flex h-20 w-16 items-center justify-center rounded-xl bg-[var(--surface-container-lowest)] shadow-[var(--shadow-card)]">
                  <FileText className="h-8 w-8 text-[var(--primary)]" />
                </div>
                <p className="mt-4 font-headline text-base font-extrabold text-[var(--on-surface)]">
                  {data.attachment?.fileName ?? 'Sem documento anexado'}
                </p>
                <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
                  {data.attachment?.signedBy ? `Assinado via ${data.attachment.signedBy}` : 'Nenhum anexo recebido no momento.'}
                </p>
                {data.attachment ? (
                  <Button asChild className="mt-5" size="sm" variant="outline">
                    <a href={data.attachment.fileUrl}>Visualizar documento</a>
                  </Button>
                ) : null}
              </div>
            </Card>

            <Card className="p-5 sm:p-6">
              <div className="flex items-start gap-3 rounded-[1.5rem] bg-[var(--tertiary-fixed)]/40 p-4">
                <Info className="mt-0.5 h-4 w-4 text-[var(--on-tertiary-fixed-variant)]" />
                <div>
                  <p className="font-headline text-sm font-extrabold text-[var(--on-surface)]">Leitura do RH</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--on-surface-variant)]">
                    {data.coverageNotes ?? 'Sem observações adicionais para esta solicitação.'}
                  </p>
                </div>
              </div>
            </Card>
          </section>
        ) : null}

        {activeTab === 'decision' ? (
          <DecisionPanel
            disabled={data.status !== 'pending'}
            onApprove={() => setApproveOpen(true)}
            onReject={() => setRejectOpen(true)}
          />
        ) : null}
      </div>

      <ReviewDecisionDialog
        confirmLabel="Aprovar férias"
        description="Confirme a aprovação do pedido e registre uma observação para o histórico administrativo."
        isPending={reviewVacationRequest.isPending}
        noteLabel="Observação da aprovação"
        notePlaceholder="Ex.: saldo conferido, cobertura validada e comunicado liberado."
        summary={[
          { label: 'Colaborador', value: data.employeeName },
          { label: 'Período', value: formatVacationPeriod(data.startDate, data.endDate) },
          { label: 'Saldo disponível', value: `${data.availableDays} dias` },
          { label: 'Departamento', value: data.department },
          { label: 'Risco de cobertura', value: coverageRiskMeta[data.operationalInsight.coverageRisk].label },
        ]}
        onConfirm={async (notes) => {
          await handleReview('approved', notes || 'Solicitação aprovada pelo RH.');
        }}
        onOpenChange={setApproveOpen}
        open={approveOpen}
        title="Aprovar solicitação de férias"
      />

      <ReviewDecisionDialog
        confirmLabel="Reprovar solicitação"
        confirmVariant="destructive"
        description="Informe o motivo da reprovação para manter rastreabilidade e orientar o colaborador."
        isPending={reviewVacationRequest.isPending}
        noteLabel="Motivo da reprovação"
        notePlaceholder="Ex.: conflito operacional, saldo insuficiente ou ausência de cobertura."
        summary={[
          { label: 'Colaborador', value: data.employeeName },
          { label: 'Período', value: formatVacationPeriod(data.startDate, data.endDate) },
          { label: 'Saldo disponível', value: `${data.availableDays} dias` },
          { label: 'Cobertura', value: data.coverageNotes ?? 'Sem observação operacional' },
          { label: 'Conflitos no período', value: String(data.operationalInsight.overlapCount) },
        ]}
        onConfirm={async (notes) => {
          await handleReview('rejected', notes);
        }}
        onOpenChange={setRejectOpen}
        open={rejectOpen}
        requireReason
        title="Reprovar solicitação de férias"
      />
    </div>
  );
};
