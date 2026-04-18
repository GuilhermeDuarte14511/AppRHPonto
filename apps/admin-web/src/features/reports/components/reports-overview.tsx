'use client';

import { BarChart3, Download, FileClock, ShieldCheck } from 'lucide-react';

import { Badge, Button, Card, ErrorState, PageHeader } from '@rh-ponto/ui';

import { OverviewPageSkeleton } from '@/shared/components/page-skeletons';
import { StatCard } from '@/shared/components/stat-card';
import { getActionErrorMessage } from '@/shared/lib/mutation-feedback';

import { useAuditOverview } from '@/features/audit/hooks/use-audit-overview';
import { downloadAuditRecordsCsv } from '@/features/audit/lib/audit-export';
import { useDashboardSummary } from '@/features/dashboard/hooks/use-dashboard-summary';
import { downloadRecentTimeRecordsCsv } from '@/features/dashboard/lib/recent-time-records-export';

export const ReportsOverview = () => {
  const { data: dashboard, error: dashboardError, isError: isDashboardError, isLoading: isDashboardLoading, refetch: refetchDashboard } =
    useDashboardSummary();
  const { data: audit, error: auditError, isError: isAuditError, isLoading: isAuditLoading, refetch: refetchAudit } = useAuditOverview();

  if (isDashboardLoading || isAuditLoading) {
    return <OverviewPageSkeleton />;
  }

  if (isDashboardError || isAuditError || !dashboard || !audit) {
    return (
      <ErrorState
        title="Não foi possível carregar os relatórios"
        description={getActionErrorMessage(
          dashboardError ?? auditError,
          'Tente novamente para consultar os dados consolidados da operação.',
        )}
        actionLabel="Tentar novamente"
        onAction={() => {
          void Promise.all([refetchDashboard(), refetchAudit()]);
        }}
      />
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      <PageHeader
        eyebrow="Relatórios / Exportação"
        title="Central de relatórios"
        description="Concentre a saída de dados da operação em exportações prontas para auditoria, análise e conferência externa."
        actions={
          <>
            <Button size="lg" variant="outline" onClick={() => downloadRecentTimeRecordsCsv(dashboard.recentTimeRecords)}>
              <FileClock className="h-4 w-4" />
              Exportar marcações
            </Button>
            <Button size="lg" variant="outline" onClick={() => downloadAuditRecordsCsv(audit.records)}>
              <Download className="h-4 w-4" />
              Exportar auditoria
            </Button>
          </>
        }
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          badge="Base operacional"
          hint="Marcações recentes prontas para análise ou integração externa."
          icon={FileClock}
          label="Marcações exportáveis"
          value={String(dashboard.recentTimeRecordsMeta.total)}
        />
        <StatCard
          badge="Trilha de auditoria"
          hint="Eventos registrados que ajudam a rastrear mudanças sensíveis."
          icon={ShieldCheck}
          label="Eventos exportáveis"
          tone="secondary"
          value={String(audit.metrics.total)}
        />
        <StatCard
          badge="Atenção"
          hint="Registros com pendência operacional no dashboard."
          icon={BarChart3}
          label="Pendências"
          tone="tertiary"
          value={String(dashboard.totalApprovalsPending)}
        />
        <Card className="primary-gradient p-6 text-white">
          <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/78">Exportação</p>
          <p className="mt-3 font-headline text-4xl font-extrabold">{dashboard.payrollSnapshot.progress}%</p>
          <p className="mt-4 text-sm text-white/82">
            {dashboard.payrollSnapshot.statusLabel} · {dashboard.payrollSnapshot.statusHint}
          </p>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="p-5 sm:p-8">
          <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
            Relatório operacional
          </p>
          <h2 className="mt-3 font-headline text-2xl font-extrabold text-[var(--on-surface)]">Marcações recentes</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--on-surface-variant)]">
            Exportação CSV com os registros mais recentes da operação para planilhas e cruzamento de dados.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="neutral">{dashboard.recentTimeRecordsMeta.total} registros</Badge>
            <Badge variant="warning">{dashboard.recentTimeRecordsMeta.pending} em revisão</Badge>
            <Badge variant="info">{dashboard.recentTimeRecordsMeta.manual} manuais</Badge>
          </div>
          <Button className="mt-6" variant="outline" onClick={() => downloadRecentTimeRecordsCsv(dashboard.recentTimeRecords)}>
            <Download className="h-4 w-4" />
            Baixar CSV
          </Button>
        </Card>

        <Card className="p-5 sm:p-8">
          <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
            Relatório de conformidade
          </p>
          <h2 className="mt-3 font-headline text-2xl font-extrabold text-[var(--on-surface)]">Auditoria do período</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--on-surface-variant)]">
            Exportação CSV da trilha de auditoria para validação interna, auditoria externa ou backup operacional.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="neutral">{audit.metrics.total} eventos</Badge>
            <Badge variant="warning">{audit.metrics.manualAdjustments} ajustes</Badge>
            <Badge variant="danger">{audit.metrics.criticalEvents} críticos</Badge>
          </div>
          <Button className="mt-6" variant="outline" onClick={() => downloadAuditRecordsCsv(audit.records)}>
            <Download className="h-4 w-4" />
            Baixar CSV
          </Button>
        </Card>
      </section>
    </div>
  );
};
