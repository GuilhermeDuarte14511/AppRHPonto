import { ArrowUpRight, type LucideIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, cn } from '@rh-ponto/ui';

interface StatCardProps {
  label: string;
  value: string;
  hint: string;
  icon?: LucideIcon;
  badge?: string;
  tone?: 'primary' | 'secondary' | 'tertiary' | 'danger';
}

const toneStyles = {
  primary: 'bg-[var(--primary-fixed)] text-[var(--primary)]',
  secondary: 'bg-[var(--secondary-fixed)] text-[var(--secondary)]',
  tertiary: 'bg-[var(--tertiary-fixed)] text-[var(--on-tertiary-fixed-variant)]',
  danger: 'bg-[var(--error-container)] text-[var(--on-error-container)]',
} as const;

export const StatCard = ({
  label,
  value,
  hint,
  icon: Icon = ArrowUpRight,
  badge,
  tone = 'primary',
}: StatCardProps) => (
  <Card className="overflow-hidden border-transparent bg-[var(--surface-container-lowest)]">
    <CardHeader className="flex-col gap-4 pb-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
          {label}
        </p>
        <CardTitle className="mt-2 text-2xl sm:mt-3 sm:text-4xl">{value}</CardTitle>
      </div>
      <div className={cn('self-start rounded-2xl p-2.5 sm:p-3', toneStyles[tone])}>
        <Icon className="h-5 w-5" />
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      <p className="text-sm leading-6 text-[var(--on-surface-variant)]">{hint}</p>
      {badge ? (
        <div className="inline-flex rounded-full bg-[var(--surface-container-low)] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
          {badge}
        </div>
      ) : null}
    </CardContent>
  </Card>
);
