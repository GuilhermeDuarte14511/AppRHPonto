import { getAppDataConnect } from '@rh-ponto/api-client';
import { createAuditLog } from '@rh-ponto/api-client/generated';

export const createPayrollAuditEvent = async (payload: {
  userId?: string | null;
  action: string;
  description: string;
  entityId?: string;
  oldData?: unknown | null;
  newData?: unknown | null;
}) => {
  await createAuditLog(getAppDataConnect(), {
    userId: payload.userId ?? null,
    entityName: 'Payroll',
    entityId: payload.entityId ?? null,
    action: payload.action,
    description: payload.description,
    oldData: payload.oldData ?? null,
    newData: payload.newData ?? null,
    ipAddress: null,
    deviceInfo: 'Admin Web · Fechamento de folha',
  });
};
