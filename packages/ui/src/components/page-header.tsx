import * as React from 'react';

import { cn } from '../lib/cn';

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader = ({ title, description, eyebrow, actions, className }: PageHeaderProps) => (
  <div className={cn('flex flex-col gap-5 md:flex-row md:items-end md:justify-between', className)}>
    <div className="space-y-2">
      {eyebrow ? (
        <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--primary)]">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="font-headline text-3xl font-extrabold tracking-tight text-[var(--on-surface)] sm:text-[2.25rem]">
        {title}
      </h1>
      {description ? <p className="max-w-2xl text-sm leading-6 text-[var(--on-surface-variant)]">{description}</p> : null}
    </div>
    {actions ? (
      <div className="flex w-full flex-wrap items-center gap-3 md:w-auto md:justify-end [&>*]:w-full sm:[&>*]:w-auto">
        {actions}
      </div>
    ) : null}
  </div>
);
