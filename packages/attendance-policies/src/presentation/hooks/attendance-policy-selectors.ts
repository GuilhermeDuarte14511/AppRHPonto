import type { AttendancePolicy, WorkLocation } from '../../domain/entities/attendance-policy';

export const getActiveAttendancePolicies = (items: AttendancePolicy[]) => items.filter((item) => item.isActive);

export const getActiveWorkLocations = (items: WorkLocation[]) => items.filter((item) => item.isActive);
