import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]',
  {
    variants: {
      variant: {
        neutral: 'bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]',
        success: 'bg-[var(--surface-container-highest)] text-[var(--on-tertiary-fixed-variant)]',
        warning: 'bg-[var(--tertiary-fixed)] text-[var(--on-tertiary-fixed-variant)]',
        danger: 'bg-[var(--error-container)] text-[var(--on-error-container)]',
        info: 'bg-[var(--primary-fixed)] text-[var(--primary)]',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
);

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string;
  children: React.ReactNode;
}

export const Badge = ({ className, variant, children }: BadgeProps) => (
  <span className={cn(badgeVariants({ variant }), className)}>{children}</span>
);
