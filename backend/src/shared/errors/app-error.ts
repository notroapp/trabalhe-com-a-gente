export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly retryable = false,
    public readonly status = 500,
    public readonly details?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function mapUnknownError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  return new AppError('INTERNAL_ERROR', 'Unexpected internal error.', true, 500);
}
