import { describe, expect, it } from 'vitest';
import { SearchRepositoriesUseCase } from '../../src/application/use-cases/search-repositories.use-case.js';
import { createSearchRepositoriesResolver } from '../../src/api/resolvers/search-repositories.resolver.js';

describe('searchRepositories pagination contract', () => {
  it('returns pagination metadata for requested page', async () => {
    const fakeClient = {
      searchRepositories: async () => ({
        total_count: 25,
        items: Array.from({ length: 10 }).map((_, index) => ({
          id: index + 1,
          name: `repo-${index + 1}`,
          html_url: `https://github.com/test/repo-${index + 1}`,
          description: null,
          watchers_count: 0,
          stargazers_count: 0,
          open_issues_count: 0,
          owner: { login: 'test' }
        }))
      })
    };

    const resolver = createSearchRepositoriesResolver(new SearchRepositoriesUseCase(fakeClient as never));
    const result = await resolver({}, { input: { query: 'angular', page: 2, perPage: 10 } });

    expect(result.pagination.page).toBe(2);
    expect(result.pagination.perPage).toBe(10);
    expect(result.pagination.totalCount).toBe(25);
    expect(result.pagination.hasPreviousPage).toBe(true);
    expect(result.pagination.hasNextPage).toBe(true);
  });
});
