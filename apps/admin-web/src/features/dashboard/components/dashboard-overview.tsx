'use client';

import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCheck,
  ClipboardList,
  Download,
  FileClock,
  Radar,
  ShieldCheck,
  TimerReset,
  UsersRound,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { formatDateTime } from '@rh-ponto/core';
import { Badge, Button, Card, ErrorState, PageHeader } from '@rh-ponto/ui';

import { OverviewPageSkeleton } from '@/shared/components/page-skeletons';
import { StatCard } from '@/shared/components/stat-card';
import {
  formatAuditActionLabel,
  formatAuditEntityLabel,
  formatTimeRecordSourceLabel,
  formatTimeRecordStatusLabel,
} from '@/shared/lib/admin-formatters';
import { getActionErrorMessage } from '@/shared/lib/mutation-feedback';

import { useDashboardSummary } from '../hooks/use-dashboard-summary';
import { downloadRecentTimeRecordsCsv } from '../lib/recent-time-records-export';

const attentionToneVariant = {
  neutral: 'neutral',
  warning: 'warning',
  danger: 'danger',
  info: 'info',
} as const;

export const DashboardOverview = () => {
  const { data, error, isError, isLoading, refetch } = useDashboardSummary();

  if (isLoading) {
    return <OverviewPageSkeleton />;
  }

  if (isError || !data) {
    return (
      <ErrorState
        title="Não foi possível carregar o dashboard"
        description={getActionErrorMessage(error, 'Revise a conexão com a base e tente novamente.')}
        actionLabel="Tentar novamente"
        onAction={() => {
          void refetch();
        }}
      />
    );
  }

  const weeklyChartData = data.weeklyActivity.days.map((day) => ({
    day: day.label,
    registros: day.totalRecords,
    atrasos: day.lateRecords,
    active: day.active,
  }));

  return (
    <div className="space-y-8 sm:space-y-10">
      <PageHeader
        eyebrow="Dashboard / Operação"
        title="Dashboard operacional"
        description="Resumo editorial da operação de ponto, com foco em presença, exceções, aprovações e rastreabilidade."
        actions={
          <Button size="lg" variant="outline" onClick={() => downloadRecentTimeRecordsCsv(data.recentTimeRecords)}>
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        }
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          badge={`${data.activeEmployees} ativos`}
          hint="Colaboradores com cadastro ativo na base atual."
          icon={UsersRound}
          label="Total de funcionários"
          value={String(data.employeesTotal)}
        />
        <StatCard
          badge="Fila ativa"
          hint="Marcações que exigem revisão humana antes do fechamento."
          icon={TimerReset}
          label="Exceções de ponto"
          tone="tertiary"
          value={String(data.pendingTimeRecords)}
        />
        <StatCard
          badge="Aguardando RH"
          hint="Justificativas e férias pendentes de decisão no momento."
          icon={ClipboardList}
          label="Pendências"
          tone="danger"
          value={String(data.totalApprovalsPending)}
        />
        <StatCard
          badge={data.payrollSnapshot.statusLabel}
          hint={data.payrollSnapshot.statusHint}
          icon={ShieldCheck}
          label="Fechamento da folha"
          tone="secondary"
          value={`${data.payrollSnapshot.progress}%`}
        />
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
                Atividade semanal
              </p>
              <h2 className="mt-3 font-headline text-2xl font-extrabold text-[var(--on-surface)]">
                Janela operacional recente
              </h2>
              <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
                Pico operacional previsto para {data.weeklyActivity.peakTimeLabel}
              </p>
            </div>
            <Button asChild size="sm" variant="ghost">
              <Link href={data.weeklyActivity.detailHref}>
                Ver detalhes
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 h-[280px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyChartData} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="var(--outline-variant)" strokeDasharray="3 3" vertical={false} opacity={0.18} />
                <XAxis
                  axisLine={false}
                  dataKey="day"
                  tick={{ fill: 'var(--on-surface-variant)', fontSize: 12, fontWeight: 700 }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tick={{ fill: 'var(--on-surface-variant)', fontSize: 12 }}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(46, 91, 255, 0.06)' }}
                  contentStyle={{
                    borderRadius: 18,
                    border: '1px solid color-mix(in srgb, var(--outline-variant) 18%, transparent)',
                    background: 'var(--surface-container-lowest)',
                    boxShadow: 'var(--shadow-card)',
                  }}
                />
                <Bar dataKey="registros" fill="var(--primary)" name="Registros" radius={[10, 10, 0, 0]}>
                  {weeklyChartData.map((entry) => (
                    <Cell
                      key={entry.day}
                      fill={entry.active ? 'var(--primary)' : 'color-mix(in srgb, var(--primary) 72%, white)'}
                    />
                  ))}
                </Bar>
                <Bar dataKey="atrasos" fill="var(--tertiary)" name="Atrasos" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 rounded-[1.5rem] bg-[var(--surface-container-low)] p-5">
            <p className="text-sm leading-7 text-[var(--on-surface-variant)]">{data.weeklyActivity.summary}</p>
          </div>
        </Card>

        <div className="grid gap-6">
          <Card className="p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <div className="rounded-[1.25rem] bg-[var(--primary-fixed)] p-3 text-[var(--primary)]">
                <Radar className="h-5 w-5" />
              </div>
              <div className="space-y-3">
                <div>
                  <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
                    Ações do RH
                  </p>
                  <h3 className="mt-2 font-headline text-xl font-extrabold text-[var(--on-surface)]">
                    Leitura rápida da operação
                  </h3>
                </div>
                <div className="space-y-3">
                  <QuickActionRow
                    href="/operations"
                    label="Abrir inbox do RH"
                    value={String(data.operationsInboxTotal)}
                  />
                  <QuickActionRow
                    href="/justifications"
                    label="Justificativas pendentes"
                    value={String(data.pendingJustifications)}
                  />
                  <QuickActionRow href="/vacations" label="Férias aguardando decisão" value={String(data.pendingVacations)} />
                  <QuickActionRow
                    href="/documents"
                    label="Documentos aguardando ciência"
                    value={String(data.pendingDocumentAcknowledgements)}
                  />
                  <QuickActionRow href="/documents" label="Documentos em revisão" value={String(data.documentsRequiringReview)} />
                  <QuickActionRow href="/schedules" label="Funcionários sem escala" value={String(data.employeesWithoutSchedule)} />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <div className="rounded-[1.25rem] bg-[var(--secondary-fixed)] p-3 text-[var(--secondary)]">
                <CheckCheck className="h-5 w-5" />
              </div>
              <div className="grid flex-1 gap-4 sm:grid-cols-2">
                {data.weeklyActivity.indicators.map((indicator) => (
                  <div
                    key={indicator.label}
                    className="rounded-[1.25rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_14%,transparent)] bg-[var(--surface-container-low)] p-4"
                  >
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                      {indicator.label}
                    </p>
                    <p className="mt-3 font-headline text-3xl font-extrabold text-[var(--on-surface)]">{indicator.value}</p>
                    <p className="mt-2 text-xs leading-6 text-[var(--on-surface-variant)]">{indicator.hint}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] px-5 py-5 sm:px-8 sm:py-6">
            <div>
              <h3 className="font-headline text-xl font-extrabold text-[var(--on-surface)]">Marcações recentes</h3>
              <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                Registros mais recentes da operação atual.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="neutral">{data.recentTimeRecordsMeta.total} exibidas</Badge>
              <Badge variant="warning">{data.recentTimeRecordsMeta.pending} em revisão</Badge>
              <Badge variant="info">{data.recentTimeRecordsMeta.manual} manuais</Badge>
            </div>
          </div>

          <div className="divide-y divide-[color:color-mix(in_srgb,var(--outline-variant)_14%,transparent)]">
            {data.recentTimeRecords.map((item) => (
              <article key={item.id} className="grid gap-4 px-5 py-5 sm:grid-cols-[1.1fr_0.75fr_0.65fr] sm:px-8">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-[var(--on-surface)]">{item.employeeName}</p>
                    <Badge variant={data.typeBadgeVariantMap[item.recordType]}>{item.typeLabel}</Badge>
                  </div>
                  <p className="text-sm text-[var(--on-surface-variant)]">{item.department}</p>
                  <p className="text-xs text-[var(--on-surface-variant)]">{item.recordedAtLabel}</p>
                </div>

                <div className="space-y-2">
                  <Badge variant={attentionToneVariant[item.attentionTone]}>{item.attentionLabel}</Badge>
                  <p className="text-sm text-[var(--on-surface-variant)]">{item.attentionDescription}</p>
                  <p className="text-xs font-semibold text-[var(--on-surface)]">
                    {formatTimeRecordSourceLabel(item.source)} · {formatTimeRecordStatusLabel(item.status)}
                  </p>
                </div>

                <div className="flex items-start sm:justify-end">
                  <Button asChild size="sm" variant="outline">
                    <Link href="/time-records">
                      Ver marcações
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="border-b border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] px-5 py-5 sm:px-8 sm:py-6">
            <h3 className="font-headline text-xl font-extrabold text-[var(--on-surface)]">Últimos eventos de auditoria</h3>
            <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
              Alterações recentes rastreadas no sistema.
            </p>
          </div>

          <div className="divide-y divide-[color:color-mix(in_srgb,var(--outline-variant)_14%,transparent)]">
            {data.recentAuditLogs.map((item) => (
              <article key={item.id} className="space-y-2 px-5 py-5 sm:px-8">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="neutral">{formatAuditEntityLabel(item.entityName)}</Badge>
                  <p className="font-semibold text-[var(--on-surface)]">{formatAuditActionLabel(item.action)}</p>
                </div>
                <p className="text-sm leading-7 text-[var(--on-surface-variant)]">
                  {item.description ?? 'Evento registrado sem descrição complementar.'}
                </p>
                <p className="text-xs text-[var(--on-surface-variant)]">{formatDateTime(item.createdAt)}</p>
              </article>
            ))}
          </div>

          <div className="px-5 py-5 sm:px-8">
            <Button asChild size="sm" variant="outline">
              <Link href="/audit">
                Abrir auditoria
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-[1.25rem] bg-[var(--tertiary-fixed)] p-3 text-[var(--on-tertiary-fixed-variant)]">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--on-surface-variant)]">
                Aprovações
              </p>
              <p className="mt-3 font-headline text-4xl font-extrabold text-[var(--on-surface)]">
                {data.totalApprovalsPending}
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--on-surface-variant)]">
                Solicitações que ainda precisam de decisão administrativa.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-[1.25rem] bg-[var(--surface-container-high)] p-3 text-[var(--primary)]">
              <FileClock className="h-5 w-5" />
            </div>
            <div>
              <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--on-surface-variant)]">
                Férias próximas
              </p>
              <p className="mt-3 font-headline text-4xl font-extrabold text-[var(--on-surface)]">
                {data.upcomingVacations}
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--on-surface-variant)]">
                Solicitações aprovadas com início previsto nos próximos 30 dias.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-[1.25rem] bg-[var(--primary-fixed)] p-3 text-[var(--primary)]">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--on-surface-variant)]">
                Cadência operacional
              </p>
              <p className="mt-3 font-headline text-4xl font-extrabold text-[var(--on-surface)]">
                {data.cadenceMetrics.attendanceTodayPercent}%
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--on-surface-variant)]">
                Leitura relativa da presença em relação à base ativa, útil para monitoramento rápido do dia.
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

const QuickActionRow = ({ href, label, value }: { href: string; label: string; value: string }) => (
  <Link
    className="flex items-center justify-between rounded-[1rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_14%,transparent)] bg-[var(--surface-container-low)] px-4 py-3 transition hover:bg-[var(--surface-container-high)]"
    href={href}
  >
    <span className="text-sm font-semibold text-[var(--on-surface)]">{label}</span>
    <div className="flex items-center gap-2">
      <span className="font-headline text-lg font-extrabold text-[var(--primary)]">{value}</span>
      <ArrowRight className="h-4 w-4 text-[var(--on-surface-variant)]" />
    </div>
  </Link>
);
