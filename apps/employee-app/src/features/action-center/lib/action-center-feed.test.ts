import { describe, expect, it } from 'vitest';

import { buildActionCenterItems } from './action-center-feed';

describe('buildActionCenterItems', () => {
  it('inclui documentos pendentes de ciência como ação obrigatória e holerites publicados como recentes', () => {
    const items = buildActionCenterItems({
      documents: [
        {
          id: 'document-1',
          title: 'Política de home office',
          description: 'Documento aguardando leitura.',
          status: 'pending_signature',
          issuedAt: '2026-04-19T09:00:00.000Z',
          acknowledgedAt: null,
        },
      ],
      payrollStatements: [
        {
          id: 'payroll-1',
          referenceLabel: 'Março/2026',
          status: 'available',
          issuedAt: '2026-04-18T09:00:00.000Z',
        },
      ],
    });

    expect(items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'document:document-1',
          source: 'document',
          statusBucket: 'requires-action',
          statusLabel: 'Aguardando ciência',
          href: '/documents/document-1',
        }),
        expect.objectContaining({
          id: 'payroll:payroll-1',
          source: 'payroll',
          statusBucket: 'recent',
          title: 'Holerite disponível: Março/2026',
          href: '/payroll/payroll-1',
        }),
      ]),
    );
  });

  it('deduplica notificações de documento e preserva o contexto oficial do item de domínio', () => {
    const items = buildActionCenterItems({
      notifications: [
        {
          id: 'notification-1',
          title: 'Novo documento publicado',
          description: 'Aguardando ciência.',
          href: '/documents/document-1',
          status: 'unread',
          triggeredAt: '2026-04-19T10:00:00.000Z',
          entityName: 'employee_document',
          entityId: 'document-1',
        },
      ],
      documents: [
        {
          id: 'document-1',
          title: 'Política de home office',
          description: 'Documento aguardando leitura.',
          status: 'pending_signature',
          issuedAt: '2026-04-19T09:00:00.000Z',
          acknowledgedAt: null,
        },
      ],
    });

    const documentItem = items.find((item) => item.dedupeKey === 'document:document-1');

    expect(documentItem).toMatchObject({
      source: 'document',
      href: '/documents/document-1',
      notificationId: 'notification-1',
    });
  });
});
