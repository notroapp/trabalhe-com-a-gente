import type { SearchRepositoriesResult } from '../../domain/entities/search.js';
import { mapGithubRepository } from '../dto/github-repository.mapper.js';
import { toPaginationMetadata } from '../dto/pagination.mapper.js';
import { MemoryCache } from '../../infrastructure/cache/memory-cache.js';
import { GithubClient } from '../../infrastructure/github/github-client.js';
import { validateSearchInput } from '../../shared/validation/search-input.validator.js';
import { AppError } from '../../shared/errors/app-error.js';
import { classifyUpstreamError, toApiError } from '../../shared/errors/error-mapper.js';
import { logger } from '../../infrastructure/logging/logger.js';

const CACHE_TTL_MS = 60_000;

export class SearchRepositoriesUseCase {
  constructor(
    private readonly githubClient = new GithubClient(),
    private readonly cache = new MemoryCache<SearchRepositoriesResult>()
  ) {}

  async execute(rawInput: unknown): Promise<SearchRepositoriesResult> {
    const input = validateSearchInput(rawInput);
    const sort = input.sort ?? 'BEST_MATCH';
    const cacheKey = `${input.query}:${input.page}:${input.perPage}:${sort}`;

    try {
      const response = await this.githubClient.searchRepositories({
        query: input.query,
        page: input.page,
        perPage: input.perPage
      });

      const result: SearchRepositoriesResult = {
        items: response.items.map(mapGithubRepository),
        pagination: toPaginationMetadata(response.total_count, input.page, input.perPage),
        source: 'LIVE',
        error: null
      };

      this.cache.set(cacheKey, result, CACHE_TTL_MS);
      return result;
    } catch (error) {
      const mappedError =
        error instanceof AppError ? error : classifyUpstreamError(error);
      logger.warn('Search request failed', {
        code: mappedError.code,
        message: mappedError.message
      });

      const cachedFallback = this.cache.get(cacheKey);
      if (mappedError.code === 'RATE_LIMIT' && cachedFallback) {
        return {
          ...cachedFallback,
          source: 'CACHE',
          error: {
            code: 'RATE_LIMIT',
            message: 'Rate limit reached. Showing cached results when available.',
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
