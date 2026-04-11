import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { cn } from '../lib/cn';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[rgba(15,23,42,0.42)] backdrop-blur-[10px]" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-1/2 top-1/2 z-50 max-h-[calc(100vh-1rem)] w-[calc(100vw-1rem)] max-w-[42rem] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[2rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_15%,transparent)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(247,249,251,0.92)_100%)] p-4 shadow-[0_24px_60px_rgba(0,74,198,0.10)] backdrop-blur-[18px] sm:max-h-[calc(100vh-2rem)] sm:w-[min(96vw,42rem)] sm:p-6',
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,255,255,0.72)] text-[var(--on-surface-variant)] transition hover:bg-[var(--surface-container-high)] hover:text-[var(--on-surface)] sm:right-4 sm:top-4">
        <X className="h-4 w-4" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));

DialogContent.displayName = DialogPrimitive.Content.displayName;
