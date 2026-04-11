export type PortalDocumentStatus = 'assinado' | 'pendente_assinatura' | 'em_revisao' | 'arquivado';

export type PortalDocumentCategory = 'justificativas' | 'ferias' | 'atestados' | 'outros';

export type PortalDocumentSourceType = 'justification_attachment' | 'vacation_attachment';

export type DocumentSignatureMode = 'senha' | 'desenho';

export interface DocumentSignaturePosition {
  x: number;
  y: number;
}

export interface SignedDocumentManifest {
  version: 1;
  documentId: string;
  sourceId: string;
  sourceType: PortalDocumentSourceType;
  portalStatus: Extract<PortalDocumentStatus, 'assinado' | 'arquivado'>;
  signedFilePath?: string;
  signedFileUrl?: string;
  signedAt?: string;
  signedByName?: string;
  signedByUserId?: string;
  signatureMode?: DocumentSignatureMode;
  signatureLabel?: string;
  signaturePosition?: DocumentSignaturePosition;
  notes?: string | null;
  archivedAt?: string;
  archivedByName?: string;
  archivedByUserId?: string;
}

export interface PortalDocumentHistoryItem {
  id: string;
  icon: 'upload' | 'approval' | 'signature' | 'archive';
  title: string;
  description: string;
  occurredAtLabel: string;
}

export interface PortalDocumentSection {
  id: string;
  title: string;
  body: string;
}

export interface PortalDocument {
  id: string;
  sourceId: string;
  sourceType: PortalDocumentSourceType;
  title: string;
  type: string;
  category: PortalDocumentCategory;
  categoryLabel: string;
  size: string;
  employeeId: string | null;
  employeeName: string;
  employeeRole: string | null;
  employeeDepartment: string | null;
  uploadedAt: string;
  uploadedAtLabel: string;
  status: PortalDocumentStatus;
  statusLabel: string;
  statusDescription: string;
  fileUrl: string | null;
  fileName: string | null;
  description: string;
  tags: string[];
  isSignable: boolean;
  previewTitle: string;
  previewSubtitle: string;
  sections: PortalDocumentSection[];
  signatureHint: string;
  history: PortalDocumentHistoryItem[];
  signedArtifact: SignedDocumentManifest | null;
}

export interface DocumentsOverviewData {
  summary: {
    total: number;
    signed: number;
    pending: number;
    review: number;
  };
  categories: Array<{
    id: string;
    label: string;
    count: number;
    active: boolean;
  }>;
  documents: PortalDocument[];
  alerts: Array<{
    id: string;
    title: string;
    description: string;
  }>;
}
