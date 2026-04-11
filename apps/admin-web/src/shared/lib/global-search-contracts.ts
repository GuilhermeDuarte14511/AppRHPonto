export type GlobalSearchCategory =
  | 'employee'
  | 'department'
  | 'time-record'
  | 'justification'
  | 'document'
  | 'vacation'
  | 'onboarding'
  | 'audit'
  | 'schedule'
  | 'device';

export interface GlobalSearchResultItem {
  id: string;
  category: GlobalSearchCategory;
  title: string;
  subtitle: string;
  meta: string;
  href: string;
}

export interface GlobalSearchResponse {
  term: string;
  total: number;
  items: GlobalSearchResultItem[];
}
