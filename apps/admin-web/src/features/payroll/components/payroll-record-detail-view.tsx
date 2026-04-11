'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import {
  ChevronLeft,
  FileSignature,
  FileText,
  Printer,
  ScrollText,
  ShieldCheck,
  TimerReset,
} from 'lucide-react';
import { toast } from 'sonner';

import { Badge, Button, EmptyState, ErrorState, PageHeader } from '@rh-ponto/ui';

import { DetailPageSkeleton } from '@/shared/components/page-skeletons';
import { getActionErrorMessage } from '@/shared/lib/mutation-feedback';
import { usePayrollRecordDetail, useValidatePayrollRecord } from '../hooks/use-payroll-overview';
import { openPayrollPdfForRecord } from '../lib/payroll-print';
import { PayrollRecordContextTabs, type PayrollDetailTabId } from './payroll-record-context-tabs';

const noteBadgeStyles = {
  neutral: 'bg-[var(--surface-container)] text-[var(--on-surface-variant)]',
  warning: 'bg-[var(--tertiary-fixed)] text-[var(--on-tertiary-fixed-variant)]',
  danger: 'bg-[var(--error-container)] text-[var(--on-error-container)]',
  info: 'bg-[var(--primary-fixed)] text-[var(--primary)]',
} as const;

const detailStatusBadge = {
  validado: 'success',
  pendente: 'warning',
  em_analise: 'info',
} as const;

const detailStatusLabel = {
  validado: 'Validado',
  pendente: 'Pendente',
  em_analise: 'Em análise',
} as const;

const PrintableDocumentCard = ({
  onPrint,
}: {
  onPrint: () => void;
}) => (
  <section className="rounded-[2rem] border border-[color:color-mix(in_srgb,var(--primary)_14%,transparent)] bg-[color:color-mix(in_srgb,var(--primary-fixed)_48%,white)] p-5 sm:p-8">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-white text-[var(--primary)] shadow-[var(--shadow-card)]">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <div>
          <h3 className="font-headline text-xl font-extrabold text-[var(--on-surface)]">Documento pronto para envio</h3>
          <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
            Gere o PDF desta folha para compartilhar com o colaborador ou seguir para assinatura.
          </p>
        </div>
      </div>
      <Button className="w-full md:w-auto" size="lg" variant="outline" onClick={onPrint}>
        <Printer className="h-4 w-4" />
        Imprimir folha
      </Button>
    </div>
  </section>
);

export const PayrollRecordDetailView = ({ payrollId }: { payrollId: string }) => {
  const { data, error, isError, isLoading, refetch } = usePayrollRecordDetail(payrollId);
  const validateRecordMutation = useValidatePayrollRecord();
  const [activeTab, setActiveTab] = useState<PayrollDetailTabId>('summary');
  const tabsetId = useId();

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Não foi possível carregar o espelho de ponto"
        description={getActionErrorMessage(error, 'Tente novamente para abrir os detalhes da folha selecionada.')}
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
        description="O colaborador selecionado não existe na base atual da folha."
        title="Folha não encontrada"
      />
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      <PageHeader
        eyebrow="Folha / Detalhamento individual"
        title="Detalhamento de folha"
        description={`Referência ${data.periodLabel} · espelho completo de ${data.employeeName}.`}
        actions={
          <>
            <Button asChild size="lg" variant="outline">
              <Link href="/payroll">
                <ChevronLeft className="h-4 w-4" />
                Voltar
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                void openPayrollPdfForRecord(data);
              }}
            >
              <Printer className="h-4 w-4" />
              Imprimir PDF
            </Button>
            <Button
              disabled={data.status === 'validado' || validateRecordMutation.isPending}
              size="lg"
              onClick={async () => {
                await validateRecordMutation.mutateAsync(data.id);
                toast.success('Espelho validado com sucesso.');
              }}
            >
              <ShieldCheck className="h-4 w-4" />
              {data.status === 'validado' ? 'Folha validada' : 'Validar folha'}
            </Button>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.75rem] bg-[var(--surface-container-lowest)] p-6 shadow-[var(--shadow-card)]">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Total do mês</p>
          <p className="mt-3 font-headline text-4xl font-extrabold text-[var(--on-surface)]">{data.workedHoursLabel}</p>
          <p className="mt-2 text-sm text-[var(--on-surface-variant)]">{data.workedHoursHint}</p>
        </div>
        <div className="rounded-[1.75rem] bg-[var(--surface-container-lowest)] p-6 shadow-[var(--shadow-card)]">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Horas normais</p>
          <p className="mt-3 font-headline text-4xl font-extrabold text-[var(--on-surface)]">{data.normalHoursLabel}</p>
          <p className="mt-2 text-sm text-[var(--on-surface-variant)]">{data.normalHoursHint}</p>
        </div>
        <div className="rounded-[1.75rem] bg-[var(--surface-container-lowest)] p-6 shadow-[var(--shadow-card)]">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Banco de horas</p>
          <p className="mt-3 font-headline text-4xl font-extrabold text-[var(--primary)]">{data.bankHoursLabel}</p>
          <p className="mt-2 text-sm text-[var(--on-surface-variant)]">{data.bankHoursHint}</p>
        </div>
        <div className="rounded-[1.75rem] bg-[var(--surface-container-lowest)] p-6 shadow-[var(--shadow-card)]">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Horas extras</p>
          <p className="mt-3 font-headline text-4xl font-extrabold text-[var(--on-surface)]">{data.overtimeHoursLabel}</p>
          <p className="mt-2 text-sm text-[var(--on-surface-variant)]">{data.overtimeHoursHint}</p>
        </div>
      </section>

      <PayrollRecordContextTabs activeTab={activeTab} onChange={setActiveTab} tabsetId={tabsetId} />

      <div aria-labelledby={`${tabsetId}-${activeTab}-tab`} id={`${tabsetId}-${activeTab}-panel`} role="tabpanel" className="space-y-8">
        {activeTab === 'summary' ? (
          <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[2rem] bg-[var(--surface-container-lowest)] p-5 shadow-[var(--shadow-card)] sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={detailStatusBadge[data.status]}>{detailStatusLabel[data.status]}</Badge>
                <Badge variant="neutral">{data.department}</Badge>
                <Badge variant="info">{data.scheduleLabel}</Badge>
              </div>

              <h2 className="mt-5 font-headline text-3xl font-extrabold text-[var(--on-surface)]">{data.employeeName}</h2>
              <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
                {data.role} · Matrícula {data.registrationNumber} · CPF {data.employeeCpf}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[1.25rem] bg-[var(--surface-container-low)] px-4 py-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Período</p>
                  <p className="mt-2 text-sm font-semibold text-[var(--on-surface)]">
                    {data.periodStartLabel} até {data.periodEndLabel}
                  </p>
                </div>
                <div className="rounded-[1.25rem] bg-[var(--surface-container-low)] px-4 py-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Gestor imediato</p>
                  <p className="mt-2 text-sm font-semibold text-[var(--on-surface)]">{data.managerName}</p>
                </div>
                <div className="rounded-[1.25rem] bg-[var(--surface-container-low)] px-4 py-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Gestor de RH</p>
                  <p className="mt-2 text-sm font-semibold text-[var(--on-surface)]">{data.rhManagerName}</p>
                </div>
                <div className="rounded-[1.25rem] bg-[var(--primary-fixed)] px-4 py-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--primary)]">Status de validação</p>
                  <p className="mt-2 text-sm font-semibold text-[var(--primary)]">{data.validationStatusLabel}</p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-[1.25rem] bg-[var(--surface-container-low)] px-4 py-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Extras 50%</p>
                  <p className="mt-2 text-xl font-extrabold text-[var(--on-surface)]">{data.overtime50HoursLabel}</p>
                </div>
                <div className="rounded-[1.25rem] bg-[var(--surface-container-low)] px-4 py-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Extras 100%</p>
                  <p className="mt-2 text-xl font-extrabold text-[var(--on-surface)]">{data.overtime100HoursLabel}</p>
                </div>
                <div className="rounded-[1.25rem] bg-[var(--surface-container-low)] px-4 py-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Adicional noturno</p>
                  <p className="mt-2 text-xl font-extrabold text-[var(--on-surface)]">{data.nightHoursLabel}</p>
                </div>
                <div className="rounded-[1.25rem] bg-[var(--surface-container-low)] px-4 py-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Atrasos</p>
                  <p className="mt-2 text-xl font-extrabold text-[var(--on-surface)]">{data.lateHoursLabel}</p>
                </div>
                <div className="rounded-[1.25rem] bg-[var(--surface-container-low)] px-4 py-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Ausências abonadas</p>
                  <p className="mt-2 text-xl font-extrabold text-[var(--on-surface)]">{data.approvedAbsencesLabel}</p>
                </div>
                <div className="rounded-[1.25rem] bg-[var(--surface-container-low)] px-4 py-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Ausências não abonadas</p>
                  <p className="mt-2 text-xl font-extrabold text-[var(--on-surface)]">{data.unapprovedAbsencesLabel}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] bg-[var(--surface-container-lowest)] p-5 shadow-[var(--shadow-card)] sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-container-low)] text-[var(--primary)]">
                    <TimerReset className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-headline text-xl font-extrabold text-[var(--on-surface)]">Conferências do período</h3>
                    <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                      Resumo das leituras e ocorrências mais relevantes desta competência.
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {data.occurrenceSummary.map((occurrence) => (
                    <div key={occurrence} className="rounded-[1.25rem] bg-[var(--surface-container-low)] px-4 py-4 text-sm leading-7 text-[var(--on-surface-variant)]">
                      {occurrence}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-[color:color-mix(in_srgb,var(--primary)_14%,transparent)] bg-[color:color-mix(in_srgb,var(--primary-fixed)_48%,white)] p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[var(--primary)] shadow-[var(--shadow-card)]">
                    <FileText className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-headline text-xl font-extrabold text-[var(--on-surface)]">Resumo documental</h3>
                    <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                      {data.documents.length} documento(s) vinculado(s) à competência e pronto(s) para conferência.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {activeTab === 'timesheet' ? (
          <section className="overflow-hidden rounded-[2rem] bg-[var(--surface-container-lowest)] shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-3 border-b border-[color:color-mix(in_srgb,var(--outline-variant)_14%,transparent)] px-5 py-4 sm:px-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-container-low)] text-[var(--primary)]">
                <ScrollText className="h-4 w-4" />
              </span>
              <div>
                <p className="font-headline text-sm font-extrabold text-[var(--on-surface)]">Espelho diário</p>
                <p className="mt-1 text-sm text-[var(--on-surface-variant)]">Marcações, saldos e observações consolidadas do período.</p>
              </div>
            </div>

            <div className="grid gap-4 p-4 lg:hidden">
              {data.days.map((day) => (
                <div key={day.id} className="rounded-[1.5rem] bg-[var(--surface-container-low)] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[var(--on-surface)]">{day.date}</p>
                      <p className="text-xs text-[var(--on-surface-variant)]">
                        {day.weekday} - {day.sourceLabel}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--on-surface-variant)]">Saldo</p>
                      <p className="font-semibold text-[var(--on-surface)]">{day.balance}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--on-surface-variant)]">Entrada 1</p>
                      <p className="mt-1 font-semibold text-[var(--on-surface)]">{day.firstEntry ?? '-'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--on-surface-variant)]">Saída 1</p>
                      <p className="mt-1 font-semibold text-[var(--on-surface)]">{day.firstExit ?? '-'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--on-surface-variant)]">Entrada 2</p>
                      <p className="mt-1 font-semibold text-[var(--on-surface)]">{day.secondEntry ?? '-'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--on-surface-variant)]">Saída 2</p>
                      <p className="mt-1 font-semibold text-[var(--on-surface)]">{day.secondExit ?? '-'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--on-surface-variant)]">Normal</p>
                      <p className="mt-1 font-semibold text-[var(--on-surface)]">{day.regularHours}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--on-surface-variant)]">Extra</p>
                      <p className="mt-1 font-semibold text-[var(--on-surface)]">{day.overtimeHours}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {day.note ? (
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] ${noteBadgeStyles[day.noteTone]}`}>
                        {day.note}
                      </span>
                    ) : (
                      <span className="text-sm text-[var(--on-surface-variant)]">Sem alerta</span>
                    )}
                    <p className="text-sm leading-6 text-[var(--on-surface-variant)]">
                      {day.occurrenceDetail ?? 'Sem observações adicionais.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead className="bg-[color:color-mix(in_srgb,var(--surface-container-low)_64%,white)] text-[var(--on-surface-variant)]">
                  <tr>
                    <th className="px-8 py-5 font-headline text-[10px] font-extrabold uppercase tracking-[0.14em]">Data</th>
                    <th className="px-4 py-5 font-headline text-[10px] font-extrabold uppercase tracking-[0.14em]">Semana</th>
                    <th className="px-4 py-5 font-headline text-[10px] font-extrabold uppercase tracking-[0.14em]">Origem</th>
                    <th className="px-4 py-5 text-center font-headline text-[10px] font-extrabold uppercase tracking-[0.14em]">Entrada 1</th>
                    <th className="px-4 py-5 text-center font-headline text-[10px] font-extrabold uppercase tracking-[0.14em]">Saída 1</th>
                    <th className="px-4 py-5 text-center font-headline text-[10px] font-extrabold uppercase tracking-[0.14em]">Entrada 2</th>
                    <th className="px-4 py-5 text-center font-headline text-[10px] font-extrabold uppercase tracking-[0.14em]">Saída 2</th>
                    <th className="px-4 py-5 text-right font-headline text-[10px] font-extrabold uppercase tracking-[0.14em]">Normal</th>
                    <th className="px-4 py-5 text-right font-headline text-[10px] font-extrabold uppercase tracking-[0.14em]">Extra</th>
                    <th className="px-4 py-5 text-right font-headline text-[10px] font-extrabold uppercase tracking-[0.14em]">Saldo</th>
                    <th className="px-8 py-5 font-headline text-[10px] font-extrabold uppercase tracking-[0.14em]">Observações</th>
                  </tr>
                </thead>
                <tbody>
                  {data.days.map((day, index) => (
                    <tr
                      key={day.id}
                      className={index % 2 === 1 ? 'bg-[color:color-mix(in_srgb,var(--surface-container-low)_30%,transparent)]' : ''}
                    >
                      <td className="px-8 py-4 font-semibold text-[var(--on-surface)]">{day.date}</td>
                      <td className="px-4 py-4 text-[var(--on-surface-variant)]">{day.weekday}</td>
                      <td className="px-4 py-4 text-[var(--on-surface-variant)]">{day.sourceLabel}</td>
                      <td className="px-4 py-4 text-center">{day.firstEntry ?? '-'}</td>
                      <td className="px-4 py-4 text-center">{day.firstExit ?? '-'}</td>
                      <td className="px-4 py-4 text-center">{day.secondEntry ?? '-'}</td>
                      <td className="px-4 py-4 text-center">{day.secondExit ?? '-'}</td>
                      <td className="px-4 py-4 text-right font-bold text-[var(--on-surface)]">{day.regularHours}</td>
                      <td className="px-4 py-4 text-right font-bold text-[var(--on-surface)]">{day.overtimeHours}</td>
                      <td className="px-4 py-4 text-right font-bold text-[var(--on-surface)]">{day.balance}</td>
                      <td className="px-8 py-4">
                        <div className="space-y-2">
                          {day.note ? (
                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] ${noteBadgeStyles[day.noteTone]}`}>
                              {day.note}
                            </span>
                          ) : (
                            <span className="text-[var(--on-surface-variant)]">Sem alerta</span>
                          )}
                          <p className="text-xs leading-6 text-[var(--on-surface-variant)]">
                            {day.occurrenceDetail ?? 'Sem observações adicionais.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[var(--inverse-surface)] text-[var(--inverse-on-surface)]">
                  <tr>
                    <td className="px-8 py-5 text-right font-headline text-[10px] font-extrabold uppercase tracking-[0.16em]" colSpan={7}>
                      Totais acumulados
                    </td>
                    <td className="px-4 py-5 text-right font-headline text-lg font-extrabold">{data.normalHoursLabel}</td>
                    <td className="px-4 py-5 text-right font-headline text-lg font-extrabold">{data.overtimeHoursLabel}</td>
                    <td className="px-4 py-5 text-right font-headline text-lg font-extrabold">{data.bankHoursLabel}</td>
                    <td className="px-8 py-5" />
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        ) : null}

        {activeTab === 'documents' ? (
          <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] bg-[var(--surface-container-lowest)] p-5 shadow-[var(--shadow-card)] sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-container-low)] text-[var(--primary)]">
                  <TimerReset className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-headline text-xl font-extrabold text-[var(--on-surface)]">Conferências do período</h3>
                  <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                    Resumo do que já foi validado e do que ainda exige leitura do RH.
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {data.occurrenceSummary.map((occurrence) => (
                  <div key={occurrence} className="rounded-[1.25rem] bg-[var(--surface-container-low)] px-4 py-4 text-sm leading-7 text-[var(--on-surface-variant)]">
                    {occurrence}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-[var(--surface-container-lowest)] p-5 shadow-[var(--shadow-card)] sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-container-low)] text-[var(--primary)]">
                  <FileText className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-headline text-xl font-extrabold text-[var(--on-surface)]">Documentos vinculados</h3>
                  <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                    Arquivos e comprovações que sustentam o fechamento deste colaborador.
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {data.documents.map((document) => (
                  <div key={document.id} className="rounded-[1.25rem] bg-[var(--surface-container-low)] px-4 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-semibold text-[var(--on-surface)]">{document.name}</p>
                      <Badge variant="info">{document.statusLabel}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
                      {document.typeLabel} · {document.issuer} · {document.issuedAtLabel}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {activeTab === 'signatures' ? (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {data.signatures.map((signature) => (
                <div key={signature.id} className="rounded-[2rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_18%,transparent)] bg-[var(--surface-container-lowest)] p-6 shadow-[var(--shadow-card)]">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--surface-container-low)] text-[var(--primary)]">
                      <FileSignature className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-headline text-sm font-extrabold text-[var(--on-surface)]">{signature.label}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">{signature.role}</p>
                    </div>
                  </div>
                  <div className="mt-16 border-t border-dashed border-[var(--outline-variant)] pt-4">
                    <p className="font-semibold text-[var(--on-surface)]">{signature.name}</p>
                    <p className="mt-1 text-sm text-[var(--on-surface-variant)]">Espaço reservado para assinatura e ciência do período.</p>
                  </div>
                </div>
              ))}
            </section>

            <PrintableDocumentCard
              onPrint={() => {
                void openPayrollPdfForRecord(data);
              }}
            />
          </>
        ) : null}
      </div>
    </div>
  );
};
