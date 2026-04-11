import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';

import { AppProviders } from '@/shared/providers/app-providers';

import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-headline',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'App RH Ponto',
  description: 'Administrativo do MVP de controle de ponto eletrônico.',
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <html lang="pt-BR" className={`${manrope.variable} ${inter.variable}`} data-scroll-behavior="smooth">
    <body className="app-shell-surface">
      <AppProviders>{children}</AppProviders>
    </body>
  </html>
);

export default RootLayout;
