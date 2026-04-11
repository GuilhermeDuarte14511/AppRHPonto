import Link from 'next/link';
import { BookOpenText, CalendarDays, Compass, LayoutDashboard, LifeBuoy } from 'lucide-react';

import { Button, Card } from '@rh-ponto/ui';

const quickLinks = [
  {
    href: '/audit',
    title: 'Relatórios recentes',
    description: 'Acesse a linha do tempo de auditoria e revisões do ambiente.',
    icon: BookOpenText,
  },
  {
    href: '/schedules',
    title: 'Minha agenda',
    description: 'Confira escalas, cobertura e distribuicao de turnos do time.',
    icon: CalendarDays,
  },
  {
    href: '/help-center',
    title: 'Documentação',
    description: 'Use a central de ajuda para encontrar guias e suporte.',
    icon: LifeBuoy,
  },
];

const NotFound = () => (
  <main className="relative min-h-screen overflow-hidden bg-[var(--background)] px-6 py-8 lg:px-10">
    <div className="absolute right-[-6rem] top-[-6rem] h-72 w-72 rounded-full bg-[var(--primary-fixed)]/60 blur-[120px]" />
    <div className="absolute bottom-[-8rem] left-[-4rem] h-80 w-80 rounded-full bg-[var(--secondary-fixed)]/45 blur-[140px]" />

    <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1440px] items-stretch gap-8 xl:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="hidden rounded-[2rem] bg-[var(--surface-container-low)] p-6 shadow-[var(--shadow-card)] xl:flex xl:flex-col">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl primary-gradient text-white shadow-[var(--shadow-card)]">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <p className="font-headline text-lg font-black text-[var(--primary)]">PontoPrecise</p>
            <p className="font-headline text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--on-surface-variant)]">
              Navegação assistida
            </p>
          </div>
        </div>

        <div className="mt-10 space-y-3">
          {quickLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-[1.5rem] bg-[var(--surface-container-lowest)] px-4 py-4 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[1rem] bg-[var(--primary-fixed)] text-[var(--primary)]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-headline text-sm font-extrabold text-[var(--on-surface)]">{item.title}</p>
                    <p className="mt-1 text-xs text-[var(--on-surface-variant)]">{item.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <Card className="mt-auto p-5">
          <p className="font-headline text-sm font-extrabold text-[var(--on-surface)]">Recurso indisponível</p>
          <p className="mt-2 text-sm leading-7 text-[var(--on-surface-variant)]">
            O link acessado não corresponde a uma rota valida do painel atual.
          </p>
        </Card>
      </aside>

      <section className="flex items-center justify-center">
        <div className="w-full max-w-3xl text-center">
          <div className="relative inline-flex items-center justify-center">
            <div className="font-headline text-[9rem] font-extrabold tracking-[-0.08em] text-[var(--surface-container-highest)] sm:text-[12rem]">
              404
            </div>
            <div className="absolute flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/60 bg-white/80 text-[var(--primary)] shadow-[0_28px_64px_rgba(0,74,198,0.12)] backdrop-blur-xl">
              <Compass className="h-12 w-12" />
            </div>
          </div>

          <h1 className="mt-10 font-headline text-4xl font-extrabold tracking-tight text-[var(--on-surface)] sm:text-5xl">
            Página não encontrada
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[var(--on-surface-variant)]">
            O recurso que você tentou acessar foi movido, removido ou ainda não existe nesta versão do painel administrativo.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/dashboard">
                <LayoutDashboard className="h-4 w-4" />
                Voltar para o dashboard
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/help-center">
                <LifeBuoy className="h-4 w-4" />
                Ir para a ajuda
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {quickLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-[1.5rem] bg-[var(--surface-container-lowest)] p-5 text-left shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-[1rem] bg-[var(--surface-container-low)] text-[var(--primary)]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="mt-4 font-headline text-sm font-extrabold text-[var(--on-surface)]">{item.title}</p>
                  <p className="mt-2 text-xs leading-6 text-[var(--on-surface-variant)]">{item.description}</p>
                </Link>
              );
            })}
          </div>

          <p className="mt-10 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--on-surface-variant)]/70">
            Error code: 404_resource_not_found - PontoPrecise Precision v2.4
          </p>
        </div>
      </section>
    </div>
  </main>
);

export default NotFound;
