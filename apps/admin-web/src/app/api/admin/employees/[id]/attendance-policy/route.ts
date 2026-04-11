import { NextResponse } from 'next/server';

import { AppError } from '@rh-ponto/core';
import { employeeAttendancePolicyFormSchema } from '@rh-ponto/validations';

import { getRequiredAdminSession } from '@/shared/lib/admin-server-session';
import {
  getEmployeeAttendancePolicyForAdmin,
  updateEmployeeAttendancePolicyForAdmin,
} from '@/features/employees/lib/employee-attendance-policy-server';

const handleRouteError = (error: unknown) => {
  if (error instanceof AppError) {
    const status = error.code === 'AUTH_UNAUTHORIZED' ? 401 : 400;

    return NextResponse.json({ message: error.message }, { status });
  }

  const message = error instanceof Error ? error.message : 'Não foi possível concluir a operação.';

  return NextResponse.json({ message }, { status: 500 });
};

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
    return handleRouteError(error);
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
    return handleRouteError(error);
  }
};
