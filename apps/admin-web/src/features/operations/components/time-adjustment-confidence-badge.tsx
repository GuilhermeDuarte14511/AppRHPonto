'use client';

import { Badge } from '@rh-ponto/ui';

import type { AssistedReviewConfidence } from '../lib/time-adjustment-assisted-review';

const meta: Record<AssistedReviewConfidence, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  high: { label: 'Confianca alta', variant: 'success' },
  medium: { label: 'Confianca media', variant: 'warning' },
  low: { label: 'Confianca baixa', variant: 'danger' },
};

export const TimeAdjustmentConfidenceBadge = ({ confidence }: { confidence: AssistedReviewConfidence }) => (
  <Badge variant={meta[confidence].variant}>{meta[confidence].label}</Badge>
);
