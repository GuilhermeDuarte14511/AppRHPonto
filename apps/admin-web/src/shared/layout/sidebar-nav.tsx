'use client';

import { Button, cn } from '@rh-ponto/ui';
import {
  Activity,
  BarChart3,
  Building2,
  CalendarDays,
  CircleHelp,
  ClipboardList,
  Clock3,
  FileCheck2,
  FileSpreadsheet,
  Files,
  LayoutDashboard,
  LogOut,
  Upload,
  ReceiptText,
  Settings2,
  Smartphone,
  Shield,
  SunMedium,
  UserRoundPlus,
  UsersRound,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { AppAvatar } from '../components/app-avatar';
import { useCurrentUser } from '../hooks/use-current-user';
import { useSession } from '../providers/session-provider';

const navigationItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/employees', label: 'Funcionários', icon: UsersRound },
  { href: '/onboarding', label: 'Onboarding', icon: UserRoundPlus },
  { href: '/departments', label: 'Departamentos', icon: Building2 },
  { href: '/imports', label: 'Importação', icon: Upload },
  { href: '/devices', label: 'Dispositivos', icon: Smartphone },
  { href: '/reports', label: 'Relatórios', icon: BarChart3 },
  { href: '/time-records', label: 'Marcações', icon: Clock3 },
  { href: '/operations', label: 'Inbox RH', icon: ClipboardList },
  { href: '/justifications', label: 'Justificativas', icon: FileCheck2 },
  { href: '/vacations', label: 'Férias', icon: SunMedium },
  { href: '/analytics', label: 'Análises', icon: BarChart3 },
  { href: '/schedules', label: 'Escalas', icon: CalendarDays },
  { href: '/payroll', label: 'Folha', icon: ReceiptText },
  { href: '/documents', label: 'Documentos', icon: Files },
  { href: '/audit', label: 'Auditoria', icon: Shield },
  { href: '/settings', label: 'Configurações', icon: Settings2 },
];

interface SidebarNavProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const SidebarNav = ({ mobileOpen = false, onCloseMobile }: SidebarNavProps) => {
  const pathname = usePathname();
  const { signOut } = useSession();
  const user = useCurrentUser();

  return (
    <>
      <button
        aria-hidden={!mobileOpen}
        aria-label="Fechar menu lateral"
        className={cn(
          'fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[2px] transition-opacity lg:hidden',
          mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        type="button"
        onClick={onCloseMobile}
      />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex min-h-screen flex-col overflow-y-auto bg-[color:color-mix(in_srgb,var(--surface-container-low)_92%,white)] px-4 py-5 text-[var(--on-surface)] shadow-[var(--shadow-float)] transition-transform duration-300 lg:z-40 lg:px-4 lg:py-6 lg:shadow-none',
          'w-[85vw] max-w-[20rem] lg:w-[var(--admin-sidebar-width)] lg:max-w-none',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0',
        )}
      >
        <div className="flex items-start justify-between gap-3 px-1 lg:px-2">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl primary-gradient text-white shadow-[var(--shadow-card)]">
              <Activity className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-headline text-lg font-black text-[var(--primary)]">PontoPrecise</p>
              <p className="font-headline text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--on-surface-variant)]">
                Painel administrativo
              </p>
            </div>
          </div>
          <Button
            aria-label="Fechar menu"
            className="h-10 w-10 shrink-0 rounded-full p-0 lg:hidden"
            size="sm"
            variant="ghost"
            onClick={onCloseMobile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1 lg:mt-10">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                className={cn(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 font-headline text-sm font-semibold transition-all duration-200',
                  isActive
                    ? 'border-r-4 border-[var(--primary)] bg-white/60 text-[var(--primary)] shadow-[0_10px_24px_rgba(0,74,198,0.05)]'
                    : 'text-[var(--on-surface-variant)] hover:bg-white/40 hover:text-[var(--on-surface)]',
                )}
                onClick={onCloseMobile}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="min-w-0 truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-4 pb-2">
          <div className="rounded-[1.5rem] bg-[var(--surface-container-lowest)] p-4 shadow-[var(--shadow-card)]">
            <p className="font-headline text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
              Módulos ativos
            </p>
            <div className="mt-4 space-y-3 text-sm text-[var(--on-surface-variant)]">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 shrink-0" />
                <span className="min-w-0">Análises e tendências</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 shrink-0" />
                <span className="min-w-0">Escalas e cobertura</span>
              </div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 shrink-0" />
                <span className="min-w-0">Folha e documentos</span>
              </div>
            </div>
            <Button asChild className="mt-4 w-full justify-center" size="sm">
              <Link href="/help-center" prefetch onClick={onCloseMobile}>
                Central do RH
              </Link>
            </Button>
          </div>

          <div className="rounded-[1.5rem] bg-[var(--surface-container-lowest)] p-4 shadow-[var(--shadow-card)]">
            <AppAvatar email={user?.email} name={user?.name ?? 'Convidado'} showMeta />
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button asChild className="flex-1 justify-center" size="sm" variant="ghost">
                <Link href="/help-center" prefetch onClick={onCloseMobile}>
                  <CircleHelp className="h-4 w-4" />
                  Ajuda
                </Link>
              </Button>
              <Button className="flex-1 justify-center" size="sm" variant="outline" onClick={() => void signOut()}>
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
