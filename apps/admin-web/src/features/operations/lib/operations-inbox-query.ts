import { fetchOnboardingAttention } from '@/features/onboarding/lib/onboarding-client';

import { fetchAdminLiveDataSnapshot } from '@/shared/lib/admin-live-data';

import { getLatestAssistedReviewDecision } from './assisted-review-audit';
import {
  buildTimeAdjustmentAssistedReviewCases,
  type AssistedReviewSourceRecord,
} from './time-adjustment-assisted-review';
import { buildOperationsInbox, type OperationsInboxData } from './operations-inbox-service';

const toIsoString = (value: string | Date | null | undefined) => {
  if (!value) {
    return null;
  }

  return typeof value === 'string' ? value : value.toISOString();
};

const isDueSoonItem = (
  item: OperationsInboxData['items'][number],
  now = new Date(),
) => {
  if (item.category !== 'vacation' && item.category !== 'onboarding') {
    return false;
  }

  const triggeredAt = new Date(item.notification.triggeredAt).getTime();
  const nowTime = now.getTime();
  const sevenDaysFromNow = nowTime + 7 * 24 * 60 * 60 * 1000;

  return triggeredAt >= nowTime && triggeredAt <= sevenDaysFromNow;
};

export const getOperationsInboxAt = async (now: Date): Promise<OperationsInboxData> => {
  const [snapshot, onboardingAttention] = await Promise.all([
    fetchAdminLiveDataSnapshot(),
    fetchOnboardingAttention(),
  ]);

  const employeeDirectory = new Map(snapshot.employees.map((employee) => [employee.id, employee.fullName]));
  const employeeDocuments = snapshot.employeeDocuments ?? [];
  const timeRecordContext: AssistedReviewSourceRecord[] = snapshot.timeRecords.map((record) => ({
    id: record.id,
    employeeId: record.employeeId,
    employeeName: employeeDirectory.get(record.employeeId) ?? 'Colaborador nao identificado',
    recordedAt: toIsoString(record.recordedAt) ?? new Date(0).toISOString(),
    originalRecordedAt: toIsoString(record.originalRecordedAt),
    recordType: record.recordType,
    source: record.source,
    notes: record.notes ?? null,
    isManual: record.isManual,
    latitude: record.latitude ?? null,
    longitude: record.longitude ?? null,
    resolvedAddress: record.resolvedAddress ?? null,
    referenceRecordId: record.referenceRecordId ?? null,
  }));
  const pendingTimeRecords = timeRecordContext.filter(
    (record) =>
      snapshot.timeRecords.some((snapshotRecord) => snapshotRecord.id === record.id && snapshotRecord.status === 'pending_review') &&
      !getLatestAssistedReviewDecision(snapshot.auditLogs, record.id),
  );
  const assistedReviewCases = buildTimeAdjustmentAssistedReviewCases({
    pendingRecords: pendingTimeRecords,
    allTimeRecords: timeRecordContext,
    scheduleContext: {
      employeeScheduleHistories: snapshot.employeeScheduleHistories,
      workSchedules: snapshot.workSchedules,
    },
  });
  const assistedReviewMap = new Map(assistedReviewCases.map((item) => [item.recordId, item]));

  const inbox = buildOperationsInbox({
    pendingTimeRecords: snapshot.timeRecords
      .filter(
        (record) => record.status === 'pending_review' && !getLatestAssistedReviewDecision(snapshot.auditLogs, record.id),
      )
      .map((record) => ({
        id: record.id,
        employeeId: record.employeeId,
        employeeName: employeeDirectory.get(record.employeeId) ?? 'Colaborador nao identificado',
        recordedAt: toIsoString(record.recordedAt) ?? new Date(0).toISOString(),
        status: 'pending_review' as const,
        recordType: record.recordType,
        source: record.source,
        notes: record.notes ?? null,
        latitude: record.latitude ?? null,
        longitude: record.longitude ?? null,
        resolvedAddress: record.resolvedAddress ?? null,
        referenceRecordId: record.referenceRecordId ?? null,
        assistedReview: assistedReviewMap.get(record.id),
      })),
    pendingJustifications: snapshot.justifications
      .filter((justification) => justification.status === 'pending')
      .map((justification) => ({
        id: justification.id,
        employeeName: employeeDirectory.get(justification.employeeId) ?? 'Colaborador não identificado',
        createdAt: toIsoString(justification.createdAt) ?? new Date(0).toISOString(),
        type: justification.type,
      })),
    pendingVacations: snapshot.vacationRequests
      .filter((vacation) => vacation.status === 'pending')
      .map((vacation) => ({
        id: vacation.id,
        employeeName: employeeDirectory.get(vacation.employeeId) ?? 'Colaborador não identificado',
        requestedAt: vacation.requestedAt,
        startDate: vacation.startDate,
        endDate: vacation.endDate,
      })),
    pendingDocumentAcknowledgements: employeeDocuments
      .filter((document) => document.status === 'pending_signature' && !document.acknowledgedAt)
      .map((document) => ({
        id: document.id,
        employeeName: employeeDirectory.get(document.employeeId) ?? 'Colaborador não identificado',
        title: document.title,
        issuedAt: toIsoString(document.issuedAt) ?? new Date(0).toISOString(),
      })),
    blockedOnboardingTasks: onboardingAttention.items,
    inactiveDevices: snapshot.devices
      .filter((device) => device.isActive === false)
      .map((device) => ({
        id: device.id,
        name: device.name,
        locationName: device.locationName ?? null,
        lastSyncAt: toIsoString(device.lastSyncAt) ?? null,
      })),
  });

  return {
    summary: {
      total: inbox.summary.total,
      highPriority: inbox.items.filter((item) => item.priority === 'high').length,
      dueSoon: inbox.items.filter((item) => isDueSoonItem(item, now)).length,
      batchEligible: inbox.items.filter((item) => item.assistedReview?.batchEligible).length,
      routedToHr: inbox.items.filter((item) => item.assistedReview?.routingTarget === 'hr').length,
      lowConfidence: inbox.items.filter((item) => item.assistedReview?.confidence === 'low').length,
      closureImpact: inbox.items.filter((item) => {
        const closureImpact = item.assistedReview?.closureImpact;

        return closureImpact === 'payroll' || closureImpact === 'compliance' || closureImpact === 'payroll_and_compliance';
      }).length,
    },
    items: inbox.items,
    groups: inbox.groups,
  };
};

export const getOperationsInbox = async (): Promise<OperationsInboxData> => getOperationsInboxAt(new Date());
