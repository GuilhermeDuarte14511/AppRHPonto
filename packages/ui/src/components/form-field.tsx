import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

export const FormField = ({ label, htmlFor, hint, error, children }: FormFieldProps) => (
  <div className="space-y-2.5">
    <LabelPrimitive.Root
      htmlFor={htmlFor}
      className="font-headline text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]"
    >
      {label}
    </LabelPrimitive.Root>
    {children}
    {error ? <p className="text-xs text-[var(--on-error-container)]">{error}</p> : null}
    {!error && hint ? <p className="text-xs text-[var(--on-surface-variant)]">{hint}</p> : null}
  </div>
);
