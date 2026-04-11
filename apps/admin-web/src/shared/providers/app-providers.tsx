'use client';

import NextTopLoader from 'nextjs-toploader';

import { AppToaster } from '../components/app-toaster';
import { QueryProvider } from './query-provider';
import { SessionProvider } from './session-provider';

export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <QueryProvider>
    <SessionProvider>
      <NextTopLoader
        color="var(--primary)"
        crawl
        easing="ease"
        height={3}
        shadow="0 0 0 1px rgba(11, 89, 214, 0.18)"
        showSpinner={false}
      />
      {children}
      <AppToaster />
    </SessionProvider>
  </QueryProvider>
);
