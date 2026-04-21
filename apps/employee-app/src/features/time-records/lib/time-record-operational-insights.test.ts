import { describe, expect, it } from 'vitest';

import type { AttendanceLocationEvaluationResult } from '@rh-ponto/attendance-policies';
import type { TimeRecord } from '@rh-ponto/time-records';

import {
  buildPunchPolicyExperience,
  buildPunchReadinessSummary,
  buildTimeRecordOperationalInsight,
} from './time-record-operational-insights';

const createEvaluation = (
  overrides: Partial<AttendanceLocationEvaluationResult> = {},
): AttendanceLocationEvaluationResult => ({
  status: 'allowed',
  reasonCode: 'within_allowed_area',
  title: 'Dentro da área autorizada',
  description: 'A marcação está dentro do raio configurado.',
  requiresPhoto: true,
  requiresGeolocation: true,
  matchedLocation: null,
  nearestAllowedLocation: null,
  distanceMeters: 18,
  canSubmitPunch: true,
  ...overrides,
});

const createRecord = (overrides: Partial<TimeRecord> = {}): TimeRecord => ({
  id: 'tr-1',
  employeeId: 'emp-1',
  deviceId: null,
  recordedByUserId: null,
  recordType: 'entry',
  source: 'employee_app',
  status: 'valid',
  recordedAt: '2026-04-21T11:58:00.000Z',
  originalRecordedAt: null,
  notes: null,
  isManual: false,
  referenceRecordId: null,
  latitude: -23.55,
  longitude: -46.63,
  resolvedAddress: 'Avenida Paulista, 1000',
  ipAddress: null,
  createdAt: '2026-04-21T11:58:00.000Z',
  updatedAt: '2026-04-21T11:58:00.000Z',
  ...overrides,
});

describe('buildPunchPolicyExperience', () => {
  it('explains allowed punches with confident copy', () => {
    const result = buildPunchPolicyExperience(createEvaluation());

    expect(result).toMatchObject({
      status: 'allowed',
      badgeLabel: 'Dentro da regra',
    });
    expect(result.headline).toContain('Tudo certo');
  });

  it('explains pending review for offsite punches', () => {
    const result = buildPunchPolicyExperience(
      createEvaluation({
        status: 'pending_review',
        reasonCode: 'outside_allowed_area',
        title: 'Fora da área, com revisão',
        canSubmitPunch: true,
      }),
    );

    expect(result).toMatchObject({
      status: 'pending_review',
      reviewReasonTitle: 'Fora da área permitida',
    });
    expect(result.description).toContain('RH');
  });

  it('explains blocked punches clearly', () => {
    const result = buildPunchPolicyExperience(
      createEvaluation({
        status: 'blocked',
        reasonCode: 'location_missing',
        canSubmitPunch: false,
      }),
    );

    expect(result).toMatchObject({
      status: 'blocked',
      badgeLabel: 'Bloqueado',
    });
    expect(result.nextStepLabel).toContain('Corrigir');
  });
});

describe('buildPunchReadinessSummary', () => {
  it('marks punch as ready when all required data is available', () => {
    const result = buildPunchReadinessSummary({
      evaluation: createEvaluation(),
      hasCoordinates: true,
      hasResolvedAddress: true,
      selectedRecordType: 'entry',
    });

    expect(result.canProceed).toBe(true);
    expect(result.checklist.every((item) => item.state === 'ready')).toBe(true);
  });
});

describe('buildTimeRecordOperationalInsight', () => {
  it('classifies pending review with geolocation divergence', () => {
    const result = buildTimeRecordOperationalInsight(
      createRecord({
        status: 'pending_review',
        notes: 'Solicitação em revisão por divergência com geolocalização informada.',
      }),
    );

    expect(result).toMatchObject({
      attentionTone: 'warning',
      reviewReasonTitle: 'Revisão por divergência de local',
    });
  });

  it('classifies adjusted records with preserved original time', () => {
    const result = buildTimeRecordOperationalInsight(
      createRecord({
        status: 'adjusted',
        originalRecordedAt: '2026-04-21T12:18:00.000Z',
        notes: 'Ajuste manual após conferência do RH.',
      }),
    );

    expect(result).toMatchObject({
      attentionTone: 'success',
      headline: 'Marcação ajustada pela operação',
    });
  });

  it('classifies rejected records as requiring justification', () => {
    const result = buildTimeRecordOperationalInsight(
      createRecord({
        status: 'rejected',
        notes: 'Solicitação rejeitada por divergência com geolocalização informada.',
      }),
    );

    expect(result).toMatchObject({
      attentionTone: 'danger',
      employeeActionLabel: 'Abrir ou complementar justificativa',
    });
  });
});
