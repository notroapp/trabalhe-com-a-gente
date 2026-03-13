import type { IssueSummary } from '../../domain/entities/search.js';
import type { GithubIssueSearchItem } from '../../infrastructure/github/github-client.js';

function extractRepositoryFullName(repositoryUrl: string): string {
  const parts = repositoryUrl.split('/');
  const owner = parts.at(-2) ?? '';
  const repository = parts.at(-1) ?? '';
  return `${owner}/${repository}`;
}

export function mapGithubIssue(item: GithubIssueSearchItem): IssueSummary {
  return {
    id: String(item.id),
    title: item.title,
    url: item.html_url,
    state: item.state,
    authorLogin: item.user.login,
    repositoryFullName: extractRepositoryFullName(item.repository_url),
    commentsCount: item.comments,
    createdAt: item.created_at
  };
}
