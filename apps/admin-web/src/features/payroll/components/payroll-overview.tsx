'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CheckCircle2, Clock3, Eye, FileSpreadsheet, Printer, TriangleAlert } from 'lucide-react';
import { toast } from 'sonner';

import { Badge, Button, DataTable, ErrorState, PageHeader } from '@rh-ponto/ui';

import { TablePageSkeleton } from '@/shared/components/page-skeletons';
import { ReviewDecisionDialog } from '@/shared/components/review-decision-dialog';
import { getActionErrorMessage } from '@/shared/lib/mutation-feedback';
import { StatCard } from '@/shared/components/stat-card';

import { useClosePayrollCycle, usePayrollOverview, useValidateAllPayrollRecords } from '../hooks/use-payroll-overview';
import { openPayrollPdfById } from '../lib/payroll-print';

const payrollStatusBadge = {
  validado: 'success',
  pendente: 'warning',
  em_analise: 'info',
} as const;

const payrollStatusLabel = {
  validado: 'Validado',
  pendente: 'Pendente',
  em_analise: 'Em análise',
} as const;

export const PayrollOverview = () => {
  const [validateAllOpen, setValidateAllOpen] = useState(false);
  const [closeCycleOpen, setCloseCycleOpen] = useState(false);
  const { data, error, isError, isLoading, refetch } = usePayrollOverview();
  const validateAllMutation = useValidateAllPayrollRecords();
  const closeCycleMutation = useClosePayrollCycle();

  if (isLoading) {
    return <TablePageSkeleton />;
  }

  if (isError || !data) {
    return (
      <ErrorState
        title="Não foi possível carregar o fechamento de folha"
        description={getActionErrorMessage(error, 'Tente novamente para abrir a consolidação da competência atual.')}
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
        eyebrow="Folha / Fechamento"
        title="Fechamento de folha"
        description="Consolidação mensal com pendências, validações e acesso direto ao espelho individual de cada colaborador."
        actions={
          <>
            <div className="rounded-full bg-[var(--surface-container-low)] px-4 py-2.5 text-sm font-semibold text-[var(--on-surface)]">
              Período: {data.periodLabel}
            </div>
            <Button size="lg" variant="outline" onClick={() => setValidateAllOpen(true)}>
              Validar tudo
            </Button>
            <Button disabled={data.isClosed} size="lg" onClick={() => setCloseCycleOpen(true)}>
              {data.isClosed ? 'Folha encerrada' : 'Fechar folha'}
            </Button>
          </>
        }
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard badge="Base ativa" hint="Colaboradores considerados no período" icon={FileSpreadsheet} label="Total de colaboradores" value={String(data.employeesTotal)} />
        <StatCard badge="Validação" hint="Percentual consolidado para fechamento do ciclo" icon={CheckCircle2} label="Progresso" tone="secondary" value={`${data.progress}%`} />
        <StatCard badge="Acumulado" hint="Horas excedentes homologadas no período" icon={Clock3} label="Horas extras" tone="tertiary" value={data.overtime} />
        <StatCard badge="Atenção" hint="Pendências críticas que ainda exigem revisão manual" icon={TriangleAlert} label="Pendências" tone="danger" value={String(data.criticalIssues)} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.42fr_0.58fr]">
        <div className="rounded-[2rem] bg-[var(--surface-container-lowest)] p-5 shadow-[var(--shadow-card)] sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--on-surface-variant)]">Progresso da validação</p>
            <p className="font-headline text-3xl font-extrabold text-[var(--primary)]">{data.progress}%</p>
          </div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-[var(--surface-container)]">
            <div className="primary-gradient h-full rounded-full" style={{ width: `${data.progress}%` }} />
          </div>
          <p className="mt-5 text-sm leading-7 text-[var(--on-surface-variant)]">
            <span className="font-headline font-extrabold text-[var(--primary)]">{data.validated} de {data.employeesTotal}</span> colaboradores validados. Restam {data.pending} itens para concluir o fechamento.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant={data.isClosed ? 'success' : 'warning'}>{data.isClosed ? 'Folha encerrada' : 'Fechamento em andamento'}</Badge>
            <Badge variant="neutral">{data.periodLabel}</Badge>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[2rem] bg-[var(--surface-container-lowest)] p-5 shadow-[var(--shadow-card)] sm:p-8">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--on-surface-variant)]">Horas extras</p>
            <p className="mt-4 font-headline text-4xl font-extrabold text-[var(--on-surface)]">{data.overtime}</p>
            <p className="mt-3 text-sm leading-7 text-[var(--on-surface-variant)]">
              Distribuição concentrada nas áreas que mais acumularam excedentes na base atual.
            </p>
          </div>
          <div className="rounded-[2rem] bg-[var(--tertiary-fixed)] p-5 shadow-[var(--shadow-card)] sm:p-8">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--on-tertiary-fixed-variant)]">Pendências críticas</p>
            <p className="mt-4 font-headline text-4xl font-extrabold text-[var(--on-tertiary-fixed)]">{data.criticalIssues}</p>
            <p className="mt-3 text-sm leading-7 text-[var(--on-tertiary-fixed-variant)]">
              Ações imediatas exigidas para ausências sem comprovação e divergências de banco de horas.
            </p>
          </div>
        </div>
      </section>

      <div className="rounded-[2rem] bg-[var(--surface-container-lowest)] shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-5 sm:px-8 sm:py-6">
          <div>
            <h3 className="font-headline text-xl font-extrabold text-[var(--on-surface)]">Detalhamento por colaborador</h3>
            <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
              Clique para abrir o espelho individual ou gerar o PDF consolidado com os dados atuais.
            </p>
          </div>
          <div className="rounded-full bg-[var(--surface-container-low)] px-4 py-2.5 text-sm font-semibold text-[var(--on-surface)]">
            Referência: {data.periodLabel}
          </div>
        </div>

        <DataTable
          className="rounded-none border-0 shadow-none"
          columns={[
            {
              key: 'employeeName',
              label: 'Colaborador',
              render: (item) => (
                <div className="space-y-1">
                  <p className="font-semibold text-[var(--on-surface)]">{item.employeeName}</p>
                  <p className="text-xs text-[var(--on-surface-variant)]">
                    {item.department} - ID: {item.registrationNumber}
                  </p>
                </div>
              ),
            },
            { key: 'workedHoursLabel', label: 'Horas trabalhadas' },
            { key: 'bankHoursLabel', label: 'Saldo de banco' },
            { key: 'additionalsLabel', label: 'Adicionais' },
            {
              key: 'status',
              label: 'Status',
              render: (item) => (
                <Badge variant={payrollStatusBadge[item.status]}>
                  {payrollStatusLabel[item.status]}
                </Badge>
              ),
            },
            {
              key: 'actions',
              label: 'Ações',
              headerClassName: 'text-right',
              cellClassName: 'text-right',
              render: (item) => (
                <div className="flex justify-end gap-2">
                  <Button asChild className="h-9 w-9 rounded-full p-0" size="sm" variant="ghost">
                    <Link href={`/payroll/${item.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    className="h-9 w-9 rounded-full p-0"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      void openPayrollPdfById(item.id);
                    }}
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                </div>
              ),
            },
          ]}
          items={data.records}
          getRowKey={(item) => item.id}
        />
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.records.slice(0, 3).map((record) => (
          <div key={record.id} className="rounded-[1.5rem] bg-[var(--surface-container-low)] p-5">
            <p className="font-headline text-sm font-extrabold text-[var(--on-surface)]">{record.employeeName}</p>
            <p className="mt-3 text-sm leading-6 text-[var(--on-surface-variant)]">{record.validationHint}</p>
          </div>
        ))}
      </section>

      <ReviewDecisionDialog
        confirmLabel="Validar tudo"
        description="Confirme a validação em lote para registrar o fechamento administrativo e atualizar a visão da competência."
        isPending={validateAllMutation.isPending}
        noteLabel="Observação da validação"
        notePlaceholder="Ex.: conferência final realizada pelo RH e pendências tratadas."
        summary={[
          { label: 'Período', value: data.periodLabel },
          { label: 'Colaboradores', value: String(data.employeesTotal) },
          { label: 'Pendências restantes', value: String(data.pending) },
          { label: 'Progresso atual', value: `${data.progress}%` },
        ]}
        onConfirm={async (notes) => {
          await validateAllMutation.mutateAsync(notes);
          toast.success('Espelhos validados com sucesso.');
        }}
        onOpenChange={setValidateAllOpen}
        open={validateAllOpen}
        title="Validar todos os registros"
      />

      <ReviewDecisionDialog
        confirmLabel="Fechar folha"
        description="Encerrar o ciclo registra o fechamento na auditoria e consolida a competência para consulta."
        isPending={closeCycleMutation.isPending}
        noteLabel="Observação do fechamento"
        notePlaceholder="Ex.: fechamento liberado para auditoria e exportação."
        summary={[
          { label: 'Período', value: data.periodLabel },
          { label: 'Registros validados', value: String(data.validated) },
          { label: 'Pendências críticas', value: String(data.criticalIssues) },
          { label: 'Horas extras', value: data.overtime },
        ]}
        onConfirm={async (notes) => {
          await closeCycleMutation.mutateAsync(notes);
          toast.success('Folha encerrada com sucesso.');
        }}
        onOpenChange={setCloseCycleOpen}
        open={closeCycleOpen}
        title="Fechar folha do período"
      />
    </div>
  );
};
