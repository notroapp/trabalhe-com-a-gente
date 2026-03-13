import { describe, expect, it } from 'vitest';
import { AppError } from '../../src/shared/errors/app-error.js';
import { SearchRepositoriesUseCase } from '../../src/application/use-cases/search-repositories.use-case.js';
import { MemoryCache } from '../../src/infrastructure/cache/memory-cache.js';
import type { SearchRepositoriesResult } from '../../src/domain/entities/search.js';

describe('searchRepositories rate-limit fallback', () => {
  it('returns cached result with rate-limit warning when provider is limited', async () => {
    let callCount = 0;
    const fakeClient = {
      searchRepositories: async () => {
        callCount += 1;
        if (callCount === 1) {
          return {
            total_count: 1,
            items: [
              {
                id: 1,
                name: 'angular',
                html_url: 'https://github.com/angular/angular',
                description: null,
                watchers_count: 1,
                stargazers_count: 2,
                open_issues_count: 3,
                owner: { login: 'angular' }
              }
            ]
          };
        }
        throw new AppError('RATE_LIMIT', 'Provider limited', true, 429);
      }
    };

    const cache = new MemoryCache<SearchRepositoriesResult>();
    const useCase = new SearchRepositoriesUseCase(fakeClient as never, cache);

    const first = await useCase.execute({ query: 'angular', page: 1, perPage: 10 });
    expect(first.source).toBe('LIVE');
    expect(first.error).toBeNull();

    const second = await useCase.execute({ query: 'angular', page: 1, perPage: 10 });
    expect(second.source).toBe('CACHE');
    expect(second.items).toHaveLength(1);
    expect(second.error?.code).toBe('RATE_LIMIT');
    expect(second.error?.retryable).toBe(true);
  });
});
