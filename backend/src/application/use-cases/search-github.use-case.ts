import { MemoryCache } from '../../infrastructure/cache/memory-cache.js';
import { GithubClient } from '../../infrastructure/github/github-client.js';
import { AppError } from '../../shared/errors/app-error.js';
import { classifyUpstreamError, toApiError } from '../../shared/errors/error-mapper.js';
import { validateGithubSearchInput } from '../../shared/validation/github-search-input.validator.js';
import { mapGithubGenericItem } from '../dto/github-generic-search.mapper.js';
import type { GenericSearchItem } from '../dto/github-generic-search.mapper.js';
import { toPaginationMetadata } from '../dto/pagination.mapper.js';

const CACHE_TTL_MS = 60_000;

export interface SearchGithubResult {
  items: GenericSearchItem[];
  pagination: {
    page: number;
    perPage: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  source: 'LIVE' | 'CACHE';
  error: {
    code: string;
    message: string;
    retryable: boolean;
    details?: string;
  } | null;
}

export class SearchGithubUseCase {
  constructor(
    private readonly githubClient = new GithubClient(),
    private readonly cache = new MemoryCache<SearchGithubResult>()
  ) {}

  async execute(rawInput: unknown): Promise<SearchGithubResult> {
    const input = validateGithubSearchInput(rawInput);
    const cacheKey = `generic:${input.type}:${input.query}:${input.page}:${input.perPage}:${input.repositoryId ?? 'none'}`;

    try {
      const response = await this.githubClient.searchByType(input);
      const result: SearchGithubResult = {
        items: response.items.map((item) => mapGithubGenericItem(input.type, item)),
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
            message: 'Rate limit reached. Showing cached results.',
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
