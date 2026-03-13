import { describe, expect, it, vi } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { RepositorySearchService } from '../../src/app/features/repository-search/services/repository-search.service';

describe('RepositorySearchService mapping', () => {
  it('maps GraphQL response payload to view payload', async () => {
    const graphqlClient = {
      query: vi.fn(async () => ({
        searchRepositories: {
          items: [{ id: '1', name: 'angular', url: 'https://github.com/angular/angular', description: null, watchersCount: 1, starsCount: 2, openIssuesCount: 3, ownerLogin: 'angular' }],
          pagination: { page: 1, perPage: 10, totalCount: 1, hasNextPage: false, hasPreviousPage: false },
          source: 'LIVE',
          error: null
        }
      }))
    };

    const service = new RepositorySearchService(graphqlClient as never);
    const result = await firstValueFrom(service.search('angular'));

    expect(result.items[0].name).toBe('angular');
    expect(result.error).toBeNull();
    expect(graphqlClient.query).toHaveBeenCalledOnce();
  });
});
