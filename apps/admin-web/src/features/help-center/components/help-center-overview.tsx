'use client';

import Link from 'next/link';
import { useDeferredValue, useState } from 'react';
import {
  ArrowRight,
  BookOpenText,
  CalendarDays,
  Code2,
  FileText,
  MessageCircle,
  PlayCircle,
  Rocket,
  Search,
  Settings2,
  Ticket,
} from 'lucide-react';

import { Badge, Button, EmptyState, ErrorState, Input, cn } from '@rh-ponto/ui';

import { AppAvatar } from '@/shared/components/app-avatar';
import { OverviewPageSkeleton } from '@/shared/components/page-skeletons';
import { getActionErrorMessage } from '@/shared/lib/mutation-feedback';

import { useHelpCenterOverview } from '../hooks/use-help-center-overview';

const categoryIcons = {
  rocket: Rocket,
  settings: Settings2,
  calendar: CalendarDays,
  code: Code2,
} as const;

const channelIcons = {
  message: MessageCircle,
  ticket: Ticket,
  'file-text': FileText,
} as const;

export const HelpCenterOverview = () => {
  const [query, setQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query);
  const { data, error, isError, isLoading, refetch } = useHelpCenterOverview();

  if (isLoading) {
    return <OverviewPageSkeleton />;
  }

  if (isError || !data) {
    return (
      <ErrorState
        title="Não foi possível carregar a central operacional"
        description={getActionErrorMessage(error, 'Tente novamente para consultar as ações e orientações do RH.')}
        actionLabel="Tentar novamente"
        onAction={() => {
          void refetch();
        }}
      />
    );
  }

  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const filteredArticles = data.articles.filter((article) => {
    const matchesCategory = !selectedCategoryId || article.categoryId === selectedCategoryId;

    if (!matchesCategory) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return [article.title, article.description, article.readTime, article.views].some((value) =>
      value.toLowerCase().includes(normalizedQuery),
    );
  });

  const filteredCategories = data.categories.filter((category) => {
    if (!normalizedQuery) {
      return true;
    }

    return [category.title, category.description].some((value) => value.toLowerCase().includes(normalizedQuery));
  });

  return (
    <div className="space-y-10 sm:space-y-12">
      <section className="relative overflow-hidden rounded-[2rem] bg-[var(--primary)] px-5 py-8 text-white sm:px-8 sm:py-10 lg:px-12 lg:py-14">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_60%)]" />
        <div className="relative z-10 max-w-3xl">
          <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/72">
            Central operacional / Prioridades do RH
          </p>
          <h1 className="mt-4 font-headline text-4xl font-extrabold tracking-tight lg:text-5xl">
            {data.hero.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/82 lg:text-lg">{data.hero.description}</p>

          <div className="mt-8 flex flex-col gap-3 rounded-[1.75rem] bg-white p-3 shadow-[0_24px_60px_rgba(0,74,198,0.18)] sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--primary)]/55" />
              <Input
                className="h-14 rounded-[1.25rem] border-transparent bg-transparent pl-14 text-base text-[var(--on-surface)]"
                onChange={(event) => setQuery(event.target.value)}
                placeholder={data.hero.placeholder}
                value={query}
              />
            </div>
            <Button className="h-14 rounded-[1.25rem] px-7" size="lg">
              Buscar
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {filteredCategories.map((category) => {
          const Icon = categoryIcons[category.icon as keyof typeof categoryIcons];
          const isActive = selectedCategoryId === category.id;

          return (
            <button
              key={category.id}
              className={cn(
                'rounded-[1.75rem] p-7 text-left transition-all duration-300',
                isActive
                  ? 'bg-[var(--primary)] text-white shadow-[0_24px_50px_rgba(0,74,198,0.14)]'
                  : 'bg-[var(--surface-container-lowest)] text-[var(--on-surface)] shadow-[var(--shadow-card)] hover:-translate-y-0.5 hover:bg-[var(--primary)] hover:text-white',
              )}
              onClick={() => setSelectedCategoryId((current) => (current === category.id ? null : category.id))}
              type="button"
            >
              <div
                className={cn(
                  'flex h-14 w-14 items-center justify-center rounded-[1.25rem] transition-colors',
                  isActive ? 'bg-white/16 text-white' : 'bg-[var(--primary-fixed)] text-[var(--primary)]',
                )}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mt-6 font-headline text-xl font-extrabold">{category.title}</h2>
              <p className={cn('mt-3 text-sm leading-7', isActive ? 'text-white/80' : 'text-[var(--on-surface-variant)]')}>
                {category.description}
              </p>
            </button>
          );
        })}
      </section>

      <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-headline text-2xl font-extrabold text-[var(--on-surface)]">Ações recomendadas</h2>
              <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                Itens construídos a partir das filas e alertas que hoje pedem atenção do time de RH.
              </p>
            </div>
            <Badge variant="info">{filteredArticles.length} itens</Badge>
          </div>

          {filteredArticles.length === 0 ? (
            <EmptyState
              description="Tente outro termo ou remova o filtro de categoria para ver mais itens."
              title="Nenhum item encontrado"
            />
          ) : (
            <div className="space-y-4">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="group rounded-[1.75rem] bg-[var(--surface-container-lowest)] p-6 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[0_28px_56px_rgba(0,74,198,0.08)]"
                >
                  <div className="flex gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] bg-[var(--surface-container-low)] text-[var(--primary)]">
                      <BookOpenText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-headline text-lg font-extrabold text-[var(--on-surface)] transition-colors group-hover:text-[var(--primary)]">
                        {article.title}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-[var(--on-surface-variant)]">{article.description}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                        <span>{article.readTime}</span>
                        <span>{article.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="overflow-hidden rounded-[1.75rem] bg-[var(--surface-container-lowest)] p-7 shadow-[var(--shadow-card)]">
            <div className="relative">
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[var(--primary-fixed)]/60 blur-2xl" />
              <div className="relative">
                <h3 className="font-headline text-2xl font-extrabold text-[var(--on-surface)]">Acessos rápidos</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--on-surface-variant)]">
                  Use estes blocos para abrir as frentes que concentram a maior carga operacional do momento.
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-3">
              {data.channels.map((channel) => {
                const Icon = channelIcons[channel.icon as keyof typeof channelIcons];

                return (
                  <button
                    key={channel.id}
                    className="group flex w-full flex-col items-start gap-4 rounded-[1.25rem] bg-[var(--surface-container-low)] px-4 py-4 text-left transition-all hover:bg-[var(--primary)] hover:text-white sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                    type="button"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-white/70 text-[var(--primary)] group-hover:bg-white/18 group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-headline text-sm font-extrabold">{channel.title}</p>
                        <p className="mt-1 text-xs text-[var(--on-surface-variant)] group-hover:text-white/72">
                          {channel.description}
                        </p>
                      </div>
                    </div>
                    <Badge className="self-start sm:self-center" variant={channel.status === 'online' ? 'success' : 'neutral'}>
                      {channel.status === 'online' ? 'online' : channel.cta}
                    </Badge>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 border-t border-[color:color-mix(in_srgb,var(--outline-variant)_20%,transparent)] pt-6">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {data.specialists.map((specialist) => (
                    <div key={specialist.id} className="rounded-full bg-[var(--surface-container-lowest)] ring-2 ring-white">
                      <AppAvatar email={specialist.id} name={specialist.name} size="sm" />
                    </div>
                  ))}
                </div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                  Tempo médio de resposta:
                  <span className="ml-2 text-[var(--primary)]">{data.responseTime}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.75rem] bg-[var(--primary-fixed)] p-7 shadow-[var(--shadow-card)]">
            <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(0,74,198,0.18),transparent_70%)]" />
            <div className="relative">
              <PlayCircle className="h-10 w-10 text-[var(--primary)]" />
              <h3 className="mt-5 font-headline text-xl font-extrabold text-[var(--on-primary-fixed)]">
                {data.videoGuide.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-[var(--on-primary-fixed-variant)]">{data.videoGuide.description}</p>
              <Button className="mt-6" size="sm" variant="outline">
                {data.videoGuide.cta}
              </Button>
            </div>
          </div>

          <div className="grid gap-3">
            {data.quickLinks.map((item) => (
              <Button key={item.id} asChild className="h-auto justify-between rounded-[1.25rem] px-5 py-4" size="lg" variant="outline">
                <Link href={item.href}>
                  <span className="text-left">
                    <span className="block font-headline text-sm font-extrabold text-[var(--on-surface)]">{item.title}</span>
                    <span className="mt-1 block text-xs font-medium text-[var(--on-surface-variant)]">{item.description}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
