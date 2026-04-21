import { describe, expect, it } from 'vitest';

import { buildTimeAdjustmentAssistedReviewCases } from './time-adjustment-assisted-review';

type SeedRecord = Parameters<typeof buildTimeAdjustmentAssistedReviewCases>[0]['pendingRecords'][number];

const createPendingRecord = (overrides: Partial<SeedRecord> = {}): SeedRecord => ({
  id: 'tr-1',
  employeeId: 'emp-1',
  employeeName: 'Ana',
  recordedAt: '2026-04-18T17:05:00.000Z',
  recordType: 'exit',
  source: 'employee_app',
  notes: null,
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
        }),
        createPendingRecord({
          id: 'tr-break-start',
          recordType: 'break_start',
          recordedAt: '2026-04-18T12:01:00.000Z',
        }),
        createPendingRecord({
          id: 'tr-break-end',
          recordType: 'break_end',
          recordedAt: '2026-04-18T13:02:00.000Z',
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
      recordedAt: '2026-04-18T12:18:00.000Z',
      notes: 'Entrada fora da tolerancia.',
    });

    const result = buildTimeAdjustmentAssistedReviewCases({
      pendingRecords: [pendingRecord],
      allTimeRecords: [pendingRecord],
    });

    expect(result[0]).toMatchObject({
      exceptionType: 'outside_rule_window',
      priority: 'high',
      confidence: 'medium',
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
});
