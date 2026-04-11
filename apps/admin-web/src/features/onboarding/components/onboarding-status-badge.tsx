'use client';

import { Badge } from '@rh-ponto/ui';

import type {
  OnboardingCategorySummaryStatus,
  OnboardingJourneyStatus,
  OnboardingTaskStatus,
} from '../lib/onboarding-contracts';
import {
  onboardingJourneyStatusLabelMap,
  onboardingJourneyStatusVariantMap,
  onboardingTaskStatusLabelMap,
  onboardingTaskStatusVariantMap,
} from '../lib/onboarding-formatters';

export const OnboardingJourneyStatusBadge = ({ status }: { status: OnboardingJourneyStatus }) => (
  <Badge variant={onboardingJourneyStatusVariantMap[status]}>{onboardingJourneyStatusLabelMap[status]}</Badge>
);

export const OnboardingTaskStatusBadge = ({
  status,
}: {
  status: OnboardingTaskStatus | OnboardingCategorySummaryStatus;
}) => (
  <Badge variant={onboardingTaskStatusVariantMap[status]}>
    {status === 'empty' ? 'Sem etapa' : onboardingTaskStatusLabelMap[status as OnboardingTaskStatus]}
  </Badge>
);
