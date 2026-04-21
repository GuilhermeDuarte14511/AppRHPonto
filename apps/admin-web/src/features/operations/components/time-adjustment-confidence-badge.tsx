'use client';

import { Badge } from '@rh-ponto/ui';

import type { AssistedReviewConfidence } from '../lib/time-adjustment-assisted-review';

const meta: Record<AssistedReviewConfidence, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  high: { label: 'Confiança alta', variant: 'success' },
  medium: { label: 'Confiança média', variant: 'warning' },
  low: { label: 'Confiança baixa', variant: 'danger' },
};

export const TimeAdjustmentConfidenceBadge = ({ confidence }: { confidence: AssistedReviewConfidence }) => (
  <Badge variant={meta[confidence].variant}>{meta[confidence].label}</Badge>
);
