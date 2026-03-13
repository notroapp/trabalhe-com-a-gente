import '@angular/compiler';
import { convertToParamMap } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RepositorySearchPageComponent } from '../../src/app/features/repository-search/pages/repository-search.page';

function buildRepositoriesPayload() {
  return {
    items: [
      {
        id: '1',
        name: 'node',
        url: 'https://github.com/nodejs/node',
        description: 'Node.js runtime',
        watchersCount: 10,
        starsCount: 20,
        openIssuesCount: 5,
        ownerLogin: 'nodejs'
      }
    ],
    pagination: {
      page: 2,
      perPage: 10,
      totalCount: 123,
      hasNextPage: true,
      hasPreviousPage: true
    },
    source: 'LIVE' as const,
    error: null
  };
}

function buildGenericPayload() {
  return {
    items: [
      {
        id: 'user-1',
        title: 'nodejs',
        url: 'https://github.com/nodejs',
        subtitle: null,
        description: null,
        state: null,
        author: null,
        repository: null,
        createdAt: null
      }
    ],
    pagination: {
      page: 1,
      perPage: 10,
      totalCount: 9,
      hasNextPage: false,
      hasPreviousPage: false
    },
    source: 'LIVE' as const,
    error: null
  };
}

describe('RepositorySearchPage routing flow', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('navigates with query params when searching/changing mode/changing page', () => {
    const queryParamMap$ = new BehaviorSubject(convertToParamMap({ q: 'node', type: 'repositories', page: '1' }));
    const navigate = vi.fn(async () => true);
    const search = vi.fn(() => of(buildRepositoriesPayload()));
    const searchGithub = vi.fn(() => of(buildGenericPayload()));

    const component = new RepositorySearchPageComponent(
      { queryParamMap: queryParamMap$.asObservable() } as never,
      { navigate } as never,
      { search, searchGithub } as never
    );

    component.onSearch('angular');
    expect(navigate).toHaveBeenCalledWith(['/search'], {
      queryParams: { q: 'angular', type: 'repositories', page: 1 }
    });

    component.onModeChange('users');
    expect(navigate).toHaveBeenCalledWith(['/search'], {
      queryParams: { q: 'node', type: 'users', page: 1 }
    });

    component.onPageChange(3);
    expect(navigate).toHaveBeenCalledWith(['/search'], {
      queryParams: { q: 'node', type: 'repositories', page: 3 }
    });
  });

  it('executes repository search based on route params and updates state', async () => {
    vi.useFakeTimers();
    const queryParamMap$ = new BehaviorSubject(convertToParamMap({ q: 'node', type: 'repositories', page: '2' }));
    const search = vi.fn(() => of(buildRepositoriesPayload()));
    const searchGithub = vi.fn(() => of(buildGenericPayload()));

    const component = new RepositorySearchPageComponent(
      { queryParamMap: queryParamMap$.asObservable() } as never,
      { navigate: vi.fn(async () => true) } as never,
      { search, searchGithub } as never
    );

    await vi.advanceTimersByTimeAsync(400);

    expect(search).toHaveBeenCalledWith('node', 2, 10);
    expect(searchGithub).not.toHaveBeenCalled();
    expect(component.items).toHaveLength(1);
    expect(component.genericItems).toHaveLength(0);
    expect(component.pagination.page).toBe(2);
    expect(component.pagination.totalCount).toBe(123);
  });

  it('executes generic search for non-repository types', async () => {
    vi.useFakeTimers();
    const queryParamMap$ = new BehaviorSubject(convertToParamMap({ q: 'node', type: 'users', page: '1' }));
    const search = vi.fn(() => of(buildRepositoriesPayload()));
    const searchGithub = vi.fn(() => of(buildGenericPayload()));

    const component = new RepositorySearchPageComponent(
      { queryParamMap: queryParamMap$.asObservable() } as never,
      { navigate: vi.fn(async () => true) } as never,
      { search, searchGithub } as never
    );

    await vi.advanceTimersByTimeAsync(400);

    expect(search).not.toHaveBeenCalled();
    expect(searchGithub).toHaveBeenCalledWith('USERS', 'node', 1, 10);
    expect(component.items).toHaveLength(0);
    expect(component.genericItems).toHaveLength(1);
    expect(component.searchMode).toBe('users');
  });
});
