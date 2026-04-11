import { getAppDataConnect } from '@rh-ponto/api-client';
import {
  listEmployeeScheduleHistory,
  listJustificationAttachments,
  listTimeRecordPhotos,
  listVacationRequests,
} from '@rh-ponto/api-client/generated';
import type { AuditLog } from '@rh-ponto/audit';
import type { Device } from '@rh-ponto/devices';
import type { Employee } from '@rh-ponto/employees';
import type { Justification } from '@rh-ponto/justifications';
import type { TimeRecord } from '@rh-ponto/time-records';
import type { EmployeeScheduleHistory, WorkSchedule } from '@rh-ponto/work-schedules';

import { services } from './service-registry';

export interface VacationRequestRecord {
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
  status: 'pending' | 'approved' | 'rejected';
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
  createdAt: string;
  updatedAt: string;
}

export interface JustificationAttachmentRecord {
  id: string;
  justificationId: string;
  fileName: string;
  fileUrl: string;
  contentType: string | null;
  fileSizeBytes: number | null;
  uploadedByUserId: string | null;
  createdAt: string;
}

export interface TimeRecordPhotoRecord {
  id: string;
  timeRecordId: string;
  fileUrl: string;
  fileName: string | null;
  contentType: string | null;
  fileSizeBytes: number | null;
  isPrimary: boolean;
  createdAt: string;
}

export interface AdminLiveDataSnapshot {
  auditLogs: AuditLog[];
  devices: Device[];
  employeeScheduleHistories: EmployeeScheduleHistory[];
  employees: Employee[];
  justificationAttachments: JustificationAttachmentRecord[];
  justifications: Justification[];
  timeRecordPhotos: TimeRecordPhotoRecord[];
  timeRecords: TimeRecord[];
  vacationRequests: VacationRequestRecord[];
  workSchedules: WorkSchedule[];
}

const mapVacationRequests = (
  records: Awaited<ReturnType<typeof listVacationRequests>>['data']['vacationRequests'],
): VacationRequestRecord[] =>
  records.map((record) => ({
    id: record.id,
    employeeId: record.employee.id,
    requestedAt: record.requestedAt,
    startDate: record.startDate,
    endDate: record.endDate,
    totalDays: record.totalDays,
    availableDays: record.availableDays,
    accrualPeriod: record.accrualPeriod ?? null,
    advanceThirteenthSalary: record.advanceThirteenthSalary,
    cashBonus: record.cashBonus,
    status: record.status as VacationRequestRecord['status'],
    attachmentFileName: record.attachmentFileName ?? null,
    attachmentFileUrl: record.attachmentFileUrl ?? null,
    coverageNotes: record.coverageNotes ?? null,
    reviewNotes: record.reviewNotes ?? null,
    managerApprovalStatus: record.managerApprovalStatus,
    managerApprovalActor: record.managerApprovalActor ?? null,
    managerApprovalTimestamp: record.managerApprovalTimestamp ?? null,
    managerApprovalNotes: record.managerApprovalNotes ?? null,
    hrApprovalStatus: record.hrApprovalStatus,
    hrApprovalActor: record.hrApprovalActor ?? null,
    hrApprovalTimestamp: record.hrApprovalTimestamp ?? null,
    hrApprovalNotes: record.hrApprovalNotes ?? null,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  }));

const mapJustificationAttachments = (
  records: Awaited<ReturnType<typeof listJustificationAttachments>>['data']['justificationAttachments'],
): JustificationAttachmentRecord[] =>
  records.map((record) => ({
    id: record.id,
    justificationId: record.justification.id,
    fileName: record.fileName,
    fileUrl: record.fileUrl,
    contentType: record.contentType ?? null,
    fileSizeBytes: record.fileSizeBytes == null ? null : Number(record.fileSizeBytes),
    uploadedByUserId: record.uploadedByUser?.id ?? null,
    createdAt: record.createdAt,
  }));

const mapTimeRecordPhotos = (
  records: Awaited<ReturnType<typeof listTimeRecordPhotos>>['data']['timeRecordPhotos'],
): TimeRecordPhotoRecord[] =>
  records.map((record) => ({
    id: record.id,
    timeRecordId: record.timeRecord.id,
    fileUrl: record.fileUrl,
    fileName: record.fileName ?? null,
    contentType: record.contentType ?? null,
    fileSizeBytes: record.fileSizeBytes == null ? null : Number(record.fileSizeBytes),
    isPrimary: record.isPrimary,
    createdAt: record.createdAt,
  }));

export const fetchAdminLiveDataSnapshot = async (): Promise<AdminLiveDataSnapshot> => {
  const dataConnect = getAppDataConnect();
  const [
    employees,
    timeRecords,
    justifications,
    auditLogs,
    workSchedules,
    devices,
    scheduleHistoryResult,
    vacationRequestsResult,
    justificationAttachmentsResult,
    timeRecordPhotosResult,
  ] = await Promise.all([
    services.employees.listEmployeesUseCase.execute(),
    services.timeRecords.listTimeRecordsUseCase.execute(),
    services.justifications.listJustificationsUseCase.execute(),
    services.audit.listAuditLogsUseCase.execute(),
    services.workSchedules.listWorkSchedulesUseCase.execute(),
    services.devices.listDevicesUseCase.execute(),
    listEmployeeScheduleHistory(dataConnect),
    listVacationRequests(dataConnect),
    listJustificationAttachments(dataConnect),
    listTimeRecordPhotos(dataConnect),
  ]);

  return {
    employees,
    timeRecords,
    justifications,
    auditLogs,
    workSchedules,
    devices,
    employeeScheduleHistories: scheduleHistoryResult.data.employeeScheduleHistories.map((item) => ({
      id: item.id,
      employeeId: item.employee.id,
      workScheduleId: item.workSchedule.id,
      startDate: item.startDate,
      endDate: item.endDate ?? null,
      isCurrent: item.isCurrent,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })),
    vacationRequests: mapVacationRequests(vacationRequestsResult.data.vacationRequests),
    justificationAttachments: mapJustificationAttachments(justificationAttachmentsResult.data.justificationAttachments),
    timeRecordPhotos: mapTimeRecordPhotos(timeRecordPhotosResult.data.timeRecordPhotos),
  };
};
