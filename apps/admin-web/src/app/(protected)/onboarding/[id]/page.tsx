import { OnboardingDetailView } from '@/features/onboarding/components/onboarding-detail-view';

export default async function OnboardingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <OnboardingDetailView journeyId={id} />;
}
