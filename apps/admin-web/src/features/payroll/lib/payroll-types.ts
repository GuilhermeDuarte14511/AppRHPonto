export type PayrollRecordStatus = 'validado' | 'pendente' | 'em_analise';

export type PayrollNoteTone = 'neutral' | 'warning' | 'danger' | 'info';

export type PayrollDayEntry = {
  id: string;
  date: string;
  weekday: string;
  firstEntry: string | null;
  firstExit: string | null;
  secondEntry: string | null;
  secondExit: string | null;
  expectedHours: string;
  regularHours: string;
  overtimeHours: string;
  balance: string;
  total: string;
  note: string | null;
  noteTone: PayrollNoteTone;
  occurrenceDetail: string | null;
  sourceLabel: string;
};

export type PayrollSupportingDocument = {
  id: string;
  name: string;
  typeLabel: string;
  issuer: string;
  issuedAtLabel: string;
  statusLabel: string;
};

export type PayrollSignatureLine = {
  id: string;
  label: string;
  name: string;
  role: string;
};

export type PayrollRecordDetail = {
  id: string;
  employeeName: string;
  registrationNumber: string;
  department: string;
  role: string;
  avatarName: string;
  companyName: string;
  unitName: string;
  periodLabel: string;
  periodStartLabel: string;
  periodEndLabel: string;
  employeeCpf: string;
  hireDateLabel: string;
  scheduleLabel: string;
  costCenter: string;
  managerName: string;
  rhManagerName: string;
  generatedAtLabel: string;
  workedHoursLabel: string;
  workedHoursHint: string;
  normalHoursLabel: string;
  normalHoursHint: string;
  bankHoursLabel: string;
  bankHoursHint: string;
  overtimeHoursLabel: string;
  overtimeHoursHint: string;
  overtime50HoursLabel: string;
  overtime100HoursLabel: string;
  nightHoursLabel: string;
  lateHoursLabel: string;
  absencesLabel: string;
  absencesHint: string;
  approvedAbsencesLabel: string;
  unapprovedAbsencesLabel: string;
  additionalsLabel: string;
  totalExtraPayLabel: string;
  mealAllowanceLabel: string;
  status: PayrollRecordStatus;
  validationStatusLabel: string;
  validationHint: string;
  occurrenceSummary: string[];
  documents: PayrollSupportingDocument[];
  signatures: PayrollSignatureLine[];
  days: PayrollDayEntry[];
};

export type PayrollClosureState = {
  periodLabel: string;
  progress: number;
  validated: number;
  employeesTotal: number;
  pending: number;
  overtime: string;
  criticalIssues: number;
  isClosed: boolean;
  records: PayrollRecordDetail[];
};

export type PeriodBounds = {
  end: Date;
  endLabel: string;
  label: string;
  month: number;
  start: Date;
  startLabel: string;
  year: number;
};
