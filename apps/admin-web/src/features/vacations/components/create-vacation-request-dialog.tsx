'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

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
import { vacationRequestSchema, type VacationRequestSchema } from '@rh-ponto/validations';

import { ActionConfirmationDialog } from '@/shared/components/action-confirmation-dialog';
import { showValidationToast } from '@/shared/lib/form-feedback';

import { useCreateVacationRequest, useVacationEmployees } from '../hooks/use-vacation-requests';

type VacationRequestFormInput = z.input<typeof vacationRequestSchema>;

type CreateVacationRequestDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const CreateVacationRequestDialog = ({ open, onOpenChange }: CreateVacationRequestDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const createVacationRequest = useCreateVacationRequest();
  const { data: employees = [] } = useVacationEmployees();
  const [pendingValues, setPendingValues] = useState<VacationRequestSchema | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const form = useForm<VacationRequestFormInput, unknown, VacationRequestSchema>({
    resolver: zodResolver(vacationRequestSchema),
    defaultValues: {
      employeeId: '',
      startDate: '',
      endDate: '',
      advanceThirteenthSalary: false,
      attachmentName: '',
    },
  });

  const selectedEmployee = useMemo(
    () => employees.find((employee) => employee.id === form.watch('employeeId')) ?? null,
    [employees, form],
  );
  const selectedEmployeeForConfirmation = useMemo(
    () => employees.find((employee) => employee.id === pendingValues?.employeeId) ?? null,
    [employees, pendingValues?.employeeId],
  );

  const startDate = form.watch('startDate');
  const endDate = form.watch('endDate');
  const totalDays = useMemo(() => {
    if (!startDate || !endDate) {
      return 0;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    return Math.max(0, Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  }, [endDate, startDate]);
  const confirmationTotalDays = useMemo(() => {
    if (!pendingValues?.startDate || !pendingValues.endDate) {
      return 0;
    }

    const start = new Date(pendingValues.startDate);
    const end = new Date(pendingValues.endDate);

    return Math.max(0, Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  }, [pendingValues]);

  const handleSubmit = form.handleSubmit(
    async (values) => {
      if (!selectedEmployee) {
        form.setError('employeeId', {
          type: 'manual',
          message: 'Selecione um funcionário válido.',
        });

        showValidationToast({ employeeId: { message: 'Selecione um funcionário válido.', type: 'manual' } }, {
          title: 'Selecione o colaborador.',
        });
        return;
      }

      setPendingValues(values);
      setIsConfirmationOpen(true);
    },
    () => {
      showValidationToast(form.formState.errors, {
        title: 'Revise os dados da solicitação.',
      });
    },
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[min(96vw,64rem)] rounded-[2rem] p-0">
          <div className="border-b border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] px-5 py-5 sm:px-8 sm:py-7">
            <h2 className="font-headline text-3xl font-extrabold tracking-tight text-[var(--on-surface)]">
              Nova solicitação de férias
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--on-surface-variant)]">
              Preencha os dados principais para registrar o novo pedido de afastamento no fluxo administrativo.
            </p>
          </div>

          <form className="space-y-6 px-5 py-5 sm:px-8 sm:py-7" onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              <FormField label="Selecionar funcionário" error={form.formState.errors.employeeId?.message}>
                <Controller
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha um colaborador" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField label="Departamento">
                <div className="flex h-12 items-center rounded-[var(--radius-md)] bg-[var(--surface-container-low)] px-4 text-sm text-[var(--on-surface-variant)]">
                  {selectedEmployee?.department ?? 'Selecione um funcionário'}
                </div>
              </FormField>
            </div>

            <div className="rounded-[1.5rem] bg-[var(--surface-container-low)] p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <FormField label="Data de início" error={form.formState.errors.startDate?.message}>
                  <Input type="date" {...form.register('startDate')} />
                </FormField>
                <FormField label="Data de fim" error={form.formState.errors.endDate?.message}>
                  <Input type="date" {...form.register('endDate')} />
                </FormField>
              </div>
              <div className="mt-4 flex flex-col gap-2 text-sm text-[var(--on-surface-variant)] sm:flex-row sm:items-center sm:justify-between">
                <span>Total de dias solicitados</span>
                <span className="font-headline text-lg font-extrabold text-[var(--primary)]">{totalDays} dias</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-[1.5rem] bg-[var(--surface-container-low)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-headline text-sm font-extrabold text-[var(--on-surface)]">
                  Adiantamento de 13º salário
                </p>
                <p className="mt-1 text-xs text-[var(--on-surface-variant)]">
                  Permite registrar a solicitação junto ao pedido de férias.
                </p>
              </div>
              <button
                aria-label="Alternar adiantamento de 13º"
                className={
                  form.watch('advanceThirteenthSalary')
                    ? 'relative inline-flex h-6 w-11 rounded-full bg-[var(--primary)]'
                    : 'relative inline-flex h-6 w-11 rounded-full bg-[var(--outline-variant)]'
                }
                type="button"
                onClick={() => form.setValue('advanceThirteenthSalary', !form.watch('advanceThirteenthSalary'))}
              >
                <span
                  className={
                    form.watch('advanceThirteenthSalary')
                      ? 'absolute right-1 top-1 h-4 w-4 rounded-full bg-white'
                      : 'absolute left-1 top-1 h-4 w-4 rounded-full bg-white'
                  }
                />
              </button>
            </div>

            <FormField label="Documento de aceite" hint="PDF, PNG ou JPG. No MVP o arquivo fica representado apenas pelo nome.">
              <input
                ref={fileInputRef}
                className="hidden"
                type="file"
                onChange={(event) => {
                  const fileName = event.target.files?.[0]?.name ?? '';
                  form.setValue('attachmentName', fileName, { shouldDirty: true });
                }}
              />
              <button
                className="flex w-full flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-[color:color-mix(in_srgb,var(--outline-variant)_40%,transparent)] bg-[var(--surface-container-low)] px-6 py-8 text-center transition hover:border-[var(--primary)]/45"
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                <p className="font-headline text-base font-extrabold text-[var(--on-surface)]">
                  {form.watch('attachmentName') || 'Arraste o arquivo aqui ou clique para buscar'}
                </p>
                <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
                  Aceite digital ou documento complementar.
                </p>
              </button>
            </FormField>

            <div className="flex flex-col-reverse gap-3 border-t border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] pt-6 sm:flex-row sm:flex-wrap sm:justify-end">
              <Button className="w-full sm:w-auto" type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button className="w-full sm:w-auto" disabled={createVacationRequest.isPending} type="submit">
                {createVacationRequest.isPending ? 'Criando...' : 'Criar solicitação'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ActionConfirmationDialog
        confirmLabel="Confirmar solicitação"
        description="Confira os dados abaixo antes de registrar a solicitação de férias no fluxo administrativo."
        isPending={createVacationRequest.isPending}
        onConfirm={async () => {
          if (!pendingValues || !selectedEmployeeForConfirmation) {
            return;
          }

          await createVacationRequest.mutateAsync({
            employeeId: selectedEmployeeForConfirmation.id,
            employeeName: selectedEmployeeForConfirmation.fullName,
            employeeEmail:
              selectedEmployeeForConfirmation.email ??
              `${selectedEmployeeForConfirmation.registrationNumber}@pontoprecise.com`,
            department: selectedEmployeeForConfirmation.department ?? 'Sem departamento',
            position: selectedEmployeeForConfirmation.position ?? 'Cargo não informado',
            startDate: pendingValues.startDate,
            endDate: pendingValues.endDate,
            advanceThirteenthSalary: pendingValues.advanceThirteenthSalary,
            attachmentName: pendingValues.attachmentName || null,
          });

          toast.success('Solicitação de férias criada com sucesso.');
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
          { label: 'Colaborador', value: selectedEmployeeForConfirmation?.fullName ?? '-' },
          { label: 'Departamento', value: selectedEmployeeForConfirmation?.department ?? 'Sem departamento' },
          { label: 'Início', value: pendingValues?.startDate ?? '-' },
          { label: 'Fim', value: pendingValues?.endDate ?? '-' },
          { label: 'Total de dias', value: `${confirmationTotalDays} dias` },
          {
            label: '13º adiantado',
            value: pendingValues?.advanceThirteenthSalary ? 'Solicitado' : 'Não solicitado',
          },
          { label: 'Documento', value: pendingValues?.attachmentName || 'Sem anexo' },
        ]}
        title="Confirmar solicitação de férias"
      />
    </>
  );
};
