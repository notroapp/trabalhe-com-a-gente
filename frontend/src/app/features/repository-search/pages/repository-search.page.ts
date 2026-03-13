import { Component, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchFormComponent } from '../components/search-form.component';
import { RepositoryListComponent } from '../components/repository-list.component';
import { GenericSearchListComponent } from '../components/generic-search-list.component';
import { PaginatorComponent } from '../components/paginator.component';
import type {
  GithubSearchItem,
  GithubSearchType,
  PaginationMetadata,
  RepositorySummary,
  SearchGithubPayload,
  SearchRepositoriesPayload
} from '../models/repository-search.models';
import { RepositorySearchService } from '../services/repository-search.service';
import { EMPTY, Observable, Subscription, distinctUntilChanged, map, switchMap, timer } from 'rxjs';

type UiSearchMode = 'code' | 'commits' | 'issues' | 'labels' | 'repositories' | 'topics' | 'users';
type SearchResult =
  | { kind: 'repositories'; payload: SearchRepositoriesPayload }
  | { kind: 'generic'; payload: SearchGithubPayload };

@Component({
  selector: 'app-repository-search-page',
  standalone: true,
  imports: [
    CommonModule,
    SearchFormComponent,
    RepositoryListComponent,
    GenericSearchListComponent,
    PaginatorComponent,
    MatButtonModule
  ],
  template: `
    <main class="github-search-page search-results-page">
      <header class="search-topbar">
        <button type="button" class="search-brand" (click)="goHome()">
          <span class="search-brand-dot"></span>
          <span>notro search</span>
        </button>
        <div class="search-topbar-form">
          <app-search-form
            [initialQuery]="queryText"
            [label]="'Search GitHub'"
            [placeholder]="'Search GitHub'"
            [buttonLabel]="'Search'"
            [loading]="loading"
            (searchSubmit)="onSearch($event)"
          />
        </div>
      </header>

      <header class="github-search-header">
        <h1>{{ selectedModeLabel }}</h1>
        <div class="results-header-meta">
          <p class="hint">{{ pagination.totalCount | number }} results</p>
          @if (source === 'CACHE') {
            <span class="source-badge">Cache</span>
          }
        </div>
      </header>

      <div class="github-search-layout">
        <aside class="github-search-sidebar">
          <h2>Filter by</h2>
          @for (mode of modes; track mode.value) {
            <button
              type="button"
              class="filter-item"
              [class.active]="searchMode === mode.value"
              (click)="onModeChange(mode.value)"
            >
              {{ mode.label }}
              @if (searchMode === mode.value) {
                <span class="filter-count">{{ pagination.totalCount | number }}</span>
              }
            </button>
          }
        </aside>

        <section class="github-search-results">
          @if (searchMode === 'labels') {
            <p class="hint">Para labels, inclua <code>repoId:123456</code> na consulta (ex.: <code>repoId:24195339 bug</code>).</p>
          }
          @if (searchMode === 'code' || searchMode === 'commits') {
            <p class="hint">Dica: esses tipos de busca funcionam melhor com <code>GITHUB_TOKEN</code> configurado no backend.</p>
          }

          @if (searchMode === 'repositories') {
            <app-repository-list
              [items]="items"
              [loading]="loading"
              [error]="error"
              [showEmpty]="showEmpty"
              [query]="queryText"
            />
          } @else {
            <app-generic-search-list
              [items]="genericItems"
              [loading]="loading"
              [error]="error"
              [showEmpty]="showEmpty"
              [query]="queryText"
            />
          }

          @if (!loading && !error && source === 'CACHE') {
            <div class="cache-note" role="status">
              Resultados exibidos do cache devido a rate limit temporario.
            </div>
          }

          @if (error) {
            <button mat-flat-button color="primary" type="button" (click)="onRetry()">Tentar novamente</button>
          }

          <div class="results-meta">
            <span class="results-range">{{ resultsRangeLabel }}</span>
          </div>
          <app-paginator [pagination]="pagination" [disabled]="loading" (pageChange)="onPageChange($event)" />
        </section>

        <aside class="github-search-right-panel">
          <div class="panel-card">
            <h3>Notro Tips</h3>
            <p>Use filtros para refinar rapidamente os resultados e navegue entre tipos sem perder o termo de busca.</p>
          </div>
          <div class="panel-card">
            <h3>Atalhos de query</h3>
            <ul>
              <li><code>language:typescript</code></li>
              <li><code>stars:>1000</code></li>
              <li><code>topic:nodejs</code></li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  `
})
export class RepositorySearchPageComponent implements OnDestroy {
  readonly modes: Array<{ value: UiSearchMode; label: string }> = [
    { value: 'code', label: 'Code' },
    { value: 'commits', label: 'Commits' },
    { value: 'issues', label: 'Issues and Pull Requests' },
    { value: 'labels', label: 'Labels' },
    { value: 'repositories', label: 'Repositories' },
    { value: 'topics', label: 'Topics' },
    { value: 'users', label: 'Users' }
  ];
  searchMode: UiSearchMode = 'repositories';
  queryText = '';
  items: RepositorySummary[] = [];
  genericItems: GithubSearchItem[] = [];
  loading = false;
  error: string | null = null;
  showEmpty = false;
  firstFeedbackMs: number | null = null;
  firstFeedbackWithinBudget: boolean | null = null;
  pagination: PaginationMetadata = {
    page: 1,
    perPage: 10,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false
  };
  source: 'LIVE' | 'CACHE' | null = null;
  errorCode: string | null = null;
  private searchStartMs: number | null = null;
  private readonly nowMs = () => (typeof performance === 'undefined' ? Date.now() : performance.now());
  private readonly routeSubscription: Subscription;
  private lastQueryText = '';
  private retrySubscription: Subscription | null = null;

  get selectedModeLabel(): string {
    return this.modes.find((mode) => mode.value === this.searchMode)?.label ?? 'Repositories';
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly searchService: RepositorySearchService
  ) {
    this.routeSubscription = this.route.queryParamMap
      .pipe(
        map((params) => {
          const q = params.get('q')?.trim() ?? '';
          const page = Number(params.get('page') ?? '1');
          const type = this.toUiMode(params.get('type'));
          return {
            q,
            page: Number.isFinite(page) && page > 0 ? page : 1,
            type
          };
        }),
        distinctUntilChanged((prev, curr) => prev.q === curr.q && prev.page === curr.page && prev.type === curr.type),
        switchMap(({ q, page, type }) => {
          this.queryText = q;
          this.searchMode = type;
          this.pagination = {
            ...this.pagination,
            page
          };

          if (q.length === 0) {
            this.resetResults();
            return EMPTY;
          }

          const shouldDebounce = q !== this.lastQueryText;
          this.lastQueryText = q;
          const delayMs = shouldDebounce ? 400 : 0;

          return timer(delayMs).pipe(switchMap(() => this.executeSearch$(q, page)));
        })
      )
      .subscribe((result) => {
        this.loading = false;
        if (result.kind === 'repositories') {
          this.items = result.payload.items;
          this.genericItems = [];
        } else {
          this.items = [];
          this.genericItems = result.payload.items;
        }
        this.error = result.payload.error?.message ?? null;
        this.errorCode = result.payload.error?.code ?? null;
        this.showEmpty = !result.payload.error && result.payload.items.length === 0;
        this.pagination = result.payload.pagination;
        this.source = result.payload.source;
        this.finishSearchFeedback();
        this.prefetchNextPage();
      });
  }

  onSearch(query: string) {
    this.router.navigate(['/search'], {
      queryParams: {
        q: query,
        type: this.searchMode,
        page: 1
      }
    });
  }

  onPageChange(page: number) {
    this.router.navigate(['/search'], {
      queryParams: {
        q: this.queryText,
        type: this.searchMode,
        page
      }
    });
  }

  onRetry() {
    if (this.retrySubscription) {
      this.retrySubscription.unsubscribe();
    }
    this.retrySubscription = this.executeSearch$(this.queryText, this.pagination.page).subscribe((result: SearchResult) => {
      this.loading = false;
      if (result.kind === 'repositories') {
        this.items = result.payload.items;
        this.genericItems = [];
      } else {
        this.items = [];
        this.genericItems = result.payload.items;
      }
      this.error = result.payload.error?.message ?? null;
      this.errorCode = result.payload.error?.code ?? null;
      this.showEmpty = !result.payload.error && result.payload.items.length === 0;
      this.pagination = result.payload.pagination;
      this.source = result.payload.source;
      this.finishSearchFeedback();
      this.prefetchNextPage();
    });
  }

  onModeChange(mode: UiSearchMode) {
    this.router.navigate(['/search'], {
      queryParams: {
        q: this.queryText,
        type: mode,
        page: 1
      }
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }

  private executeSearch$(rawQuery: string, page: number): Observable<SearchResult> {
    this.searchStartMs = this.nowMs();
    this.firstFeedbackMs = null;
    this.firstFeedbackWithinBudget = null;
    this.loading = true;
    this.error = null;
    this.errorCode = null;
    this.source = null;
    this.showEmpty = false;
    if (this.searchMode === 'repositories') {
      return this.searchService
        .search(rawQuery, page, this.pagination.perPage)
        .pipe(map((payload) => ({ kind: 'repositories' as const, payload })));
    }
    const type = this.toGithubSearchType(this.searchMode);
    return this.searchService
      .searchGithub(type, rawQuery, page, this.pagination.perPage)
      .pipe(map((payload) => ({ kind: 'generic' as const, payload })));
  }

  private resetResults() {
    this.lastQueryText = '';
    this.items = [];
    this.genericItems = [];
    this.loading = false;
    this.error = null;
    this.errorCode = null;
    this.source = null;
    this.showEmpty = false;
    this.pagination = {
      ...this.pagination,
      totalCount: 0,
      hasNextPage: false,
      hasPreviousPage: false
    };
  }

  private finishSearchFeedback() {
    if (this.searchStartMs !== null) {
      const now = this.nowMs();
      this.firstFeedbackMs = Math.round(now - this.searchStartMs);
      this.firstFeedbackWithinBudget = this.firstFeedbackMs <= 1000;
      this.searchStartMs = null;
    }
  }

  private prefetchNextPage() {
    if (this.loading || this.error || !this.queryText) {
      return;
    }
    if (!this.pagination.hasNextPage) {
      return;
    }
    const nextPage = this.pagination.page + 1;
    if (this.searchMode === 'repositories') {
      this.searchService.prefetchRepositories(this.queryText, nextPage, this.pagination.perPage);
      return;
    }
    const type = this.toGithubSearchType(this.searchMode);
    this.searchService.prefetchGithub(type, this.queryText, nextPage, this.pagination.perPage);
  }

  get resultsRangeLabel(): string {
    if (!this.pagination.totalCount) {
      return 'Mostrando 0 de 0';
    }
    const start = (this.pagination.page - 1) * this.pagination.perPage + 1;
    const end = Math.min(this.pagination.page * this.pagination.perPage, this.pagination.totalCount);
    return `Mostrando ${start}-${end} de ${this.pagination.totalCount}`;
  }

  private toGithubSearchType(mode: UiSearchMode): GithubSearchType {
    switch (mode) {
      case 'code':
        return 'CODE';
      case 'commits':
        return 'COMMITS';
      case 'issues':
        return 'ISSUES_PULL_REQUESTS';
      case 'labels':
        return 'LABELS';
      case 'topics':
        return 'TOPICS';
      case 'users':
        return 'USERS';
      case 'repositories':
      default:
        return 'REPOSITORIES';
    }
  }

  private toUiMode(value: string | null): UiSearchMode {
    switch (value) {
      case 'code':
      case 'commits':
      case 'issues':
      case 'labels':
      case 'repositories':
      case 'topics':
      case 'users':
        return value;
      default:
        return 'repositories';
    }
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.retrySubscription?.unsubscribe();
  }
}
