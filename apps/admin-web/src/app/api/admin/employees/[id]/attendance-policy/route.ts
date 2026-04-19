import { NextResponse } from 'next/server';

import { employeeAttendancePolicyFormSchema } from '@rh-ponto/validations';

import { getRequiredAdminSession } from '@/shared/lib/admin-server-session';
import { handleApiRouteError } from '@/shared/lib/api-route-error';
import {
  getEmployeeAttendancePolicyForAdmin,
  updateEmployeeAttendancePolicyForAdmin,
} from '@/features/employees/lib/employee-attendance-policy-server';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export const GET = async (_request: Request, context: RouteContext) => {
  try {
    await getRequiredAdminSession();
    const { id } = await context.params;
    const data = await getEmployeeAttendancePolicyForAdmin(id);

    return NextResponse.json({ data });
  } catch (error) {
    return handleApiRouteError(error, 'Não foi possível concluir a operação.');
  }
};

export const PUT = async (request: Request, context: RouteContext) => {
  try {
    await getRequiredAdminSession();
    const payload = employeeAttendancePolicyFormSchema.parse(await request.json());
    const { id } = await context.params;
    const data = await updateEmployeeAttendancePolicyForAdmin(id, payload);

    return NextResponse.json({ data });
  } catch (error) {
    return handleApiRouteError(error, 'Não foi possível concluir a operação.');
  }
};
