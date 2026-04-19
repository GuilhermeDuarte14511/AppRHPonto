import type { EmployeeDocumentItem } from '@/shared/lib/employee-self-service-api';

export interface EmployeeDocumentAttention {
  requiresAcknowledgement: boolean;
  primaryActionLabel: string;
  statusHeadline: string;
  statusDescription: string;
  completedAt: string | null;
}

export const resolveEmployeeDocumentAttention = (
  document: EmployeeDocumentItem,
): EmployeeDocumentAttention => {
  if (document.acknowledgedAt) {
    return {
      requiresAcknowledgement: false,
      primaryActionLabel: 'Abrir arquivo',
      statusHeadline: 'Ciência concluída',
      statusDescription: 'O RH já tem o registro de leitura desse documento no seu histórico.',
      completedAt: document.acknowledgedAt,
    };
  }

  if (document.status === 'pending_signature') {
    return {
      requiresAcknowledgement: true,
      primaryActionLabel: 'Confirmar ciência',
      statusHeadline: 'Aguardando sua ciência',
      statusDescription: 'Abra o arquivo e registre sua ciência para concluir essa pendência.',
      completedAt: null,
    };
  }

  return {
    requiresAcknowledgement: false,
    primaryActionLabel: 'Abrir arquivo',
    statusHeadline: 'Documento disponível',
    statusDescription: 'O arquivo já está liberado para consulta e download no seu portal.',
    completedAt: null,
  };
};
