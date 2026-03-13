import { describe, expect, it } from 'vitest';
import { SearchRepositoriesUseCase } from '../../src/application/use-cases/search-repositories.use-case.js';
import { createSearchRepositoriesResolver } from '../../src/api/resolvers/search-repositories.resolver.js';

describe('searchRepositories required fields contract', () => {
  it('returns all required repository fields', async () => {
    const fakeClient = {
      searchRepositories: async () => ({
        total_count: 1,
        items: [
          {
            id: 1,
            name: 'angular',
            html_url: 'https://github.com/angular/angular',
            description: null,
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
    const first = result.items[0];

    expect(first).toMatchObject({
      id: '1',
      name: 'angular',
      url: 'https://github.com/angular/angular',
      description: null,
      watchersCount: 2000,
      starsCount: 90000,
      openIssuesCount: 1200,
      ownerLogin: 'angular'
    });
  });
});
