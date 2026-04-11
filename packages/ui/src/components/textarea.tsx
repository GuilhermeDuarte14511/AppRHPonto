import * as React from 'react';

import { cn } from '../lib/cn';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-32 w-full rounded-[1.1rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_15%,transparent)] bg-[rgba(255,255,255,0.82)] px-4 py-3 text-sm text-[var(--on-surface)] outline-none backdrop-blur-[10px] transition placeholder:text-[color:color-mix(in_srgb,var(--outline)_62%,transparent)] focus-visible:ring-2 focus-visible:ring-[var(--primary-fixed)]',
        className,
      )}
      {...props}
    />
  ),
);

Textarea.displayName = 'Textarea';
