import { z } from 'zod';
import { AppError } from '../errors/app-error.js';

export const githubSearchTypeValues = [
  'CODE',
  'COMMITS',
  'ISSUES_PULL_REQUESTS',
  'LABELS',
  'REPOSITORIES',
  'TOPICS',
  'USERS'
] as const;

export type GithubSearchTypeValue = (typeof githubSearchTypeValues)[number];

export interface GithubSearchInput {
  type: GithubSearchTypeValue;
  query: string;
  page: number;
  perPage: number;
  repositoryId?: number;
}

const schema = z.object({
  type: z.enum(githubSearchTypeValues),
  query: z.string().trim().min(1, 'Query is required.'),
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(50).default(10),
  repositoryId: z.number().int().positive().optional()
});

export function validateGithubSearchInput(input: unknown): GithubSearchInput {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    throw new AppError('VALIDATION_ERROR', 'Invalid GitHub search input.', false, 400, parsed.error.message);
  }
  return parsed.data;
}
