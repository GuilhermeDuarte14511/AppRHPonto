import { AuditDetailView } from '@/features/audit/components/audit-detail-view';

const AuditDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <AuditDetailView auditId={id} />;
};

export default AuditDetailPage;
