'use client';

import Link from 'next/link';
import { CircleHelp, Menu, Settings2 } from 'lucide-react';

import { Button } from '@rh-ponto/ui';

import { AppAvatar } from '../components/app-avatar';
import { GlobalSearchAutocomplete } from '../components/global-search-autocomplete';
import { NotificationCenter } from '../components/notification-center';
import { useCurrentUser } from '../hooks/use-current-user';

interface TopbarProps {
  onOpenSidebar: () => void;
}

export const Topbar = ({ onOpenSidebar }: TopbarProps) => {
  const user = useCurrentUser();
  const currentDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="fixed left-0 right-0 top-0 z-30 h-16 border-b border-[color:color-mix(in_srgb,var(--outline-variant)_18%,transparent)] bg-[rgba(255,255,255,0.82)] backdrop-blur-xl lg:left-[var(--admin-sidebar-width)]">
      <div className="mx-auto flex h-full w-full max-w-[calc(1440px+4rem)] items-center justify-between gap-3 px-4 sm:px-5 md:gap-4 md:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4">
          <Button
            aria-label="Abrir menu lateral"
            className="h-10 w-10 shrink-0 rounded-full p-0 lg:hidden"
            size="sm"
            variant="ghost"
            onClick={onOpenSidebar}
          >
            <Menu className="h-4 w-4" />
          </Button>
          <div className="hidden min-w-0 lg:block">
            <p className="font-headline text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
              Operação diária
            </p>
            <p className="truncate text-sm text-[var(--on-surface-variant)]">{currentDate}</p>
          </div>
          <GlobalSearchAutocomplete />
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <NotificationCenter />
          <Button asChild aria-label="Abrir central de ajuda" className="h-10 w-10 rounded-full p-0" size="sm" variant="ghost">
            <Link href="/help-center" prefetch>
              <CircleHelp className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild aria-label="Abrir configurações" className="hidden h-10 w-10 rounded-full p-0 sm:inline-flex" size="sm" variant="ghost">
            <Link href="/settings" prefetch>
              <Settings2 className="h-4 w-4" />
            </Link>
          </Button>
          <div className="mx-1 hidden h-8 w-px bg-[color:color-mix(in_srgb,var(--outline-variant)_30%,transparent)] md:block" />
          <AppAvatar className="hidden sm:flex" email={user?.email} name={user?.name ?? 'Convidado'} showMeta />
        </div>
      </div>
    </header>
  );
};
