import type { TimeRecord, TimeRecordPhoto } from '@rh-ponto/time-records';

export type TimeRecordListItem = TimeRecord & {
  employeeName: string;
  department: string;
  photos: TimeRecordPhoto[];
};
