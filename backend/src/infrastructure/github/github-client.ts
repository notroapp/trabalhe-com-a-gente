import axios, { AxiosError } from 'axios';
import { classifyUpstreamError } from '../../shared/errors/error-mapper.js';
import type { GithubSearchTypeValue } from '../../shared/validation/github-search-input.validator.js';

export interface GithubSearchResponseItem {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  watchers_count: number;
  stargazers_count: number;
  open_issues_count: number;
  owner: { login: string };
}

export interface GithubSearchResponse {
  total_count: number;
  items: GithubSearchResponseItem[];
}

export interface GithubIssueSearchItem {
  id: number;
  html_url: string;
  title: string;
  state: string;
  user: { login: string };
  repository_url: string;
  comments: number;
  created_at: string;
}

export interface GithubIssueSearchResponse {
  total_count: number;
  items: GithubIssueSearchItem[];
}

export interface GithubGenericSearchResponse {
  total_count: number;
  items: Record<string, unknown>[];
}

export class GithubClient {
  private readonly defaultHeaders: Record<string, string>;

  constructor() {
    this.defaultHeaders = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'notro-github-search-app'
    };
    if (process.env.GITHUB_TOKEN) {
      this.defaultHeaders.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
  }

  async searchRepositories(input: { query: string; page: number; perPage: number }) {
    try {
      const response = await axios.get<GithubSearchResponse>('https://api.github.com/search/repositories', {
        params: {
          q: input.query,
          page: input.page,
          per_page: input.perPage
        },
        headers: this.defaultHeaders,
        timeout: 5000
      });

      return response.data;
    } catch (error) {
      throw classifyUpstreamError(error as AxiosError<{ message?: string }>);
    }
  }

  async searchIssues(input: { owner: string; repository: string; page: number; perPage: number }) {
    try {
      const response = await axios.get<GithubIssueSearchResponse>('https://api.github.com/search/issues', {
        params: {
          q: `repo:${input.owner}/${input.repository}`,
          page: input.page,
          per_page: input.perPage
        },
        headers: this.defaultHeaders,
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      throw classifyUpstreamError(error as AxiosError<{ message?: string }>);
    }
  }

  async searchByType(input: {
    type: GithubSearchTypeValue;
    query: string;
    page: number;
    perPage: number;
    repositoryId?: number;
  }): Promise<GithubGenericSearchResponse> {
    const endpoint = this.getEndpointByType(input.type);
    const params: Record<string, string | number> = {
      q: input.query,
      page: input.page,
      per_page: input.perPage
    };
    if (input.type === 'LABELS' && input.repositoryId) {
      params.repository_id = input.repositoryId;
    }

    try {
      const response = await axios.get<GithubGenericSearchResponse>(`https://api.github.com/search/${endpoint}`, {
        params,
        headers: this.defaultHeaders,
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      throw classifyUpstreamError(error as AxiosError<{ message?: string }>);
    }
  }

  private getEndpointByType(type: GithubSearchTypeValue): string {
    switch (type) {
      case 'CODE':
        return 'code';
      case 'COMMITS':
        return 'commits';
      case 'ISSUES_PULL_REQUESTS':
        return 'issues';
      case 'LABELS':
        return 'labels';
      case 'REPOSITORIES':
        return 'repositories';
      case 'TOPICS':
        return 'topics';
      case 'USERS':
        return 'users';
      default:
        return 'repositories';
    }
  }
}
