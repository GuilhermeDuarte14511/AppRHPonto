'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import type { Employee } from '@rh-ponto/employees';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormField,
  Input,
  PageHeader,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rh-ponto/ui';
import { employeeFormSchema, type EmployeeFormSchema } from '@rh-ponto/validations';

import { ActionConfirmationDialog } from '@/shared/components/action-confirmation-dialog';
import {
  formatCpf,
  formatCpfInput,
  formatPhone,
  formatPhoneInput,
  formatPinInput,
  normalizeCpf,
  normalizePhone,
} from '@/shared/lib/admin-formatters';
import { showValidationToast } from '@/shared/lib/form-feedback';
import { DepartmentFormDialog } from '@/features/departments/components/department-form-dialog';
import { useDepartments } from '@/features/departments/hooks/use-departments';

import { useCreateEmployee } from '../hooks/use-create-employee';
import { initializeEmployeeOnboarding } from '../lib/employee-onboarding-client';
import { useUpdateEmployee } from '../hooks/use-update-employee';
import { useEmployees } from '../hooks/use-employees';

type EmployeeFormInput = z.input<typeof employeeFormSchema>;

interface EmployeeFormProps {
  mode?: 'create' | 'edit';
  employee?: Employee | null;
}

const emptySelectValue = '__none__';

const createDefaultValues = (employee?: Employee | null): EmployeeFormInput => ({
  registrationNumber: employee?.registrationNumber ?? '',
  fullName: employee?.fullName ?? '',
  cpf: employee?.cpf ? formatCpf(employee.cpf) : '',
  email: employee?.email ?? '',
  phone: employee?.phone ? formatPhone(employee.phone) : '',
  birthDate: typeof employee?.birthDate === 'string' ? employee.birthDate : '',
  hireDate: typeof employee?.hireDate === 'string' ? employee.hireDate : '',
  departmentId: employee?.departmentId ?? '',
  position: employee?.position ?? '',
  pinCode: employee?.pinCode ?? '',
  isActive: employee?.isActive ?? true,
});

export const EmployeeForm = ({ mode = 'create', employee = null }: EmployeeFormProps) => {
  const router = useRouter();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const { data: departments = [], isLoading: isDepartmentsLoading } = useDepartments();
  const { data: employees = [] } = useEmployees();
  const isEditMode = mode === 'edit' && employee != null;
  const [pendingValues, setPendingValues] = useState<EmployeeFormSchema | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isDepartmentDialogOpen, setIsDepartmentDialogOpen] = useState(false);

  const form = useForm<EmployeeFormInput, unknown, EmployeeFormSchema>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: createDefaultValues(employee),
  });

  useEffect(() => {
    form.reset(createDefaultValues(employee));
  }, [employee, form]);

  const selectedDepartmentName = useMemo(() => {
    const departmentId = pendingValues?.departmentId ?? form.watch('departmentId');

    return departments.find((department) => department.id === departmentId)?.name ?? 'Sem departamento';
  }, [departments, form, pendingValues?.departmentId]);

  const handleSubmit = form.handleSubmit(
    async (values: EmployeeFormSchema) => {
      setPendingValues(values);
      setIsConfirmationOpen(true);
    },
    () => {
      showValidationToast(form.formState.errors, {
        title: 'Revise os dados do colaborador.',
      });
    },
  );

  const backPath = isEditMode ? `/employees/${employee.id}` : '/employees';

  return (
    <div className="space-y-8 sm:space-y-10">
      <PageHeader
        eyebrow={isEditMode ? 'Funcionários / Editar' : 'Funcionários / Novo'}
        title={isEditMode ? 'Editar funcionário' : 'Adicionar funcionário'}
        description={
          isEditMode
            ? 'Atualize os dados cadastrais do colaborador com persistência direta na base operacional.'
            : 'Formulário principal do cadastro de colaborador, já integrado a departamentos e estrutura organizacional.'
        }
        actions={
          <Button size="lg" variant="outline" onClick={() => router.push(backPath)}>
            Voltar
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <CardHeader className="border-b border-[color:color-mix(in_srgb,var(--outline-variant)_18%,transparent)] bg-[var(--surface-container-low)]">
          <CardTitle>{isEditMode ? 'Edição cadastral' : 'Novo registro de colaborador'}</CardTitle>
          <p className="text-sm text-[var(--on-surface-variant)]">
            {isEditMode
              ? 'Revise os dados essenciais do colaborador e mantenha a base administrativa atualizada.'
              : 'Preencha os dados essenciais para iniciar o cadastro do colaborador na base operacional.'}
          </p>
        </CardHeader>
        <CardContent className="p-5 sm:p-8">
          <form className="space-y-10" onSubmit={handleSubmit}>
            <section className="space-y-6">
              <div>
                <p className="font-headline text-sm font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
                  Identidade
                </p>
                <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
                  Informações básicas que compõem o arquivo principal do funcionário.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField label="Matrícula" error={form.formState.errors.registrationNumber?.message}>
                  <Input {...form.register('registrationNumber')} />
                </FormField>
                <FormField label="Nome completo" error={form.formState.errors.fullName?.message}>
                  <Input {...form.register('fullName')} />
                </FormField>
                <FormField label="CPF" error={form.formState.errors.cpf?.message}>
                  <Controller
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <Input
                        inputMode="numeric"
                        maxLength={14}
                        placeholder="000.000.000-00"
                        value={typeof field.value === 'string' ? field.value : ''}
                        onBlur={field.onBlur}
                        onChange={(event) => field.onChange(formatCpfInput(normalizeCpf(event.target.value)))}
                      />
                    )}
                  />
                </FormField>
                <FormField label="Email corporativo" error={form.formState.errors.email?.message}>
                  <Input type="email" {...form.register('email')} />
                </FormField>
                <FormField label="Telefone" error={form.formState.errors.phone?.message}>
                  <Controller
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <Input
                        inputMode="tel"
                        maxLength={15}
                        placeholder="(00) 00000-0000"
                        value={typeof field.value === 'string' ? field.value : ''}
                        onBlur={field.onBlur}
                        onChange={(event) => field.onChange(formatPhoneInput(normalizePhone(event.target.value)))}
                      />
                    )}
                  />
                </FormField>
                <FormField label="PIN" error={form.formState.errors.pinCode?.message}>
                  <Controller
                    control={form.control}
                    name="pinCode"
                    render={({ field }) => (
                      <Input
                        inputMode="numeric"
                        maxLength={8}
                        placeholder="0000"
                        value={typeof field.value === 'string' ? field.value : ''}
                        onBlur={field.onBlur}
                        onChange={(event) => field.onChange(formatPinInput(event.target.value))}
                      />
                    )}
                  />
                </FormField>
              </div>
            </section>

            <section className="space-y-6">
              <div>
                <p className="font-headline text-sm font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
                  Vínculo profissional
                </p>
                <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
                  Dados utilizados pelo painel para jornadas, autorizações e histórico de ponto.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField label="Nascimento" error={form.formState.errors.birthDate?.message}>
                  <Input type="date" {...form.register('birthDate')} />
                </FormField>
                <FormField label="Admissão" error={form.formState.errors.hireDate?.message}>
                  <Input type="date" {...form.register('hireDate')} />
                </FormField>

                <div className="space-y-2.5 md:col-span-2">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                      Departamento
                    </p>
                    <Button size="sm" type="button" variant="outline" onClick={() => setIsDepartmentDialogOpen(true)}>
                      Criar departamento
                    </Button>
                  </div>
                  <Controller
                    control={form.control}
                    name="departmentId"
                    render={({ field }) => (
                      <Select
                        value={String(field.value ?? emptySelectValue)}
                        onValueChange={(value) => field.onChange(value === emptySelectValue ? '' : value)}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isDepartmentsLoading ? 'Carregando departamentos...' : 'Selecione um departamento'
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={emptySelectValue}>Sem departamento definido</SelectItem>
                          {departments.map((department) => (
                            <SelectItem key={department.id} value={department.id}>
                              {department.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.departmentId?.message ? (
                    <p className="text-xs text-[var(--on-error-container)]">
                      {form.formState.errors.departmentId.message}
                    </p>
                  ) : (
                    <p className="text-xs text-[var(--on-surface-variant)]">
                      Se o departamento ainda não existir, crie-o sem sair desta tela.
                    </p>
                  )}
                </div>

                <FormField label="Cargo" error={form.formState.errors.position?.message}>
                  <Input {...form.register('position')} />
                </FormField>
              </div>
            </section>

            <div className="flex flex-col-reverse gap-3 border-t border-[color:color-mix(in_srgb,var(--outline-variant)_18%,transparent)] pt-8 sm:flex-row sm:flex-wrap sm:justify-end">
              <Button className="w-full sm:w-auto" type="button" variant="ghost" onClick={() => router.push(backPath)}>
                Cancelar
              </Button>
              <Button
                className="w-full sm:w-auto"
                disabled={createEmployee.isPending || updateEmployee.isPending}
                size="lg"
                type="submit"
              >
                {createEmployee.isPending || updateEmployee.isPending
                  ? 'Salvando...'
                  : isEditMode
                    ? 'Salvar alterações'
                    : 'Criar funcionário'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <ActionConfirmationDialog
        confirmLabel={isEditMode ? 'Confirmar atualização' : 'Confirmar cadastro'}
        description={
          isEditMode
            ? 'Confira os dados abaixo antes de atualizar o cadastro do colaborador na base operacional.'
            : 'Confira os dados abaixo antes de criar o novo colaborador na base operacional.'
        }
        isPending={createEmployee.isPending || updateEmployee.isPending}
        onConfirm={async () => {
          if (!pendingValues) {
            return;
          }

          const savedEmployee = isEditMode
            ? await updateEmployee.mutateAsync({
                ...pendingValues,
                id: employee.id,
              })
            : await createEmployee.mutateAsync(pendingValues);

          if (!isEditMode) {
            try {
              await initializeEmployeeOnboarding(savedEmployee.id);
            } catch (error) {
              const message =
                error instanceof Error && error.message
                  ? error.message
                  : 'O colaborador foi criado, mas o onboarding inicial não pôde ser iniciado agora.';

              toast.warning(message);
            }
          }

          toast.success(
            isEditMode
              ? 'Cadastro atualizado com sucesso.'
              : 'Funcionário criado com onboarding inicial já configurado.',
          );
          setPendingValues(null);
          router.push(`/employees/${savedEmployee.id}`);
        }}
        onOpenChange={(open) => {
          setIsConfirmationOpen(open);
          if (!open) {
            setPendingValues(null);
          }
        }}
        open={isConfirmationOpen}
        summary={[
          { label: 'Nome completo', value: pendingValues?.fullName ?? '-' },
          { label: 'Matrícula', value: pendingValues?.registrationNumber ?? '-' },
          { label: 'Departamento', value: selectedDepartmentName },
          { label: 'Cargo', value: pendingValues?.position ?? 'Cargo não informado' },
          { label: 'Email corporativo', value: pendingValues?.email ?? 'Não informado' },
          { label: 'Admissão', value: pendingValues?.hireDate ?? 'Não informada' },
        ]}
        title={isEditMode ? 'Confirmar atualização do cadastro' : 'Confirmar criação do colaborador'}
      />

      <DepartmentFormDialog
        managers={employees}
        onOpenChange={setIsDepartmentDialogOpen}
        onSaved={(department) => {
          form.setValue('departmentId', department.id, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          });
        }}
        open={isDepartmentDialogOpen}
      />
    </div>
  );
};
