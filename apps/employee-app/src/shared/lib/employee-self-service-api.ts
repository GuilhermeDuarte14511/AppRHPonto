import {
  createVacationRequest,
  getCurrentEmployeeByEmail,
  getCurrentEmployeeByUserId,
  getEmployeeDocumentByIdForEmployee,
  getEmployeeNotificationPreferences,
  getEmployeeVacationRequestByIdForEmployee,
  getPayrollStatementByIdForEmployee,
  listEmployeeDocuments,
  listEmployeeNotifications,
  listEmployeeVacationRequestsByEmployee,
  listPayrollStatements,
  markEmployeeNotificationAsRead,
  markEmployeeNotificationsAsRead,
  updateEmployeeNotificationPreferences,
} from '@rh-ponto/api-client/generated';
import { getAppDataConnect } from '@rh-ponto/api-client';
import { AppError } from '@rh-ponto/core';
import { createEmployee, type Employee } from '@rh-ponto/employees';

export type EmployeeNotificationSeverity = 'info' | 'warning' | 'danger' | 'success';
export type EmployeeNotificationStatus = 'unread' | 'read';

export interface EmployeeNotificationItem {
  id: string;
  category: string;
  title: string;
  description: string;
  href: string | null;
  entityName: string | null;
  entityId: string | null;
  severity: EmployeeNotificationSeverity;
  status: EmployeeNotificationStatus;
  triggeredAt: string;
  readAt: string | null;
}

export interface EmployeeNotificationPreferences {
  id: string;
  userId: string;
  notifyEntryReminder: boolean;
  notifyBreakReminder: boolean;
  notifyExitReminder: boolean;
  notifyJustificationStatus: boolean;
  notifyRhAdjustment: boolean;
  notifyCompanyCommunications: boolean;
  notifySystemAlerts: boolean;
  notifyVacationStatus: boolean;
  notifyDocuments: boolean;
  notifyPayroll: boolean;
}

export interface EmployeeDocumentItem {
  id: string;
  employeeId: string;
  category: string;
  title: string;
  description: string | null;
  status: string;
  fileName: string;
  fileUrl: string;
  issuedAt: string;
  acknowledgedAt: string | null;
  expiresAt: string | null;
}

export interface PayrollStatementItem {
  id: string;
  employeeId: string;
  referenceLabel: string;
  referenceYear: number;
  referenceMonth: number;
  status: string;
  grossAmount: number;
  netAmount: number;
  fileName: string;
  fileUrl: string;
  issuedAt: string;
}

export interface EmployeeVacationItem {
  id: string;
  employeeId: string;
  requestedAt: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  availableDays: number;
  accrualPeriod: string | null;
  advanceThirteenthSalary: boolean;
  cashBonus: boolean;
  status: string;
  attachmentFileName: string | null;
  attachmentFileUrl: string | null;
  coverageNotes: string | null;
  reviewNotes: string | null;
  managerApprovalStatus: string;
  managerApprovalActor: string | null;
  managerApprovalTimestamp: string | null;
  managerApprovalNotes: string | null;
  hrApprovalStatus: string;
  hrApprovalActor: string | null;
  hrApprovalTimestamp: string | null;
  hrApprovalNotes: string | null;
}

export interface CreateEmployeeVacationPayload {
  employeeId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  availableDays: number;
  accrualPeriod?: string | null;
  advanceThirteenthSalary?: boolean;
  cashBonus?: boolean;
  attachmentFileName?: string | null;
  attachmentFileUrl?: string | null;
  coverageNotes?: string | null;
}

const normalizeEmail = (value?: string | null) => value?.trim().toLowerCase() ?? null;

const mapNotificationSeverity = (value: string): EmployeeNotificationSeverity => {
  if (value === 'info' || value === 'warning' || value === 'danger' || value === 'success') {
    return value;
  }

  return 'info';
};

const mapNotificationStatus = (value: string): EmployeeNotificationStatus =>
  value === 'read' ? 'read' : 'unread';

const createNotificationItem = (
  item: Awaited<ReturnType<typeof listEmployeeNotifications>>['data']['adminNotifications'][number],
): EmployeeNotificationItem => ({
  id: item.id,
  category: item.category,
  title: item.title,
  description: item.description,
  href: item.href ?? null,
  entityName: item.entityName ?? null,
  entityId: item.entityId ?? null,
  severity: mapNotificationSeverity(item.severity),
  status: mapNotificationStatus(item.status),
  triggeredAt: item.triggeredAt,
  readAt: item.readAt ?? null,
});

const createNotificationPreferences = (
  item: Awaited<ReturnType<typeof getEmployeeNotificationPreferences>>['data']['employeeNotificationPreferences'][number],
): EmployeeNotificationPreferences => ({
  id: item.id,
  userId: item.user.id,
  notifyEntryReminder: item.notifyEntryReminder,
  notifyBreakReminder: item.notifyBreakReminder,
  notifyExitReminder: item.notifyExitReminder,
  notifyJustificationStatus: item.notifyJustificationStatus,
  notifyRhAdjustment: item.notifyRhAdjustment,
  notifyCompanyCommunications: item.notifyCompanyCommunications,
  notifySystemAlerts: item.notifySystemAlerts,
  notifyVacationStatus: item.notifyVacationStatus,
  notifyDocuments: item.notifyDocuments,
  notifyPayroll: item.notifyPayroll,
});

const createEmployeeDocumentItem = (
  item: Awaited<ReturnType<typeof listEmployeeDocuments>>['data']['employeeDocuments'][number],
): EmployeeDocumentItem => ({
  id: item.id,
  employeeId: item.employee.id,
  category: item.category,
  title: item.title,
  description: item.description ?? null,
  status: item.status,
  fileName: item.fileName,
  fileUrl: item.fileUrl,
  issuedAt: item.issuedAt,
  acknowledgedAt: item.acknowledgedAt ?? null,
  expiresAt: item.expiresAt ?? null,
});

const createPayrollStatementItem = (
  item: Awaited<ReturnType<typeof listPayrollStatements>>['data']['payrollStatements'][number],
): PayrollStatementItem => ({
  id: item.id,
  employeeId: item.employee.id,
  referenceLabel: item.referenceLabel,
  referenceYear: item.referenceYear,
  referenceMonth: item.referenceMonth,
  status: item.status,
  grossAmount: item.grossAmount,
  netAmount: item.netAmount,
  fileName: item.fileName,
  fileUrl: item.fileUrl,
  issuedAt: item.issuedAt,
});

const createVacationItem = (
  item: Awaited<ReturnType<typeof listEmployeeVacationRequestsByEmployee>>['data']['vacationRequests'][number],
): EmployeeVacationItem => ({
  id: item.id,
  employeeId: item.employee.id,
  requestedAt: item.requestedAt,
  startDate: item.startDate,
  endDate: item.endDate,
  totalDays: item.totalDays,
  availableDays: item.availableDays,
  accrualPeriod: item.accrualPeriod ?? null,
  advanceThirteenthSalary: item.advanceThirteenthSalary,
  cashBonus: item.cashBonus,
  status: item.status,
  attachmentFileName: item.attachmentFileName ?? null,
  attachmentFileUrl: item.attachmentFileUrl ?? null,
  coverageNotes: item.coverageNotes ?? null,
  reviewNotes: item.reviewNotes ?? null,
  managerApprovalStatus: item.managerApprovalStatus,
  managerApprovalActor: item.managerApprovalActor ?? null,
  managerApprovalTimestamp: item.managerApprovalTimestamp ?? null,
  managerApprovalNotes: item.managerApprovalNotes ?? null,
  hrApprovalStatus: item.hrApprovalStatus,
  hrApprovalActor: item.hrApprovalActor ?? null,
  hrApprovalTimestamp: item.hrApprovalTimestamp ?? null,
  hrApprovalNotes: item.hrApprovalNotes ?? null,
});

const createCurrentEmployee = (
  item:
    | Awaited<ReturnType<typeof getCurrentEmployeeByUserId>>['data']['employees'][number]
    | Awaited<ReturnType<typeof getCurrentEmployeeByEmail>>['data']['employees'][number],
): Employee =>
  createEmployee({
    id: item.id,
    userId: item.user?.id ?? null,
    registrationNumber: item.registrationNumber,
    fullName: item.fullName,
    cpf: item.cpf ?? null,
    email: item.email ?? null,
    phone: item.phone ?? null,
    birthDate: item.birthDate ?? null,
    hireDate: item.hireDate ?? null,
    departmentId: item.departmentId ?? null,
    department: item.department?.name ?? null,
    position: item.position ?? null,
    profilePhotoUrl: item.profilePhotoUrl ?? null,
    pinCode: item.pinCode ?? null,
    isActive: item.isActive,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  });

export const fetchCurrentEmployee = async (input: {
  userId?: string | null;
  email?: string | null;
}): Promise<Employee | null> => {
  if (input.userId) {
    const { data } = await getCurrentEmployeeByUserId(getAppDataConnect(), { userId: input.userId });
    const item = data.employees[0];

    if (item) {
      return createCurrentEmployee(item);
    }
  }

  const email = normalizeEmail(input.email);

  if (!email) {
    return null;
  }

  const { data } = await getCurrentEmployeeByEmail(getAppDataConnect(), { email });
  const item = data.employees[0];

  return item ? createCurrentEmployee(item) : null;
};

export const fetchEmployeeNotifications = async (userId: string): Promise<EmployeeNotificationItem[]> => {
  const { data } = await listEmployeeNotifications(getAppDataConnect(), { userId });
  return data.adminNotifications.map(createNotificationItem);
};

export const markEmployeeNotificationRead = async (notificationId: string): Promise<void> => {
  await markEmployeeNotificationAsRead(getAppDataConnect(), { id: notificationId });
};

export const markAllEmployeeNotificationsRead = async (userId: string): Promise<void> => {
  await markEmployeeNotificationsAsRead(getAppDataConnect(), { userId });
};

export const fetchEmployeeNotificationPreferences = async (
  userId: string,
): Promise<EmployeeNotificationPreferences | null> => {
  const { data } = await getEmployeeNotificationPreferences(getAppDataConnect(), { userId });
  const item = data.employeeNotificationPreferences[0];

  return item ? createNotificationPreferences(item) : null;
};

export const updateEmployeeNotificationPreferenceSet = async (
  payload: EmployeeNotificationPreferences,
): Promise<void> => {
  await updateEmployeeNotificationPreferences(getAppDataConnect(), {
    id: payload.id,
    notifyEntryReminder: payload.notifyEntryReminder,
    notifyBreakReminder: payload.notifyBreakReminder,
    notifyExitReminder: payload.notifyExitReminder,
    notifyJustificationStatus: payload.notifyJustificationStatus,
    notifyRhAdjustment: payload.notifyRhAdjustment,
    notifyCompanyCommunications: payload.notifyCompanyCommunications,
    notifySystemAlerts: payload.notifySystemAlerts,
    notifyVacationStatus: payload.notifyVacationStatus,
    notifyDocuments: payload.notifyDocuments,
    notifyPayroll: payload.notifyPayroll,
  });
};

export const fetchEmployeeDocuments = async (employeeId: string): Promise<EmployeeDocumentItem[]> => {
  const { data } = await listEmployeeDocuments(getAppDataConnect(), { employeeId });
  return data.employeeDocuments.map(createEmployeeDocumentItem);
};

export const fetchEmployeeDocumentByIdForEmployee = async (
  id: string,
  employeeId: string,
): Promise<EmployeeDocumentItem | null> => {
  const { data } = await getEmployeeDocumentByIdForEmployee(getAppDataConnect(), { id, employeeId });
  const item = data.employeeDocuments[0];

  return item ? createEmployeeDocumentItem(item) : null;
};

export const fetchPayrollStatements = async (employeeId: string): Promise<PayrollStatementItem[]> => {
  const { data } = await listPayrollStatements(getAppDataConnect(), { employeeId });
  return data.payrollStatements.map(createPayrollStatementItem);
};

export const fetchPayrollStatementByIdForEmployee = async (
  id: string,
  employeeId: string,
): Promise<PayrollStatementItem | null> => {
  const { data } = await getPayrollStatementByIdForEmployee(getAppDataConnect(), { id, employeeId });
  const item = data.payrollStatements[0];

  return item ? createPayrollStatementItem(item) : null;
};

export const fetchEmployeeVacationRequests = async (employeeId: string): Promise<EmployeeVacationItem[]> => {
  const { data } = await listEmployeeVacationRequestsByEmployee(getAppDataConnect(), { employeeId });
  return data.vacationRequests.map(createVacationItem);
};

export const fetchEmployeeVacationRequestByIdForEmployee = async (
  id: string,
  employeeId: string,
): Promise<EmployeeVacationItem | null> => {
  const { data } = await getEmployeeVacationRequestByIdForEmployee(getAppDataConnect(), { id, employeeId });
  const item = data.vacationRequests[0];

  return item ? createVacationItem(item) : null;
};

export const createEmployeeVacationRequest = async (
  payload: CreateEmployeeVacationPayload,
): Promise<EmployeeVacationItem> => {
  const { data } = await createVacationRequest(getAppDataConnect(), {
    employeeId: payload.employeeId,
    startDate: payload.startDate,
    endDate: payload.endDate,
    totalDays: payload.totalDays,
    availableDays: payload.availableDays,
    accrualPeriod: payload.accrualPeriod ?? null,
    advanceThirteenthSalary: payload.advanceThirteenthSalary ?? false,
    cashBonus: payload.cashBonus ?? false,
    attachmentFileName: payload.attachmentFileName ?? null,
    attachmentFileUrl: payload.attachmentFileUrl ?? null,
    coverageNotes: payload.coverageNotes ?? null,
  });

  const created = await fetchEmployeeVacationRequestByIdForEmployee(
    data.vacationRequest_insert.id,
    payload.employeeId,
  );

  if (!created) {
    throw new AppError('EMPLOYEE_VACATION_NOT_FOUND_AFTER_CREATE', 'SolicitaÃ§Ã£o de fÃ©rias nÃ£o encontrada apÃ³s criaÃ§Ã£o.');
  }

  return created;
};
