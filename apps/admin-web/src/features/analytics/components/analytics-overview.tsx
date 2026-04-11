'use client';

import {
  Activity,
  ArrowUpRight,
  BriefcaseBusiness,
  Clock3,
  ReceiptText,
  TriangleAlert,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Badge, Card, ErrorState, PageHeader } from '@rh-ponto/ui';

import { OverviewPageSkeleton } from '@/shared/components/page-skeletons';
import { StatCard } from '@/shared/components/stat-card';
import { getActionErrorMessage } from '@/shared/lib/mutation-feedback';

import { useAnalyticsOverview } from '../hooks/use-analytics-overview';

const heatmapIntensityClass = (value: number) => {
  if (value >= 72) {
    return 'bg-[var(--primary)] text-white';
  }

  if (value >= 48) {
    return 'bg-[var(--primary-fixed)] text-[var(--primary)]';
  }

  if (value >= 24) {
    return 'bg-[var(--surface-container-high)] text-[var(--on-surface)]';
  }

  return 'bg-[var(--surface-container-low)] text-[var(--on-surface-variant)]';
};

export const AnalyticsOverview = () => {
  const { data, error, isError, isLoading, refetch } = useAnalyticsOverview();

  if (isLoading) {
    return <OverviewPageSkeleton />;
  }

  if (isError || !data) {
    return (
      <ErrorState
        title="Não foi possível carregar os indicadores analíticos"
        description={getActionErrorMessage(error, 'Tente novamente para consultar os indicadores da competência.')}
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
        eyebrow="Analytics / Indicadores"
        title="Leitura analítica da operação"
        description="Indicadores derivados de marcações, justificativas e fechamento da competência, com foco em absenteísmo, pontualidade e custo excedente."
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          badge={data.periodLabel}
          hint="Proporção de ausências registradas frente à base ativa."
          icon={TriangleAlert}
          label="Absenteísmo"
          tone="danger"
          value={data.metrics.absenteeismRate}
        />
        <StatCard
          badge="Média por colaborador"
          hint="Carga excedente média registrada na competência atual."
          icon={Clock3}
          label="Horas extras"
          tone="tertiary"
          value={data.metrics.overtimeAverage}
        />
        <StatCard
          badge="Entradas monitoradas"
          hint="Índice calculado a partir de entradas válidas e atrasos detectados."
          icon={Activity}
          label="Pontualidade"
          tone="secondary"
          value={data.metrics.punctualityIndex}
        />
        <StatCard
          badge="Estimativa"
          hint="Leitura de custo excedente baseada nas horas extras do período."
          icon={ReceiptText}
          label="Custo extra"
          value={data.metrics.overtimeCost}
        />
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden p-6 sm:p-8">
          <div>
            <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
              Tendência de presença vs atrasos
            </p>
            <h2 className="mt-3 font-headline text-2xl font-extrabold text-[var(--on-surface)]">
              Variação operacional em últimos 30 dias
            </h2>
            <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
              A leitura cruza entradas registradas e exceções de pontualidade persistidas no banco.
            </p>
          </div>

          <div className="mt-8 h-[300px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trend} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="var(--outline-variant)" strokeDasharray="3 3" vertical={false} opacity={0.18} />
                <XAxis
                  axisLine={false}
                  dataKey="label"
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
                  contentStyle={{
                    borderRadius: 18,
                    border: '1px solid color-mix(in srgb, var(--outline-variant) 18%, transparent)',
                    background: 'var(--surface-container-lowest)',
                    boxShadow: 'var(--shadow-card)',
                  }}
                />
                <Line
                  dataKey="presence"
                  dot={{ fill: 'var(--primary)', r: 3 }}
                  name="Presença"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  type="monotone"
                />
                <Line
                  dataKey="delays"
                  dot={{ fill: 'var(--tertiary)', r: 3 }}
                  name="Atrasos"
                  stroke="var(--tertiary)"
                  strokeWidth={3}
                  type="monotone"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="overflow-hidden p-6 sm:p-8">
          <div>
            <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
              Horas extras por área
            </p>
            <h2 className="mt-3 font-headline text-2xl font-extrabold text-[var(--on-surface)]">
              Departamentos com maior carga excedente
            </h2>
            <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
              Ranking calculado a partir do fechamento individual da competência.
            </p>
          </div>

          <div className="mt-8 h-[300px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.overtimeByDepartment} layout="vertical" margin={{ top: 8, right: 8, left: 10, bottom: 0 }}>
                <CartesianGrid stroke="var(--outline-variant)" strokeDasharray="3 3" horizontal={false} opacity={0.16} />
                <XAxis axisLine={false} hide tickLine={false} type="number" />
                <YAxis
                  axisLine={false}
                  dataKey="department"
                  tick={{ fill: 'var(--on-surface-variant)', fontSize: 12, fontWeight: 700 }}
                  tickLine={false}
                  type="category"
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 18,
                    border: '1px solid color-mix(in srgb, var(--outline-variant) 18%, transparent)',
                    background: 'var(--surface-container-lowest)',
                    boxShadow: 'var(--shadow-card)',
                  }}
                />
                <Bar dataKey="percent" fill="var(--primary)" name="Participação" radius={[0, 10, 10, 0]}>
                  {data.overtimeByDepartment.map((item) => (
                    <Cell
                      key={item.department}
                      fill={
                        item.percent >= 85
                          ? 'var(--primary)'
                          : 'color-mix(in srgb, var(--primary) 70%, white)'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-5 grid gap-3">
            {data.overtimeByDepartment.slice(0, 3).map((item) => (
              <div
                key={item.department}
                className="flex items-center justify-between rounded-[1rem] bg-[var(--surface-container-low)] px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-[var(--on-surface)]">{item.department}</p>
                  <p className="text-xs text-[var(--on-surface-variant)]">Carga excedente consolidada</p>
                </div>
                <Badge variant="info">{item.hours}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1fr_1fr]">
        <Card className="overflow-hidden p-6 sm:p-8">
          <div>
            <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
              Mapa de calor dos atrasos
            </p>
            <h2 className="mt-3 font-headline text-2xl font-extrabold text-[var(--on-surface)]">
              Faixas de horário mais sensíveis
            </h2>
            <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
              Escala visual para identificar concentração de atrasos por dia útil e faixa horária.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <div className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))] gap-2 px-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--on-surface-variant)]">
              <span>Dia</span>
              {['07h', '08h', '09h', '10h', '11h', '12h', '13h'].map((slot) => (
                <span key={slot} className="text-center">
                  {slot}
                </span>
              ))}
            </div>

            {data.delayHeatmap.map((row) => (
              <div key={row.day} className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))] gap-2">
                <div className="flex items-center font-semibold text-[var(--on-surface)]">{row.day}</div>
                {row.values.map((value, index) => (
                  <div
                    key={`${row.day}-${index}`}
                    className={`flex h-12 items-center justify-center rounded-[0.9rem] text-xs font-bold ${heatmapIntensityClass(value)}`}
                  >
                    {value > 0 ? value : '—'}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden p-6 sm:p-8">
          <div>
            <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
              Ranking de engajamento
            </p>
            <h2 className="mt-3 font-headline text-2xl font-extrabold text-[var(--on-surface)]">
              Departamentos com melhor aderência
            </h2>
            <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
              Leitura combinada entre validação da folha, pendências e consistência operacional.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {data.engagementRanking.map((item, index) => (
              <div
                key={item.department}
                className="grid gap-3 rounded-[1.25rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_14%,transparent)] bg-[var(--surface-container-low)] px-4 py-4 sm:grid-cols-[auto_1fr_auto_auto]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--surface-container-high)] font-headline text-lg font-extrabold text-[var(--primary)]">
                  {index + 1}
                </div>
                <div>
                  <p className="font-semibold text-[var(--on-surface)]">{item.department}</p>
                  <p className="text-xs text-[var(--on-surface-variant)]">{item.members} colaborador(es) na amostra</p>
                </div>
                <Badge variant="success">{item.score}</Badge>
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--on-surface-variant)]">
                  <ArrowUpRight className={`h-4 w-4 ${item.trend === 'down' ? 'rotate-90' : item.trend === 'stable' ? 'rotate-45' : ''}`} />
                  {item.trend === 'up' ? 'Alta' : item.trend === 'down' ? 'Baixa' : 'Estável'}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {data.insights.map((insight, index) => (
          <Card key={insight.id} className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-[1.25rem] bg-[var(--surface-container-high)] p-3 text-[var(--primary)]">
                {index === 0 ? (
                  <TriangleAlert className="h-5 w-5" />
                ) : index === 1 ? (
                  <BriefcaseBusiness className="h-5 w-5" />
                ) : (
                  <ReceiptText className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
                  Insight
                </p>
                <h3 className="mt-3 font-headline text-xl font-extrabold text-[var(--on-surface)]">
                  {insight.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--on-surface-variant)]">{insight.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
};
