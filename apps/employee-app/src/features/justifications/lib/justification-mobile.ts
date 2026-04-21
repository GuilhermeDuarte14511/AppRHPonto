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
  pending: 'O RH ainda está conferindo o vínculo com a jornada, os horários e os anexos enviados.',
  approved: 'A análise foi concluída e a solicitação já segue como tratada no fluxo da jornada.',
  rejected: 'O RH devolveu o pedido e pode ser necessário complementar informações ou reenviar.',
};

const justificationTypeOperationalCopy: Record<
  JustificationType,
  {
    summary: string;
    reasonHint: string;
    attachmentHint: string;
    nextAction: string;
  }
> = {
  missing_record: {
    summary: 'Use quando uma batida esperada não entrou e precisa ser explicada com contexto operacional.',
    reasonHint: 'Informe a jornada, o horário esperado e o que impediu o registro.',
    attachmentHint: 'Anexe comprovantes que ajudem a validar a ausência da batida.',
    nextAction: 'Explique o turno e relacione a marcação faltante.',
  },
  late: {
    summary: 'Use quando houve atraso e você precisa contextualizar o motivo para o RH.',
    reasonHint: 'Detalhe o horário previsto, o horário real e a causa do atraso.',
    attachmentHint: 'Se houver, inclua documento ou registro que confirme o motivo.',
    nextAction: 'Explique o atraso com base na jornada do dia.',
  },
  absence: {
    summary: 'Use para justificar uma ausência completa ou parcial dentro da jornada.',
    reasonHint: 'Descreva o período ausente, a janela de tempo e o motivo objetivo.',
    attachmentHint: 'Atestados, comprovantes e evidências ajudam na conferência.',
    nextAction: 'Explique a ausência e a janela afetada.',
  },
  adjustment_request: {
    summary: 'Use quando a batida existe, mas precisa de correção no horário ou na leitura da jornada.',
    reasonHint: 'Explique qual batida deve ser ajustada e qual valor operacional faz sentido.',
    attachmentHint: 'Anexe suporte que ajude a validar a correção solicitada.',
    nextAction: 'Descreva a correção desejada com a marcação vinculada.',
  },
};

const justificationStatusOperationalCopy: Record<
  JustificationStatus,
  {
    summary: string;
    reviewFocus: string;
    nextAction: string;
    decisionLabel: string;
  }
> = {
  pending: {
    summary: 'A solicitação está na fila e depende da conferência do RH.',
    reviewFocus: 'O RH está olhando vínculo com a marcação, coerência de horário e qualidade dos anexos.',
    nextAction: 'Acompanhe o retorno e complemente o pedido se o RH solicitar novos dados.',
    decisionLabel: 'Aguardando análise operacional',
  },
  approved: {
    summary: 'O RH validou o caso e a ocorrência já está tratada na jornada.',
    reviewFocus: 'A análise confirmou o pedido e encerrou a pendência daquele registro.',
    nextAction: 'Você pode seguir com o histórico; nenhuma ação adicional costuma ser necessária.',
    decisionLabel: 'Pendência resolvida',
  },
  rejected: {
    summary: 'O RH recusou a solicitação e sinalizou que ainda falta contexto ou evidência.',
    reviewFocus: 'A devolutiva indica o que precisa ser revisto antes de reenviar ou abrir novo pedido.',
    nextAction: 'Leia a devolutiva com atenção e complemente a justificativa, se fizer sentido.',
    decisionLabel: 'Precisa de complemento',
  },
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

export const getJustificationTypeOperationalCopy = (type: JustificationType) => justificationTypeOperationalCopy[type];

export const getJustificationStatusOperationalCopy = (status: JustificationStatus) =>
  justificationStatusOperationalCopy[status];

export const buildJustificationOperationalSummary = (
  justification: {
    id: string;
    status: JustificationStatus;
    type: JustificationType;
    reason?: string;
    reviewNotes?: string | null;
    reviewedAt?: string | Date | null;
    requestedRecordType?: TimeRecordType | null;
    requestedRecordedAt?: string | Date | null;
    timeRecordId?: string | null;
  },
) => {
  const typeCopy = getJustificationTypeOperationalCopy(justification.type);
  const statusCopy = getJustificationStatusOperationalCopy(justification.status);
  const linkedRecordLabel = justification.timeRecordId
    ? `Marcação vinculada: ${justification.timeRecordId}`
    : justification.requestedRecordType
      ? `Pedido sobre ${requestedRecordTypeLabels[justification.requestedRecordType]}`
      : 'Sem marcação vinculada';
  const requestedRecordedAtLabel = justification.requestedRecordedAt
    ? `Data solicitada: ${formatJustificationDateTime(justification.requestedRecordedAt)}`
    : 'Data solicitada não informada';

  return {
    typeLabel: justificationTypeLabels[justification.type],
    statusLabel: justificationStatusLabels[justification.status],
    statusDescription: justificationStatusDescriptions[justification.status],
    typeSummary: typeCopy.summary,
    reasonHint: typeCopy.reasonHint,
    attachmentHint: typeCopy.attachmentHint,
    nextAction: typeCopy.nextAction,
    reviewFocus: statusCopy.reviewFocus,
    statusAction: statusCopy.nextAction,
    decisionLabel: statusCopy.decisionLabel,
    linkedRecordLabel,
    requestedRecordedAtLabel,
    reviewedAtLabel: justification.reviewedAt ? `Respondido em ${formatJustificationDateTime(justification.reviewedAt)}` : null,
    reviewNotesLabel: justification.reviewNotes?.trim() || null,
    isPending: justification.status === 'pending',
    isApproved: justification.status === 'approved',
    isRejected: justification.status === 'rejected',
  } as const;
};
