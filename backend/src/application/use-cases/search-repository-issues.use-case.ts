import type { SearchRepositoryIssuesResult } from '../../domain/entities/search.js';
import { toPaginationMetadata } from '../dto/pagination.mapper.js';
import { mapGithubIssue } from '../dto/github-issue.mapper.js';
import { MemoryCache } from '../../infrastructure/cache/memory-cache.js';
import { GithubClient } from '../../infrastructure/github/github-client.js';
import { validateRepositoryIssuesInput } from '../../shared/validation/repository-issues-input.validator.js';
import { AppError } from '../../shared/errors/app-error.js';
import { classifyUpstreamError, toApiError } from '../../shared/errors/error-mapper.js';

const CACHE_TTL_MS = 60_000;

export class SearchRepositoryIssuesUseCase {
  constructor(
    private readonly githubClient = new GithubClient(),
    private readonly cache = new MemoryCache<SearchRepositoryIssuesResult>()
  ) {}

  async execute(rawInput: unknown): Promise<SearchRepositoryIssuesResult> {
    const input = validateRepositoryIssuesInput(rawInput);
    const cacheKey = `issues:${input.owner}:${input.repository}:${input.page}:${input.perPage}`;

    try {
      const response = await this.githubClient.searchIssues(input);
      const result: SearchRepositoryIssuesResult = {
        items: response.items.map(mapGithubIssue),
        pagination: toPaginationMetadata(response.total_count, input.page, input.perPage),
        source: 'LIVE',
        error: null
      };
      this.cache.set(cacheKey, result, CACHE_TTL_MS);
      return result;
    } catch (error) {
      const mappedError = error instanceof AppError ? error : classifyUpstreamError(error);
      const cached = this.cache.get(cacheKey);
      if (mappedError.code === 'RATE_LIMIT' && cached) {
        return {
          ...cached,
          source: 'CACHE',
          error: {
            code: 'RATE_LIMIT',
            message: 'Rate limit reached. Showing cached issues.',
            retryable: true
          }
        };
      }

      return {
        items: [],
        pagination: toPaginationMetadata(0, input.page, input.perPage),
        source: 'LIVE',
        error: toApiError(mappedError)
      };
    }
  }
}
