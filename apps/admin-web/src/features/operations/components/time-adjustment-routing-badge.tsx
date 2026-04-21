'use client';

import { Badge } from '@rh-ponto/ui';

import type { AssistedReviewRoutingTarget } from '../lib/time-adjustment-assisted-review';

const meta: Record<AssistedReviewRoutingTarget, { label: string; variant: 'info' | 'neutral' | 'warning' }> = {
  manager: { label: 'Destino: Gestor', variant: 'info' },
  hr: { label: 'Destino: RH', variant: 'warning' },
  operations: { label: 'Destino: Operacao', variant: 'neutral' },
};

export const TimeAdjustmentRoutingBadge = ({ routingTarget }: { routingTarget: AssistedReviewRoutingTarget }) => (
  <Badge variant={meta[routingTarget].variant}>{meta[routingTarget].label}</Badge>
);
