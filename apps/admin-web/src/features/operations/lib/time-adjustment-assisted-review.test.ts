import { describe, expect, it } from 'vitest';

import { buildTimeAdjustmentAssistedReviewCases } from './time-adjustment-assisted-review';

type SeedRecord = Parameters<typeof buildTimeAdjustmentAssistedReviewCases>[0]['pendingRecords'][number];

const scheduleContext = {
  workSchedules: [
    {
      id: 'ws-1',
      name: 'Horario comercial',
      startTime: '09:00',
      breakStartTime: '12:00',
      breakEndTime: '13:00',
      endTime: '18:00',
      toleranceMinutes: 10,
      expectedDailyMinutes: 480,
      isActive: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
  employeeScheduleHistories: [
    {
      id: 'esh-1',
      employeeId: 'emp-1',
      workScheduleId: 'ws-1',
      startDate: '2026-01-01',
      endDate: null,
      isCurrent: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
};

const createPendingRecord = (overrides: Partial<SeedRecord> = {}): SeedRecord => ({
  id: 'tr-1',
  employeeId: 'emp-1',
  employeeName: 'Ana',
  recordedAt: '2026-04-18T17:05:00.000Z',
  originalRecordedAt: null,
  recordType: 'exit',
  source: 'employee_app',
  notes: null,
  isManual: false,
  latitude: null,
  longitude: null,
  resolvedAddress: null,
  referenceRecordId: null,
  ...overrides,
});

describe('buildTimeAdjustmentAssistedReviewCases', () => {
  it('classifies missing punch cases with high confidence and batch eligibility', () => {
    const pendingRecord = createPendingRecord({
      id: 'tr-missing',
      recordType: 'exit',
      notes: 'Colaborador informou esquecimento da saída.',
    });

    const result = buildTimeAdjustmentAssistedReviewCases({
      pendingRecords: [pendingRecord],
      allTimeRecords: [
        createPendingRecord({
          id: 'tr-entry',
          recordType: 'entry',
          recordedAt: '2026-04-18T08:02:00.000Z',
          originalRecordedAt: null,
        }),
        createPendingRecord({
          id: 'tr-break-start',
          recordType: 'break_start',
          recordedAt: '2026-04-18T12:01:00.000Z',
          originalRecordedAt: null,
        }),
        createPendingRecord({
          id: 'tr-break-end',
          recordType: 'break_end',
          recordedAt: '2026-04-18T13:02:00.000Z',
          originalRecordedAt: null,
        }),
        pendingRecord,
      ],
    });

    expect(result[0]).toMatchObject({
      exceptionType: 'missing_punch',
      confidence: 'high',
      recommendedAction: 'complete_with_expected_time',
      routingTarget: 'manager',
      batchEligible: true,
    });
  });

  it('classifies incomplete sequences with medium confidence', () => {
    const pendingRecord = createPendingRecord({
      id: 'tr-incomplete',
      recordType: 'break_end',
      recordedAt: '2026-04-18T13:00:00.000Z',
      notes: 'Sequência incompleta do intervalo.',
    });

    const result = buildTimeAdjustmentAssistedReviewCases({
      pendingRecords: [pendingRecord],
      allTimeRecords: [
        createPendingRecord({
          id: 'tr-entry',
          recordType: 'entry',
          recordedAt: '2026-04-18T08:02:00.000Z',
          originalRecordedAt: null,
        }),
        pendingRecord,
      ],
    });

    expect(result[0]).toMatchObject({
      exceptionType: 'incomplete_sequence',
      confidence: 'medium',
      recommendedAction: 'review_daily_sequence',
      routingTarget: 'manager',
      batchEligible: false,
    });
  });

  it('classifies outside-rule-window cases with high priority', () => {
    const pendingRecord = createPendingRecord({
      id: 'tr-window',
      recordType: 'entry',
      recordedAt: '2026-04-18T09:32:00.000Z',
      notes: null,
    });

    const result = buildTimeAdjustmentAssistedReviewCases({
      pendingRecords: [pendingRecord],
      allTimeRecords: [pendingRecord],
      scheduleContext,
    });

    expect(result[0]).toMatchObject({
      exceptionType: 'outside_rule_window',
      priority: 'high',
      confidence: 'high',
      recommendedAction: 'request_justification',
      routingTarget: 'manager',
      closureImpact: 'payroll',
      batchEligible: false,
    });
  });

  it('classifies location divergence with low confidence and no batch action', () => {
    const pendingRecord = createPendingRecord({
      id: 'tr-location',
      recordType: 'entry',
      source: 'employee_app',
      recordedAt: '2026-04-18T08:07:00.000Z',
      latitude: -23.5912,
      longitude: -46.6761,
      resolvedAddress: 'Rua Vergueiro, 3185 - Vila Mariana - São Paulo - SP',
      notes: 'Divergência com geolocalização informada.',
    });

    const result = buildTimeAdjustmentAssistedReviewCases({
      pendingRecords: [pendingRecord],
      allTimeRecords: [pendingRecord],
    });

    expect(result[0]).toMatchObject({
      exceptionType: 'location_divergence',
      confidence: 'low',
      recommendedAction: 'escalate_for_compliance_review',
      routingTarget: 'hr',
      batchEligible: false,
      closureImpact: 'payroll_and_compliance',
    });
  });

  it('keeps manual recovery close to the expected schedule as missing punch', () => {
    const pendingRecord = createPendingRecord({
      id: 'tr-manual-exit',
      recordedAt: '2026-04-18T18:06:00.000Z',
      originalRecordedAt: '2026-04-18T18:06:00.000Z',
      recordType: 'exit',
      isManual: true,
      notes: 'Ajuste manual apos esquecimento da saida.',
    });

    const result = buildTimeAdjustmentAssistedReviewCases({
      pendingRecords: [pendingRecord],
      allTimeRecords: [
        createPendingRecord({
          id: 'tr-entry',
          recordType: 'entry',
          recordedAt: '2026-04-18T09:01:00.000Z',
        }),
        createPendingRecord({
          id: 'tr-break-start',
          recordType: 'break_start',
          recordedAt: '2026-04-18T12:01:00.000Z',
        }),
        createPendingRecord({
          id: 'tr-break-end',
          recordType: 'break_end',
          recordedAt: '2026-04-18T13:01:00.000Z',
        }),
        pendingRecord,
      ],
      scheduleContext,
    });

    expect(result[0]).toMatchObject({
      exceptionType: 'missing_punch',
      confidence: 'high',
      recommendedAction: 'complete_with_expected_time',
      batchEligible: true,
    });
  });

  it('treats missing break pair as incomplete sequence under the assigned schedule', () => {
    const pendingRecord = createPendingRecord({
      id: 'tr-exit-no-break',
      recordType: 'exit',
      recordedAt: '2026-04-18T18:00:00.000Z',
      notes: 'Fechamento do dia com intervalo incompleto.',
    });

    const result = buildTimeAdjustmentAssistedReviewCases({
      pendingRecords: [pendingRecord],
      allTimeRecords: [
        createPendingRecord({
          id: 'tr-entry',
          recordType: 'entry',
          recordedAt: '2026-04-18T09:00:00.000Z',
        }),
        createPendingRecord({
          id: 'tr-break-start',
          recordType: 'break_start',
          recordedAt: '2026-04-18T12:00:00.000Z',
        }),
        pendingRecord,
      ],
      scheduleContext,
    });

    expect(result[0]).toMatchObject({
      exceptionType: 'incomplete_sequence',
      recommendedAction: 'review_daily_sequence',
      batchEligible: false,
    });
  });
});
