export interface RequestAdapter {
  get<TResult>(url: string): Promise<TResult>;
  post<TResult>(url: string, payload: unknown): Promise<TResult>;
}

