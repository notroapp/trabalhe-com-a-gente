import { describe, expect, it, vi } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { RepositorySearchService } from '../../src/app/features/repository-search/services/repository-search.service';

describe('RepositorySearchService pagination reset', () => {
  it('resets page to 1 when query changes', async () => {
    const querySpy = vi.fn(async (_query: string, variables?: { input: { page: number } }) => ({
      searchRepositories: {
        items: [],
        pagination: {
          page: variables?.input.page ?? 1,
          perPage: 10,
          totalCount: 0,
          hasNextPage: false,
          hasPreviousPage: false
        },
        source: 'LIVE',
        error: null
      }
    }));

    const service = new RepositorySearchService({ query: querySpy } as never);

    await firstValueFrom(service.search('angular', 3, 10));
    await firstValueFrom(service.search('react', 3, 10));

    const secondCallVars = querySpy.mock.calls[1][1] as { input: { page: number } };
    expect(secondCallVars.input.page).toBe(1);
  });
});
