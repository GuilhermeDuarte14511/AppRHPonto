'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import type { Department } from '@rh-ponto/departments';
import type { Employee } from '@rh-ponto/employees';
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
  Textarea,
} from '@rh-ponto/ui';
import { departmentFormSchema, type DepartmentFormSchema } from '@rh-ponto/validations';

import { ActionConfirmationDialog } from '@/shared/components/action-confirmation-dialog';
import { showValidationToast } from '@/shared/lib/form-feedback';

import { useCreateDepartment, useUpdateDepartment } from '../hooks/use-department-mutations';

type DepartmentFormInput = z.input<typeof departmentFormSchema>;

type ManagerOption = Pick<Employee, 'id' | 'fullName' | 'position'>;

interface DepartmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department?: Department | null;
  managers?: ManagerOption[];
  onSaved?: (department: Department) => void;
}

const emptySelectValue = '__none__';

const createDefaultValues = (department?: Department | null): DepartmentFormInput => ({
  code: department?.code ?? '',
  name: department?.name ?? '',
  managerEmployeeId: department?.managerEmployeeId ?? '',
  costCenter: department?.costCenter ?? '',
  description: department?.description ?? '',
  isActive: department?.isActive ?? true,
});

export const DepartmentFormDialog = ({
  open,
  onOpenChange,
  department = null,
  managers = [],
  onSaved,
}: DepartmentFormDialogProps) => {
  const createDepartment = useCreateDepartment();
  const updateDepartment = useUpdateDepartment();
  const isEditMode = department != null;
  const [pendingValues, setPendingValues] = useState<DepartmentFormSchema | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const form = useForm<DepartmentFormInput, unknown, DepartmentFormSchema>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: createDefaultValues(department),
  });

  useEffect(() => {
    if (open) {
      form.reset(createDefaultValues(department));
    }
  }, [department, form, open]);

  const selectedManager = useMemo(
    () => managers.find((manager) => manager.id === pendingValues?.managerEmployeeId) ?? null,
    [managers, pendingValues?.managerEmployeeId],
  );

  const handleSubmit = form.handleSubmit(
    async (values) => {
      setPendingValues(values);
      setIsConfirmationOpen(true);
    },
    () => {
      showValidationToast(form.formState.errors, {
        title: 'Revise os dados do departamento.',
      });
    },
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[min(96vw,64rem)] rounded-[2rem] p-0">
          <div className="border-b border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] px-5 py-5 sm:px-8 sm:py-7">
            <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
              Estrutura organizacional
            </p>
            <h2 className="mt-3 font-headline text-3xl font-extrabold tracking-tight text-[var(--on-surface)]">
              {isEditMode ? 'Editar departamento' : 'Criar departamento'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--on-surface-variant)]">
              Cadastre código, centro de custo e responsável para manter o vínculo organizacional consistente no painel.
            </p>
          </div>

          <form className="space-y-6 px-5 py-5 sm:px-8 sm:py-7" onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              <FormField label="Código" error={form.formState.errors.code?.message}>
                <Input placeholder="DEP-RH" {...form.register('code')} />
              </FormField>

              <FormField label="Nome do departamento" error={form.formState.errors.name?.message}>
                <Input placeholder="Recursos Humanos" {...form.register('name')} />
              </FormField>

              <FormField label="Responsável" error={form.formState.errors.managerEmployeeId?.message}>
                <Controller
                  control={form.control}
                  name="managerEmployeeId"
                  render={({ field }) => (
                    <Select
                      value={String(field.value ?? emptySelectValue)}
                      onValueChange={(value) => field.onChange(value === emptySelectValue ? '' : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um responsável" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={emptySelectValue}>Sem responsável definido</SelectItem>
                        {managers.map((manager) => (
                          <SelectItem key={manager.id} value={manager.id}>
                            {manager.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField label="Centro de custo" error={form.formState.errors.costCenter?.message}>
                <Input placeholder="CC-1004" {...form.register('costCenter')} />
              </FormField>
            </div>

            <FormField label="Descrição" error={form.formState.errors.description?.message}>
              <Textarea
                className="min-h-32"
                placeholder="Descreva o escopo do departamento, cobertura e contexto operacional."
                {...form.register('description')}
              />
            </FormField>

            <FormField label="Status">
              <label className="flex h-12 items-center gap-3 rounded-[var(--radius-md)] bg-[var(--surface-container-low)] px-4 text-sm text-[var(--on-surface)]">
                <input className="h-4 w-4" type="checkbox" {...form.register('isActive')} />
                Departamento ativo para novos vínculos
              </label>
            </FormField>

            <div className="flex flex-col-reverse gap-3 border-t border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] pt-6 sm:flex-row sm:flex-wrap sm:justify-end">
              <Button className="w-full sm:w-auto" type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button
                className="w-full sm:w-auto"
                disabled={createDepartment.isPending || updateDepartment.isPending}
                type="submit"
              >
                {createDepartment.isPending || updateDepartment.isPending
                  ? 'Salvando...'
                  : isEditMode
                    ? 'Salvar alterações'
                    : 'Criar departamento'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ActionConfirmationDialog
        confirmLabel={isEditMode ? 'Confirmar alterações' : 'Confirmar criação'}
        description={
          isEditMode
            ? 'Confira os dados abaixo antes de atualizar o departamento na base operacional.'
            : 'Confira os dados abaixo antes de criar o novo departamento na base operacional.'
        }
        isPending={createDepartment.isPending || updateDepartment.isPending}
        onConfirm={async () => {
          if (!pendingValues) {
            return;
          }

          const savedDepartment = isEditMode
            ? await updateDepartment.mutateAsync({
                id: department.id,
                ...pendingValues,
              })
            : await createDepartment.mutateAsync(pendingValues);

          toast.success(isEditMode ? 'Departamento atualizado com sucesso.' : 'Departamento criado com sucesso.');
          setPendingValues(null);
          onSaved?.(savedDepartment);
          onOpenChange(false);
        }}
        onOpenChange={(nextOpen) => {
          setIsConfirmationOpen(nextOpen);
          if (!nextOpen) {
            setPendingValues(null);
          }
        }}
        open={isConfirmationOpen}
        summary={[
          { label: 'Código', value: pendingValues?.code ?? '-' },
          { label: 'Departamento', value: pendingValues?.name ?? '-' },
          { label: 'Responsável', value: selectedManager?.fullName ?? 'Não definido' },
          { label: 'Centro de custo', value: pendingValues?.costCenter ?? 'Não informado' },
          { label: 'Status', value: pendingValues?.isActive ? 'Ativo' : 'Inativo' },
        ]}
        title={isEditMode ? 'Confirmar atualização do departamento' : 'Confirmar criação do departamento'}
      />
    </>
  );
};
