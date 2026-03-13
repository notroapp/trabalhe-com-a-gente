import { describe, expect, it } from 'vitest';
import { of, switchMap } from 'rxjs';
import { RepositorySearchStore } from '../../src/app/features/repository-search/state/repository-search.store';

describe('RepositorySearch pagination navigation', () => {
  it('navigates pages preserving query context', () => {
    const calls: Array<{ query: string; page: number; perPage: number }> = [];
    const service = {
      createPaginatedSearchStream: (request$: { pipe: (arg0: unknown) => unknown }) =>
        request$.pipe(
          switchMap((request: { query: string; page: number; perPage: number }) => {
            calls.push(request);
            return of({
              items: [],
              pagination: {
                page: request.page,
                perPage: request.perPage,
                totalCount: 25,
                hasNextPage: request.page < 3,
                hasPreviousPage: request.page > 1
              },
              source: 'LIVE' as const,
              error: null
            });
          })
        )
    };

    const store = new RepositorySearchStore(service as never);
    store.search('angular');
    store.goToPage(2);

    expect(calls).toEqual([
      { query: 'angular', page: 1, perPage: 10 },
      { query: 'angular', page: 2, perPage: 10 }
    ]);
    expect(store.snapshot.pagination.page).toBe(2);
  });
});
