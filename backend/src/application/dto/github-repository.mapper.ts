import type { GithubSearchResponseItem } from '../../infrastructure/github/github-client.js';
import type { RepositorySummary } from '../../domain/entities/search.js';

export function mapGithubRepository(item: GithubSearchResponseItem): RepositorySummary {
  return {
    id: String(item.id),
    name: item.name,
    url: item.html_url,
    description: item.description,
    watchersCount: item.watchers_count,
    starsCount: item.stargazers_count,
    openIssuesCount: item.open_issues_count,
    ownerLogin: item.owner.login
  };
}
