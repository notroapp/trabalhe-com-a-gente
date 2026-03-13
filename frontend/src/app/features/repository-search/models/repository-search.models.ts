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

export interface SearchRepositoriesPayload {
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

export interface SearchRepositoryIssuesPayload {
  items: IssueSummary[];
  pagination: PaginationMetadata;
  source: 'LIVE' | 'CACHE';
  error: ApiErrorPayload | null;
}

export type GithubSearchType =
  | 'CODE'
  | 'COMMITS'
  | 'ISSUES_PULL_REQUESTS'
  | 'LABELS'
  | 'REPOSITORIES'
  | 'TOPICS'
  | 'USERS';

export interface GithubSearchItem {
  id: string;
  title: string;
  url: string;
  subtitle: string | null;
  description: string | null;
  state: string | null;
  author: string | null;
  repository: string | null;
  createdAt: string | null;
}

export interface SearchGithubPayload {
  items: GithubSearchItem[];
  pagination: PaginationMetadata;
  source: 'LIVE' | 'CACHE';
  error: ApiErrorPayload | null;
}

export interface SearchViewState {
  items: RepositorySummary[];
  loading: boolean;
  error: string | null;
  empty: boolean;
}
