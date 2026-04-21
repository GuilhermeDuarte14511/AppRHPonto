'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Input } from '@rh-ponto/ui';

import { useGlobalSearch } from '../hooks/use-global-search';
import type { GlobalSearchCategory } from '../lib/global-search-contracts';

const categoryLabels: Record<GlobalSearchCategory, string> = {
  employee: 'Funcionários',
  department: 'Departamentos',
  'time-record': 'Marcações',
  justification: 'Justificativas',
  document: 'Documentos',
  vacation: 'Férias',
  onboarding: 'Onboarding',
  audit: 'Auditoria',
  schedule: 'Escalas',
  device: 'Dispositivos',
};

export const GlobalSearchAutocomplete = () => {
  const [term, setTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { data, isFetching } = useGlobalSearch(term);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('mousedown', handlePointerDown);

    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
    };
  }, []);

  const groupedItems = useMemo(() => {
    if (!data?.items.length) {
      return [];
    }

    return Object.entries(
      data.items.reduce<Record<string, typeof data.items>>((groups, item) => {
        const currentItems = groups[item.category] ?? [];
        groups[item.category] = [...currentItems, item];
        return groups;
      }, {}),
    );
  }, [data]);

  const shouldShowPanel = isOpen && term.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative w-full min-w-0 max-w-none sm:max-w-xl">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--outline)]" />
      <Input
        className="h-10 w-full min-w-0 rounded-full border-transparent bg-[var(--surface-container-low)] pl-11 sm:h-11"
        placeholder="Buscar colaboradores, documentos, escalas ou auditoria"
        value={term}
        onChange={(event) => {
          setTerm(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />

      {shouldShowPanel ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-40 overflow-hidden rounded-[1.5rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] bg-[rgba(255,255,255,0.98)] shadow-[0_20px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <div className="border-b border-[color:color-mix(in_srgb,var(--outline-variant)_12%,transparent)] px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
            {isFetching ? 'Buscando resultados…' : data?.total ? `${data.total} resultado(s) para "${data.term}"` : 'Nenhum resultado para esta busca'}
          </div>

          {data?.items.length ? (
            <div className="max-h-[22rem] overflow-y-auto p-2 sm:max-h-[28rem]">
              {groupedItems.map(([category, items]) => (
                <div key={category} className="mb-2">
                  <p className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--primary)]">
                    {categoryLabels[category as GlobalSearchCategory]}
                  </p>
                  <div className="space-y-1">
                    {items.map((item) => (
                      <Link
                        key={`${item.category}-${item.id}`}
                        className="block rounded-[1.1rem] px-3 py-3 transition hover:bg-[var(--surface-container-low)]"
                        href={item.href}
                        onClick={() => {
                          setIsOpen(false);
                          setTerm('');
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-[var(--on-surface)]">{item.title}</p>
                            <p className="mt-1 truncate text-sm text-[var(--on-surface-variant)]">{item.subtitle}</p>
                          </div>
                          <span className="shrink-0 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--on-surface-variant)]">
                            {categoryLabels[item.category]}
                          </span>
                        </div>
                        <p className="mt-2 text-xs leading-5 text-[var(--on-surface-variant)]">{item.meta}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-5 text-sm text-[var(--on-surface-variant)]">
              Tente buscar por nome, matrícula, documento, departamento ou ação do sistema.
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
