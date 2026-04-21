'use client';

import { CalendarDays, GripVertical, PencilLine, Plus, UserRoundPlus } from 'lucide-react';
import { useMemo, useState } from 'react';

import type { WorkSchedule } from '@rh-ponto/work-schedules';
import { Badge, Button, Card, Dialog, DialogContent, ErrorState, Input, PageHeader } from '@rh-ponto/ui';

import { AssignWorkScheduleDialog } from './assign-work-schedule-dialog';
import { WorkScheduleFormDialog } from './work-schedule-form-dialog';
import { OverviewPageSkeleton } from '@/shared/components/page-skeletons';
import { getActionErrorMessage } from '@/shared/lib/mutation-feedback';
import { useScheduleCatalog } from '../hooks/use-schedule-catalog';
import { useSchedulesOverview } from '../hooks/use-schedules-overview';

const shiftToneStyles = {
  primary: 'bg-[var(--primary-fixed)] text-[var(--primary)] border-[color:color-mix(in_srgb,var(--primary)_22%,transparent)]',
  secondary: 'bg-[var(--secondary-fixed)] text-[var(--secondary)] border-[color:color-mix(in_srgb,var(--secondary)_22%,transparent)]',
  success:
    'bg-[var(--surface-container-highest)] text-[var(--on-tertiary-fixed-variant)] border-[color:color-mix(in_srgb,var(--primary)_10%,transparent)]',
  warning: 'bg-[var(--tertiary-fixed)] text-[var(--on-tertiary-fixed-variant)] border-[color:color-mix(in_srgb,var(--tertiary)_20%,transparent)]',
  neutral: 'bg-[var(--surface-container-low)] text-[var(--on-surface-variant)] border-[color:color-mix(in_srgb,var(--outline-variant)_45%,transparent)]',
} as const;

type ScheduleFilterTone = 'all' | 'primary' | 'secondary' | 'success' | 'warning' | 'neutral';

const scheduleFilterLabels: Record<ScheduleFilterTone, string> = {
  all: 'Todas as escalas',
  primary: 'Operação padrão',
  secondary: 'Turno noturno',
  success: 'Atendimento e suporte',
  warning: 'Cobertura crítica',
  neutral: 'Folga ou apoio',
};

export const SchedulesOverview = () => {
  const { data, error, isError, isLoading, refetch } = useSchedulesOverview();
  const {
    data: catalog,
    error: catalogError,
    isError: isCatalogError,
    isLoading: isCatalogLoading,
  } = useScheduleCatalog();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<WorkSchedule | null>(null);
  const [assignmentSearch, setAssignmentSearch] = useState('');
  const [selectedToneFilter, setSelectedToneFilter] = useState<ScheduleFilterTone>('all');

  const activeSchedules = useMemo(
    () => catalog?.workSchedules.filter((schedule) => schedule.isActive).length ?? 0,
    [catalog],
  );
  const visibleAssignments = useMemo(() => {
    if (!data) {
      return [];
    }

    const normalizedSearch = assignmentSearch.trim().toLocaleLowerCase('pt-BR');

    return data.assignments.filter((assignment) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        assignment.employeeName.toLocaleLowerCase('pt-BR').includes(normalizedSearch) ||
        assignment.position.toLocaleLowerCase('pt-BR').includes(normalizedSearch);
      const matchesTone =
        selectedToneFilter === 'all' ||
        assignment.shifts.some((shift) => shift.tone === selectedToneFilter);

      return matchesSearch && matchesTone;
    });
  }, [assignmentSearch, data, selectedToneFilter]);

  if (isLoading || isCatalogLoading) {
    return <OverviewPageSkeleton />;
  }

  if (isError || isCatalogError || !data || !catalog) {
    return (
      <ErrorState
        title="Não foi possível carregar as escalas"
        description={getActionErrorMessage(
          error ?? catalogError,
          'Tente novamente para abrir o planejamento operacional da semana.',
        )}
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
        eyebrow="Escalas / Planejamento"
        title="Gestão de escalas"
        description="Planejamento visual dos turnos da semana com CRUD real de jornadas e vínculos operacionais."
        actions={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" variant="outline" onClick={() => setIsAssignOpen(true)}>
              <UserRoundPlus className="h-4 w-4" />
              Vincular colaborador
            </Button>
            <Button size="lg" onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              Criar nova escala
            </Button>
          </div>
        }
      />

      <section className="rounded-[1.75rem] bg-[var(--surface-container-low)] p-4 shadow-[var(--shadow-card)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="info">Semanal</Badge>
            <div className="rounded-full bg-[var(--surface-container-lowest)] px-4 py-2.5 text-sm font-semibold text-[var(--on-surface)]">
              Unidade: Matriz - SP
            </div>
            <div className="rounded-full bg-[var(--surface-container-lowest)] px-4 py-2.5 text-sm font-semibold text-[var(--on-surface)]">
              Escalas ativas: {activeSchedules}
            </div>
            <div className="rounded-full bg-[var(--surface-container-lowest)] px-4 py-2.5 text-sm font-semibold text-[var(--on-surface)]">
              Colaboradores visíveis: {visibleAssignments.length}
            </div>
          </div>
          <Button className="w-full justify-center sm:w-auto" size="sm" variant="outline" onClick={() => setIsFilterDialogOpen(true)}>
            Filtrar escalas
          </Button>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
        <Card className="overflow-hidden">
          <div className="grid gap-4 p-4 lg:hidden">
            {visibleAssignments.length === 0 ? (
              <div className="rounded-[1.5rem] bg-[var(--surface-container-low)] p-6 text-center text-sm text-[var(--on-surface-variant)]">
                Nenhuma escala corresponde ao filtro atual. Ajuste a busca ou o tipo de turno para continuar.
              </div>
            ) : (
              visibleAssignments.map((assignment) => (
                <div key={assignment.id} className="rounded-[1.5rem] bg-[var(--surface-container-low)] p-4">
                  <p className="font-headline text-base font-extrabold text-[var(--on-surface)]">{assignment.employeeName}</p>
                  <p className="mt-1 text-sm text-[var(--on-surface-variant)]">{assignment.position}</p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {assignment.shifts.map((shift, index) => (
                      <div
                        key={`${assignment.id}-${shift.dayId}`}
                        className={`rounded-[1.25rem] border-l-4 px-3 py-3 ${
                          shiftToneStyles[shift.tone as keyof typeof shiftToneStyles]
                        }`}
                      >
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--on-surface-variant)]">
                          {data.days[index]?.label}
                        </p>
                        <p className="mt-2 text-[11px] font-extrabold uppercase tracking-[0.12em]">{shift.name}</p>
                        <p className="mt-1 text-sm font-medium">{shift.hours}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="hidden lg:block">
            <div className="overflow-x-auto">
              <div className="min-w-[960px]">
                <div className="grid grid-cols-[260px_repeat(6,minmax(0,1fr))] bg-[color:color-mix(in_srgb,var(--surface-container-low)_60%,white)]">
                  <div className="px-6 py-5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                    Colaborador
                  </div>
                  {data.days.map((day) => (
                    <div key={day.id} className="px-4 py-5 text-center">
                      <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                        {day.label}
                      </div>
                      <div className="mt-1 font-headline text-xl font-extrabold text-[var(--on-surface)]">{day.date}</div>
                    </div>
                  ))}
                </div>

                <div className="divide-y divide-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)]">
                  {visibleAssignments.map((assignment) => (
                    <div key={assignment.id} className="grid grid-cols-[260px_repeat(6,minmax(0,1fr))]">
                      <div className="px-6 py-5">
                        <p className="font-headline text-sm font-extrabold text-[var(--on-surface)]">{assignment.employeeName}</p>
                        <p className="mt-1 text-xs text-[var(--on-surface-variant)]">{assignment.position}</p>
                      </div>
                      {assignment.shifts.map((shift) => (
                        <div key={`${assignment.id}-${shift.dayId}`} className="px-3 py-4">
                          <div
                            className={`rounded-[1.25rem] border-l-4 px-3 py-3 ${
                              shiftToneStyles[shift.tone as keyof typeof shiftToneStyles]
                            }`}
                          >
                            <p className="text-[11px] font-extrabold uppercase tracking-[0.12em]">{shift.name}</p>
                            <p className="mt-1 text-xs font-medium">{shift.hours}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {visibleAssignments.length === 0 ? (
              <div className="border-t border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] px-6 py-8 text-center text-sm text-[var(--on-surface-variant)]">
                Nenhuma escala corresponde ao filtro atual. Ajuste a busca ou o tipo de turno para continuar.
              </div>
            ) : null}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-headline text-lg font-extrabold text-[var(--on-surface)]">Biblioteca de turnos</h3>
              <CalendarDays className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <div className="mt-6 space-y-3">
              {catalog.workSchedules.map((shift) => (
                <div
                  key={shift.id}
                  className={`rounded-[1.25rem] border px-4 py-4 ${
                    shiftToneStyles[(shift.isActive ? 'primary' : 'neutral') as keyof typeof shiftToneStyles]
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-[0.12em]">{shift.name}</span>
                      <p className="mt-2 text-sm font-medium">{`${shift.startTime} - ${shift.endTime}`}</p>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <Button className="h-9 w-9 rounded-full p-0" size="sm" variant="ghost" onClick={() => setEditingSchedule(shift)}>
                        <PencilLine className="h-4 w-4" />
                      </Button>
                      <GripVertical className="h-4 w-4 opacity-60" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button className="mt-6 w-full justify-center" variant="outline" onClick={() => setIsCreateOpen(true)}>
              Configurar novos turnos
            </Button>
          </Card>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            <Card className="p-5 sm:p-6">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                Equipe alocada
              </p>
              <p className="mt-3 font-headline text-3xl font-extrabold text-[var(--on-surface)] sm:text-4xl">
                {data.summary.allocatedTeam}
              </p>
            </Card>
            <Card className="p-5 sm:p-6">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                Conflitos
              </p>
              <p className="mt-3 font-headline text-3xl font-extrabold text-[var(--on-surface)] sm:text-4xl">
                {String(data.summary.conflicts).padStart(2, '0')}
              </p>
            </Card>
            <Card className="p-5 sm:p-6">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                Horas planejadas
              </p>
              <p className="mt-3 font-headline text-3xl font-extrabold text-[var(--on-surface)] sm:text-4xl">
                {data.summary.plannedHours}
              </p>
            </Card>
            <Card className="primary-gradient p-5 text-white sm:p-6">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/76">Status</p>
              <p className="mt-3 font-headline text-3xl font-extrabold sm:text-4xl">{data.summary.status}</p>
            </Card>
          </section>

          <div className="grid gap-4">
            {data.alerts.map((alert) => (
              <Card key={alert.id} className="p-5">
                <p className="font-headline text-sm font-extrabold text-[var(--on-surface)]">{alert.title}</p>
                <p className="mt-3 text-sm leading-6 text-[var(--on-surface-variant)]">{alert.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <WorkScheduleFormDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <WorkScheduleFormDialog open={editingSchedule != null} onOpenChange={(open) => !open && setEditingSchedule(null)} schedule={editingSchedule} />
      <AssignWorkScheduleDialog
        employees={catalog.employees}
        open={isAssignOpen}
        onOpenChange={setIsAssignOpen}
        schedules={catalog.workSchedules}
      />
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="w-[min(96vw,48rem)] rounded-[2rem] p-0">
          <div className="space-y-6 p-6 sm:p-8">
            <div className="space-y-2">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--primary)]">
                Filtro operacional
              </p>
              <h4 className="font-headline text-2xl font-extrabold text-[var(--on-surface)]">Refinar a grade semanal</h4>
              <p className="text-sm text-[var(--on-surface-variant)]">
                Encontre rapidamente um colaborador, um contexto de cobertura ou um turno específico.
              </p>
            </div>

            <div className="space-y-3">
              <label
                className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]"
                htmlFor="assignment-search-input"
              >
                Buscar colaborador ou cargo
              </label>
              <Input
                id="assignment-search-input"
                placeholder="Ex.: Ana Paula ou suporte"
                value={assignmentSearch}
                onChange={(event) => setAssignmentSearch(event.target.value)}
              />
            </div>

            <div className="space-y-3">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                Contexto do turno
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {(Object.entries(scheduleFilterLabels) as Array<[ScheduleFilterTone, string]>).map(([tone, label]) => {
                  const isActive = selectedToneFilter === tone;

                  return (
                    <button
                      key={tone}
                      type="button"
                      onClick={() => setSelectedToneFilter(tone)}
                      className={
                        isActive
                          ? 'rounded-[1.35rem] border border-[color:color-mix(in_srgb,var(--primary)_28%,transparent)] bg-[var(--primary-fixed)] px-4 py-4 text-left shadow-[var(--shadow-card)]'
                          : 'rounded-[1.35rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_18%,transparent)] bg-[var(--surface-container-lowest)] px-4 py-4 text-left transition hover:bg-[var(--surface-container-low)]'
                      }
                    >
                      <span className="block font-headline text-sm font-extrabold text-[var(--on-surface)]">{label}</span>
                      <span className="mt-1 block text-sm text-[var(--on-surface-variant)]">
                        {tone === 'all' && 'Exibe toda a escala disponível na janela atual.'}
                        {tone === 'primary' && 'Mostra a operação regular da semana.'}
                        {tone === 'secondary' && 'Destaca turnos com perfil noturno.'}
                        {tone === 'success' && 'Foca nas jornadas de atendimento e suporte.'}
                        {tone === 'warning' && 'Ajuda a localizar coberturas críticas ou de fim de semana.'}
                        {tone === 'neutral' && 'Reúne folgas ou alocações de apoio.'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setAssignmentSearch('');
                  setSelectedToneFilter('all');
                }}
              >
                Limpar filtros
              </Button>
              <Button onClick={() => setIsFilterDialogOpen(false)}>Aplicar visualização</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
