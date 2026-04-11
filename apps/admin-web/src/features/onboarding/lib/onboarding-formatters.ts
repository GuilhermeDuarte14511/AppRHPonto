import type {
  OnboardingCategorySummaryStatus,
  OnboardingJourneyStatus,
  OnboardingTaskCategory,
  OnboardingTaskStatus,
} from './onboarding-contracts';

export const onboardingJourneyStatusLabelMap: Record<OnboardingJourneyStatus, string> = {
  pending: 'Pendente',
  in_progress: 'Em andamento',
  blocked: 'Bloqueado',
  completed: 'Concluído',
};

export const onboardingTaskStatusLabelMap: Record<OnboardingTaskStatus, string> = {
  pending: 'Pendente',
  in_progress: 'Em andamento',
  blocked: 'Bloqueado',
  completed: 'Concluído',
};

export const onboardingCategoryLabelMap: Record<OnboardingTaskCategory, string> = {
  documentation: 'Documentação',
  equipment: 'Equipamentos',
  signature: 'Assinaturas',
  access: 'Acessos',
  training: 'Treinamentos',
  benefits: 'Benefícios',
  culture: 'Cultura',
};

export const onboardingJourneyStatusVariantMap: Record<
  OnboardingJourneyStatus,
  'warning' | 'info' | 'danger' | 'success'
> = {
  pending: 'warning',
  in_progress: 'info',
  blocked: 'danger',
  completed: 'success',
};

export const onboardingTaskStatusVariantMap: Record<
  OnboardingTaskStatus | OnboardingCategorySummaryStatus,
  'neutral' | 'warning' | 'info' | 'danger' | 'success'
> = {
  empty: 'neutral',
  pending: 'warning',
  in_progress: 'info',
  blocked: 'danger',
  completed: 'success',
};
