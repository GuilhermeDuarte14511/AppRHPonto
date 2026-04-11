'use client';

import type { ReactNode } from 'react';
import { ClipboardList, FileText, LayoutDashboard, Workflow } from 'lucide-react';

export type VacationDetailTabId = 'summary' | 'workflow' | 'document' | 'decision';

type VacationDetailTabDefinition = {
  id: VacationDetailTabId;
  label: string;
  description: string;
  icon: ReactNode;
};

const vacationDetailTabs: VacationDetailTabDefinition[] = [
  {
    id: 'summary',
    label: 'Resumo',
    description: 'Período solicitado, saldo, benefícios e visão geral do pedido.',
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    id: 'workflow',
    label: 'Fluxo',
    description: 'Etapas de aprovação, atores envolvidos e histórico do pedido.',
    icon: <Workflow className="h-4 w-4" />,
  },
  {
    id: 'document',
    label: 'Documento',
    description: 'Termo anexado, observações operacionais e comprovações.',
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: 'decision',
    label: 'Decisão',
    description: 'Área de ação do RH para aprovar ou reprovar a solicitação.',
    icon: <ClipboardList className="h-4 w-4" />,
  },
];

export const VacationRequestContextTabs = ({
  activeTab,
  onChange,
  tabsetId,
}: {
  activeTab: VacationDetailTabId;
  onChange: (tab: VacationDetailTabId) => void;
  tabsetId: string;
}) => (
  <div className="space-y-4">
    <div>
      <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
        Contexto da solicitação
      </p>
      <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
        Navegue por blocos mais claros para revisar o pedido sem concentrar tudo em uma única tela.
      </p>
    </div>

    <div className="grid gap-3 xl:grid-cols-4" role="tablist" aria-label="Contextos da solicitação de férias">
      {vacationDetailTabs.map((tab) => {
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
