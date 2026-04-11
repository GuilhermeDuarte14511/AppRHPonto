'use client';

import Link from 'next/link';
import { ArrowLeft, Clock3, Download, FileText, Radar, ShieldCheck } from 'lucide-react';

import { Badge, Button, Card, EmptyState, ErrorState, PageHeader } from '@rh-ponto/ui';

import { AppAvatar } from '@/shared/components/app-avatar';
import { DetailPageSkeleton } from '@/shared/components/page-skeletons';
import { getActionErrorMessage } from '@/shared/lib/mutation-feedback';

import { downloadAuditDetailJson } from '../lib/audit-export';
import { useAuditDetail } from '../hooks/use-audit-detail';

const timelineToneClasses = {
  primary: 'bg-[var(--primary-fixed)] text-[var(--primary)]',
  warning: 'bg-[var(--tertiary-fixed)] text-[var(--on-tertiary-fixed-variant)]',
  secondary: 'bg-[var(--secondary-fixed)] text-[var(--secondary)]',
} as const;

export const AuditDetailView = ({ auditId }: { auditId: string }) => {
  const { data, error, isError, isLoading, refetch } = useAuditDetail(auditId);

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Não foi possível carregar o registro de auditoria"
        description={getActionErrorMessage(error, 'Tente novamente para abrir os detalhes do evento selecionado.')}
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
        title="Registro de auditoria não encontrado"
        description="O identificador informado não existe na base atual."
      />
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      <PageHeader
        eyebrow={`Auditoria / ${data.auditCode}`}
        title="Detalhes do registro de auditoria"
        description={data.summary}
        actions={
          <>
            <Button asChild className="whitespace-nowrap" size="lg" variant="outline">
              <Link href="/audit">
                <ArrowLeft className="h-4 w-4" />
                Voltar para auditoria
              </Link>
            </Button>
            <Button className="whitespace-nowrap" size="lg" onClick={() => downloadAuditDetailJson(data)}>
              <Download className="h-4 w-4" />
              Exportar log
            </Button>
          </>
        }
      />

      <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden p-5 sm:p-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-center">
            <AppAvatar className="items-start" name={data.subjectName} size="lg" />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="neutral">{data.auditCode}</Badge>
                <Badge variant="success">{data.integrityLabel}</Badge>
                <Badge variant="info">{data.eventTypeLabel}</Badge>
              </div>

              <h2 className="mt-4 font-headline text-3xl font-extrabold text-[var(--on-surface)]">{data.subjectName}</h2>
              <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
                {data.subjectRole} · {data.subjectLocation}
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[1.5rem] bg-[var(--surface-container-low)] px-5 py-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Data e hora</p>
                  <p className="mt-2 text-sm font-semibold text-[var(--on-surface)]">{data.occurredAtLabel}</p>
                </div>
                <div className="rounded-[1.5rem] bg-[var(--surface-container-low)] px-5 py-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Severidade</p>
                  <p className="mt-2 text-sm font-semibold text-[var(--on-surface)]">{data.severityLabel}</p>
                </div>
                <div className="rounded-[1.5rem] bg-[var(--surface-container-low)] px-5 py-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Confiança</p>
                  <p className="mt-2 text-sm font-semibold text-[var(--primary)]">{data.confidenceScoreLabel}</p>
                </div>
                <div className="rounded-[1.5rem] bg-[var(--primary-fixed)] px-5 py-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--primary)]">Responsável</p>
                  <p className="mt-2 text-sm font-semibold text-[var(--primary)]">{data.actorName}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-container-low)] text-[var(--primary)]">
                <FileText className="h-4 w-4" />
              </span>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">O que aconteceu</p>
            </div>
            <p className="mt-3 font-headline text-xl font-extrabold text-[var(--on-surface)]">{data.actionLabel}</p>
            <p className="mt-3 text-sm leading-7 text-[var(--on-surface-variant)]">{data.note}</p>
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-container-low)] text-[var(--primary)]">
                <Radar className="h-4 w-4" />
              </span>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Metadados de origem</p>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {data.metadata.map((item) => (
                <div key={item.label} className="rounded-[1.25rem] bg-[var(--surface-container-low)] px-4 py-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-[var(--on-surface)]">{item.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-5 sm:p-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[var(--primary)]" />
            <h3 className="font-headline text-xl font-extrabold text-[var(--on-surface)]">O que mudou</h3>
          </div>

          <div className="mt-6 space-y-4">
            {data.changes.length === 0 ? (
              <div className="rounded-[1.5rem] bg-[var(--surface-container-low)] px-5 py-6 text-sm text-[var(--on-surface-variant)]">
                Este evento não alterou campos comparáveis entre o estado anterior e o novo estado.
              </div>
            ) : (
              data.changes.map((change) => (
                <div key={change.fieldLabel} className="grid gap-4 rounded-[1.5rem] bg-[var(--surface-container-low)] p-5 md:grid-cols-[1fr_auto_1fr] md:items-center">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Campo</p>
                    <p className="mt-2 font-semibold text-[var(--on-surface)]">{change.fieldLabel}</p>
                  </div>
                  <div className="text-center text-xs font-bold uppercase tracking-[0.16em] text-[var(--primary)]">Alteração</div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-[1rem] bg-white px-4 py-3">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Anterior</p>
                      <p className="mt-2 text-sm text-[var(--on-surface-variant)] line-through">{change.previousValue}</p>
                    </div>
                    <div className="rounded-[1rem] bg-[var(--primary-fixed)] px-4 py-3">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--primary)]">Novo valor</p>
                      <p className="mt-2 text-sm font-semibold text-[var(--primary)]">{change.nextValue}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-5 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-container-low)] text-[var(--primary)]">
              <FileText className="h-4 w-4" />
            </span>
            <h3 className="font-headline text-xl font-extrabold text-[var(--on-surface)]">Registros relacionados</h3>
          </div>
          <div className="mt-6 space-y-4">
            {data.relatedRecords.map((record) => (
              <Link
                key={record.id}
                href={`/audit/${record.id}`}
                className="block rounded-[1.5rem] bg-[var(--surface-container-low)] px-5 py-5 transition hover:bg-[var(--surface-container)]"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="neutral">{record.entityLabel}</Badge>
                  <Badge variant="info">{record.actionLabel}</Badge>
                </div>
                <p className="mt-3 font-semibold text-[var(--on-surface)]">{record.summary}</p>
                <p className="mt-2 text-sm text-[var(--on-surface-variant)]">{record.occurredAtLabel}</p>
              </Link>
            ))}
          </div>
        </Card>
      </section>

      <Card className="p-5 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-container-low)] text-[var(--primary)]">
            <Clock3 className="h-4 w-4" />
          </span>
          <h3 className="font-headline text-xl font-extrabold text-[var(--on-surface)]">Linha do tempo do registro</h3>
        </div>
        <div className="mt-8 space-y-6">
          {data.timeline.map((item) => (
            <div key={item.id} className="flex gap-4 rounded-[1.5rem] bg-[var(--surface-container-low)] p-5">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${timelineToneClasses[item.tone]}`}>
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-headline text-lg font-extrabold text-[var(--on-surface)]">{item.title}</p>
                  <Badge variant="neutral">{item.badgeLabel}</Badge>
                </div>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">{item.timestampLabel}</p>
                <p className="mt-3 text-sm leading-7 text-[var(--on-surface-variant)]">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
