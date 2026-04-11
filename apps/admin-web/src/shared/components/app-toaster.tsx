'use client';

import { Toaster } from 'sonner';

export const AppToaster = () => (
  <Toaster
    closeButton
    expand={false}
    position="top-right"
    richColors
    toastOptions={{
      className: 'font-body',
    }}
  />
);
