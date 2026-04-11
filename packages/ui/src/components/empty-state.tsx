import * as React from 'react';
import { Inbox } from 'lucide-react';

import { Button } from './button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({ title, description, actionLabel, onAction }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] bg-[var(--surface-container-lowest)] px-8 py-14 text-center shadow-[var(--shadow-card)]">
    <div className="mb-5 rounded-[1.25rem] bg-[var(--surface-container-low)] p-4">
      <Inbox className="h-6 w-6 text-[var(--primary)]" />
    </div>
    <h3 className="font-headline text-2xl font-extrabold text-[var(--on-surface)]">{title}</h3>
    <p className="mt-2 max-w-md text-sm text-[var(--on-surface-variant)]">{description}</p>
    {actionLabel && onAction ? (
      <Button className="mt-6" onClick={onAction}>
        {actionLabel}
      </Button>
    ) : null}
  </div>
);
