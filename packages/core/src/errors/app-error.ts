export class AppError extends Error {
  public readonly code: string;
  public readonly context?: unknown;

  constructor(code: string, message: string, context?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.context = context;
  }
}

