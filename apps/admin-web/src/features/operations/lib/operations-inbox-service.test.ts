import { describe, expect, it } from 'vitest';

import { buildOperationsInbox } from './operations-inbox-service';

describe('buildOperationsInbox', () => {
  it('groups pending items by category and sorts by priority then date', () => {
    const result = buildOperationsInbox({
      pendingTimeRecords: [
        {
          id: 'tr-1',
          employeeName: 'Ana',
          recordedAt: '2026-04-18T08:00:00.000Z',
          status: 'pending_review',
          recordType: 'entry',
        },
      ],
      pendingJustifications: [
        { id: 'jus-1', employeeName: 'Bruno', createdAt: '2026-04-18T09:00:00.000Z', type: 'late' },
      ],
      pendingVacations: [
        {
          id: 'vac-1',
          employeeName: 'Carla',
          requestedAt: '2026-04-18T07:00:00.000Z',
          startDate: '2026-04-21',
          endDate: '2026-04-25',
        },
      ],
      pendingDocumentAcknowledgements: [],
      blockedOnboardingTasks: [],
      inactiveDevices: [],
    });

    expect(result.summary.total).toBe(3);
    expect(result.items[0]?.category).toBe('time-record');
    expect(result.groups.find((group) => group.category === 'vacation')?.count).toBe(1);
  });

  it('keeps blocked onboarding without due date fresh for notifications', () => {
    const result = buildOperationsInbox({
      pendingTimeRecords: [],
      pendingJustifications: [],
      pendingVacations: [],
      pendingDocumentAcknowledgements: [],
      blockedOnboardingTasks: [
        {
          id: 'task-1',
          title: 'Assinar contrato',
          status: 'blocked',
          dueDate: null,
          employeeName: 'Diego',
          journeyId: 'journey-1',
          updatedAt: '2026-04-18T10:30:00.000Z',
        },
      ],
      inactiveDevices: [],
    });

    expect(result.items[0]).toMatchObject({
      category: 'onboarding',
      title: 'Etapa de onboarding bloqueada',
      occurredAt: '2026-04-18T10:30:00.000Z',
      notification: {
        referenceKey: 'onboarding-task:task-1:blocked:no-date',
        severity: 'danger',
        triggeredAt: '2026-04-18T10:30:00.000Z',
      },
    });
  });

  it('preserves overdue onboarding semantics distinctly from blocked items', () => {
    const result = buildOperationsInbox({
      pendingTimeRecords: [],
      pendingJustifications: [],
      pendingVacations: [],
      pendingDocumentAcknowledgements: [],
      blockedOnboardingTasks: [
        {
          id: 'task-2',
          title: 'Enviar documentos',
          status: 'in_progress',
          dueDate: '2026-04-10',
          employeeName: 'Erica',
          journeyId: 'journey-2',
          updatedAt: '2026-04-18T08:00:00.000Z',
        },
      ],
      inactiveDevices: [],
    });

    expect(result.items[0]).toMatchObject({
      category: 'onboarding',
      title: 'Etapa de onboarding vencida',
      occurredAt: '2026-04-10T09:00:00.000Z',
      notification: {
        referenceKey: 'onboarding-task:task-2:overdue:2026-04-10',
        severity: 'warning',
        triggeredAt: '2026-04-10T09:00:00.000Z',
      },
    });
  });

  it('uses requestedAt for inbox ordering while keeping vacation notification chronology on startDate', () => {
    const result = buildOperationsInbox({
      pendingTimeRecords: [],
      pendingJustifications: [],
      pendingVacations: [
        {
          id: 'vac-late-request',
          employeeName: 'Fabio',
          requestedAt: '2026-04-18T12:00:00.000Z',
          startDate: '2026-05-20',
          endDate: '2026-05-30',
        },
        {
          id: 'vac-early-request',
          employeeName: 'Gabi',
          requestedAt: '2026-04-18T08:00:00.000Z',
          startDate: '2026-06-10',
          endDate: '2026-06-20',
        },
      ],
      pendingDocumentAcknowledgements: [],
      blockedOnboardingTasks: [],
      inactiveDevices: [],
    });

    expect(result.items.map((item) => item.id)).toEqual(['vac-late-request', 'vac-early-request']);
    expect(result.items[0]?.occurredAt).toBe('2026-04-18T12:00:00.000Z');
    expect(result.items[0]?.notification.triggeredAt).toBe('2026-05-20T09:00:00.000Z');
    expect(result.items[1]?.notification.triggeredAt).toBe('2026-06-10T09:00:00.000Z');
  });

  it('preserves assisted review metadata on time record items', () => {
    const result = buildOperationsInbox({
      pendingTimeRecords: [
        {
          id: 'tr-assisted',
          employeeId: 'emp-1',
          employeeName: 'Helena',
          recordedAt: '2026-04-19T08:05:00.000Z',
          status: 'pending_review',
          recordType: 'entry',
          assistedReview: {
            recordId: 'tr-assisted',
            employeeId: 'emp-1',
            employeeName: 'Helena',
            recordedAt: '2026-04-19T08:05:00.000Z',
            recordType: 'entry',
            priority: 'high',
            exceptionType: 'outside_rule_window',
            confidence: 'medium',
            recommendedAction: 'request_justification',
            routingTarget: 'manager',
            batchEligible: false,
            batchGroupKey: null,
            closureImpact: 'payroll',
            title: 'Marcacao fora da regra: Helena',
            description: 'Solicite justificativa antes de decidir.',
            confidenceReason: 'A batida exige contexto operacional adicional.',
            suggestionReason: 'O desvio temporal deve ser justificado antes do fechamento.',
            decisionSummary: 'Confianca media com sugestao de request_justification.',
          },
        },
      ],
      pendingJustifications: [],
      pendingVacations: [],
      pendingDocumentAcknowledgements: [],
      blockedOnboardingTasks: [],
      inactiveDevices: [],
    });

    expect(result.items[0]).toMatchObject({
      priority: 'high',
      title: 'Marcacao fora da regra: Helena',
      description: 'Solicite justificativa antes de decidir.',
      href: '/operations?case=tr-assisted',
      assistedReview: {
        exceptionType: 'outside_rule_window',
        recommendedAction: 'request_justification',
      },
      notification: {
        title: 'Marcacao fora da regra: Helena',
        description: 'O desvio temporal deve ser justificado antes do fechamento.',
        href: '/operations?case=tr-assisted',
      },
    });
  });
});
