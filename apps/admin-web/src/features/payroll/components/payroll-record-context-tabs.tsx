'use client';

import type { ReactNode } from 'react';
import { FileSignature, FileText, LayoutDashboard, ScrollText } from 'lucide-react';

export type PayrollDetailTabId = 'summary' | 'timesheet' | 'documents' | 'signatures';

type PayrollDetailTabDefinition = {
  id: PayrollDetailTabId;
  label: string;
  description: string;
  icon: ReactNode;
};

const payrollDetailTabs: PayrollDetailTabDefinition[] = [
  {
    id: 'summary',
    label: 'Resumo',
    description: 'Panorama do período, status da folha e indicadores principais.',
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    id: 'timesheet',
    label: 'Espelho',
    description: 'Marcações diárias, saldos e observações consolidadas.',
    icon: <ScrollText className="h-4 w-4" />,
  },
  {
    id: 'documents',
    label: 'Documentos',
    description: 'Comprovantes e conferências vinculadas à competência.',
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: 'signatures',
    label: 'Assinaturas',
    description: 'Campos de ciência e envio do documento final.',
    icon: <FileSignature className="h-4 w-4" />,
  },
];

export const PayrollRecordContextTabs = ({
  activeTab,
  onChange,
  tabsetId,
}: {
  activeTab: PayrollDetailTabId;
  onChange: (tab: PayrollDetailTabId) => void;
  tabsetId: string;
}) => (
  <div className="space-y-4">
    <div>
      <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
        Contexto da folha
      </p>
      <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
        Escolha o bloco que deseja revisar para navegar pelo fechamento sem percorrer uma página muito longa.
      </p>
    </div>

    <div className="grid gap-3 xl:grid-cols-4" role="tablist" aria-label="Contextos da folha de ponto">
      {payrollDetailTabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            id={`${tabsetId}-${tab.id}-tab`}
            aria-controls={`${tabsetId}-${tab.id}-panel`}
            aria-selected={isActive}
            className={
              isActive
                ? 'flex min-h-[5.5rem] items-start gap-3 rounded-[1.5rem] border border-[color:color-mix(in_srgb,var(--primary)_24%,transparent)] bg-[var(--primary-fixed)] px-4 py-4 text-left shadow-[var(--shadow-card)]'
                : 'flex min-h-[5.5rem] items-start gap-3 rounded-[1.5rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] bg-[var(--surface-container-lowest)] px-4 py-4 text-left transition hover:border-[color:color-mix(in_srgb,var(--primary)_18%,transparent)] hover:bg-[var(--surface-container-low)]'
            }
            role="tab"
            type="button"
            onClick={() => onChange(tab.id)}
          >
            <span
              className={
                isActive
                  ? 'mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-[var(--primary)]'
                  : 'mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-[var(--surface-container-low)] text-[var(--primary)]'
              }
            >
              {tab.icon}
            </span>
            <span className="block min-w-0">
              <span className="block font-headline text-sm font-extrabold text-[var(--on-surface)]">{tab.label}</span>
              <span className="mt-1 block text-sm leading-6 text-[var(--on-surface-variant)]">{tab.description}</span>
            </span>
          </button>
        );
      })}
    </div>
  </div>
);
