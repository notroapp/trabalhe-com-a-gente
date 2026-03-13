export type RepositorySort = 'BEST_MATCH';

export interface SearchQuery {
  query: string;
  page: number;
  perPage: number;
  sort: RepositorySort;
}

export interface RepositoryIssuesQuery {
  owner: string;
  repository: string;
  page: number;
  perPage: number;
}

export interface RepositorySummary {
  id: string;
  name: string;
  url: string;
  description: string | null;
  watchersCount: number;
  starsCount: number;
  openIssuesCount: number;
  ownerLogin: string;
}

export interface PaginationMetadata {
  page: number;
  perPage: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  retryable: boolean;
  details?: string;
}

export interface SearchRepositoriesResult {
  items: RepositorySummary[];
  pagination: PaginationMetadata;
  source: 'LIVE' | 'CACHE';
  error: ApiErrorPayload | null;
}

export interface IssueSummary {
  id: string;
  title: string;
  url: string;
  state: string;
  authorLogin: string;
  repositoryFullName: string;
  commentsCount: number;
  createdAt: string;
}

export interface SearchRepositoryIssuesResult {
  items: IssueSummary[];
  pagination: PaginationMetadata;
  source: 'LIVE' | 'CACHE';
  error: ApiErrorPayload | null;
}
