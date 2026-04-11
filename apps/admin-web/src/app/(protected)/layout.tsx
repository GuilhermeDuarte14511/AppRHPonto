import { AdminGuard } from '@/shared/guards/admin-guard';
import { AdminShell } from '@/shared/layout/admin-shell';

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => (
  <AdminGuard>
    <AdminShell>{children}</AdminShell>
  </AdminGuard>
);

export default ProtectedLayout;

