import { VacationRequestDetailView } from '@/features/vacations/components/vacation-request-detail-view';

const VacationDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <VacationRequestDetailView vacationId={id} />;
};

export default VacationDetailPage;
