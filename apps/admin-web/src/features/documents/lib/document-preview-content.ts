import type { PortalDocument, PortalDocumentCategory, PortalDocumentSection } from '../types/document-record';

const categoryDescriptions: Record<PortalDocumentCategory, string> = {
  justificativas: 'Documento de suporte vinculado a uma justificativa operacional do colaborador.',
  ferias: 'Documento associado ao fluxo de férias e planejamento de cobertura.',
  atestados: 'Documento médico ou comprobatório sujeito à conferência do RH.',
  holerites: 'Comprovante oficial de folha e remuneração disponibilizado ao colaborador.',
  outros: 'Documento administrativo disponível no portal interno de RH.',
};

const buildSharedSections = (document: PortalDocument): PortalDocumentSection[] => [
  {
    id: 'identificacao',
    title: 'Identificação do documento',
    body: `${document.title} foi persistido no portal em ${document.uploadedAtLabel} e está relacionado a ${document.employeeName}.`,
  },
  {
    id: 'contexto',
    title: 'Contexto operacional',
    body: `${document.description} ${categoryDescriptions[document.category]}`,
  },
  {
    id: 'conferencia',
    title: 'Conferência e rastreabilidade',
    body: `Este registro fica disponível para auditoria interna, acompanhamento do RH e envio ao colaborador após a conclusão da assinatura.`,
  },
];

export const createDocumentSections = (document: Omit<PortalDocument, 'sections'>): PortalDocumentSection[] => {
  const sharedSections = buildSharedSections(document as PortalDocument);

  if (document.category === 'ferias') {
    return [
      ...sharedSections,
      {
        id: 'ferias',
        title: 'Planejamento de férias',
        body: 'O anexo consolida período solicitado, cobertura da equipe, saldo disponível e notas de aprovação do gestor e do RH.',
      },
    ];
  }

  if (document.category === 'atestados') {
    return [
      ...sharedSections,
      {
        id: 'atestado',
        title: 'Validação documental',
        body: 'O RH utiliza esta visualização para validar autenticidade, período de afastamento e anexar assinatura administrativa antes do arquivamento final.',
      },
    ];
  }

  if (document.category === 'justificativas') {
    return [
      ...sharedSections,
      {
        id: 'justificativa',
        title: 'Justificativa relacionada',
        body: 'O conteúdo apoia a análise de ajuste de ponto, ausência ou atraso, mantendo histórico completo para futuras auditorias.',
      },
    ];
  }

  if (document.category === 'holerites') {
    return [
      ...sharedSections,
      {
        id: 'holerite',
        title: 'Competência e remuneração',
        body: 'O holerite consolida a competência processada, valores bruto e líquido e o arquivo oficial liberado para consulta do colaborador.',
      },
    ];
  }

  return sharedSections;
};
