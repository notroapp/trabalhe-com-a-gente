import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import type { PaginationMetadata, RepositorySummary } from '../models/repository-search.models';
import { RepositorySearchService, SearchRequest } from '../services/repository-search.service';

export interface RepositorySearchState {
  items: RepositorySummary[];
  loading: boolean;
  error: string | null;
  empty: boolean;
  query: string;
  pagination: PaginationMetadata;
}

const INITIAL_STATE: RepositorySearchState = {
  items: [],
  loading: false,
  error: null,
  empty: false,
  query: '',
  pagination: {
    page: 1,
    perPage: 10,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false
  }
};

@Injectable({ providedIn: 'root' })
export class RepositorySearchStore {
  private readonly stateSubject = new BehaviorSubject<RepositorySearchState>(INITIAL_STATE);
  readonly state$ = this.stateSubject.asObservable();
  private readonly request$ = new Subject<SearchRequest>();

  constructor(private readonly searchService: RepositorySearchService) {
    this.searchService.createPaginatedSearchStream(this.request$).subscribe((payload) => {
      this.patchState({
        loading: false,
        items: payload.items,
        error: payload.error?.message ?? null,
        empty: !payload.error && payload.items.length === 0,
        pagination: payload.pagination
      });
    });
  }

  get snapshot(): RepositorySearchState {
    return this.stateSubject.value;
  }

  search(query: string) {
    const trimmed = query.trim();
    this.patchState({
      query: trimmed,
      loading: true,
      error: null,
      empty: false,
      pagination: { ...this.snapshot.pagination, page: 1 }
    });
    this.request$.next({ query: trimmed, page: 1, perPage: this.snapshot.pagination.perPage });
  }

  goToPage(page: number) {
    if (!this.snapshot.query || page < 1 || page === this.snapshot.pagination.page) {
      return;
    }
    this.patchState({ loading: true, error: null, empty: false });
    this.request$.next({ query: this.snapshot.query, page, perPage: this.snapshot.pagination.perPage });
  }

  retry() {
    if (!this.snapshot.query) {
      return;
    }
    this.patchState({ loading: true, error: null, empty: false });
    this.request$.next({
      query: this.snapshot.query,
      page: this.snapshot.pagination.page,
      perPage: this.snapshot.pagination.perPage
    });
  }

  private patchState(partial: Partial<RepositorySearchState>) {
    this.stateSubject.next({
      ...this.snapshot,
      ...partial
    });
  }
}
