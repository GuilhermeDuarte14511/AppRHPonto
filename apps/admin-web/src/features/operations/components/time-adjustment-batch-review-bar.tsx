'use client';

import { CheckCheck, X } from 'lucide-react';

import { Button, Card } from '@rh-ponto/ui';

export const TimeAdjustmentBatchReviewBar = ({
  selectedCount,
  disabled,
  onApprove,
  onClear,
}: {
  selectedCount: number;
  disabled?: boolean;
  onApprove: () => void;
  onClear: () => void;
}) => (
  <Card className="border-[color:color-mix(in_srgb,var(--primary)_18%,transparent)] bg-[linear-gradient(135deg,rgba(226,232,240,0.92),rgba(255,255,255,0.97))] p-4 sm:p-5">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--primary)]">Lote rápido</p>
        <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
          {selectedCount} caso(s) elegível(is) selecionado(s) para aprovação em lote.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button disabled={disabled || selectedCount === 0} onClick={onApprove}>
          <CheckCheck className="h-4 w-4" />
          Aprovar lote
        </Button>
        <Button disabled={disabled || selectedCount === 0} variant="outline" onClick={onClear}>
          <X className="h-4 w-4" />
          Limpar seleção
        </Button>
      </div>
    </div>
  </Card>
);
