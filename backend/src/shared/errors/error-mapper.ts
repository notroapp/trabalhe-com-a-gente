import { AxiosError } from 'axios';
import { AppError } from './app-error.js';

export function classifyUpstreamError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  const axiosError = error as AxiosError<{ message?: string }>;
  const status = axiosError?.response?.status;

  if (status === 403) {
    return new AppError('RATE_LIMIT', 'External provider rate limit reached.', true, 429);
  }
  if (status && status >= 400 && status < 500) {
    return new AppError('UPSTREAM_CLIENT_ERROR', 'External provider request failed.', false, 502);
  }
  if (status && status >= 500) {
    return new AppError('UPSTREAM_SERVER_ERROR', 'External provider unavailable.', true, 503);
  }

  return new AppError('UPSTREAM_TIMEOUT', 'External provider timeout.', true, 504);
}

export function toApiError(error: AppError) {
  const safeMessageByCode: Record<string, string> = {
    VALIDATION_ERROR: 'Invalid request.',
    RATE_LIMIT: 'Rate limit reached. Please retry shortly.',
    UPSTREAM_TIMEOUT: 'External provider timeout. Try again.',
    UPSTREAM_SERVER_ERROR: 'External provider unavailable. Try again.',
    UPSTREAM_CLIENT_ERROR: 'Unable to fetch data from provider.',
    INTERNAL_ERROR: 'Unexpected internal error.'
  };

  return {
    code: error.code,
    message: safeMessageByCode[error.code] ?? 'Unexpected internal error.',
    retryable: error.retryable,
    details: undefined
  };
}
