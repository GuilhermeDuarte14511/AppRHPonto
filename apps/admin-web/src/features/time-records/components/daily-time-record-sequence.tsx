'use client';

import { Badge, Button, Card } from '@rh-ponto/ui';
import type { TimeRecordType } from '@rh-ponto/types';
import {
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  Clock3,
  Eye,
  MapPin,
  PencilLine,
  ShieldAlert,
} from 'lucide-react';
import { useMemo } from 'react';

import {
  formatTimeRecordStatusLabel,
  formatTimeRecordTypeLabel,
} from '@/shared/lib/admin-formatters';

import type { TimeRecordListItem } from './time-record-list-item';

interface DailyTimeRecordSequenceProps {
  records: TimeRecordListItem[];
  selectedDayLabel: string;
  onAdjustRecord: (record: TimeRecordListItem) => void;
  onViewRecord: (record: TimeRecordListItem) => void;
}

interface EmployeeDailyJourneyCard {
  employeeId: string;
  employeeName: string;
  department: string;
  records: TimeRecordListItem[];
  latestRecord: TimeRecordListItem;
  firstRecord: TimeRecordListItem;
  missingSteps: TimeRecordType[];
  duplicatedSteps: TimeRecordType[];
  pendingCount: number;
  flaggedCount: number;
  photosCount: number;
  completedSteps: number;
  completionPercent: number;
  nextExpectedStep: TimeRecordType | null;
  statusTone: 'success' | 'warning' | 'danger' | 'info';
  statusLabel: string;
}

const expectedJourneyOrder: TimeRecordType[] = ['entry', 'break_start', 'break_end', 'exit'];

const formatTimeOnly = (value: string | Date) =>
  new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));

const getStatusVariant = (status: TimeRecordListItem['status']) => {
  switch (status) {
    case 'valid':
      return 'success';
    case 'pending_review':
      return 'warning';
    case 'adjusted':
      return 'info';
    case 'rejected':
      return 'danger';
    default:
      return 'neutral';
  }
};

const buildJourneyCards = (records: TimeRecordListItem[]): EmployeeDailyJourneyCard[] => {
  const employeeMap = new Map<string, TimeRecordListItem[]>();

  for (const record of records) {
    const current = employeeMap.get(record.employeeId) ?? [];
    current.push(record);
    employeeMap.set(record.employeeId, current);
  }

  return Array.from(employeeMap.entries())
    .map(([employeeId, employeeRecords]) => {
      const orderedRecords = [...employeeRecords].sort(
        (left, right) => new Date(left.recordedAt).getTime() - new Date(right.recordedAt).getTime(),
      );
      const typeCounts = orderedRecords.reduce<Map<TimeRecordType, number>>((counts, record) => {
        counts.set(record.recordType, (counts.get(record.recordType) ?? 0) + 1);
        return counts;
      }, new Map());
      const missingSteps = expectedJourneyOrder.filter((step) => !typeCounts.has(step));
      const duplicatedSteps = expectedJourneyOrder.filter((step) => (typeCounts.get(step) ?? 0) > 1);
      const pendingCount = orderedRecords.filter((record) => record.status === 'pending_review').length;
      const flaggedCount = orderedRecords.filter((record) => record.status !== 'valid').length;
      const photosCount = orderedRecords.reduce((total, record) => total + record.photos.length, 0);
      const completedSteps = expectedJourneyOrder.filter((step) => (typeCounts.get(step) ?? 0) > 0).length;
      const completionPercent = Math.round((completedSteps / expectedJourneyOrder.length) * 100);
      const nextExpectedStep = missingSteps[0] ?? null;

      let statusTone: EmployeeDailyJourneyCard['statusTone'] = 'success';
      let statusLabel = 'Fluxo completo';

      if (orderedRecords.some((record) => record.status === 'rejected')) {
        statusTone = 'danger';
        statusLabel = 'Com rejeição';
      } else if (pendingCount > 0) {
        statusTone = 'warning';
        statusLabel = 'Em validação';
      } else if (missingSteps.length > 0 || duplicatedSteps.length > 0) {
        statusTone = 'info';
        statusLabel = 'Fluxo incompleto';
      }

      return {
        employeeId,
        employeeName: orderedRecords[0]?.employeeName ?? 'Colaborador',
        department: orderedRecords[0]?.department ?? 'Sem departamento',
        records: orderedRecords,
        latestRecord: orderedRecords[orderedRecords.length - 1]!,
        firstRecord: orderedRecords[0]!,
        missingSteps,
        duplicatedSteps,
        pendingCount,
        flaggedCount,
        photosCount,
        completedSteps,
        completionPercent,
        nextExpectedStep,
        statusTone,
        statusLabel,
      };
    })
    .sort((left, right) => {
      if (left.statusTone !== right.statusTone) {
        const priority = { danger: 0, warning: 1, info: 2, success: 3 };
        return priority[left.statusTone] - priority[right.statusTone];
      }

      return left.employeeName.localeCompare(right.employeeName, 'pt-BR');
    });
};

export const DailyTimeRecordSequence = ({
  records,
  selectedDayLabel,
  onAdjustRecord,
  onViewRecord,
}: DailyTimeRecordSequenceProps) => {
  const employeeJourneys = useMemo(() => buildJourneyCards(records), [records]);

  if (employeeJourneys.length === 0) {
    return null;
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
            Leitura da jornada
          </p>
          <h3 className="mt-2 font-headline text-2xl font-extrabold text-[var(--on-surface)]">
            Sequência diária por funcionário
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--on-surface-variant)]">
            Acompanhe em {selectedDayLabel} a ordem real das batidas por colaborador, identifique lacunas no fluxo
            esperado e abra rapidamente o registro mais recente para revisar evidências e localização.
          </p>
        </div>

        <Badge variant="neutral">{employeeJourneys.length} funcionário(s) com marcações no dia</Badge>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {employeeJourneys.map((journey) => (
          <Card
            key={journey.employeeId}
            className="overflow-hidden border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.96))] p-0"
          >
            <div className="border-b border-[color:color-mix(in_srgb,var(--outline-variant)_12%,transparent)] px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={journey.statusTone}>{journey.statusLabel}</Badge>
                    <Badge variant="neutral">{journey.records.length} batida(s)</Badge>
                  </div>
                  <h4 className="mt-3 font-headline text-xl font-extrabold text-[var(--on-surface)]">
                    {journey.employeeName}
                  </h4>
                  <p className="mt-1 text-sm text-[var(--on-surface-variant)]">{journey.department}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:min-w-[18rem]">
                  <div className="rounded-[1rem] bg-[var(--surface-container-low)] px-3 py-3">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                      Primeiro registro
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--on-surface)]">
                      {formatTimeOnly(journey.firstRecord.recordedAt)}
                    </p>
                  </div>
                  <div className="rounded-[1rem] bg-[var(--surface-container-low)] px-3 py-3">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                      Último registro
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--on-surface)]">
                      {formatTimeOnly(journey.latestRecord.recordedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5 px-5 py-5 sm:px-6">
              <div className="grid gap-3 sm:grid-cols-4">
                <div className="rounded-[1rem] bg-[var(--surface-container-low)] px-4 py-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                    Conclusão
                  </p>
                  <p className="mt-2 text-lg font-extrabold text-[var(--on-surface)]">{journey.completionPercent}%</p>
                </div>
                <div className="rounded-[1rem] bg-[var(--surface-container-low)] px-4 py-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                    Em revisão
                  </p>
                  <p className="mt-2 text-lg font-extrabold text-[var(--on-surface)]">{journey.pendingCount}</p>
                </div>
                <div className="rounded-[1rem] bg-[var(--surface-container-low)] px-4 py-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                    Evidências
                  </p>
                  <p className="mt-2 text-lg font-extrabold text-[var(--on-surface)]">{journey.photosCount}</p>
                </div>
                <div className="rounded-[1rem] bg-[var(--surface-container-low)] px-4 py-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                    Alertas
                  </p>
                  <p className="mt-2 text-lg font-extrabold text-[var(--on-surface)]">{journey.flaggedCount}</p>
                </div>
              </div>

              <div className="rounded-[1.25rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_12%,transparent)] bg-[var(--surface-container-lowest)] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-[var(--primary)]" />
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
                    Linha do tempo registrada
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {journey.records.map((record, index) => (
                    <div key={record.id} className="flex items-center gap-2">
                      <button
                        className="group rounded-[1rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_14%,transparent)] bg-[var(--surface-container-low)] px-3 py-3 text-left transition hover:-translate-y-0.5 hover:border-[var(--primary)] hover:bg-[var(--surface-container)]"
                        type="button"
                        onClick={() => onViewRecord(record)}
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusVariant(record.status)}>
                            {formatTimeRecordTypeLabel(record.recordType)}
                          </Badge>
                          <span className="text-sm font-semibold text-[var(--on-surface)]">
                            {formatTimeOnly(record.recordedAt)}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-[var(--on-surface-variant)]">
                          {formatTimeRecordStatusLabel(record.status)}
                        </p>
                      </button>

                      {index < journey.records.length - 1 ? (
                        <ArrowRight className="h-4 w-4 text-[var(--on-surface-variant)]" />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1.2fr]">
                <div className="rounded-[1.15rem] bg-[var(--surface-container-low)] px-4 py-4">
                  <div className="flex items-center gap-2">
                    {journey.missingSteps.length === 0 ? (
                      <CheckCircle2 className="h-4 w-4 text-[var(--primary)]" />
                    ) : (
                      <CircleDashed className="h-4 w-4 text-[var(--on-surface-variant)]" />
                    )}
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                      Próxima etapa esperada
                    </p>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-[var(--on-surface)]">
                    {journey.nextExpectedStep ? formatTimeRecordTypeLabel(journey.nextExpectedStep) : 'Jornada completa'}
                  </p>
                </div>

                <div className="rounded-[1.15rem] bg-[var(--surface-container-low)] px-4 py-4">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-[var(--on-surface-variant)]" />
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                      Pontos de atenção
                    </p>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-[var(--on-surface)]">
                    {journey.missingSteps.length > 0
                      ? `Faltam ${journey.missingSteps.map((step) => formatTimeRecordTypeLabel(step).toLowerCase()).join(', ')}.`
                      : journey.duplicatedSteps.length > 0
                        ? `Há duplicidade em ${journey.duplicatedSteps
                            .map((step) => formatTimeRecordTypeLabel(step).toLowerCase())
                            .join(', ')}.`
                        : 'Sem lacunas estruturais no fluxo esperado.'}
                  </p>
                </div>

                <div className="rounded-[1.15rem] bg-[var(--surface-container-low)] px-4 py-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[var(--on-surface-variant)]" />
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                      Contexto do último registro
                    </p>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm font-semibold text-[var(--on-surface)]">
                    {journey.latestRecord.resolvedAddress ?? 'Sem endereço resolvido no registro mais recente.'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-2 border-t border-[color:color-mix(in_srgb,var(--outline-variant)_12%,transparent)] pt-4">
                <Button size="sm" variant="outline" onClick={() => onViewRecord(journey.latestRecord)}>
                  <Eye className="h-4 w-4" />
                  Ver último registro
                </Button>
                <Button size="sm" onClick={() => onAdjustRecord(journey.latestRecord)}>
                  <PencilLine className="h-4 w-4" />
                  Ajustar mais recente
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
