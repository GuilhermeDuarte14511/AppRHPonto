'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { CheckSquare2, PlusCircle } from 'lucide-react';
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
  Textarea,
} from '@rh-ponto/ui';
import {
  onboardingTaskCategories,
  onboardingTaskCreateSchema,
  type OnboardingTaskCreateSchema,
} from '@rh-ponto/validations';

import { showValidationToast } from '@/shared/lib/form-feedback';

import { onboardingCategoryLabelMap } from '../lib/onboarding-formatters';

const noAssigneeValue = '__none__';

interface CreateOnboardingTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPending: boolean;
  assigneeOptions: Array<{ id: string; label: string; supportingText: string }>;
  onSubmit: (payload: OnboardingTaskCreateSchema) => Promise<void> | void;
}

const defaultValues: OnboardingTaskCreateSchema = {
  title: '',
  category: 'documentation',
  description: undefined,
  dueDate: undefined,
  assignedUserId: undefined,
  isRequired: true,
};

type OnboardingTaskCreateInput = z.input<typeof onboardingTaskCreateSchema>;

export const CreateOnboardingTaskDialog = ({
  open,
  onOpenChange,
  isPending,
  assigneeOptions,
  onSubmit,
}: CreateOnboardingTaskDialogProps) => {
  const form = useForm<OnboardingTaskCreateInput, unknown, OnboardingTaskCreateSchema>({
    resolver: zodResolver(onboardingTaskCreateSchema),
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
  }, [form, open]);

  const handleSubmit = form.handleSubmit(
    async (values) => {
      await onSubmit(values);
      onOpenChange(false);
    },
    () => {
      showValidationToast(form.formState.errors, {
        title: 'Revise os dados da nova etapa.',
      });
    },
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(96vw,64rem)] rounded-[2rem] overflow-hidden p-0">
        <div className="bg-[rgba(255,255,255,0.76)] px-5 py-5 backdrop-blur-[14px] sm:px-8 sm:py-7">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.4rem] bg-[var(--primary-fixed)] text-[var(--primary)]">
              <PlusCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--primary)]">
                Checklist de onboarding
              </p>
              <h2 className="mt-3 font-headline text-[2rem] font-extrabold tracking-tight text-[var(--on-surface)] sm:text-[2.25rem]">
                Nova etapa
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--on-surface-variant)]">
                Adicione uma nova tarefa ao fluxo de admissão para manter a jornada do colaborador rastreável.
              </p>
            </div>
          </div>
        </div>

        <form className="space-y-6 bg-[rgba(247,249,251,0.72)] px-5 py-5 sm:px-8 sm:py-7" onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <FormField label="Título da etapa" error={form.formState.errors.title?.message}>
              <Input placeholder="Ex.: Assinar contrato digital" {...form.register('title')} />
            </FormField>

            <FormField label="Categoria" error={form.formState.errors.category?.message}>
              <Controller
                control={form.control}
                name="category"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {onboardingTaskCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {onboardingCategoryLabelMap[category]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <FormField label="Prazo">
              <Input type="date" {...form.register('dueDate')} />
            </FormField>

            <FormField label="Responsável">
              <Controller
                control={form.control}
                name="assignedUserId"
                render={({ field }) => (
                  <Select onValueChange={(value) => field.onChange(value === noAssigneeValue ? undefined : value)} value={field.value ?? noAssigneeValue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={noAssigneeValue}>Sem responsável específico</SelectItem>
                      {assigneeOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>

          <div className="rounded-[1.5rem] bg-[rgba(255,255,255,0.82)] px-4 py-4 backdrop-blur-[12px] sm:px-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-container-low)] text-[var(--primary)]">
                <CheckSquare2 className="h-4 w-4" />
              </span>
              <div>
                <p className="font-headline text-sm font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
                  Contexto da etapa
                </p>
                <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                  Descreva o que precisa ser feito para o RH ou a área responsável avançarem com clareza.
                </p>
              </div>
            </div>

            <FormField label="Descrição">
              <Textarea
                className="min-h-32 bg-[var(--surface-container-lowest)]"
                placeholder="Ex.: Formalizar a assinatura do contrato, termo de confidencialidade e política de uso dos ativos."
                {...form.register('description')}
              />
            </FormField>

            <label className="mt-5 flex items-center gap-3 rounded-[1rem] bg-[var(--surface-container-low)] px-4 py-3">
              <input className="h-4 w-4 rounded border-[var(--outline-variant)] text-[var(--primary)]" type="checkbox" {...form.register('isRequired')} />
              <span className="text-sm font-semibold text-[var(--on-surface)]">Esta etapa é obrigatória para concluir o onboarding.</span>
            </label>
          </div>

          <div className="flex flex-col gap-3 border-t border-[color:color-mix(in_srgb,var(--outline-variant)_12%,transparent)] pt-5 sm:flex-row sm:flex-wrap sm:justify-end">
            <Button className="rounded-xl px-6" type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button className="rounded-xl px-6" disabled={isPending} type="submit">
              {isPending ? 'Salvando...' : 'Adicionar etapa'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
