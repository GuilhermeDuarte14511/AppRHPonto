export type OnboardingJourneyStatus = 'pending' | 'in_progress' | 'blocked' | 'completed';
export type OnboardingTaskStatus = 'pending' | 'in_progress' | 'blocked' | 'completed';
export type OnboardingTaskCategory =
  | 'documentation'
  | 'equipment'
  | 'signature'
  | 'access'
  | 'training'
  | 'benefits'
  | 'culture';

export type OnboardingCategorySummaryStatus = 'empty' | 'pending' | 'in_progress' | 'blocked' | 'completed';

export interface OnboardingCategorySummary {
  category: OnboardingTaskCategory;
  label: string;
  status: OnboardingCategorySummaryStatus;
  completedCount: number;
  totalCount: number;
}

export interface OnboardingOverviewItem {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string | null;
  department: string;
  position: string;
  ownerName: string;
  status: OnboardingJourneyStatus;
  statusLabel: string;
  progressPercent: number;
  currentStageLabel: string;
  startDateLabel: string;
  expectedEndDateLabel: string;
  overdueTasksCount: number;
  categorySummaries: Record<'documentation' | 'equipment' | 'signature', OnboardingCategorySummary>;
}

export interface OnboardingOverviewData {
  metrics: {
    total: number;
    inProgress: number;
    blocked: number;
    completed: number;
    pendingDocuments: number;
    pendingEquipment: number;
    pendingSignatures: number;
    overdueTasks: number;
  };
  departments: string[];
  statuses: OnboardingJourneyStatus[];
  items: OnboardingOverviewItem[];
}

export interface EmployeeOnboardingSnapshot {
  employeeId: string;
  journeyId: string | null;
  status: OnboardingJourneyStatus | null;
  statusLabel: string | null;
  progressPercent: number | null;
  currentStageLabel: string | null;
}

export interface OnboardingDetailTask {
  id: string;
  title: string;
  description: string | null;
  category: OnboardingTaskCategory;
  categoryLabel: string;
  status: OnboardingTaskStatus;
  statusLabel: string;
  dueDateLabel: string;
  dueDate: string | null;
  completedAtLabel: string;
  assignedToLabel: string;
  blockerReason: string | null;
  evidenceLabel: string | null;
  evidenceUrl: string | null;
  isRequired: boolean;
}

export interface OnboardingTaskSection {
  category: OnboardingTaskCategory;
  label: string;
  summary: string;
  completedCount: number;
  totalCount: number;
  tasks: OnboardingDetailTask[];
}

export interface OnboardingJourneyDetailData {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string | null;
  department: string;
  position: string;
  registrationNumber: string;
  hireDateLabel: string;
  phoneLabel: string;
  ownerName: string;
  status: OnboardingJourneyStatus;
  statusLabel: string;
  progressPercent: number;
  currentStageLabel: string;
  startDateLabel: string;
  expectedEndDateLabel: string;
  completedAtLabel: string;
  notes: string | null;
  stats: {
    totalTasks: number;
    completedTasks: number;
    blockedTasks: number;
    overdueTasks: number;
  };
  sections: OnboardingTaskSection[];
  assigneeOptions: Array<{ id: string; label: string; supportingText: string }>;
}
