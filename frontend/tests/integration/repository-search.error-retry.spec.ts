import { describe, expect, it } from 'vitest';
import { of, switchMap } from 'rxjs';
import { RepositorySearchStore } from '../../src/app/features/repository-search/state/repository-search.store';

describe('RepositorySearch error and retry flow', () => {
  it('shows error then recovers after retry', () => {
    let call = 0;
    const service = {
      createPaginatedSearchStream: (request$: { pipe: (arg0: unknown) => unknown }) =>
        request$.pipe(switchMap((request: { query: string; page: number; perPage: number }) => {
          call += 1;
          if (call === 1) {
            return of({
              items: [],
              pagination: {
                page: request.page,
                perPage: request.perPage,
                totalCount: 0,
                hasNextPage: false,
                hasPreviousPage: false
              },
              source: 'LIVE' as const,
              error: {
                code: 'REQUEST_FAILED',
                message: 'Nao foi possivel carregar os dados. Tente novamente.',
                retryable: true
              }
            });
          }
          return of({
            items: [
              {
                id: '1',
                name: 'angular',
                url: 'https://github.com/angular/angular',
                description: null,
                watchersCount: 1,
                starsCount: 2,
                openIssuesCount: 3,
                ownerLogin: 'angular'
              }
            ],
            pagination: {
              page: request.page,
              perPage: request.perPage,
              totalCount: 1,
              hasNextPage: false,
              hasPreviousPage: false
            },
            source: 'LIVE' as const,
            error: null
          });
        }))
    };

    const store = new RepositorySearchStore(service as never);
    store.search('angular');
    expect(store.snapshot.error).toContain('Nao foi possivel');
    expect(store.snapshot.items).toHaveLength(0);

    store.retry();
    expect(store.snapshot.error).toBeNull();
    expect(store.snapshot.items).toHaveLength(1);
  });
});
