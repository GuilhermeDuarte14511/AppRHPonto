export type VacationRequestStatus = 'pending' | 'approved' | 'rejected';

export interface VacationAttachment {
  fileName: string;
  fileUrl: string;
  signedBy?: string | null;
}

export interface VacationApprovalStep {
  label: string;
  status: 'completed' | 'pending';
  actor: string;
  timestamp?: string | null;
  notes: string;
}

export interface VacationOperationalInsight {
  overlapCount: number;
  overlappingApprovedCount: number;
  overlappingPendingCount: number;
  overlappingEmployeeNames: string[];
  coverageRisk: 'low' | 'medium' | 'high';
  summary: string;
}

export interface VacationRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  department: string;
  position: string;
  requestedAt: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  availableDays: number;
  accrualPeriod: string;
  advanceThirteenthSalary: boolean;
  cashBonus: boolean;
  status: VacationRequestStatus;
  attachment: VacationAttachment | null;
  coverageNotes: string | null;
  managerApproval: VacationApprovalStep;
  hrApproval: VacationApprovalStep;
  reviewNotes: string | null;
  createdAt: string;
  updatedAt: string;
  operationalInsight: VacationOperationalInsight;
}

export interface CreateVacationRequestPayload {
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  department: string;
  position: string;
  startDate: string;
  endDate: string;
  advanceThirteenthSalary: boolean;
  attachmentName?: string | null;
}
