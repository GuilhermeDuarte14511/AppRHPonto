'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  BadgeCheck,
  Blocks,
  ChevronLeft,
  Clock3,
  FileText,
  GraduationCap,
  HandCoins,
  KeyRound,
  LaptopMinimal,
  Plus,
  ShieldAlert,
  Signature,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button, Card, EmptyState, ErrorState, PageHeader } from '@rh-ponto/ui';

import { ActionConfirmationDialog } from '@/shared/components/action-confirmation-dialog';
import { DetailPageSkeleton } from '@/shared/components/page-skeletons';
import { getActionErrorMessage } from '@/shared/lib/mutation-feedback';

import {
  useCreateOnboardingTask,
  useOnboardingJourneyDetail,
  useUpdateOnboardingTaskStatus,
} from '../hooks/use-onboarding-overview';
import type { OnboardingTaskCategory } from '../lib/onboarding-contracts';
import { onboardingCategoryLabelMap } from '../lib/onboarding-formatters';
import { CreateOnboardingTaskDialog } from './create-onboarding-task-dialog';
import { OnboardingJourneyStatusBadge, OnboardingTaskStatusBadge } from './onboarding-status-badge';

const categoryIcons: Record<OnboardingTaskCategory, typeof FileText> = {
  documentation: FileText,
  equipment: LaptopMinimal,
  signature: Signature,
  access: KeyRound,
  training: GraduationCap,
  benefits: HandCoins,
  culture: Sparkles,
};

type TaskActionType = 'completed' | 'blocked' | 'in_progress';

export const OnboardingDetailView = ({ journeyId }: { journeyId: string }) => {
  const { data, error, isError, isLoading, refetch } = useOnboardingJourneyDetail(journeyId);
  const createTask = useCreateOnboardingTask(journeyId);
  const updateTaskStatus = useUpdateOnboardingTaskStatus(journeyId);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [taskAction, setTaskAction] = useState<{
    taskId: string;
    taskTitle: string;
    action: TaskActionType;
  } | null>(null);

  const selectedTask = useMemo(
    () =>
      data?.sections
        .flatMap((section) => section.tasks)
        .find((task) => task.id === taskAction?.taskId) ?? null,
    [data?.sections, taskAction?.taskId],
  );

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Não foi possível carregar o checklist de onboarding"
        description={getActionErrorMessage(error, 'Tente novamente para consultar esta jornada.')}
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
        title="Jornada não encontrada"
        description="Esta jornada não está disponível. Volte para a lista e escolha outro onboarding."
      />
    );
  }

  const actionMeta: Record<
    TaskActionType,
    {
      title: string;
      description: string;
      confirmLabel: string;
      confirmVariant?: 'default' | 'destructive';
      noteLabel: string;
      notePlaceholder: string;
      requireReason?: boolean;
      tone: 'success' | 'danger' | 'info';
    }
  > = {
    completed: {
      title: 'Concluir etapa',
      description: 'Confirme a conclusão da etapa para atualizar o progresso da jornada.',
      confirmLabel: 'Concluir etapa',
      noteLabel: 'Observação da conclusão',
      notePlaceholder: 'Ex.: contrato assinado, acessos liberados e evidência validada.',
      tone: 'success',
    },
    blocked: {
      title: 'Bloquear etapa',
      description: 'Informe o motivo do bloqueio para manter a trilha operacional clara para o RH.',
      confirmLabel: 'Registrar bloqueio',
      confirmVariant: 'destructive',
      noteLabel: 'Motivo do bloqueio',
      notePlaceholder: 'Ex.: equipamento não entregue, documento pendente ou dependência externa.',
      requireReason: true,
      tone: 'danger',
    },
    in_progress: {
      title: 'Retomar etapa',
      description: 'Use esta ação quando a etapa voltar para a execução normal após um bloqueio ou reabertura.',
      confirmLabel: 'Retomar etapa',
      noteLabel: 'Observação da retomada',
      notePlaceholder: 'Ex.: fornecedor confirmou a entrega e a etapa voltou ao fluxo normal.',
      tone: 'info',
    },
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      <PageHeader
        eyebrow="Onboarding / Checklist"
        title="Checklist individual"
        description="Acompanhe a integração do novo colaborador com foco em etapas, bloqueios, evidências e progresso operacional."
        actions={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" variant="outline" onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Adicionar etapa
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/onboarding">
                <ChevronLeft className="h-4 w-4" />
                Voltar
              </Link>
            </Button>
          </div>
        }
      />

      <section className="grid gap-8 xl:grid-cols-[0.42fr_0.58fr]">
        <Card className="overflow-hidden p-6 sm:p-8">
          <div className="flex items-start gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary-fixed),white)] font-headline text-2xl font-extrabold text-[var(--primary)]">
              {data.employeeName
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0]?.toUpperCase() ?? '')
                .join('')}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <OnboardingJourneyStatusBadge status={data.status} />
                <span className="rounded-full bg-[var(--primary-fixed)] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--primary)]">
                  {data.currentStageLabel}
                </span>
              </div>
              <h2 className="mt-4 font-headline text-3xl font-extrabold text-[var(--on-surface)]">{data.employeeName}</h2>
              <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                {data.position} · {data.department}
              </p>
              <p className="mt-1 text-sm text-[var(--on-surface-variant)]">{data.employeeEmail ?? 'Sem e-mail cadastrado'}</p>
            </div>
          </div>

          <div className="mt-8 rounded-[1.5rem] bg-[var(--surface-container-low)] p-5">
            <div className="flex items-center justify-between text-sm font-semibold text-[var(--on-surface-variant)]">
              <span>Progresso geral</span>
              <span>{data.progressPercent}%</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-[var(--surface-container-high)]">
              <div className="primary-gradient h-full rounded-full" style={{ width: `${data.progressPercent}%` }} />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <ProfileMetaCard label="Matrícula" value={data.registrationNumber} />
              <ProfileMetaCard label="Admissão" value={data.hireDateLabel} />
              <ProfileMetaCard label="Início do onboarding" value={data.startDateLabel} />
              <ProfileMetaCard label="Previsão de conclusão" value={data.expectedEndDateLabel} />
              <ProfileMetaCard label="Responsável RH" value={data.ownerName} />
              <ProfileMetaCard label="Telefone" value={data.phoneLabel} />
            </div>
          </div>

          <div className="mt-6 rounded-[1.5rem] bg-[var(--surface-container-low)] p-5">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
              Observações da jornada
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--on-surface-variant)]">
              {data.notes ?? 'Sem observações adicionais para esta jornada.'}
            </p>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <MetricPanel icon={BadgeCheck} label="Etapas concluídas" tone="success" value={String(data.stats.completedTasks)} />
          <MetricPanel icon={Blocks} label="Etapas totais" tone="info" value={String(data.stats.totalTasks)} />
          <MetricPanel icon={ShieldAlert} label="Bloqueios ativos" tone="danger" value={String(data.stats.blockedTasks)} />
          <MetricPanel icon={Clock3} label="Etapas vencidas" tone="warning" value={String(data.stats.overdueTasks)} />
        </div>
      </section>

      <div className="space-y-6">
        {data.sections.map((section) => {
          const Icon = categoryIcons[section.category];

          return (
            <Card key={section.category} className="overflow-hidden">
              <div className="border-b border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] px-5 py-5 sm:px-8 sm:py-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-[var(--surface-container-low)] text-[var(--primary)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-headline text-xl font-extrabold text-[var(--on-surface)]">{section.label}</h3>
                      <p className="mt-1 text-sm leading-7 text-[var(--on-surface-variant)]">{section.summary}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-[var(--surface-container-low)] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                      {section.completedCount}/{section.totalCount} concluídas
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-0">
                {section.tasks.length === 0 ? (
                  <div className="px-5 py-6 text-sm text-[var(--on-surface-variant)] sm:px-8">
                    Nenhuma etapa cadastrada nesta categoria ainda.
                  </div>
                ) : (
                  section.tasks.map((task) => (
                    <article
                      key={task.id}
                      className="grid gap-5 border-b border-[color:color-mix(in_srgb,var(--outline-variant)_12%,transparent)] px-5 py-5 last:border-b-0 sm:px-8 xl:grid-cols-[1fr_auto]"
                    >
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <OnboardingTaskStatusBadge status={task.status} />
                          {task.isRequired ? (
                            <span className="rounded-full bg-[var(--surface-container-low)] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                              Obrigatória
                            </span>
                          ) : null}
                          {task.evidenceLabel ? (
                            <span className="rounded-full bg-[var(--primary-fixed)] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--primary)]">
                              Com evidência
                            </span>
                          ) : null}
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--on-surface)]">{task.title}</p>
                          <p className="mt-2 text-sm leading-7 text-[var(--on-surface-variant)]">
                            {task.description ?? 'Sem descrição complementar.'}
                          </p>
                        </div>
                        <div className="grid gap-3 md:grid-cols-3">
                          <TaskMetaRow label="Prazo" value={task.dueDateLabel} />
                          <TaskMetaRow label="Responsável" value={task.assignedToLabel} />
                          <TaskMetaRow label="Conclusão" value={task.completedAtLabel} />
                        </div>
                        {task.blockerReason ? (
                          <div className="rounded-[1rem] bg-[var(--error-container)] px-4 py-3 text-sm text-[var(--on-error-container)]">
                            <span className="font-semibold">Bloqueio:</span> {task.blockerReason}
                          </div>
                        ) : null}
                        {task.evidenceLabel && task.evidenceUrl ? (
                          <a
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]"
                            href={task.evidenceUrl}
                          >
                            <FileText className="h-4 w-4" />
                            {task.evidenceLabel}
                          </a>
                        ) : null}
                      </div>

                      <div className="flex flex-col gap-2 xl:min-w-[11rem] xl:items-end">
                        {task.status !== 'completed' ? (
                          <Button
                            className="w-full xl:w-auto"
                            size="sm"
                            onClick={() =>
                              setTaskAction({ taskId: task.id, taskTitle: task.title, action: 'completed' })
                            }
                          >
                            Concluir
                          </Button>
                        ) : (
                          <Button
                            className="w-full xl:w-auto"
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setTaskAction({ taskId: task.id, taskTitle: task.title, action: 'in_progress' })
                            }
                          >
                            Reabrir
                          </Button>
                        )}

                        {task.status !== 'blocked' ? (
                          <Button
                            className="w-full xl:w-auto"
                            size="sm"
                            variant="outline"
                            onClick={() => setTaskAction({ taskId: task.id, taskTitle: task.title, action: 'blocked' })}
                          >
                            Bloquear
                          </Button>
                        ) : (
                          <Button
                            className="w-full xl:w-auto"
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setTaskAction({ taskId: task.id, taskTitle: task.title, action: 'in_progress' })
                            }
                          >
                            Retomar
                          </Button>
                        )}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <CreateOnboardingTaskDialog
        assigneeOptions={data.assigneeOptions}
        isPending={createTask.isPending}
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={async (payload) => {
          await createTask.mutateAsync(payload);
          toast.success('Etapa adicionada ao onboarding.');
        }}
      />

      {taskAction && selectedTask ? (
        <ActionConfirmationDialog
          accentLabel={
            taskAction.action === 'completed'
              ? 'Atualização positiva'
              : taskAction.action === 'blocked'
                ? 'Atenção operacional'
                : 'Retomada do fluxo'
          }
          confirmLabel={actionMeta[taskAction.action].confirmLabel}
          confirmVariant={actionMeta[taskAction.action].confirmVariant}
          description={actionMeta[taskAction.action].description}
          isPending={updateTaskStatus.isPending}
          noteLabel={actionMeta[taskAction.action].noteLabel}
          notePlaceholder={actionMeta[taskAction.action].notePlaceholder}
          onConfirm={async (notes) => {
            await updateTaskStatus.mutateAsync({
              taskId: selectedTask.id,
              payload: {
                status: taskAction.action,
                blockerReason: notes || undefined,
              },
            });
            toast.success('Etapa atualizada com sucesso.');
          }}
          onOpenChange={(open) => {
            if (!open) {
              setTaskAction(null);
            }
          }}
          open
          requireReason={actionMeta[taskAction.action].requireReason}
          summary={[
            { label: 'Etapa', value: selectedTask.title },
            { label: 'Categoria', value: onboardingCategoryLabelMap[selectedTask.category] },
            { label: 'Status atual', value: selectedTask.statusLabel },
            { label: 'Prazo', value: selectedTask.dueDateLabel },
          ]}
          title={actionMeta[taskAction.action].title}
          tone={actionMeta[taskAction.action].tone}
        />
      ) : null}
    </div>
  );
};

const ProfileMetaCard = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-[1rem] bg-[var(--surface-container-lowest)] px-4 py-3">
    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">{label}</p>
    <p className="mt-2 text-sm font-semibold text-[var(--on-surface)]">{value}</p>
  </div>
);

const MetricPanel = ({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof BadgeCheck;
  label: string;
  value: string;
  tone: 'success' | 'danger' | 'warning' | 'info';
}) => {
  const toneMap = {
    success: 'bg-[var(--primary-fixed)] text-[var(--primary)]',
    danger: 'bg-[var(--error-container)] text-[var(--on-error-container)]',
    warning: 'bg-[var(--tertiary-fixed)] text-[var(--on-tertiary-fixed-variant)]',
    info: 'bg-[var(--secondary-fixed)] text-[var(--on-secondary-fixed-variant)]',
  } as const;

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className={`rounded-[1.25rem] p-3 ${toneMap[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--on-surface-variant)]">{label}</p>
          <p className="mt-3 font-headline text-4xl font-extrabold text-[var(--on-surface)]">{value}</p>
        </div>
      </div>
    </Card>
  );
};

const TaskMetaRow = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-[1rem] bg-[var(--surface-container-low)] px-4 py-3">
    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">{label}</p>
    <p className="mt-2 text-sm font-semibold text-[var(--on-surface)]">{value}</p>
  </div>
);
