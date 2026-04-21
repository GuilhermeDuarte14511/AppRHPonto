'use client';

import { Badge, Button, Card, Dialog, DialogContent } from '@rh-ponto/ui';
import { ClipboardList, ExternalLink, ShieldAlert, Sparkles, Workflow } from 'lucide-react';
import { useState } from 'react';

import { ReviewDecisionDialog } from '@/shared/components/review-decision-dialog';
import { formatTimeRecordTypeLabel } from '@/shared/lib/admin-formatters';
import { TimeRecordDetailsDialog } from '@/features/time-records/components/time-record-details-dialog';
import type { TimeRecordListItem } from '@/features/time-records/components/time-record-list-item';

import type { OperationsInboxItem } from '../lib/operations-inbox-service';
import { TimeAdjustmentConfidenceBadge } from './time-adjustment-confidence-badge';
import { TimeAdjustmentRoutingBadge } from './time-adjustment-routing-badge';

const actionLabel: Record<string, string> = {
  complete_with_expected_time: 'Completar com horário esperado',
  request_employee_confirmation: 'Pedir confirmação adicional',
  review_daily_sequence: 'Revisar sequência do dia',
  request_justification: 'Solicitar justificativa',
  escalate_for_compliance_review: 'Escalar para revisão',
};

const impactLabel: Record<string, string> = {
  none: 'Sem impacto operacional direto',
  payroll: 'Impacto no fechamento da folha',
  compliance: 'Impacto de compliance',
  payroll_and_compliance: 'Impacto em fechamento e compliance',
};

const confidenceLabel: Record<'high' | 'medium' | 'low', string> = {
  high: 'Alta',
  medium: 'Média',
  low: 'Baixa',
};

const routingTargetLabel: Record<'manager' | 'hr' | 'operations', string> = {
  manager: 'Gestor',
  hr: 'RH',
  operations: 'Operação',
};

export const TimeAdjustmentCaseDetailDialog = ({
  item,
  open,
  onOpenChange,
  isPending,
  onApprove,
  onReject,
  onRequestJustification,
  onEscalate,
  timeRecord,
  deviceLabel,
}: {
  item: OperationsInboxItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPending?: boolean;
  onApprove: (item: OperationsInboxItem, notes: string) => Promise<void>;
  onReject: (item: OperationsInboxItem, notes: string) => Promise<void>;
  onRequestJustification: (item: OperationsInboxItem, notes: string) => Promise<void>;
  onEscalate: (item: OperationsInboxItem, notes: string) => Promise<void>;
  timeRecord?: TimeRecordListItem | null;
  deviceLabel?: string | null;
}) => {
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [justificationOpen, setJustificationOpen] = useState(false);
  const [escalateOpen, setEscalateOpen] = useState(false);
  const [fullDetailOpen, setFullDetailOpen] = useState(false);

  if (!item?.assistedReview) {
    return null;
  }

  const assistedReview = item.assistedReview;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[min(96vw,84rem)] rounded-[2rem] p-0">
          <div className="border-b border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] bg-[linear-gradient(135deg,rgba(226,232,240,0.92),rgba(255,255,255,0.97))] px-5 py-5 sm:px-8 sm:py-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="info">Ajuste assistido</Badge>
                  <TimeAdjustmentConfidenceBadge confidence={assistedReview.confidence} />
                  <TimeAdjustmentRoutingBadge routingTarget={assistedReview.routingTarget} />
                </div>
                <h2 className="mt-4 font-headline text-3xl font-extrabold tracking-tight text-[var(--on-surface)]">
                  {item.title}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--on-surface-variant)]">{item.description}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                {timeRecord ? (
                  <Button variant="outline" onClick={() => setFullDetailOpen(true)}>
                    <ExternalLink className="h-4 w-4" />
                    Ver marcação completa
                  </Button>
                ) : null}
              </div>
            </div>
          </div>

          <div className="space-y-6 px-5 py-5 sm:px-8 sm:py-7">
            <section className="grid gap-4 lg:grid-cols-3">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-[var(--primary)]" />
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                      Sugestão
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[var(--on-surface)]">
                      {actionLabel[assistedReview.recommendedAction] ?? assistedReview.recommendedAction}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="h-5 w-5 text-[var(--primary)]" />
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                      Impacto
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[var(--on-surface)]">
                      {impactLabel[assistedReview.closureImpact] ?? assistedReview.closureImpact}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Workflow className="h-5 w-5 text-[var(--primary)]" />
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                      Resumo
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[var(--on-surface)]">{assistedReview.decisionSummary}</p>
                  </div>
                </div>
              </Card>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              <Card className="p-5">
                <div className="flex items-center gap-3">
                  <ClipboardList className="h-5 w-5 text-[var(--primary)]" />
                  <div>
                    <p className="font-headline text-lg font-extrabold text-[var(--on-surface)]">Motivo da confiança</p>
                    <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                      O que sustenta o nível de automação assistida deste caso.
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-[var(--on-surface)]">{assistedReview.confidenceReason}</p>
              </Card>

              <Card className="p-5">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-[var(--primary)]" />
                  <div>
                    <p className="font-headline text-lg font-extrabold text-[var(--on-surface)]">Por que esta sugestão</p>
                    <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                      Explicação operacional para a ação recomendada.
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-[var(--on-surface)]">{assistedReview.suggestionReason}</p>
              </Card>
            </section>

            <Card className="p-5">
              <div className="grid gap-4 lg:grid-cols-4">
                <div className="rounded-[1.2rem] bg-[var(--surface-container-low)] p-4">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                    Colaborador
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--on-surface)]">{assistedReview.employeeName}</p>
                </div>
                <div className="rounded-[1.2rem] bg-[var(--surface-container-low)] p-4">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                    Marcação
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--on-surface)]">
                    {formatTimeRecordTypeLabel(timeRecord?.recordType ?? assistedReview.recordType)}
                  </p>
                </div>
                <div className="rounded-[1.2rem] bg-[var(--surface-container-low)] p-4">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                    Horário
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--on-surface)]">{item.occurredAt}</p>
                </div>
                <div className="rounded-[1.2rem] bg-[var(--surface-container-low)] p-4">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                    Lote
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--on-surface)]">
                    {assistedReview.batchEligible ? 'Elegível' : 'Fora do lote inicial'}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-5 w-5 text-[var(--primary)]" />
                <div>
                  <p className="font-headline text-lg font-extrabold text-[var(--on-surface)]">Decisão administrativa</p>
                  <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                    Registre a decisão do caso usando a mesma trilha de confirmação do restante do admin.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Button disabled={isPending} onClick={() => setApproveOpen(true)}>
                  Aprovar sugestão
                </Button>
                <Button disabled={isPending} variant="outline" onClick={() => setJustificationOpen(true)}>
                  Solicitar justificativa
                </Button>
                <Button disabled={isPending} variant="outline" onClick={() => setEscalateOpen(true)}>
                  Escalar caso
                </Button>
                <Button disabled={isPending} variant="destructive" onClick={() => setRejectOpen(true)}>
                  Rejeitar sugestão
                </Button>
              </div>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <ReviewDecisionDialog
        confirmLabel="Aprovar sugestão"
        description="Confirme a aprovação desta sugestão assistida e registre uma observação para a trilha operacional."
        isPending={isPending}
        noteLabel="Observação da aprovação"
        notePlaceholder="Ex.: sugestão coerente com a jornada e sem risco adicional."
        onConfirm={(notes) => onApprove(item, notes)}
        onOpenChange={setApproveOpen}
        open={approveOpen}
        summary={[
          { label: 'Colaborador', value: assistedReview.employeeName },
          { label: 'Sugestão', value: actionLabel[assistedReview.recommendedAction] ?? assistedReview.recommendedAction },
          { label: 'Destino', value: routingTargetLabel[assistedReview.routingTarget] },
          { label: 'Impacto', value: impactLabel[assistedReview.closureImpact] ?? assistedReview.closureImpact },
        ]}
        title="Aprovar caso assistido"
      />

      <ReviewDecisionDialog
        confirmLabel="Solicitar justificativa"
        description="Registre o motivo da solicitação adicional para o histórico do caso."
        isPending={isPending}
        noteLabel="Orientação para a justificativa"
        notePlaceholder="Ex.: detalhe por que a batida precisa de contexto adicional antes do fechamento."
        onConfirm={(notes) => onRequestJustification(item, notes)}
        onOpenChange={setJustificationOpen}
        open={justificationOpen}
        requireReason
        summary={[
          { label: 'Colaborador', value: assistedReview.employeeName },
          { label: 'Exceção', value: item.title },
          { label: 'Confiança', value: confidenceLabel[assistedReview.confidence] },
        ]}
        title="Solicitar justificativa adicional"
      />

      <ReviewDecisionDialog
        confirmLabel="Escalar caso"
        description="Explique por que este caso precisa subir de nível antes de qualquer aprovação."
        isPending={isPending}
        noteLabel="Motivo da escalação"
        notePlaceholder="Ex.: risco de compliance, divergência operacional ou necessidade de validação extra."
        onConfirm={(notes) => onEscalate(item, notes)}
        onOpenChange={setEscalateOpen}
        open={escalateOpen}
        requireReason
        summary={[
          { label: 'Colaborador', value: assistedReview.employeeName },
          { label: 'Destino recomendado', value: routingTargetLabel[assistedReview.routingTarget] },
          { label: 'Impacto', value: impactLabel[assistedReview.closureImpact] ?? assistedReview.closureImpact },
        ]}
        title="Escalar caso assistido"
      />

      <ReviewDecisionDialog
        confirmLabel="Rejeitar sugestão"
        confirmVariant="destructive"
        description="Registre o motivo da rejeição da sugestão assistida para manter rastreabilidade."
        isPending={isPending}
        noteLabel="Motivo da rejeição"
        notePlaceholder="Ex.: contexto inconsistente, evidências insuficientes ou conflito com outra ocorrência."
        onConfirm={(notes) => onReject(item, notes)}
        onOpenChange={setRejectOpen}
        open={rejectOpen}
        requireReason
        summary={[
          { label: 'Colaborador', value: assistedReview.employeeName },
          { label: 'Sugestão rejeitada', value: actionLabel[assistedReview.recommendedAction] ?? assistedReview.recommendedAction },
          { label: 'Confiança', value: confidenceLabel[assistedReview.confidence] },
        ]}
        title="Rejeitar sugestão assistida"
      />

      {timeRecord ? (
        <TimeRecordDetailsDialog
          deviceLabel={deviceLabel}
          onAdjust={() => undefined}
          onOpenChange={setFullDetailOpen}
          open={fullDetailOpen}
          record={timeRecord}
        />
      ) : null}
    </>
  );
};
