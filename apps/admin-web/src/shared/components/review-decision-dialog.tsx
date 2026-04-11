'use client';

import { CheckCheck, ShieldAlert } from 'lucide-react';

import { ActionConfirmationDialog } from './action-confirmation-dialog';

type ReviewSummaryItem = {
  label: string;
  value: string;
  hint?: string;
};

type ReviewDecisionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  confirmVariant?: 'default' | 'destructive';
  noteLabel: string;
  notePlaceholder: string;
  defaultNotes?: string;
  requireReason?: boolean;
  isPending?: boolean;
  summary?: ReviewSummaryItem[];
  onConfirm: (notes: string) => Promise<void> | void;
};

export const ReviewDecisionDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  confirmVariant = 'default',
  noteLabel,
  notePlaceholder,
  defaultNotes = '',
  requireReason = false,
  isPending = false,
  summary,
  onConfirm,
}: ReviewDecisionDialogProps) => (
  <ActionConfirmationDialog
    accentLabel={confirmVariant === 'destructive' ? 'Ação sensível' : 'Confirmação da ação'}
    confirmLabel={confirmLabel}
    confirmVariant={confirmVariant}
    defaultNotes={defaultNotes}
    description={description}
    eyebrow="Confirmação"
    icon={confirmVariant === 'destructive' ? ShieldAlert : CheckCheck}
    isPending={isPending}
    noteLabel={noteLabel}
    notePlaceholder={notePlaceholder}
    onConfirm={onConfirm}
    onOpenChange={onOpenChange}
    open={open}
    requireReason={requireReason}
    summary={summary}
    title={title}
    tone={confirmVariant === 'destructive' ? 'danger' : 'success'}
    validationTitle="Preencha a observação para continuar."
  />
);
