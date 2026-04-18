import { describe, expect, it } from 'vitest';

import { buildOperationsInbox } from './operations-inbox-service';

describe('buildOperationsInbox', () => {
  it('groups pending items by category and sorts by priority then date', () => {
    const result = buildOperationsInbox({
      pendingTimeRecords: [
        { id: 'tr-1', employeeName: 'Ana', recordedAt: '2026-04-18T08:00:00.000Z', status: 'pending_review' },
      ],
      pendingJustifications: [
        { id: 'jus-1', employeeName: 'Bruno', createdAt: '2026-04-18T09:00:00.000Z', type: 'late' },
      ],
      pendingVacations: [
        { id: 'vac-1', employeeName: 'Carla', requestedAt: '2026-04-18T07:00:00.000Z' },
      ],
      blockedOnboardingTasks: [],
      inactiveDevices: [],
    });

    expect(result.summary.total).toBe(3);
    expect(result.items[0]?.category).toBe('time-record');
    expect(result.groups.find((group) => group.category === 'vacation')?.count).toBe(1);
  });
});
