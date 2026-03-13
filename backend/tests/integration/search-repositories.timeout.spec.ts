import { describe, expect, it } from 'vitest';
import { AppError } from '../../src/shared/errors/app-error.js';
import { SearchRepositoriesUseCase } from '../../src/application/use-cases/search-repositories.use-case.js';
import { createSearchRepositoriesResolver } from '../../src/api/resolvers/search-repositories.resolver.js';

describe('searchRepositories timeout error mapping', () => {
  it('returns user-safe timeout error payload', async () => {
    const fakeClient = {
      searchRepositories: async () => {
        throw new AppError('UPSTREAM_TIMEOUT', 'socket hang up', true, 504);
      }
    };

    const resolver = createSearchRepositoriesResolver(new SearchRepositoriesUseCase(fakeClient as never));
    const result = await resolver({}, { input: { query: 'angular', page: 1, perPage: 10 } });

    expect(result.items).toHaveLength(0);
    expect(result.error?.code).toBe('UPSTREAM_TIMEOUT');
    expect(result.error?.message).toBe('External provider timeout. Try again.');
    expect(result.error?.details).toBeUndefined();
  });
});
