import type { Justification, JustificationAttachment } from '@rh-ponto/justifications';
import type { JustificationStatus, JustificationType, TimeRecordType } from '@rh-ponto/types';

export const justificationTypeLabels: Record<JustificationType, string> = {
  missing_record: 'Falta de marcação',
  late: 'Atraso',
  absence: 'Ausência',
  adjustment_request: 'Solicitação de ajuste',
};

export const justificationStatusLabels: Record<JustificationStatus, string> = {
  pending: 'Pendente',
  approved: 'Aprovada',
  rejected: 'Rejeitada',
};

export const requestedRecordTypeLabels: Record<TimeRecordType, string> = {
  entry: 'Entrada',
  break_start: 'Início do intervalo',
  break_end: 'Fim do intervalo',
  exit: 'Saída',
};

export const justificationStatusDescriptions: Record<JustificationStatus, string> = {
  pending: 'Sua solicitação foi enviada e aguarda decisão do RH.',
  approved: 'A solicitação foi aprovada e já pode refletir no fechamento.',
  rejected: 'A solicitação foi recusada e pode precisar de complemento.',
};

export const sortJustificationsNewestFirst = (items: Justification[]) =>
  items.slice().sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export const formatJustificationDate = (value: string | Date) => dateFormatter.format(new Date(value));

export const formatJustificationDateTime = (value: string | Date) => dateTimeFormatter.format(new Date(value));

export const filterJustificationsByStatus = (
  items: Justification[],
  preset: 'all' | JustificationStatus,
) => {
  if (preset === 'all') {
    return items;
  }

  return items.filter((item) => item.status === preset);
};

export const formatAttachmentMeta = (attachment: JustificationAttachment) => {
  const fileSizeText =
    attachment.fileSizeBytes == null ? null : attachment.fileSizeBytes >= 1024 * 1024
      ? `${(attachment.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.max(Math.round(attachment.fileSizeBytes / 1024), 1)} KB`;

  return [attachment.contentType ?? 'Arquivo', fileSizeText].filter(Boolean).join(' · ');
};
