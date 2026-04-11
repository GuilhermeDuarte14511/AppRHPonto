import { getAppDataConnect } from '@rh-ponto/api-client';
import { createAuditLog } from '@rh-ponto/api-client/generated';

export const createPayrollAuditEvent = async (payload: {
  action: string;
  description: string;
  entityId?: string;
}) => {
  await createAuditLog(getAppDataConnect(), {
    userId: null,
    entityName: 'Payroll',
    entityId: payload.entityId ?? null,
    action: payload.action,
    description: payload.description,
    ipAddress: null,
    deviceInfo: 'Admin Web · Fechamento de folha',
  });
};
