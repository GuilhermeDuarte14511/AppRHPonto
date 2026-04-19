'use client';

import { fetchAdminLiveDataSnapshot } from '@/shared/lib/admin-live-data';
import { formatDocumentTypeLabel, formatFileNameLabel } from '@/shared/lib/admin-formatters';

import { createDocumentSections } from './document-preview-content';
import type {
  DocumentsOverviewData,
  PortalDocument,
  PortalDocumentCategory,
  PortalDocumentHistoryItem,
  PortalDocumentStatus,
} from '../types/document-record';

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
  }).format(new Date(value));

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));

const inferDocumentType = (fileName: string | null) => formatDocumentTypeLabel(fileName?.split('.').pop() ?? null);

const inferDocumentCategory = (fileName: string | null, fallback: PortalDocumentCategory): PortalDocumentCategory => {
  const normalizedName = fileName?.toLowerCase() ?? '';

  if (normalizedName.includes('atestado')) {
    return 'atestados';
  }

  if (normalizedName.includes('ferias') || normalizedName.includes('férias')) {
    return 'ferias';
  }

  return fallback;
};

const categoryLabels: Record<PortalDocumentCategory, string> = {
  justificativas: 'Justificativas',
  ferias: 'Férias',
  atestados: 'Atestados',
  holerites: 'Holerites',
  outros: 'Outros',
};

const statusMeta: Record<
  PortalDocumentStatus,
  {
    label: string;
    description: string;
  }
> = {
  assinado: {
    label: 'Ciência registrada',
    description: 'O colaborador já registrou leitura ou ciência para este documento oficial.',
  },
  pendente_assinatura: {
    label: 'Aguardando ciência',
    description: 'Documento oficial já publicado, mas ainda sem confirmação de leitura pelo colaborador.',
  },
  em_revisao: {
    label: 'Em revisão',
    description: 'Documento ainda depende de conferência operacional.',
  },
  publicado: {
    label: 'Publicado',
    description: 'Documento oficial já liberado no portal do colaborador para consulta e download.',
  },
  arquivado: {
    label: 'Fluxo encerrado',
    description: 'Documento fora da fila ativa, mas ainda preservado para rastreabilidade.',
  },
};

const resolvePortalStatus = (sourceStatus: 'approved' | 'pending' | 'rejected'): PortalDocumentStatus => {
  if (sourceStatus === 'approved') {
    return 'pendente_assinatura';
  }

  if (sourceStatus === 'rejected') {
    return 'arquivado';
  }

  return 'em_revisao';
};

const resolveEmployeeDocumentPortalStatus = ({
  status,
  acknowledgedAt,
}: {
  status: string;
  acknowledgedAt: string | null;
}): PortalDocumentStatus => {
  if (status === 'archived') {
    return 'arquivado';
  }

  if (acknowledgedAt) {
    return 'assinado';
  }

  return 'pendente_assinatura';
};

const buildHistory = ({
  uploadedAt,
  sourceStatus,
  reviewLabel,
}: {
  uploadedAt: string;
  sourceStatus: 'approved' | 'pending' | 'rejected';
  reviewLabel: string;
}): PortalDocumentHistoryItem[] => {
  const items: PortalDocumentHistoryItem[] = [
    {
      id: 'uploaded',
      icon: 'upload',
      title: 'Documento disponível no portal',
      description: reviewLabel,
      occurredAtLabel: formatDateTime(uploadedAt),
    },
  ];

  if (sourceStatus === 'approved') {
    items.push({
      id: 'approved',
      icon: 'approval',
      title: 'Fluxo operacional concluído',
      description: 'O documento já passou pela etapa principal de validação e segue disponível para consulta.',
      occurredAtLabel: formatDate(uploadedAt),
    });
  }

  if (sourceStatus === 'rejected') {
    items.push({
      id: 'closed',
      icon: 'archive',
      title: 'Fluxo encerrado',
      description: 'O documento permanece rastreável, mas não faz mais parte da fila ativa de conferência.',
      occurredAtLabel: formatDate(uploadedAt),
    });
  }

  return items;
};

const withSections = (document: Omit<PortalDocument, 'sections'>): PortalDocument => ({
  ...document,
  sections: createDocumentSections(document),
});

export const getDocumentsOverview = async (): Promise<DocumentsOverviewData> => {
  const snapshot = await fetchAdminLiveDataSnapshot();
  const employeeDirectory = new Map(snapshot.employees.map((employee) => [employee.id, employee]));
  const justificationDirectory = new Map(snapshot.justifications.map((item) => [item.id, item]));

  const documents = [
    ...snapshot.employeeDocuments.map((document) => {
      const employee = employeeDirectory.get(document.employeeId);
      const category = inferDocumentCategory(document.fileName, 'outros');
      const status = resolveEmployeeDocumentPortalStatus(document);

      return withSections({
        id: document.id,
        sourceId: document.id,
        sourceType: 'employee_document',
        title: document.title,
        type: inferDocumentType(document.fileName),
        category,
        categoryLabel: categoryLabels[category],
        size: 'Documento oficial',
        employeeId: employee?.id ?? null,
        employeeName: employee?.fullName ?? 'Colaborador não identificado',
        employeeRole: employee?.position ?? null,
        employeeDepartment: employee?.department ?? null,
        uploadedAt: document.issuedAt,
        uploadedAtLabel: formatDate(document.issuedAt),
        status,
        statusLabel: statusMeta[status].label,
        statusDescription: statusMeta[status].description,
        fileUrl: document.fileUrl,
        fileName: document.fileName,
        description:
          document.description ??
          'Documento oficial publicado pelo RH no arquivo digital do colaborador.',
        tags: ['Arquivo digital', inferDocumentType(document.fileName)],
        isSignable: false,
        previewTitle: document.title,
        previewSubtitle: `Arquivo digital • ${employee?.fullName ?? 'Colaborador não identificado'}`,
        signatureHint: document.acknowledgedAt
          ? 'A ciência do colaborador já foi registrada neste documento oficial.'
          : 'Assim que o colaborador registrar a ciência, o status deste documento será atualizado aqui.',
        history: [
          {
            id: 'published',
            icon: 'upload',
            title: 'Documento publicado no arquivo digital',
            description: 'O RH disponibilizou este documento oficial para consulta do colaborador.',
            occurredAtLabel: formatDateTime(document.issuedAt),
          },
          ...(document.acknowledgedAt
            ? [
                {
                  id: 'acknowledged',
                  icon: 'signature' as const,
                  title: 'Ciência registrada pelo colaborador',
                  description: 'A leitura foi confirmada e preservada no histórico do documento.',
                  occurredAtLabel: formatDateTime(document.acknowledgedAt),
                },
              ]
            : []),
        ],
        signedArtifact: null,
      });
    }),
    ...snapshot.payrollStatements.map((statement) => {
      const employee = employeeDirectory.get(statement.employeeId);

      return withSections({
        id: statement.id,
        sourceId: statement.id,
        sourceType: 'payroll_statement',
        title: `Holerite ${statement.referenceLabel}`,
        type: inferDocumentType(statement.fileName),
        category: 'holerites',
        categoryLabel: categoryLabels.holerites,
        size: 'Comprovante oficial',
        employeeId: employee?.id ?? null,
        employeeName: employee?.fullName ?? 'Colaborador não identificado',
        employeeRole: employee?.position ?? null,
        employeeDepartment: employee?.department ?? null,
        uploadedAt: statement.issuedAt,
        uploadedAtLabel: formatDate(statement.issuedAt),
        status: 'publicado',
        statusLabel: statusMeta.publicado.label,
        statusDescription: statusMeta.publicado.description,
        fileUrl: statement.fileUrl,
        fileName: statement.fileName,
        description: `Comprovante da competência ${statement.referenceLabel} com valores bruto e líquido publicados para o colaborador.`,
        tags: ['Holerite', inferDocumentType(statement.fileName)],
        isSignable: false,
        previewTitle: `Holerite ${statement.referenceLabel}`,
        previewSubtitle: `Folha publicada • ${employee?.fullName ?? 'Colaborador não identificado'}`,
        signatureHint: 'O holerite está disponível para consulta e exportação no portal do colaborador.',
        history: [
          {
            id: 'published',
            icon: 'upload',
            title: 'Holerite publicado',
            description: 'A competência foi liberada no arquivo digital do colaborador.',
            occurredAtLabel: formatDateTime(statement.issuedAt),
          },
        ],
        signedArtifact: null,
      });
    }),
    ...snapshot.justificationAttachments.map((attachment) => {
      const justification = justificationDirectory.get(attachment.justificationId);
      const employee = justification ? employeeDirectory.get(justification.employeeId) : null;
      const category = inferDocumentCategory(attachment.fileName, 'justificativas');
      const sourceStatus = justification?.status ?? 'pending';
      const status = resolvePortalStatus(sourceStatus);

      return withSections({
        id: attachment.id,
        sourceId: attachment.id,
        sourceType: 'justification_attachment',
        title: formatFileNameLabel(attachment.fileName),
        type: inferDocumentType(attachment.fileName),
        category,
        categoryLabel: categoryLabels[category],
        size:
          attachment.fileSizeBytes != null
            ? `${Math.max(1, Math.round(attachment.fileSizeBytes / 1024))} KB`
            : 'Tamanho não informado',
        employeeId: employee?.id ?? null,
        employeeName: employee?.fullName ?? 'Colaborador não identificado',
        employeeRole: employee?.position ?? null,
        employeeDepartment: employee?.department ?? null,
        uploadedAt: attachment.createdAt,
        uploadedAtLabel: formatDate(attachment.createdAt),
        status,
        statusLabel: statusMeta[status].label,
        statusDescription: statusMeta[status].description,
        fileUrl: attachment.fileUrl,
        fileName: attachment.fileName,
        description: justification
          ? `Anexo relacionado à justificativa de ${employee?.fullName ?? 'colaborador'} para ${justification.type}.`
          : 'Documento de justificativa disponível para conferência administrativa.',
        tags: ['Documento de justificativa', inferDocumentType(attachment.fileName)],
        isSignable: false,
        previewTitle: formatFileNameLabel(attachment.fileName),
        previewSubtitle: `Portal de documentos • ${employee?.fullName ?? 'Colaborador não identificado'}`,
        signatureHint: 'Documento disponível somente para consulta. O status acompanha a etapa atual do processo.',
        history: buildHistory({
          uploadedAt: attachment.createdAt,
          sourceStatus,
          reviewLabel: justification
            ? `Relacionado à justificativa ${justification.type} do colaborador.`
            : 'Documento enviado para análise interna.',
        }),
        signedArtifact: null,
      });
    }),
    ...snapshot.vacationRequests
      .filter((request) => request.attachmentFileName || request.attachmentFileUrl)
      .map((request) => {
        const employee = employeeDirectory.get(request.employeeId);
        const fileName = request.attachmentFileName ?? 'planejamento-ferias.pdf';
        const category = inferDocumentCategory(fileName, 'ferias');
        const status = resolvePortalStatus(request.status);

        return withSections({
          id: request.id,
          sourceId: request.id,
          sourceType: 'vacation_attachment',
          title: formatFileNameLabel(fileName),
          type: inferDocumentType(fileName),
          category,
          categoryLabel: categoryLabels[category],
          size: 'Documento vinculado',
          employeeId: employee?.id ?? null,
          employeeName: employee?.fullName ?? 'Colaborador não identificado',
          employeeRole: employee?.position ?? null,
          employeeDepartment: employee?.department ?? null,
          uploadedAt: request.createdAt,
          uploadedAtLabel: formatDate(request.createdAt),
          status,
          statusLabel: statusMeta[status].label,
          statusDescription: statusMeta[status].description,
          fileUrl: request.attachmentFileUrl,
          fileName,
          description: `Anexo da solicitação de férias referente ao período de ${formatDate(request.startDate)} a ${formatDate(request.endDate)}.`,
          tags: ['Férias', inferDocumentType(fileName)],
          isSignable: false,
          previewTitle: formatFileNameLabel(fileName),
          previewSubtitle: `Fluxo de férias • ${employee?.fullName ?? 'Colaborador não identificado'}`,
          signatureHint: 'Documento disponível somente para consulta. O histórico reflete o andamento atual da solicitação.',
          history: buildHistory({
            uploadedAt: request.createdAt,
            sourceStatus: request.status,
            reviewLabel: 'Documento vinculado ao planejamento e cobertura de férias.',
          }),
          signedArtifact: null,
        });
      }),
  ].sort((left, right) => new Date(right.uploadedAt).getTime() - new Date(left.uploadedAt).getTime());

  const signed = documents.filter((item) => item.status === 'assinado').length;
  const review = documents.filter((item) => item.status === 'em_revisao').length;
  const pending = documents.filter((item) => item.status === 'pendente_assinatura').length;
  const archived = documents.filter((item) => item.status === 'arquivado').length;

  return {
    summary: {
      total: documents.length,
      signed,
      pending,
      review,
    },
    categories: [
      { id: 'all', label: 'Todos', count: documents.length, active: true },
      {
        id: 'justifications',
        label: 'Justificativas',
        count: documents.filter((item) => item.category === 'justificativas').length,
        active: false,
      },
      {
        id: 'payroll',
        label: 'Holerites',
        count: documents.filter((item) => item.category === 'holerites').length,
        active: false,
      },
      {
        id: 'vacations',
        label: 'Férias',
        count: documents.filter((item) => item.category === 'ferias').length,
        active: false,
      },
      {
        id: 'medical',
        label: 'Atestados',
        count: documents.filter((item) => item.category === 'atestados').length,
        active: false,
      },
      { id: 'archived', label: 'Fluxo encerrado', count: archived, active: false },
    ],
    documents,
    alerts: [
      {
        id: 'documents-alert-approved',
        title: `${pending} documentos aguardam ciência do colaborador`,
        description: 'O portal agora mostra documentos oficiais publicados pelo RH junto com os anexos operacionais.',
      },
      {
        id: 'documents-alert-review',
        title: `${review} documentos seguem em revisão`,
        description: 'Atestados e anexos pendentes continuam visíveis para conferência e rastreabilidade.',
      },
      {
        id: 'documents-alert-archived',
        title: `${archived} documentos tiveram o fluxo encerrado`,
        description: 'Mesmo fora da fila ativa, os registros continuam ligados ao histórico operacional do banco.',
      },
    ],
  };
};
