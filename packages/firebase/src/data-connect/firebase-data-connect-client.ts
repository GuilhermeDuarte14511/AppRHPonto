export interface FirebaseDataConnectClient {
  query<TResult>(operationName: string, variables?: Record<string, unknown>): Promise<TResult>;
  mutate<TResult>(operationName: string, variables?: Record<string, unknown>): Promise<TResult>;
}

