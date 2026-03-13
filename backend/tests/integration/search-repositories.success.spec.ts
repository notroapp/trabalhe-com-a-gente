import { describe, expect, it } from 'vitest';
import { SearchRepositoriesUseCase } from '../../src/application/use-cases/search-repositories.use-case.js';
import { createSearchRepositoriesResolver } from '../../src/api/resolvers/search-repositories.resolver.js';

describe('searchRepositories success flow', () => {
  it('returns repository list and pagination metadata', async () => {
    const fakeClient = {
      searchRepositories: async () => ({
        total_count: 1,
        items: [
          {
            id: 1,
            name: 'angular',
            html_url: 'https://github.com/angular/angular',
            description: 'Angular framework',
            watchers_count: 2000,
            stargazers_count: 90000,
            open_issues_count: 1200,
            owner: { login: 'angular' }
          }
        ]
      })
    };

    const resolver = createSearchRepositoriesResolver(new SearchRepositoriesUseCase(fakeClient as never));
    const result = await resolver({}, { input: { query: 'angular', page: 1, perPage: 10 } });

    expect(result.error).toBeNull();
    expect(result.items).toHaveLength(1);
    expect(result.items[0].name).toBe('angular');
    expect(result.pagination.totalCount).toBe(1);
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.perPage).toBe(10);
    expect(result.source).toBe('LIVE');
  });
});
