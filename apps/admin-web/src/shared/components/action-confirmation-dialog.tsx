'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CircleAlert, FileText, type LucideIcon, MessageSquareQuote } from 'lucide-react';

import { Button, Dialog, DialogContent, FormField, Textarea, cn } from '@rh-ponto/ui';

import { showValidationToast } from '@/shared/lib/form-feedback';

type ActionSummaryItem = {
  label: string;
  value: string;
  hint?: string;
};

type ActionConfirmationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eyebrow?: string;
  title: string;
  description: string;
  accentLabel?: string;
  confirmLabel: string;
  confirmVariant?: 'default' | 'destructive';
  cancelLabel?: string;
  isPending?: boolean;
  icon?: LucideIcon;
  tone?: 'default' | 'success' | 'danger' | 'warning' | 'info';
  noteLabel?: string;
  notePlaceholder?: string;
  defaultNotes?: string;
  requireReason?: boolean;
  validationTitle?: string;
  summaryTitle?: string;
  summary?: ActionSummaryItem[];
  onConfirm: (notes: string) => Promise<void> | void;
};

const toneStyles = {
  default: {
    badge: 'bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]',
    icon: 'bg-[var(--primary-fixed)] text-[var(--primary)]',
    panel: 'bg-[rgba(255,255,255,0.72)]',
    summary: 'bg-[rgba(255,255,255,0.82)]',
  },
  success: {
    badge: 'bg-[var(--primary-fixed)] text-[var(--primary)]',
    icon: 'bg-[var(--primary-fixed)] text-[var(--primary)]',
    panel: 'bg-[rgba(255,255,255,0.72)]',
    summary: 'bg-[rgba(255,255,255,0.82)]',
  },
  danger: {
    badge: 'bg-[var(--error-container)] text-[var(--on-error-container)]',
    icon: 'bg-[var(--error-container)] text-[var(--on-error-container)]',
    panel: 'bg-[rgba(255,250,250,0.84)]',
    summary: 'bg-[rgba(255,255,255,0.86)]',
  },
  warning: {
    badge: 'bg-[var(--tertiary-fixed)] text-[var(--on-tertiary-fixed-variant)]',
    icon: 'bg-[var(--tertiary-fixed)] text-[var(--on-tertiary-fixed-variant)]',
    panel: 'bg-[rgba(255,250,245,0.82)]',
    summary: 'bg-[rgba(255,255,255,0.84)]',
  },
  info: {
    badge: 'bg-[var(--secondary-fixed)] text-[var(--on-secondary-fixed-variant)]',
    icon: 'bg-[var(--secondary-fixed)] text-[var(--on-secondary-fixed-variant)]',
    panel: 'bg-[rgba(247,249,255,0.82)]',
    summary: 'bg-[rgba(255,255,255,0.84)]',
  },
} as const;

const buildSchema = (requireReason: boolean, hasNotes: boolean) =>
  z.object({
    notes:
      hasNotes && requireReason
        ? z
            .string()
            .trim()
            .min(1, 'Preencha a observação para continuar.')
            .min(8, 'A observação deve ter pelo menos 8 caracteres.')
        : z.string().optional(),
  });

export const ActionConfirmationDialog = ({
  open,
  onOpenChange,
  eyebrow = 'Confirmação da ação',
  title,
  description,
  accentLabel,
  confirmLabel,
  confirmVariant = 'default',
  cancelLabel = 'Cancelar',
  isPending = false,
  icon: Icon = CircleAlert,
  tone = 'default',
  noteLabel,
  notePlaceholder = '',
  defaultNotes = '',
  requireReason = false,
  validationTitle = 'Revise os dados antes de continuar.',
  summaryTitle = 'Resumo da decisão',
  summary = [],
  onConfirm,
}: ActionConfirmationDialogProps) => {
  const hasNotes = Boolean(noteLabel);
  const schema = buildSchema(requireReason, hasNotes);
  const styles = toneStyles[tone];
  const form = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      notes: defaultNotes,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({ notes: defaultNotes });
    }
  }, [defaultNotes, form, open]);

  const handleSubmit = form.handleSubmit(
    async (values) => {
      await onConfirm(values.notes?.trim() ?? '');
      onOpenChange(false);
    },
    () => {
      showValidationToast(form.formState.errors, {
        title: validationTitle,
      });
    },
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(96vw,48rem)] rounded-[2rem] overflow-hidden p-0">
        <div className={cn('px-5 py-5 backdrop-blur-[14px] sm:px-8 sm:py-7', styles.panel)}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className={cn('flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.4rem]', styles.icon)}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--primary)]">
                  {eyebrow}
                </p>
                <h2 className="mt-3 font-headline text-[2rem] font-extrabold tracking-tight text-[var(--on-surface)] sm:text-[2.25rem]">
                  {title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--on-surface-variant)]">{description}</p>
              </div>
            </div>
            {accentLabel ? (
              <div className={cn('inline-flex rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em]', styles.badge)}>
                {accentLabel}
              </div>
            ) : null}
          </div>
        </div>

        <form className="space-y-6 bg-[rgba(247,249,251,0.72)] px-5 py-5 sm:px-8 sm:py-7" onSubmit={handleSubmit}>
          {summary.length > 0 ? (
            <div className={cn('rounded-[1.5rem] px-4 py-4 backdrop-blur-[12px] sm:px-5', styles.summary)}>
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-container-low)] text-[var(--primary)]">
                  <FileText className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-headline text-sm font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
                    {summaryTitle}
                  </p>
                  <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                    Revise os principais pontos antes de confirmar a ação.
                  </p>
                </div>
              </div>

              <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
                {summary.map((item, index) => (
                  <div
                    key={item.label}
                    className={cn(
                      'border-b border-[color:color-mix(in_srgb,var(--outline-variant)_12%,transparent)] py-4',
                      index < 2 ? 'pt-4' : '',
                      index >= summary.length - (summary.length % 2 === 0 ? 2 : 1) ? 'border-b-0 pb-1' : '',
                    )}
                  >
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-[var(--on-surface)]">{item.value}</p>
                    {item.hint ? (
                      <p className="mt-1 text-xs leading-5 text-[var(--on-surface-variant)]">{item.hint}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {noteLabel ? (
            <div className="rounded-[1.5rem] bg-[rgba(255,255,255,0.78)] px-4 py-4 backdrop-blur-[12px] sm:px-5">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-container-low)] text-[var(--primary)]">
                  <MessageSquareQuote className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-headline text-sm font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
                    Observação administrativa
                  </p>
                  <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                    Registre o contexto para manter a trilha de decisão clara para RH e auditoria.
                  </p>
                </div>
              </div>
              <FormField
                label={noteLabel}
                error={form.formState.errors.notes?.message}
                hint={!requireReason ? 'Opcional, mas recomendado para manter rastreabilidade.' : undefined}
              >
                <Textarea className="min-h-36 bg-[var(--surface-container-lowest)]" placeholder={notePlaceholder} {...form.register('notes')} />
              </FormField>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 border-t border-[color:color-mix(in_srgb,var(--outline-variant)_12%,transparent)] pt-5 sm:flex-row sm:flex-wrap sm:justify-end">
            <Button className="rounded-xl px-6" type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              {cancelLabel}
            </Button>
            <Button className="rounded-xl px-6" disabled={isPending} type="submit" variant={confirmVariant}>
              {isPending ? 'Processando...' : confirmLabel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
