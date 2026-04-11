export type Identifier = string;
export type ISODateString = string;
export type DateValue = string | Date;
export type Nullable<TValue> = TValue | null;
export type Optional<TValue> = TValue | undefined;

export interface PáginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PáginatedResult<TItem> {
  items: TItem[];
  total: number;
}

export interface DateRange {
  startDate?: DateValue;
  endDate?: DateValue;
}
