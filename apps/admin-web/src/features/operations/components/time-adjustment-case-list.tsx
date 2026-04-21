'use client';

import { formatDateTime } from '@rh-ponto/core';
import { Badge, Button, Card, EmptyState } from '@rh-ponto/ui';
import { Search } from 'lucide-react';
import { useDeferredValue, useMemo, useState } from 'react';

import type { OperationsInboxItem, OperationsInboxPriority } from '../lib/operations-inbox-service';
import type {
  AssistedReviewClosureImpact,
  AssistedReviewExceptionType,
} from '../lib/time-adjustment-assisted-review';
import { TimeAdjustmentConfidenceBadge } from './time-adjustment-confidence-badge';
import { TimeAdjustmentRoutingBadge } from './time-adjustment-routing-badge';

const priorityMeta: Record<OperationsInboxPriority, { label: string; variant: 'danger' | 'warning' | 'neutral' }> = {
  high: { label: 'Alta prioridade', variant: 'danger' },
  medium: { label: 'Prioridade moderada', variant: 'warning' },
  low: { label: 'Monitoramento', variant: 'neutral' },
};

const exceptionLabel: Record<AssistedReviewExceptionType, string> = {
  missing_punch: 'Esqueci de bater ponto',
  incomplete_sequence: 'Marcação incompleta',
  outside_rule_window: 'Fora da regra',
  location_divergence: 'Divergência de local',
};

const impactMeta: Record<AssistedReviewClosureImpact, { label: string; variant: 'neutral' | 'warning' | 'danger' }> = {
  none: { label: 'Sem impacto', variant: 'neutral' },
  payroll: { label: 'Impacta fechamento', variant: 'warning' },
  compliance: { label: 'Impacta compliance', variant: 'danger' },
  payroll_and_compliance: { label: 'Impacta fechamento e compliance', variant: 'danger' },
};

const actionLabel: Record<string, string> = {
  complete_with_expected_time: 'Completar com horário esperado',
  request_employee_confirmation: 'Pedir confirmação adicional',
  review_daily_sequence: 'Revisar sequência do dia',
  request_justification: 'Solicitar justificativa',
  escalate_for_compliance_review: 'Escalar para revisão',
};

export const TimeAdjustmentCaseList = ({
  items,
  selectedIds,
  onToggleSelect,
  onOpenCase,
}: {
  items: OperationsInboxItem[];
  selectedIds: string[];
  onToggleSelect: (item: OperationsInboxItem, selected: boolean) => void;
  onOpenCase: (item: OperationsInboxItem) => void;
}) => {
  const [search, setSearch] = useState('');
  const [exceptionFilter, setExceptionFilter] = useState<'all' | AssistedReviewExceptionType>('all');
  const [confidenceFilter, setConfidenceFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [routingFilter, setRoutingFilter] = useState<'all' | 'manager' | 'hr' | 'operations'>('all');
  const [impactFilter, setImpactFilter] = useState<'all' | AssistedReviewClosureImpact>('all');
  const [batchOnly, setBatchOnly] = useState(false);
  const deferredSearch = useDeferredValue(search);

  const filteredItems = useMemo(() => {
    const normalizedSearch = deferredSearch.trim().toLowerCase();

    return items.filter((item) => {
      const assistedReview = item.assistedReview;

      if (!assistedReview) {
        return false;
      }

      const matchesSearch =
        normalizedSearch.length === 0 ||
        [
          item.title,
          item.description,
          assistedReview.suggestionReason,
          assistedReview.confidenceReason,
          assistedReview.recommendedAction,
          assistedReview.employeeName,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch);
      const matchesException = exceptionFilter === 'all' || assistedReview.exceptionType === exceptionFilter;
      const matchesConfidence = confidenceFilter === 'all' || assistedReview.confidence === confidenceFilter;
      const matchesRouting = routingFilter === 'all' || assistedReview.routingTarget === routingFilter;
      const matchesImpact = impactFilter === 'all' || assistedReview.closureImpact === impactFilter;
      const matchesBatch = !batchOnly || assistedReview.batchEligible;

      return matchesSearch && matchesException && matchesConfidence && matchesRouting && matchesImpact && matchesBatch;
    });
  }, [batchOnly, confidenceFilter, deferredSearch, exceptionFilter, impactFilter, items, routingFilter]);

  if (items.length === 0) {
    return (
      <EmptyState
        title="Nenhum ajuste assistido disponível"
        description="As marcações de ponto ainda não possuem contexto suficiente para entrar na fila assistida."
      />
    );
  }

  return (
    <div className="space-y-5">
      <Card className="p-5 sm:p-6">
        <div className="grid gap-4 xl:grid-cols-[1.2fr_repeat(4,minmax(0,0.75fr))_auto]">
          <label className="space-y-2">
            <span className="px-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
              Buscar caso
            </span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--on-surface-variant)]" />
              <input
                className="h-12 w-full rounded-[1rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_18%,transparent)] bg-[var(--surface-container-low)] pl-11 pr-4 text-sm text-[var(--on-surface)] outline-none transition focus:border-[var(--primary)]"
                placeholder="Colaborador, motivo ou sugestão"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </label>

          <label className="space-y-2">
            <span className="px-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
              Exceção
            </span>
            <select
              className="h-12 w-full rounded-[1rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_18%,transparent)] bg-[var(--surface-container-low)] px-4 text-sm text-[var(--on-surface)] outline-none transition focus:border-[var(--primary)]"
              value={exceptionFilter}
              onChange={(event) => setExceptionFilter(event.target.value as typeof exceptionFilter)}
            >
              <option value="all">Todas</option>
              <option value="missing_punch">Esqueci de bater</option>
              <option value="incomplete_sequence">Marcação incompleta</option>
              <option value="outside_rule_window">Fora da regra</option>
              <option value="location_divergence">Divergência de local</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="px-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
              Confiança
            </span>
            <select
              className="h-12 w-full rounded-[1rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_18%,transparent)] bg-[var(--surface-container-low)] px-4 text-sm text-[var(--on-surface)] outline-none transition focus:border-[var(--primary)]"
              value={confidenceFilter}
              onChange={(event) => setConfidenceFilter(event.target.value as typeof confidenceFilter)}
            >
              <option value="all">Todas</option>
              <option value="high">Alta</option>
              <option value="medium">Média</option>
              <option value="low">Baixa</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="px-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
              Destino
            </span>
            <select
              className="h-12 w-full rounded-[1rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_18%,transparent)] bg-[var(--surface-container-low)] px-4 text-sm text-[var(--on-surface)] outline-none transition focus:border-[var(--primary)]"
              value={routingFilter}
              onChange={(event) => setRoutingFilter(event.target.value as typeof routingFilter)}
            >
              <option value="all">Todos</option>
              <option value="manager">Gestor</option>
              <option value="hr">RH</option>
              <option value="operations">Operação</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="px-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
              Impacto
            </span>
            <select
              className="h-12 w-full rounded-[1rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_18%,transparent)] bg-[var(--surface-container-low)] px-4 text-sm text-[var(--on-surface)] outline-none transition focus:border-[var(--primary)]"
              value={impactFilter}
              onChange={(event) => setImpactFilter(event.target.value as typeof impactFilter)}
            >
              <option value="all">Todos</option>
              <option value="none">Sem impacto</option>
              <option value="payroll">Fechamento</option>
              <option value="compliance">Compliance</option>
              <option value="payroll_and_compliance">Fechamento + compliance</option>
            </select>
          </label>

          <div className="flex items-end">
            <label className="flex h-12 w-full items-center gap-3 rounded-[1rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_18%,transparent)] bg-[var(--surface-container-low)] px-4 text-sm text-[var(--on-surface)]">
              <input checked={batchOnly} type="checkbox" onChange={(event) => setBatchOnly(event.target.checked)} />
              Somente lote
            </label>
          </div>
        </div>
      </Card>

      {filteredItems.length === 0 ? (
        <EmptyState
          title="Nenhum caso encontrado"
            description="Os filtros atuais não encontraram casos de ajuste assistido. Ajuste os filtros para continuar."
        />
      ) : (
        <div className="grid gap-4">
          {filteredItems.map((item) => {
            const assistedReview = item.assistedReview;

            if (!assistedReview) {
              return null;
            }

            const isSelected = selectedIds.includes(item.id);

            return (
              <Card
                key={item.id}
                className={`p-5 sm:p-6 ${
                  isSelected
                    ? 'border-[color:color-mix(in_srgb,var(--primary)_28%,transparent)] shadow-[var(--shadow-card)]'
                    : ''
                }`}
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={priorityMeta[item.priority].variant}>{priorityMeta[item.priority].label}</Badge>
                      <Badge variant="info">{exceptionLabel[assistedReview.exceptionType]}</Badge>
                      <TimeAdjustmentConfidenceBadge confidence={assistedReview.confidence} />
                      <TimeAdjustmentRoutingBadge routingTarget={assistedReview.routingTarget} />
                      <Badge variant={impactMeta[assistedReview.closureImpact].variant}>
                        {impactMeta[assistedReview.closureImpact].label}
                      </Badge>
                      <Badge variant="neutral">{formatDateTime(item.occurredAt)}</Badge>
                    </div>

                    <div>
                      <h3 className="font-headline text-xl font-extrabold text-[var(--on-surface)]">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-[var(--on-surface-variant)]">{item.description}</p>
                    </div>

                    <div className="grid gap-3 xl:grid-cols-[1fr_1fr]">
                      <div className="rounded-[1.2rem] bg-[var(--surface-container-low)] p-4">
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                            Motivo da confiança
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[var(--on-surface)]">{assistedReview.confidenceReason}</p>
                      </div>
                      <div className="rounded-[1.2rem] bg-[var(--surface-container-low)] p-4">
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                            Sugestão
                        </p>
                        <p className="mt-2 text-sm font-semibold text-[var(--on-surface)]">
                          {actionLabel[assistedReview.recommendedAction] ?? assistedReview.recommendedAction}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-[var(--on-surface-variant)]">{assistedReview.suggestionReason}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-[15rem]">
                    {assistedReview.batchEligible ? (
                      <label className="flex items-center gap-3 rounded-[1rem] bg-[var(--surface-container-low)] px-4 py-3 text-sm font-semibold text-[var(--on-surface)]">
                        <input
                          aria-label={`Selecionar ${item.title}`}
                          checked={isSelected}
                          type="checkbox"
                          onChange={(event) => onToggleSelect(item, event.target.checked)}
                        />
                        Selecionar para lote
                      </label>
                    ) : (
                      <div className="rounded-[1rem] bg-[var(--surface-container-low)] px-4 py-3 text-sm text-[var(--on-surface-variant)]">
                        Caso fora do lote inicial
                      </div>
                    )}

                    <Button className="w-full" variant="outline" onClick={() => onOpenCase(item)}>
                      Abrir contexto
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
