import { Subject, delay, of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { RepositorySearchService } from '../../src/app/features/repository-search/services/repository-search.service';

describe('RepositorySearchService rx flow', () => {
  it('applies debounceTime(400) and emits last query', async () => {
    vi.useFakeTimers();
    const graphqlClient = { query: vi.fn() };
    const service = new RepositorySearchService(graphqlClient as never);
    const searchSpy = vi.spyOn(service, 'search').mockImplementation((query: string) =>
      of({
        items: [],
        pagination: { page: 1, perPage: 10, totalCount: 0, hasNextPage: false, hasPreviousPage: false },
        source: 'LIVE',
        error: query ? null : { code: 'VALIDATION_ERROR', message: 'x', retryable: false }
      })
    );

    const query$ = new Subject<string>();
    const emitted: string[] = [];
    service.createSearchStream(query$).subscribe((payload) => emitted.push(payload.error?.code ?? 'OK'));

    query$.next('a');
    query$.next('ang');
    query$.next('angular');
    vi.advanceTimersByTime(399);
    expect(searchSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(searchSpy).toHaveBeenCalledOnce();
    expect(searchSpy).toHaveBeenCalledWith('angular', 1, 10);
    expect(emitted).toHaveLength(1);

    vi.useRealTimers();
  });

  it('cancels stale paginated requests with switchMap', () => {
    vi.useFakeTimers();
    const service = new RepositorySearchService({ query: vi.fn() } as never);
    const request$ = new Subject<{ query: string; page: number; perPage: number }>();
    const searchSpy = vi.spyOn(service, 'search').mockImplementation((_query, page) =>
      of({
        items: [{ id: String(page), name: `repo-${page}`, url: '', description: null, watchersCount: 0, starsCount: 0, openIssuesCount: 0, ownerLogin: '' }],
        pagination: { page, perPage: 10, totalCount: 2, hasNextPage: false, hasPreviousPage: page > 1 },
        source: 'LIVE',
        error: null
      }).pipe(delay(page === 1 ? 20 : 5))
    );

    const emitted: string[] = [];
    service
      .createPaginatedSearchStream(request$)
      .subscribe((payload) => emitted.push(payload.items[0]?.id ?? 'none'));

    request$.next({ query: 'angular', page: 1, perPage: 10 });
    request$.next({ query: 'angular', page: 2, perPage: 10 });

    vi.advanceTimersByTime(25);
    expect(searchSpy).toHaveBeenCalledTimes(2);
    expect(emitted).toEqual(['2']);
    vi.useRealTimers();
  });
});
