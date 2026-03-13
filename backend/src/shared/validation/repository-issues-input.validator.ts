import { z } from 'zod';
import type { RepositoryIssuesQuery } from '../../domain/entities/search.js';
import { AppError } from '../errors/app-error.js';

const schema = z.object({
  owner: z.string().trim().min(1, 'Owner is required.'),
  repository: z.string().trim().min(1, 'Repository is required.'),
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(50).default(10)
});

export function validateRepositoryIssuesInput(input: unknown): RepositoryIssuesQuery {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    throw new AppError('VALIDATION_ERROR', 'Invalid issues search input.', false, 400, parsed.error.message);
  }
  return parsed.data;
}
