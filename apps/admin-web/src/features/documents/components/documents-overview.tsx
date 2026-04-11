'use client';

import { useMemo, useState } from 'react';
import { Download, Eye, FileStack, FolderOpen, Layers3 } from 'lucide-react';

import { Badge, Button, Card, DataTable, ErrorState, PageHeader } from '@rh-ponto/ui';

import { OverviewPageSkeleton } from '@/shared/components/page-skeletons';
import { getActionErrorMessage } from '@/shared/lib/mutation-feedback';
import { StatCard } from '@/shared/components/stat-card';

import { useDocumentsOverview } from '../hooks/use-documents-overview';
import type { PortalDocument } from '../types/document-record';
import { DocumentViewerDialog } from './document-viewer-dialog';

const documentStatusVariant = {
  assinado: 'success',
  pendente_assinatura: 'warning',
  em_revisao: 'info',
  arquivado: 'neutral',
} as const;

type CategoryFilter = 'all' | 'justificativas' | 'ferias' | 'atestados' | 'arquivado';

export const DocumentsOverview = () => {
  const { data, error, isError, isLoading, refetch } = useDocumentsOverview();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [selectedDocument, setSelectedDocument] = useState<PortalDocument | null>(null);

  const documents = useMemo(() => {
    if (!data) {
      return [];
    }

    if (selectedCategory === 'all') {
      return data.documents;
    }

    if (selectedCategory === 'arquivado') {
      return data.documents.filter((item) => item.status === 'arquivado');
    }

    return data.documents.filter((item) => item.category === selectedCategory);
  }, [data, selectedCategory]);

  if (isLoading) {
    return <OverviewPageSkeleton />;
  }

  if (isError || !data) {
    return (
      <ErrorState
        title="Não foi possível carregar os documentos"
        description={getActionErrorMessage(error, 'Tente novamente para abrir o portal documental do RH.')}
        actionLabel="Tentar novamente"
        onAction={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <>
      <div className="space-y-8 sm:space-y-10">
        <PageHeader
          eyebrow="Documentos / Conferência"
          title="Portal de documentos"
          description="Consulte anexos do RH, acompanhe o andamento de cada item e baixe os arquivos vinculados."
          actions={
            <>
              <Button asChild size="lg" variant="outline">
                <a href={selectedDocument?.fileUrl ?? '#'} rel="noreferrer" target="_blank">
                  <Download className="h-4 w-4" />
                  Exportar documento
                </a>
              </Button>
              <Button size="lg" onClick={() => setSelectedDocument(data.documents[0] ?? null)}>
                <FolderOpen className="h-4 w-4" />
                Abrir documento
              </Button>
            </>
          }
        />

        <section className="grid gap-8 xl:grid-cols-[0.32fr_0.68fr]">
          <div className="space-y-4">
            <section className="grid gap-4">
              <StatCard
                badge="Acervo ativo"
                hint="Volume total de documentos montados a partir dos vínculos existentes no banco."
                label="Total"
                value={String(data.summary.total)}
              />
              <StatCard
                badge="Conferidos"
                hint="Documentos vinculados a fluxos já aprovados e prontos para consulta."
                label="Prontos"
                tone="secondary"
                value={String(data.summary.pending)}
              />
              <StatCard
                badge="Fila operacional"
                hint="Itens que ainda exigem leitura e decisão operacional."
                label="Em revisão"
                tone="tertiary"
                value={String(data.summary.review)}
              />
            </section>

            <div className="rounded-[1.7rem] bg-[rgba(255,255,255,0.82)] p-4 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-3 px-1">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-container-low)] text-[var(--primary)]">
                  <FileStack className="h-4 w-4" />
                </span>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--on-surface-variant)]">
                  Categorias
                </p>
              </div>
              <div className="mt-4 space-y-2">
                {[
                  { id: 'all', label: 'Todos', count: data.documents.length },
                  {
                    id: 'justificativas',
                    label: 'Justificativas',
                    count: data.documents.filter((item) => item.category === 'justificativas').length,
                  },
                  { id: 'ferias', label: 'Férias', count: data.documents.filter((item) => item.category === 'ferias').length },
                  {
                    id: 'atestados',
                    label: 'Atestados',
                    count: data.documents.filter((item) => item.category === 'atestados').length,
                  },
                  { id: 'arquivado', label: 'Fluxo encerrado', count: data.documents.filter((item) => item.status === 'arquivado').length },
                ].map((category) => (
                  <button
                    key={category.id}
                    className={
                      selectedCategory === category.id
                        ? 'flex w-full items-center justify-between rounded-[1.25rem] bg-[var(--surface-container-lowest)] px-4 py-4 text-left shadow-[var(--shadow-card)]'
                        : 'flex w-full items-center justify-between rounded-[1.25rem] px-4 py-4 text-left text-[var(--on-surface-variant)] transition hover:bg-[var(--surface-container-low)]'
                    }
                    type="button"
                    onClick={() => setSelectedCategory(category.id as CategoryFilter)}
                  >
                    <span className="font-headline text-sm font-extrabold text-[var(--on-surface)]">{category.label}</span>
                    <span className="rounded-full bg-[var(--primary-fixed)] px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--primary)]">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-2 border-dashed border-[color:color-mix(in_srgb,var(--outline-variant)_40%,transparent)] p-5 sm:p-8">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--surface-container-low)] text-[var(--primary)]">
                  <Layers3 className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-headline text-xl font-extrabold text-[var(--on-surface)]">
                  Fluxo central de conferência documental
                </h3>
                <p className="mt-2 max-w-2xl text-sm text-[var(--on-surface-variant)]">
                  Os documentos desta central são derivados das justificativas e das solicitações de férias já persistidas no Data Connect.
                </p>
                <Button className="mt-6" variant="outline" onClick={() => setSelectedDocument(data.documents[0] ?? null)}>
                  Abrir o primeiro documento
                </Button>
              </div>
            </Card>

            <DataTable
              columns={[
                {
                  key: 'title',
                  label: 'Documento',
                  render: (item) => (
                    <div className="space-y-1">
                      <p className="font-semibold text-[var(--on-surface)]">{item.title}</p>
                      <p className="text-xs text-[var(--on-surface-variant)]">
                        {item.size} · {item.type} · {item.categoryLabel}
                      </p>
                    </div>
                  ),
                },
                {
                  key: 'employeeName',
                  label: 'Colaborador',
                  render: (item) => (
                    <div className="space-y-1">
                      <p>{item.employeeName}</p>
                      <p className="text-xs text-[var(--on-surface-variant)]">
                        {item.employeeDepartment ?? 'Sem departamento informado'}
                      </p>
                    </div>
                  ),
                },
                { key: 'uploadedAtLabel', label: 'Envio' },
                {
                  key: 'status',
                  label: 'Status',
                  render: (item) => <Badge variant={documentStatusVariant[item.status]}>{item.statusLabel}</Badge>,
                },
                {
                  key: 'actions',
                  label: 'Ações',
                  render: (item) => (
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedDocument(item)}>
                        <Eye className="h-4 w-4" />
                        Visualizar
                      </Button>
                    </div>
                  ),
                },
              ]}
              items={documents}
              getRowKey={(item) => item.id}
            />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {data.alerts.map((alert) => (
                <Card key={alert.id} className="p-5">
                  <p className="font-headline text-sm font-extrabold text-[var(--on-surface)]">{alert.title}</p>
                  <p className="mt-3 text-sm leading-6 text-[var(--on-surface-variant)]">{alert.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>

      <DocumentViewerDialog
        document={selectedDocument}
        open={Boolean(selectedDocument)}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedDocument(null);
          }
        }}
      />
    </>
  );
};
