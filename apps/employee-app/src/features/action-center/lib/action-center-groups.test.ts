import { describe, expect, it } from 'vitest';

import { groupActionCenterItems, type ActionCenterItem } from './action-center-groups';

const createItem = (overrides: Partial<ActionCenterItem>): ActionCenterItem => ({
  id: overrides.id ?? 'item-1',
  source: overrides.source ?? 'notification',
  statusBucket: overrides.statusBucket ?? 'requires-action',
  title: overrides.title ?? 'Título',
  description: overrides.description ?? 'Descrição',
  href: overrides.href ?? '/notifications',
  occurredAt: overrides.occurredAt ?? '2026-04-19T10:00:00.000Z',
  statusLabel: overrides.statusLabel ?? 'Pendente',
  dedupeKey: overrides.dedupeKey ?? overrides.id ?? 'item-1',
  notificationId: overrides.notificationId ?? null,
});

describe('groupActionCenterItems', () => {
  it('preserva apenas um item por dedupeKey e mantém o notificationId quando existir', () => {
    const groups = groupActionCenterItems(
      [
        createItem({
          id: 'vacation-domain',
          source: 'vacation',
          statusBucket: 'requires-action',
          dedupeKey: 'vacation:vac-1',
          occurredAt: '2026-04-19T09:00:00.000Z',
        }),
        createItem({
          id: 'notification-1',
          source: 'notification',
          statusBucket: 'requires-action',
          dedupeKey: 'vacation:vac-1',
          notificationId: 'notification-1',
          occurredAt: '2026-04-18T12:00:00.000Z',
        }),
      ],
      { now: new Date('2026-04-19T12:00:00.000Z') },
    );

    expect(groups.requiresAction).toHaveLength(1);
    expect(groups.requiresAction[0]).toMatchObject({
      dedupeKey: 'vacation:vac-1',
      notificationId: 'notification-1',
    });
  });

  it('prefere o item de domínio mesmo quando a notificação é mais recente', () => {
    const groups = groupActionCenterItems(
      [
        createItem({
          id: 'notification-2',
          source: 'notification',
          statusBucket: 'requires-action',
          dedupeKey: 'justification:jus-1',
          notificationId: 'notification-2',
          href: '/notifications',
          occurredAt: '2026-04-19T11:00:00.000Z',
        }),
        createItem({
          id: 'justification-domain',
          source: 'justification',
          statusBucket: 'in-review',
          dedupeKey: 'justification:jus-1',
          href: '/justifications/jus-1',
          occurredAt: '2026-04-18T09:00:00.000Z',
        }),
      ],
      { now: new Date('2026-04-19T12:00:00.000Z') },
    );

    expect(groups.requiresAction).toHaveLength(0);
    expect(groups.inReview).toHaveLength(1);
    expect(groups.inReview[0]).toMatchObject({
      source: 'justification',
      href: '/justifications/jus-1',
      notificationId: 'notification-2',
    });
  });

  it('reordena os itens após deduplicar para manter o bucket em ordem decrescente de data', () => {
    const groups = groupActionCenterItems(
      [
        createItem({
          id: 'notification-3',
          source: 'notification',
          statusBucket: 'requires-action',
          dedupeKey: 'vacation:vac-2',
          notificationId: 'notification-3',
          occurredAt: '2026-04-19T11:00:00.000Z',
        }),
        createItem({
          id: 'vacation-domain-older',
          source: 'vacation',
          statusBucket: 'in-review',
          dedupeKey: 'vacation:vac-2',
          occurredAt: '2026-04-18T09:00:00.000Z',
        }),
        createItem({
          id: 'justification-newer',
          source: 'justification',
          statusBucket: 'in-review',
          dedupeKey: 'justification:jus-2',
          occurredAt: '2026-04-19T10:00:00.000Z',
        }),
      ],
      { now: new Date('2026-04-19T12:00:00.000Z') },
    );

    expect(groups.inReview.map((item) => item.id)).toEqual(['justification-newer', 'vacation-domain-older']);
  });

  it('mantém apenas itens realmente recentes no bucket recent e limita a quantidade', () => {
    const groups = groupActionCenterItems(
      [
        createItem({
          id: 'recent-1',
          statusBucket: 'recent',
          dedupeKey: 'recent-1',
          occurredAt: '2026-04-19T11:00:00.000Z',
        }),
        createItem({
          id: 'recent-2',
          statusBucket: 'recent',
          dedupeKey: 'recent-2',
          occurredAt: '2026-04-18T11:00:00.000Z',
        }),
        createItem({
          id: 'recent-old',
          statusBucket: 'recent',
          dedupeKey: 'recent-old',
          occurredAt: '2026-03-01T11:00:00.000Z',
        }),
        createItem({
          id: 'recent-future',
          statusBucket: 'recent',
          dedupeKey: 'recent-future',
          occurredAt: '2026-04-21T11:00:00.000Z',
        }),
      ],
      {
        now: new Date('2026-04-19T12:00:00.000Z'),
        recentWindowDays: 14,
        maxRecentItems: 2,
      },
    );

    expect(groups.recent).toHaveLength(2);
    expect(groups.recent.map((item) => item.id)).toEqual(['recent-1', 'recent-2']);
  });
});
