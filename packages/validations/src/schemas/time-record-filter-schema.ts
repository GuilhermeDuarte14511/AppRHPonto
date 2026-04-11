import { timeRecordStatuses, timeRecordTypes } from '@rh-ponto/types';
import { z } from 'zod';

export const timeRecordFilterSchema = z.object({
  employeeId: z.string().optional(),
  status: z.enum(timeRecordStatuses).optional(),
  recordType: z.enum(timeRecordTypes).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type TimeRecordFilterSchema = z.infer<typeof timeRecordFilterSchema>;

