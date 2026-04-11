'use client';

import { CheckCircle2, FileText, ShieldAlert, XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { formatDateTime } from '@rh-ponto/core';
import { getJustificationStatusVariant } from '@rh-ponto/justifications';
import { Badge, Button, Card, ErrorState, PageHeader } from '@rh-ponto/ui';

import { ReviewDecisionDialog } from '@/shared/components/review-decision-dialog';
import { TablePageSkeleton } from '@/shared/components/page-skeletons';
import { StatCard } from '@/shared/components/stat-card';
import { useCurrentUser } from '@/shared/hooks/use-current-user';
import {
  formatJustificationStatusLabel,
  formatJustificationTypeLabel,
  formatTimeRecordTypeLabel,
} from '@/shared/lib/admin-formatters';
import { getActionErrorMessage } from '@/shared/lib/mutation-feedback';

import { useReviewJustification, useJustifications } from '../hooks/use-justifications';

const JustificationMetaRow = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-[1rem] bg-[var(--surface-container-low)] px-4 py-3">
    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">{label}</p>
    <p className="mt-2 text-sm font-semibold text-[var(--on-surface)]">{value}</p>
  </div>
);

export const JustificationsListView = () => {
  const { data, error, isError, isLoading, refetch } = useJustifications();
  const reviewJustification = useReviewJustification();
  const currentUser = useCurrentUser();
  const [selectedJustificationId, setSelectedJustificationId] = useState<string | null>(null);
  const [decisionType, setDecisionType] = useState<'approved' | 'rejected' | null>(null);

  if (isLoading) {
    return <TablePageSkeleton />;
  }

  if (isError || !data) {
    return (
      <ErrorState
        title="Não foi possível carregar as justificativas"
        description={getActionErrorMessage(error, 'Tente novamente para abrir a fila de análise do RH.')}
        actionLabel="Tentar novamente"
        onAction={() => {
          void refetch();
        }}
      />
    );
  }

  const selectedJustification = data.find((item) => item.id === selectedJustificationId) ?? null;

  const pending = data.filter((item) => item.status === 'pending').length;
  const approved = data.filter((item) => item.status === 'approved').length;
  const rejected = data.filter((item) => item.status === 'rejected').length;

  return (
    <div className="space-y-8 sm:space-y-10">
      <PageHeader
        eyebrow="Justificativas / Fila"
        title="Análise de justificativas"
        description="Fila administrativa para aprovar ou reprovar pedidos relacionados a atrasos, ausências e ajustes."
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card className="primary-gradient p-8 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/14 text-white">
              <ShieldAlert className="h-5 w-5" />
            </span>
            <div>
              <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.16em] text-white/76">Fila atual</p>
              <p className="mt-2 font-headline text-5xl font-extrabold">{pending}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/82">Itens aguardando decisão do administrativo.</p>
        </Card>
        <StatCard
          badge="Concluído"
          hint="Itens liberados para efeito de folha"
          icon={CheckCircle2}
          label="Aprovadas"
          tone="secondary"
          value={String(approved)}
        />
        <StatCard
          badge="Controle"
          hint="Itens rejeitados com observação"
          icon={XCircle}
          label="Reprovadas"
          tone="danger"
          value={String(rejected)}
        />
        <StatCard
          badge="Comprovantes"
          hint="Anexos e documentos enviados para apoiar a análise"
          icon={FileText}
          label="Envios"
          tone="tertiary"
          value={String(data.filter((item) => item.timeRecordId || item.reviewedByUserId || item.requestedRecordType).length)}
        />
      </section>

      <div className="grid gap-6">
        {data.map((item) => (
          <Card key={item.id} className="p-5 sm:p-6">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0 flex-1 space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant={getJustificationStatusVariant(item.status)}>
                    {formatJustificationStatusLabel(item.status)}
                  </Badge>
                  <span className="inline-flex items-center rounded-full bg-[var(--primary-fixed)] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--primary)]">
                    {formatJustificationTypeLabel(item.type)}
                  </span>
                </div>

                <div>
                  <h3 className="font-headline text-2xl font-extrabold text-[var(--on-surface)]">{item.employeeName}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                    {item.department}
                  </p>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--on-surface-variant)]">{item.reason}</p>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <JustificationMetaRow label="Solicitada em" value={formatDateTime(item.createdAt)} />
                  <JustificationMetaRow label="Registro alvo" value={item.timeRecordId ?? '-'} />
                  <JustificationMetaRow
                    label="Tipo solicitado"
                    value={item.requestedRecordType ? formatTimeRecordTypeLabel(item.requestedRecordType) : '-'}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row xl:justify-end">
                {item.status === 'pending' ? (
                  <>
                    <Button
                      className="w-full sm:w-auto"
                      onClick={() => {
                        setSelectedJustificationId(item.id);
                        setDecisionType('approved');
                      }}
                    >
                      Aprovar
                    </Button>
                    <Button
                      className="w-full sm:w-auto"
                      variant="outline"
                      onClick={() => {
                        setSelectedJustificationId(item.id);
                        setDecisionType('rejected');
                      }}
                    >
                      Reprovar
                    </Button>
                  </>
                ) : (
                  <div className="rounded-full bg-[var(--surface-container-low)] px-4 py-2 text-sm text-[var(--on-surface-variant)]">
                    Revisado por {item.reviewedByUserId ?? '-'}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <ReviewDecisionDialog
        confirmLabel="Aprovar justificativa"
        description={`Confirme a aprovação de ${selectedJustification?.employeeName ?? 'esta justificativa'} e registre uma observação para o histórico.`}
        isPending={reviewJustification.isPending}
        noteLabel="Observação da aprovação"
        notePlaceholder="Ex.: documento conferido e justificativa coerente com o registro informado."
        summary={
          selectedJustification
            ? [
                { label: 'Colaborador', value: selectedJustification.employeeName },
                { label: 'Departamento', value: selectedJustification.department },
                {
                  label: 'Tipo',
                  value: formatJustificationTypeLabel(selectedJustification.type),
                },
                {
                  label: 'Solicitada em',
                  value: formatDateTime(selectedJustification.createdAt),
                },
              ]
            : []
        }
        onConfirm={async (notes) => {
          if (!currentUser) {
            throw new Error('Sessão do usuário não disponível para registrar a aprovação.');
          }

          await reviewJustification.mutateAsync({
            justificationId: selectedJustificationId ?? '',
            status: 'approved',
            reviewNotes: notes || 'Justificativa aprovada na fila administrativa.',
            reviewedByUserId: currentUser.id,
          });
          toast.success('Justificativa aprovada com sucesso.');
        }}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedJustificationId(null);
            setDecisionType(null);
          }
        }}
        open={decisionType === 'approved' && Boolean(selectedJustification)}
        title="Aprovar justificativa"
      />

      <ReviewDecisionDialog
        confirmLabel="Reprovar justificativa"
        confirmVariant="destructive"
        description={`Informe o motivo da reprovação para orientar ${selectedJustification?.employeeName ?? 'o colaborador'} com clareza.`}
        isPending={reviewJustification.isPending}
        noteLabel="Motivo da reprovação"
        notePlaceholder="Ex.: documento insuficiente, divergência de horário ou informação inconsistente."
        summary={
          selectedJustification
            ? [
                { label: 'Colaborador', value: selectedJustification.employeeName },
                { label: 'Departamento', value: selectedJustification.department },
                {
                  label: 'Tipo',
                  value: formatJustificationTypeLabel(selectedJustification.type),
                },
                {
                  label: 'Registro alvo',
                  value: selectedJustification.timeRecordId ?? 'Sem vínculo direto',
                },
              ]
            : []
        }
        onConfirm={async (notes) => {
          if (!currentUser) {
            throw new Error('Sessão do usuário não disponível para registrar a reprovação.');
          }

          await reviewJustification.mutateAsync({
            justificationId: selectedJustificationId ?? '',
            status: 'rejected',
            reviewNotes: notes,
            reviewedByUserId: currentUser.id,
          });
          toast.success('Justificativa reprovada com sucesso.');
        }}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedJustificationId(null);
            setDecisionType(null);
          }
        }}
        open={decisionType === 'rejected' && Boolean(selectedJustification)}
        requireReason
        title="Reprovar justificativa"
      />
    </div>
  );
};
