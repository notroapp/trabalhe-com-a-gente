import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, from, map, of, switchMap, tap } from 'rxjs';
import { GraphqlClientService } from '../../../core/api/graphql-client.service';
import type {
  GithubSearchType,
  SearchGithubPayload,
  SearchRepositoriesPayload,
  SearchRepositoryIssuesPayload
} from '../models/repository-search.models';

interface SearchRepositoriesData {
  searchRepositories: SearchRepositoriesPayload;
}

interface SearchRepositoryIssuesData {
  searchRepositoryIssues: SearchRepositoryIssuesPayload;
}

interface SearchGithubData {
  searchGithub: SearchGithubPayload;
}

export interface SearchRequest {
  query: string;
  page: number;
  perPage: number;
}

const SEARCH_REPOSITORIES_QUERY = `
  query SearchRepositories($input: SearchRepositoriesInput!) {
    searchRepositories(input: $input) {
      items {
        id
        name
        url
        description
        watchersCount
        starsCount
        openIssuesCount
        ownerLogin
      }
      pagination {
        page
        perPage
        totalCount
        hasNextPage
        hasPreviousPage
      }
      source
      error {
        code
        message
        retryable
        details
      }
    }
  }
`;

const SEARCH_REPOSITORY_ISSUES_QUERY = `
  query SearchRepositoryIssues($input: SearchRepositoryIssuesInput!) {
    searchRepositoryIssues(input: $input) {
      items {
        id
        title
        url
        state
        authorLogin
        repositoryFullName
        commentsCount
        createdAt
      }
      pagination {
        page
        perPage
        totalCount
        hasNextPage
        hasPreviousPage
      }
      source
      error {
        code
        message
        retryable
        details
      }
    }
  }
`;

const SEARCH_GITHUB_QUERY = `
  query SearchGithub($input: SearchGithubInput!) {
    searchGithub(input: $input) {
      items {
        id
        title
        url
        subtitle
        description
        state
        author
        repository
        createdAt
      }
      pagination {
        page
        perPage
        totalCount
        hasNextPage
        hasPreviousPage
      }
      source
      error {
        code
        message
        retryable
        details
      }
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class RepositorySearchService {
  private lastQuery = '';
  private readonly repositoryCache = new Map<string, SearchRepositoriesPayload>();
  private readonly githubCache = new Map<string, SearchGithubPayload>();
  private activeController: AbortController | null = null;

  constructor(private readonly graphqlClient: GraphqlClientService) {}

  search(query: string, page = 1, perPage = 10): Observable<SearchRepositoriesPayload> {
    const trimmedQuery = query.trim();
    const isNewQuery = trimmedQuery === this.lastQuery;
    const effectivePage = isNewQuery ? page : 1;
    this.lastQuery = trimmedQuery;

    if (trimmedQuery.length === 0) {
      this.lastQuery = '';
      return of({
        items: [],
        pagination: {
          page: 1,
          perPage,
          totalCount: 0,
          hasNextPage: false,
          hasPreviousPage: false
        },
        source: 'LIVE',
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Digite um termo para pesquisar.',
          retryable: false
        }
      });
    }

    const cacheKey = this.getRepositoryCacheKey(trimmedQuery, effectivePage, perPage);
    const cached = this.repositoryCache.get(cacheKey);
    if (cached) {
      return of(cached);
    }

    const controller = this.createAbortController();

    return from(
      this.graphqlClient.query<SearchRepositoriesData>(
        SEARCH_REPOSITORIES_QUERY,
        {
          input: { query: trimmedQuery, page: effectivePage, perPage, sort: 'BEST_MATCH' }
        },
        { signal: controller?.signal }
      )
    ).pipe(
      map((response) => response.searchRepositories),
      tap((payload) => this.repositoryCache.set(cacheKey, payload)),
      catchError(() =>
        of({
          items: [],
          pagination: {
            page: effectivePage,
            perPage,
            totalCount: 0,
            hasNextPage: false,
            hasPreviousPage: effectivePage > 1
          },
          source: 'LIVE' as const,
          error: {
            code: 'REQUEST_FAILED',
            message: 'Nao foi possivel carregar os dados. Tente novamente.',
            retryable: true
          }
        })
      )
    );
  }

  createSearchStream(queryInput$: Subject<string>): Observable<SearchRepositoriesPayload> {
    return queryInput$.pipe(
      map((value) => value.trim()),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query) => this.search(query, 1, 10))
    );
  }

  createPaginatedSearchStream(request$: Subject<SearchRequest>): Observable<SearchRepositoriesPayload> {
    return request$.pipe(
      switchMap((request) => this.search(request.query, request.page, request.perPage))
    );
  }

  searchIssues(owner: string, repository: string, page = 1, perPage = 10): Observable<SearchRepositoryIssuesPayload> {
    const ownerTrimmed = owner.trim();
    const repositoryTrimmed = repository.trim();
    if (ownerTrimmed.length === 0 || repositoryTrimmed.length === 0) {
      return of({
        items: [],
        pagination: {
          page: 1,
          perPage,
          totalCount: 0,
          hasNextPage: false,
          hasPreviousPage: false
        },
        source: 'LIVE',
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Informe owner/repository no formato owner/repo.',
          retryable: false
        }
      });
    }

    return from(
      this.graphqlClient.query<SearchRepositoryIssuesData>(SEARCH_REPOSITORY_ISSUES_QUERY, {
        input: {
          owner: ownerTrimmed,
          repository: repositoryTrimmed,
          page,
          perPage
        }
      })
    ).pipe(
      map((response) => response.searchRepositoryIssues),
      catchError(() =>
        of({
          items: [],
          pagination: {
            page,
            perPage,
            totalCount: 0,
            hasNextPage: false,
            hasPreviousPage: page > 1
          },
          source: 'LIVE' as const,
          error: {
            code: 'REQUEST_FAILED',
            message: 'Nao foi possivel carregar as issues. Tente novamente.',
            retryable: true
          }
        })
      )
    );
  }

  searchGithub(type: GithubSearchType, query: string, page = 1, perPage = 10): Observable<SearchGithubPayload> {
    let trimmedQuery = query.trim();
    let repositoryId: number | undefined;
    if (type === 'LABELS') {
      const repositoryIdPattern = /repoId:(\d+)/i;
      const match = repositoryIdPattern.exec(trimmedQuery);
      if (match?.[1]) {
        repositoryId = Number(match[1]);
        trimmedQuery = trimmedQuery.replace(match[0], '').trim();
      }
    }
    if (trimmedQuery.length === 0) {
      return of({
        items: [],
        pagination: {
          page: 1,
          perPage,
          totalCount: 0,
          hasNextPage: false,
          hasPreviousPage: false
        },
        source: 'LIVE',
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Digite um termo para pesquisar.',
          retryable: false
        }
      });
    }

    const cacheKey = this.getGithubCacheKey(type, trimmedQuery, page, perPage, repositoryId);
    const cached = this.githubCache.get(cacheKey);
    if (cached) {
      return of(cached);
    }

    const controller = this.createAbortController();

    return from(this.querySearchGithub(type, trimmedQuery, page, perPage, repositoryId, controller?.signal)).pipe(
      catchError((error) => {
        const message = error instanceof Error ? error.message : '';
        const unsupportedSchema = message.includes('Unknown type "SearchGithubInput"')
          || message.includes('Cannot query field "searchGithub"');

        if (unsupportedSchema && type === 'REPOSITORIES') {
          return this.search(trimmedQuery, page, perPage).pipe(
            map((payload) => ({
              items: payload.items.map((repo) => ({
                id: repo.id,
                title: repo.name,
                url: repo.url,
                subtitle: repo.ownerLogin,
                description: repo.description,
                state: null,
                author: repo.ownerLogin,
                repository: repo.name,
                createdAt: null
              })),
              pagination: payload.pagination,
              source: payload.source,
              error: payload.error
            }))
          );
        }

        return of({
          items: [],
          pagination: {
            page,
            perPage,
            totalCount: 0,
            hasNextPage: false,
            hasPreviousPage: page > 1
          },
          source: 'LIVE' as const,
          error: {
            code: 'REQUEST_FAILED',
            message: 'Nao foi possivel carregar os dados. Tente novamente.',
            retryable: true
          }
        });
      })
    );
  }

  private async querySearchGithub(
    type: GithubSearchType,
    query: string,
    page: number,
    perPage: number,
    repositoryId?: number,
    signal?: AbortSignal
  ): Promise<SearchGithubPayload> {
    const response = await this.graphqlClient.query<SearchGithubData>(
      SEARCH_GITHUB_QUERY,
      {
        input: {
          type,
          query,
          page,
          perPage,
          repositoryId
        }
      },
      { signal }
    );
    const payload = response.searchGithub;
    const cacheKey = this.getGithubCacheKey(type, query, page, perPage, repositoryId);
    this.githubCache.set(cacheKey, payload);
    return payload;
  }

  prefetchRepositories(query: string, page: number, perPage: number) {
    const trimmedQuery = query.trim();
    if (!trimmedQuery || page < 1) {
      return;
    }
    const cacheKey = this.getRepositoryCacheKey(trimmedQuery, page, perPage);
    if (this.repositoryCache.has(cacheKey)) {
      return;
    }
    from(
      this.graphqlClient.query<SearchRepositoriesData>(SEARCH_REPOSITORIES_QUERY, {
        input: { query: trimmedQuery, page, perPage, sort: 'BEST_MATCH' }
      })
    )
      .pipe(
        map((response) => response.searchRepositories),
        tap((payload) => this.repositoryCache.set(cacheKey, payload))
      )
      .subscribe();
  }

  prefetchGithub(type: GithubSearchType, query: string, page: number, perPage: number, repositoryId?: number) {
    const trimmedQuery = query.trim();
    if (!trimmedQuery || page < 1) {
      return;
    }
    const cacheKey = this.getGithubCacheKey(type, trimmedQuery, page, perPage, repositoryId);
    if (this.githubCache.has(cacheKey)) {
      return;
    }
    from(this.querySearchGithub(type, trimmedQuery, page, perPage, repositoryId)).subscribe();
  }

  private createAbortController(): AbortController | null {
    if (typeof AbortController === 'undefined') {
      return null;
    }
    if (this.activeController) {
      this.activeController.abort();
    }
    this.activeController = new AbortController();
    return this.activeController;
  }

  private getRepositoryCacheKey(query: string, page: number, perPage: number) {
    return `repositories:${query}:${page}:${perPage}:BEST_MATCH`;
  }

  private getGithubCacheKey(
    type: GithubSearchType,
    query: string,
    page: number,
    perPage: number,
    repositoryId?: number
  ) {
    return `github:${type}:${query}:${page}:${perPage}:${repositoryId ?? 'none'}`;
  }
}
