'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import type { Employee } from '@rh-ponto/employees';
import type { WorkSchedule } from '@rh-ponto/work-schedules';
import {
  Button,
  Dialog,
  DialogContent,
  FormField,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rh-ponto/ui';

import { ActionConfirmationDialog } from '@/shared/components/action-confirmation-dialog';
import { showValidationToast } from '@/shared/lib/form-feedback';

import { useAssignWorkSchedule } from '../hooks/use-schedule-mutations';

const assignWorkScheduleSchema = z.object({
  employeeId: z.string().trim().min(1, 'Selecione um colaborador.'),
  workScheduleId: z.string().trim().min(1, 'Selecione uma escala.'),
  startDate: z.string().trim().min(1, 'Informe a data de início.'),
  endDate: z.string().trim().optional(),
});

type AssignWorkScheduleSchema = z.infer<typeof assignWorkScheduleSchema>;

interface AssignWorkScheduleDialogProps {
  employees: Employee[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedules: WorkSchedule[];
}

export const AssignWorkScheduleDialog = ({
  employees,
  open,
  onOpenChange,
  schedules,
}: AssignWorkScheduleDialogProps) => {
  const assignWorkSchedule = useAssignWorkSchedule();
  const [pendingValues, setPendingValues] = useState<AssignWorkScheduleSchema | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const form = useForm<AssignWorkScheduleSchema>({
    resolver: zodResolver(assignWorkScheduleSchema),
    defaultValues: {
      employeeId: '',
      workScheduleId: '',
      startDate: '',
      endDate: '',
    },
  });

  const handleSubmit = form.handleSubmit(
    async (values) => {
      setPendingValues(values);
      setIsConfirmationOpen(true);
    },
    () => {
      showValidationToast(form.formState.errors, {
        title: 'Revise os dados do vínculo.',
      });
    },
  );

  const selectedEmployee = employees.find((employee) => employee.id === pendingValues?.employeeId) ?? null;
  const selectedSchedule = schedules.find((item) => item.id === pendingValues?.workScheduleId) ?? null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[min(96vw,48rem)] rounded-[2rem] p-0">
          <div className="border-b border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] px-5 py-5 sm:px-8 sm:py-7">
            <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
              Planejamento operacional
            </p>
            <h2 className="mt-3 font-headline text-3xl font-extrabold tracking-tight text-[var(--on-surface)]">
              Vincular escala a colaborador
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--on-surface-variant)]">
              Registre o histórico de jornada do colaborador diretamente na base operacional.
            </p>
          </div>

          <form className="space-y-6 px-5 py-5 sm:px-8 sm:py-7" onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              <FormField label="Colaborador" error={form.formState.errors.employeeId?.message}>
                <Controller
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um colaborador" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.filter((employee) => employee.isActive).map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField label="Escala" error={form.formState.errors.workScheduleId?.message}>
                <Controller
                  control={form.control}
                  name="workScheduleId"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma escala" />
                      </SelectTrigger>
                      <SelectContent>
                        {schedules.filter((schedule) => schedule.isActive).map((schedule) => (
                          <SelectItem key={schedule.id} value={schedule.id}>
                            {schedule.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField label="Início da vigência" error={form.formState.errors.startDate?.message}>
                <Input type="date" {...form.register('startDate')} />
              </FormField>

              <FormField label="Fim da vigência" hint="Opcional para escalas sem data final definida.">
                <Input type="date" {...form.register('endDate')} />
              </FormField>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] pt-6 sm:flex-row sm:flex-wrap sm:justify-end">
              <Button className="w-full sm:w-auto" type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button className="w-full sm:w-auto" disabled={assignWorkSchedule.isPending} type="submit">
                {assignWorkSchedule.isPending ? 'Vinculando...' : 'Vincular escala'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ActionConfirmationDialog
        confirmLabel="Confirmar vínculo"
        description="Confira os dados abaixo antes de registrar o vínculo da escala no histórico do colaborador."
        isPending={assignWorkSchedule.isPending}
        onConfirm={async () => {
          if (!pendingValues) {
            return;
          }

          await assignWorkSchedule.mutateAsync({
            employeeId: pendingValues.employeeId,
            workScheduleId: pendingValues.workScheduleId,
            startDate: pendingValues.startDate,
            endDate: pendingValues.endDate || null,
          });

          toast.success('Escala vinculada com sucesso.');
          form.reset();
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
          { label: 'Colaborador', value: selectedEmployee?.fullName ?? '-' },
          { label: 'Escala', value: selectedSchedule?.name ?? '-' },
          {
            label: 'Jornada',
            value: selectedSchedule ? `${selectedSchedule.startTime} às ${selectedSchedule.endTime}` : '-',
          },
          { label: 'Início da vigência', value: pendingValues?.startDate ?? '-' },
          { label: 'Fim da vigência', value: pendingValues?.endDate || 'Sem data final' },
        ]}
        title="Confirmar vínculo de escala"
      />
    </>
  );
};
