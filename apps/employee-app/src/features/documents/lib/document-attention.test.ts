import { describe, expect, it } from 'vitest';

import type { EmployeeDocumentItem } from '@/shared/lib/employee-self-service-api';

import { resolveEmployeeDocumentAttention } from './document-attention';

const createDocument = (overrides: Partial<EmployeeDocumentItem> = {}): EmployeeDocumentItem => ({
  id: 'document-1',
  employeeId: 'employee-1',
  category: 'policy',
  title: 'Política de home office',
  description: 'Termo atualizado para leitura.',
  status: 'pending_signature',
  fileName: 'politica-home-office.pdf',
  fileUrl: 'https://example.com/politica-home-office.pdf',
  issuedAt: '2026-04-18T09:00:00.000Z',
  acknowledgedAt: null,
  expiresAt: '2027-04-18',
  ...overrides,
});

describe('resolveEmployeeDocumentAttention', () => {
  it('sinaliza ação obrigatória quando o documento ainda aguarda ciência', () => {
    expect(resolveEmployeeDocumentAttention(createDocument())).toMatchObject({
      requiresAcknowledgement: true,
      primaryActionLabel: 'Confirmar ciência',
      statusHeadline: 'Aguardando sua ciência',
    });
  });

  it('transforma o documento em item concluído quando a ciência já foi registrada', () => {
    expect(
      resolveEmployeeDocumentAttention(
        createDocument({
          status: 'available',
          acknowledgedAt: '2026-04-18T11:30:00.000Z',
        }),
      ),
    ).toMatchObject({
      requiresAcknowledgement: false,
      primaryActionLabel: 'Abrir arquivo',
      statusHeadline: 'Ciência concluída',
      completedAt: '2026-04-18T11:30:00.000Z',
    });
  });
});
