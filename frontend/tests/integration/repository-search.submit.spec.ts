import { describe, expect, it, vi } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { RepositorySearchService } from '../../src/app/features/repository-search/services/repository-search.service';

describe('Repository search submit flow', () => {
  it('returns data for valid search submit', async () => {
    const service = new RepositorySearchService({
      query: vi.fn(async () => ({
        searchRepositories: {
          items: [{ id: '1', name: 'angular', url: 'https://github.com/angular/angular', description: null, watchersCount: 0, starsCount: 0, openIssuesCount: 0, ownerLogin: 'angular' }],
          pagination: { page: 1, perPage: 10, totalCount: 1, hasNextPage: false, hasPreviousPage: false },
          source: 'LIVE',
          error: null
        }
      }))
    } as never);

    const payload = await firstValueFrom(service.search('angular'));

    expect(payload.error).toBeNull();
    expect(payload.items).toHaveLength(1);
    expect(payload.items[0].name).toBe('angular');
  });

  it('blocks empty search submit with validation payload', async () => {
    const service = new RepositorySearchService({
      query: vi.fn()
    } as never);

    const payload = await firstValueFrom(service.search('   '));

    expect(payload.items).toHaveLength(0);
    expect(payload.error?.code).toBe('VALIDATION_ERROR');
    expect(payload.error?.message).toContain('Digite um termo');
  });
});
