import { z } from 'zod';
import type { SearchQuery } from '../../domain/entities/search.js';
import { AppError } from '../errors/app-error.js';

const schema = z.object({
  query: z.string().trim().min(1, 'Query is required.'),
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(50).default(10),
  sort: z.enum(['BEST_MATCH']).default('BEST_MATCH')
});

export function validateSearchInput(input: unknown): SearchQuery {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    throw new AppError('VALIDATION_ERROR', 'Invalid search input.', false, 400, parsed.error.message);
  }
  return parsed.data;
}
