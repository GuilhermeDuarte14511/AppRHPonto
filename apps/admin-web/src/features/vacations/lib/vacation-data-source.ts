import { getAppDataConnect } from '@rh-ponto/api-client';
import {
  approveVacationRequest,
  createVacationRequest,
  getVacationRequestById,
  listVacationRequests,
  rejectVacationRequest,
} from '@rh-ponto/api-client/generated';
import type { Employee } from '@rh-ponto/employees';

import type { CreateVacationRequestPayload, VacationRequest } from '../types/vacation-request';

const FALLBACK_ATTACHMENT_URL = 'https://storage.googleapis.com/pontoprecise-demo/documentos';
const defaultActorName = 'Equipe de RH';

const mapApprovalStep = ({
  label,
  status,
  actor,
  timestamp,
  notes,
}: {
  label: string;
  status: string;
  actor?: string | null;
  timestamp?: string | null;
  notes?: string | null;
}): VacationRequest['managerApproval'] => ({
  label,
  status: status === 'completed' ? 'completed' : 'pending',
  actor: actor ?? defaultActorName,
  timestamp: timestamp ?? null,
  notes: notes ?? 'Aguardando processamento da etapa.',
});

const buildAttachment = ({
  attachmentFileName,
  attachmentFileUrl,
  employeeName,
}: {
  attachmentFileName?: string | null;
  attachmentFileUrl?: string | null;
  employeeName: string;
}) => {
  if (!attachmentFileName && !attachmentFileUrl) {
    return null;
  }

  return {
    fileName: attachmentFileName ?? 'documento-ferias.pdf',
    fileUrl:
      attachmentFileUrl ??
      `${FALLBACK_ATTACHMENT_URL}/${encodeURIComponent(employeeName.toLowerCase().replace(/\s+/g, '-'))}`,
    signedBy: 'Fluxo digital do RH',
  };
};

const mapVacationRequest = (
  record: Awaited<ReturnType<typeof listVacationRequests>>['data']['vacationRequests'][number],
  employeesById: Map<string, Employee>,
): VacationRequest => {
  const employee = employeesById.get(record.employee.id);
  const employeeName = employee?.fullName ?? 'Colaborador não identificado';
  const employeeEmail = employee?.email ?? `${employee?.registrationNumber ?? 'funcionario'}@empresa.com`;

  return {
    id: record.id,
    employeeId: record.employee.id,
    employeeName,
    employeeEmail,
    department: employee?.department ?? 'Sem departamento',
    position: employee?.position ?? 'Cargo não informado',
    requestedAt: record.requestedAt,
    startDate: record.startDate,
    endDate: record.endDate,
    totalDays: record.totalDays,
    availableDays: record.availableDays,
    accrualPeriod: record.accrualPeriod ?? 'Período não informado',
    advanceThirteenthSalary: record.advanceThirteenthSalary,
    cashBonus: record.cashBonus,
    status: record.status as VacationRequest['status'],
    attachment: buildAttachment({
      attachmentFileName: record.attachmentFileName ?? null,
      attachmentFileUrl: record.attachmentFileUrl ?? null,
      employeeName,
    }),
    coverageNotes: record.coverageNotes ?? null,
    managerApproval: mapApprovalStep({
      label: 'Aprovação da liderança',
      status: record.managerApprovalStatus,
      actor: record.managerApprovalActor,
      timestamp: record.managerApprovalTimestamp,
      notes: record.managerApprovalNotes,
    }),
    hrApproval: mapApprovalStep({
      label: 'Aprovação do RH',
      status: record.hrApprovalStatus,
      actor: record.hrApprovalActor,
      timestamp: record.hrApprovalTimestamp,
      notes: record.hrApprovalNotes ?? record.reviewNotes,
    }),
    reviewNotes: record.reviewNotes ?? null,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
};

const createEmployeesDirectory = (employees: Employee[]) => new Map(employees.map((employee) => [employee.id, employee]));

const calculateTotalDays = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return Math.max(1, Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
};

const resolveAccrualPeriod = (employee: Employee | undefined) => {
  const hireYear = employee?.hireDate ? new Date(employee.hireDate).getUTCFullYear() : new Date().getUTCFullYear() - 1;
  const periodEnd = hireYear + 1;

  return `${hireYear}/${periodEnd}`;
};

export const fetchVacationRequests = async (employees: Employee[]): Promise<VacationRequest[]> => {
  const employeesById = createEmployeesDirectory(employees);
  const { data } = await listVacationRequests(getAppDataConnect());

  return data.vacationRequests.map((record) => mapVacationRequest(record, employeesById));
};

export const fetchVacationRequestDetail = async (id: string, employees: Employee[]): Promise<VacationRequest | null> => {
  const employeesById = createEmployeesDirectory(employees);
  const { data } = await getVacationRequestById(getAppDataConnect(), { id });

  if (!data.vacationRequest) {
    return null;
  }

  return mapVacationRequest(data.vacationRequest, employeesById);
};

export const createVacationRequestRecord = async (
  payload: CreateVacationRequestPayload,
  employees: Employee[],
): Promise<VacationRequest> => {
  const employee = employees.find((item) => item.id === payload.employeeId);

  const { data } = await createVacationRequest(getAppDataConnect(), {
    employeeId: payload.employeeId,
    startDate: payload.startDate,
    endDate: payload.endDate,
    totalDays: calculateTotalDays(payload.startDate, payload.endDate),
    availableDays: 30,
    accrualPeriod: resolveAccrualPeriod(employee),
    advanceThirteenthSalary: payload.advanceThirteenthSalary,
    cashBonus: false,
    attachmentFileName: payload.attachmentName ?? null,
    attachmentFileUrl: payload.attachmentName
      ? `${FALLBACK_ATTACHMENT_URL}/${encodeURIComponent(payload.attachmentName)}`
      : null,
    coverageNotes:
      payload.department && payload.position
        ? `Cobertura prevista para ${payload.department} com apoio do cargo ${payload.position}.`
        : null,
  });

  const createdRecord = await fetchVacationRequestDetail(data.vacationRequest_insert.id, employees);

  if (!createdRecord) {
    throw new Error('Não foi possível localizar a solicitação de férias após a criação.');
  }

  return createdRecord;
};

export const reviewVacationRequestRecord = async ({
  id,
  status,
  notes,
  actorName,
  employees,
}: {
  id: string;
  status: 'approved' | 'rejected';
  notes: string;
  actorName?: string;
  employees: Employee[];
}) => {
  const actor = actorName?.trim() || defaultActorName;

  if (status === 'approved') {
    await approveVacationRequest(getAppDataConnect(), {
      id,
      reviewNotes: notes,
      managerApprovalActor: actor,
      managerApprovalNotes: notes,
      hrApprovalActor: actor,
      hrApprovalNotes: notes,
    });
  } else {
    await rejectVacationRequest(getAppDataConnect(), {
      id,
      reviewNotes: notes,
      managerApprovalActor: actor,
      managerApprovalNotes: notes,
      hrApprovalActor: actor,
      hrApprovalNotes: notes,
    });
  }

  return fetchVacationRequestDetail(id, employees);
};
