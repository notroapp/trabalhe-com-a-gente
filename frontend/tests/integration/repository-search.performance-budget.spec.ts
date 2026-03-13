import '@angular/compiler';
import { convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RepositorySearchPageComponent } from '../../src/app/features/repository-search/pages/repository-search.page';

describe('RepositorySearch performance budget', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('records first feedback within 1 second budget', async () => {
    vi.useFakeTimers();
    const fakeRoute = {
      queryParamMap: of(
        convertToParamMap({
          q: 'angular',
          type: 'repositories',
          page: '1'
        })
      )
    };

    const fakeRouter = {
      navigate: () => Promise.resolve(true)
    };

    const fakeService = {
      search: () =>
        of({
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
            page: 1,
            perPage: 10,
            totalCount: 1,
            hasNextPage: false,
            hasPreviousPage: false
          },
          source: 'LIVE' as const,
          error: null
        }),
      searchGithub: () =>
        of({
          items: [],
          pagination: {
            page: 1,
            perPage: 10,
            totalCount: 0,
            hasNextPage: false,
            hasPreviousPage: false
          },
          source: 'LIVE' as const,
          error: null
        })
    };

    const component = new RepositorySearchPageComponent(
      fakeRoute as never,
      fakeRouter as never,
      fakeService as never
    );

    await vi.advanceTimersByTimeAsync(400);

    expect(component.firstFeedbackMs).not.toBeNull();
    expect(component.firstFeedbackWithinBudget).toBe(true);
    expect((component.firstFeedbackMs ?? 2000) <= 1000).toBe(true);
  });
});
