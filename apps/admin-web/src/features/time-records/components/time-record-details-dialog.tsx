'use client';

import { formatDateTime } from '@rh-ponto/core';
import type { TimeRecord } from '@rh-ponto/time-records';
import { Badge, Button, Dialog, DialogContent } from '@rh-ponto/ui';
import {
  Camera,
  Clock3,
  ExternalLink,
  Globe,
  MapPin,
  PencilLine,
  ShieldCheck,
  Smartphone,
  TimerReset,
} from 'lucide-react';

import {
  formatFileNameLabel,
  formatTimeRecordSourceLabel,
  formatTimeRecordStatusLabel,
  formatTimeRecordTypeLabel,
} from '@/shared/lib/admin-formatters';

import type { TimeRecordListItem } from './time-record-list-item';

interface TimeRecordDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdjust: (record: TimeRecordListItem) => void;
  record: TimeRecordListItem | null;
  deviceLabel?: string | null;
}

const getStatusVariant = (status: TimeRecord['status']) => {
  switch (status) {
    case 'valid':
      return 'success';
    case 'pending_review':
      return 'warning';
    case 'adjusted':
      return 'info';
    case 'rejected':
      return 'danger';
    default:
      return 'neutral';
  }
};

const formatCoordinates = (latitude: number | null, longitude: number | null) => {
  if (latitude == null || longitude == null) {
    return 'Coordenadas não informadas';
  }

  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
};

const formatPhotoCount = (count: number) => {
  if (count <= 0) {
    return 'Sem evidências visuais';
  }

  return count === 1 ? '1 evidência vinculada' : `${count} evidências vinculadas`;
};

const buildPhotoBackground = (photoUrl: string) => ({
  backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.08) 0%, rgba(15, 23, 42, 0.42) 100%), url(${photoUrl})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
});

const SummaryField = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) => (
  <div className="rounded-[1.2rem] bg-[var(--surface-container-low)] px-4 py-4">
    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">{label}</p>
    <p className="mt-2 text-sm font-semibold leading-6 text-[var(--on-surface)]">{value}</p>
    {hint ? <p className="mt-1 text-xs leading-5 text-[var(--on-surface-variant)]">{hint}</p> : null}
  </div>
);

export const TimeRecordDetailsDialog = ({
  open,
  onOpenChange,
  onAdjust,
  record,
  deviceLabel,
}: TimeRecordDetailsDialogProps) => {
  const primaryPhoto = record?.photos.find((photo) => photo.isPrimary) ?? record?.photos[0] ?? null;

  if (!record) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[min(96vh,70rem)] w-[min(99vw,124rem)] max-w-none overflow-hidden rounded-[2rem] p-0 sm:w-[min(99vw,124rem)] sm:p-0">
        <div className="grid h-full grid-cols-1 bg-[rgba(247,249,251,0.94)] 2xl:grid-cols-[minmax(0,1.9fr)_30rem]">
          <div className="flex min-h-0 flex-col">
            <div className="border-b border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] bg-[linear-gradient(135deg,rgba(226,232,240,0.92),rgba(255,255,255,0.97))] px-5 py-5 sm:px-8 sm:py-7">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="info">Detalhe da marcação</Badge>
                    <Badge variant={getStatusVariant(record.status)}>
                      {formatTimeRecordStatusLabel(record.status)}
                    </Badge>
                    <Badge variant="neutral">{formatTimeRecordSourceLabel(record.source)}</Badge>
                  </div>

                  <div>
                    <h2 className="font-headline text-[2rem] font-extrabold tracking-tight text-[var(--on-surface)] sm:text-[2.6rem]">
                      {formatTimeRecordTypeLabel(record.recordType)}
                    </h2>
                    <p className="mt-2 max-w-4xl text-sm leading-7 text-[var(--on-surface-variant)]">
                      {record.employeeName} · {record.department} · registro capturado em {formatDateTime(record.recordedAt)}.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    className="rounded-xl px-5"
                    variant="outline"
                    onClick={() => {
                      onOpenChange(false);
                      onAdjust(record);
                    }}
                  >
                    <PencilLine className="h-4 w-4" />
                    Ajustar marcação
                  </Button>
                  {primaryPhoto ? (
                    <Button
                      className="rounded-xl px-5"
                      variant="ghost"
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          window.open(primaryPhoto.fileUrl, '_blank', 'noopener,noreferrer');
                        }
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Abrir evidência
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
              <div className="grid gap-4 2xl:grid-cols-2">
                <article className="rounded-[1.6rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] bg-[var(--surface-container-lowest)] p-5 shadow-[var(--shadow-card)]">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-fixed)] text-[var(--primary)]">
                      <Clock3 className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                        Captura
                      </p>
                      <p className="mt-1 text-base font-semibold text-[var(--on-surface)]">
                        {formatDateTime(record.recordedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 border-t border-[color:color-mix(in_srgb,var(--outline-variant)_14%,transparent)] pt-4 sm:grid-cols-2">
                    <SummaryField label="Tipo" value={formatTimeRecordTypeLabel(record.recordType)} />
                    <SummaryField label="Origem" value={formatTimeRecordSourceLabel(record.source)} />
                    <SummaryField label="Status" value={formatTimeRecordStatusLabel(record.status)} />
                    <SummaryField label="Criado em" value={formatDateTime(record.createdAt)} />
                  </div>
                </article>

                <article className="rounded-[1.6rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] bg-[var(--surface-container-lowest)] p-5 shadow-[var(--shadow-card)]">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--secondary-fixed)] text-[var(--on-secondary-fixed-variant)]">
                      <Smartphone className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                        Dispositivo e referência
                      </p>
                      <p className="mt-1 text-base font-semibold text-[var(--on-surface)]">
                        {deviceLabel ?? 'Não informado'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 border-t border-[color:color-mix(in_srgb,var(--outline-variant)_14%,transparent)] pt-4 sm:grid-cols-2">
                    <SummaryField label="Lançamento manual" value={record.isManual ? 'Sim' : 'Não'} />
                    <SummaryField
                      label="Registro original"
                      value={record.originalRecordedAt ? formatDateTime(record.originalRecordedAt) : 'Sem horário anterior'}
                    />
                    <SummaryField label="Referência" value={record.referenceRecordId ?? 'Sem vínculo'} />
                    <SummaryField label="Atualizado em" value={formatDateTime(record.updatedAt)} />
                  </div>
                </article>
              </div>

              <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                <article className="rounded-[1.6rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] bg-[var(--surface-container-lowest)] p-5 shadow-[var(--shadow-card)]">
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--tertiary-fixed)] text-[var(--on-tertiary-fixed-variant)]">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                        Localização capturada
                      </p>
                      <p className="mt-2 text-base font-semibold leading-7 text-[var(--on-surface)]">
                        {record.resolvedAddress ?? 'Endereço não informado para esta marcação'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 border-t border-[color:color-mix(in_srgb,var(--outline-variant)_14%,transparent)] pt-4 sm:grid-cols-2 xl:grid-cols-3">
                    <SummaryField label="Coordenadas" value={formatCoordinates(record.latitude, record.longitude)} />
                    <SummaryField label="IP informado" value={record.ipAddress ?? 'Não informado'} />
                    <SummaryField
                      label="Leitura operacional"
                      value={record.resolvedAddress ? 'Endereço resolvido com sucesso' : 'Sem resolução de endereço'}
                      hint="Baseado nos dados persistidos junto da marcação."
                    />
                  </div>
                </article>

                <article className="rounded-[1.6rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] bg-[var(--surface-container-lowest)] p-5 shadow-[var(--shadow-card)]">
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--surface-container-low)] text-[var(--primary)]">
                      <TimerReset className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                        Observações e rastreabilidade
                      </p>
                      <p className="mt-2 text-sm leading-7 text-[var(--on-surface)]">
                        {record.notes ?? 'Nenhuma observação complementar foi registrada para esta marcação.'}
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>

          <aside className="flex min-h-0 flex-col gap-5 border-t border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] bg-[rgba(255,255,255,0.82)] px-5 py-5 backdrop-blur-[14px] sm:px-6 2xl:border-l 2xl:border-t-0">
            <article className="rounded-[1.7rem] bg-[rgba(255,255,255,0.9)] p-5 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--on-surface-variant)]">
                    Evidências visuais
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--on-surface)]">
                    {formatPhotoCount(record.photos.length)}
                  </p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-fixed)] text-[var(--primary)]">
                  <Camera className="h-5 w-5" />
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {primaryPhoto ? (
                  <div
                    className="relative h-96 overflow-hidden rounded-[1.5rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] 2xl:h-[30rem]"
                    style={buildPhotoBackground(primaryPhoto.fileUrl)}
                  >
                    <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(15,23,42,0.84))] px-4 py-4 text-white">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/72">Evidência principal</p>
                      <p className="mt-2 break-words text-sm font-semibold">
                        {formatFileNameLabel(primaryPhoto.fileName)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-96 flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-[color:color-mix(in_srgb,var(--outline-variant)_22%,transparent)] bg-[var(--surface-container-low)] px-6 text-center 2xl:h-[30rem]">
                    <ShieldCheck className="h-8 w-8 text-[var(--on-surface-variant)]" />
                    <p className="mt-4 text-sm font-semibold text-[var(--on-surface)]">
                      Esta marcação não possui foto vinculada.
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--on-surface-variant)]">
                      O RH ainda pode revisar horário, localização e observações para decidir sobre ajustes.
                    </p>
                  </div>
                )}

                {record.photos.length > 1 ? (
                  <div className="grid gap-3">
                    {record.photos.slice(0, 3).map((photo) => (
                      <button
                        key={photo.id}
                        className="group overflow-hidden rounded-[1.2rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] text-left transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
                        type="button"
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            window.open(photo.fileUrl, '_blank', 'noopener,noreferrer');
                          }
                        }}
                      >
                        <div className="h-28" style={buildPhotoBackground(photo.fileUrl)} />
                        <div className="px-3 py-3">
                          <p className="line-clamp-2 text-sm font-semibold text-[var(--on-surface)]">
                            {formatFileNameLabel(photo.fileName)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </article>

            <article className="rounded-[1.7rem] bg-[var(--surface-container-low)] p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[var(--primary)] shadow-sm">
                  <Globe className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--on-surface-variant)]">
                    Leitura administrativa
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--on-surface)]">
                    Painel conectado ao banco operacional
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-[var(--on-surface-variant)]">
                O tipo, o status, a origem, a geolocalização e as evidências exibidos neste detalhe refletem os dados
                persistidos para a batida selecionada.
              </p>
            </article>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
};
