'use client';

import { CheckCircle2, Clock3, Download, Eye, FileText, ShieldCheck, Upload } from 'lucide-react';

import { Badge, Button, Dialog, DialogContent } from '@rh-ponto/ui';

import type { PortalDocument } from '../types/document-record';

const historyIconMap = {
  upload: Upload,
  approval: CheckCircle2,
  signature: CheckCircle2,
  archive: FileText,
} as const;

const statusVariantMap = {
  assinado: 'success',
  pendente_assinatura: 'warning',
  em_revisao: 'info',
  arquivado: 'neutral',
} as const;

interface DocumentViewerDialogProps {
  document: PortalDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DocumentViewerDialog = ({ document, open, onOpenChange }: DocumentViewerDialogProps) => {
  if (!document) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[min(94vh,58rem)] w-[min(98vw,88rem)] max-w-none overflow-hidden rounded-[2rem] p-0">
        <div className="grid h-full grid-cols-1 bg-[rgba(247,249,251,0.92)] lg:grid-cols-[minmax(0,1fr)_23rem]">
          <div className="flex min-h-0 flex-col">
            <div className="border-b border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] bg-[rgba(255,255,255,0.76)] px-5 py-4 backdrop-blur-[16px] sm:px-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--primary)]">
                    Portal de documentos
                  </p>
                  <h2 className="mt-2 font-headline text-[2rem] font-extrabold tracking-tight text-[var(--on-surface)]">
                    {document.previewTitle}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-[var(--on-surface-variant)]">{document.previewSubtitle}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant={statusVariantMap[document.status]}>{document.statusLabel}</Badge>
                  <Button asChild size="sm" variant="outline">
                    <a href={document.fileUrl ?? '#'} rel="noreferrer" target="_blank">
                      <Download className="h-4 w-4" />
                      Baixar original
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex items-center justify-between rounded-[1.4rem] bg-[rgba(255,255,255,0.74)] px-4 py-3 text-sm text-[var(--on-surface-variant)] shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-[var(--primary)]" />
                  <span>Visualização administrativa montada a partir dos registros persistidos no Data Connect.</span>
                </div>
                <div className="hidden items-center gap-2 lg:flex">
                  <FileText className="h-4 w-4" />
                  <span>Somente leitura</span>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto rounded-[1.8rem] bg-[rgba(230,232,234,0.68)] p-4 sm:p-6">
                <div className="relative mx-auto min-h-[52rem] w-full max-w-4xl rounded-[1.75rem] bg-white px-8 py-10 shadow-[0_18px_44px_rgba(0,74,198,0.08)] sm:px-12 sm:py-14">
                  <div className="space-y-10">
                    <div className="flex flex-col gap-4 border-b border-[color:color-mix(in_srgb,var(--outline-variant)_22%,transparent)] pb-8 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--primary)]">
                          Documento corporativo
                        </p>
                        <h3 className="font-headline text-3xl font-extrabold tracking-tight text-[var(--on-surface)]">
                          {document.previewTitle}
                        </h3>
                        <p className="max-w-2xl text-sm leading-7 text-[var(--on-surface-variant)]">{document.description}</p>
                      </div>
                      <div className="rounded-[1.25rem] bg-[var(--surface-container-low)] p-4 text-[var(--primary)]">
                        <FileText className="h-8 w-8" />
                      </div>
                    </div>

                    {document.sections.map((section) => (
                      <section key={section.id} className="space-y-3">
                        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--primary)]">
                          {section.title}
                        </p>
                        <p className="max-w-3xl text-[15px] leading-8 text-[var(--on-surface)]">{section.body}</p>
                      </section>
                    ))}

                    <div className="grid gap-5 border-t border-[color:color-mix(in_srgb,var(--outline-variant)_22%,transparent)] pt-14 sm:grid-cols-2">
                      <div className="rounded-[1.25rem] border-2 border-dashed border-[color:color-mix(in_srgb,var(--outline-variant)_34%,transparent)] px-5 py-7 text-center text-sm font-semibold text-[var(--on-surface-variant)]">
                        {document.status === 'assinado' ? 'Ciência registrada no histórico' : 'Aguardando ciência do colaborador'}
                      </div>
                      <div className="rounded-[1.25rem] border-2 border-dashed border-[color:color-mix(in_srgb,var(--outline-variant)_34%,transparent)] px-5 py-7 text-center text-sm font-semibold text-[var(--on-surface-variant)]">
                        Conferência administrativa
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="flex min-h-0 flex-col gap-5 border-l border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] bg-[rgba(255,255,255,0.8)] px-5 py-5 backdrop-blur-[14px] sm:px-6">
            <div className="rounded-[1.7rem] bg-[rgba(255,255,255,0.84)] p-5 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between">
                <h3 className="font-headline text-lg font-extrabold text-[var(--on-surface)]">Informações</h3>
                <ShieldCheck className="h-5 w-5 text-[var(--primary)]" />
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--on-surface-variant)]">
                    Tipo
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--on-surface)]">{document.type}</p>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--on-surface-variant)]">
                    Categoria
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--on-surface)]">{document.categoryLabel}</p>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--on-surface-variant)]">
                    Colaborador
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--on-surface)]">{document.employeeName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--on-surface-variant)]">
                    Status atual
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--on-surface)]">{document.statusDescription}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button asChild className="w-full" size="lg" variant="outline">
                  <a href={document.fileUrl ?? '#'} rel="noreferrer" target="_blank">
                    <Download className="h-4 w-4" />
                    Baixar documento original
                  </a>
                </Button>
              </div>
            </div>

            <div className="rounded-[1.7rem] bg-[var(--surface-container-low)] p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-headline text-sm font-extrabold uppercase tracking-[0.16em] text-[var(--on-surface-variant)]">
                  Histórico
                </h3>
                <Clock3 className="h-4 w-4 text-[var(--on-surface-variant)]" />
              </div>

              <div className="mt-4 space-y-4">
                {document.history.map((item) => {
                  const Icon = historyIconMap[item.icon];

                  return (
                    <div key={item.id} className="flex gap-3">
                      <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[var(--primary)] shadow-sm">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[var(--on-surface)]">{item.title}</p>
                        <p className="mt-1 text-xs leading-5 text-[var(--on-surface-variant)]">{item.description}</p>
                        <p className="mt-1 text-[11px] font-medium text-[var(--on-surface-variant)]">{item.occurredAtLabel}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[1.7rem] bg-[linear-gradient(180deg,#0f172a_0%,#1e293b_100%)] p-5 text-white">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-sky-300">Origem dos dados</p>
              <h3 className="mt-3 font-headline text-base font-extrabold">Leitura administrativa conectada ao banco</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                O status, o colaborador vinculado e o histórico exibidos aqui são compostos a partir do arquivo digital do colaborador e dos anexos operacionais persistidos no Data Connect.
              </p>
            </div>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
};
