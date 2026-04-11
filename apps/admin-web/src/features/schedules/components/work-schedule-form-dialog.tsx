'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import type { WorkSchedule } from '@rh-ponto/work-schedules';
import { Button, Dialog, DialogContent, FormField, Input } from '@rh-ponto/ui';
import { workScheduleFormSchema, type WorkScheduleFormSchema } from '@rh-ponto/validations';

import { ActionConfirmationDialog } from '@/shared/components/action-confirmation-dialog';
import { showValidationToast } from '@/shared/lib/form-feedback';

import { useCreateWorkSchedule, useUpdateWorkSchedule } from '../hooks/use-schedule-mutations';

type WorkScheduleFormInput = z.input<typeof workScheduleFormSchema>;

interface WorkScheduleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule?: WorkSchedule | null;
}

const createDefaultValues = (schedule?: WorkSchedule | null): WorkScheduleFormInput => ({
  name: schedule?.name ?? '',
  startTime: schedule?.startTime ?? '',
  breakStartTime: schedule?.breakStartTime ?? '',
  breakEndTime: schedule?.breakEndTime ?? '',
  endTime: schedule?.endTime ?? '',
  toleranceMinutes: schedule?.toleranceMinutes ?? 5,
  expectedDailyMinutes: schedule?.expectedDailyMinutes ?? 480,
  isActive: schedule?.isActive ?? true,
});

export const WorkScheduleFormDialog = ({
  open,
  onOpenChange,
  schedule = null,
}: WorkScheduleFormDialogProps) => {
  const createWorkSchedule = useCreateWorkSchedule();
  const updateWorkSchedule = useUpdateWorkSchedule();
  const isEditMode = schedule != null;
  const [pendingValues, setPendingValues] = useState<WorkScheduleFormSchema | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const form = useForm<WorkScheduleFormInput, unknown, WorkScheduleFormSchema>({
    resolver: zodResolver(workScheduleFormSchema),
    defaultValues: createDefaultValues(schedule),
  });

  useEffect(() => {
    if (open) {
      form.reset(createDefaultValues(schedule));
    }
  }, [form, open, schedule]);

  const handleSubmit = form.handleSubmit(
    async (values) => {
      setPendingValues(values);
      setIsConfirmationOpen(true);
    },
    () => {
      showValidationToast(form.formState.errors, {
        title: 'Revise os dados da escala.',
      });
    },
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[min(96vw,52rem)] rounded-[2rem] p-0">
          <div className="border-b border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] px-5 py-5 sm:px-8 sm:py-7">
            <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
              Escalas operacionais
            </p>
            <h2 className="mt-3 font-headline text-3xl font-extrabold tracking-tight text-[var(--on-surface)]">
              {isEditMode ? 'Editar escala' : 'Criar nova escala'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--on-surface-variant)]">
              Mantenha a biblioteca de jornadas sincronizada com a operação real do RH.
            </p>
          </div>

          <form className="space-y-6 px-5 py-5 sm:px-8 sm:py-7" onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              <FormField label="Nome da escala" error={form.formState.errors.name?.message}>
                <Input {...form.register('name')} />
              </FormField>
              <FormField label="Início da jornada" error={form.formState.errors.startTime?.message}>
                <Input type="time" {...form.register('startTime')} />
              </FormField>
              <FormField label="Início do intervalo" error={form.formState.errors.breakStartTime?.message}>
                <Input type="time" {...form.register('breakStartTime')} />
              </FormField>
              <FormField label="Fim do intervalo" error={form.formState.errors.breakEndTime?.message}>
                <Input type="time" {...form.register('breakEndTime')} />
              </FormField>
              <FormField label="Fim da jornada" error={form.formState.errors.endTime?.message}>
                <Input type="time" {...form.register('endTime')} />
              </FormField>
              <FormField label="Tolerância (min)" error={form.formState.errors.toleranceMinutes?.message}>
                <Input type="number" {...form.register('toleranceMinutes', { valueAsNumber: true })} />
              </FormField>
              <FormField
                label="Carga diária esperada (min)"
                error={form.formState.errors.expectedDailyMinutes?.message}
              >
                <Input type="number" {...form.register('expectedDailyMinutes', { valueAsNumber: true })} />
              </FormField>
              <FormField label="Status">
                <label className="flex h-12 items-center gap-3 rounded-[var(--radius-md)] bg-[var(--surface-container-low)] px-4 text-sm text-[var(--on-surface)]">
                  <input className="h-4 w-4" type="checkbox" {...form.register('isActive')} />
                  Escala ativa para uso operacional
                </label>
              </FormField>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] pt-6 sm:flex-row sm:flex-wrap sm:justify-end">
              <Button className="w-full sm:w-auto" type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button
                className="w-full sm:w-auto"
                disabled={createWorkSchedule.isPending || updateWorkSchedule.isPending}
                type="submit"
              >
                {createWorkSchedule.isPending || updateWorkSchedule.isPending
                  ? 'Salvando...'
                  : isEditMode
                    ? 'Salvar alterações'
                    : 'Criar escala'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ActionConfirmationDialog
        confirmLabel={isEditMode ? 'Confirmar alterações' : 'Confirmar criação'}
        description={
          isEditMode
            ? 'Confira a jornada abaixo antes de atualizar a escala na base operacional.'
            : 'Confira a jornada abaixo antes de criar a nova escala na base operacional.'
        }
        isPending={createWorkSchedule.isPending || updateWorkSchedule.isPending}
        onConfirm={async () => {
          if (!pendingValues) {
            return;
          }

          if (isEditMode) {
            await updateWorkSchedule.mutateAsync({
              id: schedule.id,
              ...pendingValues,
            });
          } else {
            await createWorkSchedule.mutateAsync(pendingValues);
          }

          toast.success(isEditMode ? 'Escala atualizada com sucesso.' : 'Escala criada com sucesso.');
          setPendingValues(null);
          onOpenChange(false);
        }}
        onOpenChange={(open) => {
          setIsConfirmationOpen(open);
          if (!open) {
            setPendingValues(null);
          }
        }}
        open={isConfirmationOpen}
        summary={[
          { label: 'Escala', value: pendingValues?.name ?? '-' },
          {
            label: 'Jornada',
            value: pendingValues ? `${pendingValues.startTime} às ${pendingValues.endTime}` : '-',
          },
          {
            label: 'Intervalo',
            value:
              pendingValues?.breakStartTime && pendingValues.breakEndTime
                ? `${pendingValues.breakStartTime} às ${pendingValues.breakEndTime}`
                : 'Sem intervalo definido',
          },
          {
            label: 'Tolerância',
            value: pendingValues ? `${pendingValues.toleranceMinutes} min` : '-',
          },
          {
            label: 'Carga diária',
            value: pendingValues?.expectedDailyMinutes ? `${pendingValues.expectedDailyMinutes} min` : 'Não informada',
          },
          {
            label: 'Status',
            value: pendingValues?.isActive ? 'Ativa' : 'Inativa',
          },
        ]}
        title={isEditMode ? 'Confirmar atualização da escala' : 'Confirmar criação da escala'}
      />
    </>
  );
};
