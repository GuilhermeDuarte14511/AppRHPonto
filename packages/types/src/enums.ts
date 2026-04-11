export const userRoles = ['admin', 'employee', 'kiosk'] as const;
export type UserRole = (typeof userRoles)[number];

export const deviceTypes = ['kiosk', 'mobile', 'web'] as const;
export type DeviceType = (typeof deviceTypes)[number];

export const timeRecordTypes = ['entry', 'break_start', 'break_end', 'exit'] as const;
export type TimeRecordType = (typeof timeRecordTypes)[number];

export const timeRecordSources = ['kiosk', 'employee_app', 'admin_adjustment'] as const;
export type TimeRecordSource = (typeof timeRecordSources)[number];

export const timeRecordStatuses = ['valid', 'pending_review', 'adjusted', 'rejected'] as const;
export type TimeRecordStatus = (typeof timeRecordStatuses)[number];

export const justificationTypes = ['missing_record', 'late', 'absence', 'adjustment_request'] as const;
export type JustificationType = (typeof justificationTypes)[number];

export const justificationStatuses = ['pending', 'approved', 'rejected'] as const;
export type JustificationStatus = (typeof justificationStatuses)[number];

export const workLocationTypes = ['company', 'home', 'branch', 'client_site', 'free_zone'] as const;
export type WorkLocationType = (typeof workLocationTypes)[number];

export const attendancePolicyModes = ['company_only', 'home_only', 'hybrid', 'free', 'field'] as const;
export type AttendancePolicyMode = (typeof attendancePolicyModes)[number];

export const attendanceValidationStrategies = ['block', 'pending_review', 'allow'] as const;
export type AttendanceValidationStrategy = (typeof attendanceValidationStrategies)[number];

export const attendanceLocationRoles = ['primary_company', 'home', 'optional', 'client_site'] as const;
export type AttendanceLocationRole = (typeof attendanceLocationRoles)[number];
