import type { GithubSearchTypeValue } from '../../shared/validation/github-search-input.validator.js';

export interface GenericSearchItem {
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

function asRecord(value: unknown): Record<string, unknown> {
  return (value ?? {}) as Record<string, unknown>;
}

function asString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function asId(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return '';
}

export function mapGithubGenericItem(type: GithubSearchTypeValue, raw: Record<string, unknown>): GenericSearchItem {
  const owner = asRecord(raw.owner);
  const user = asRecord(raw.user);
  const repository = asRecord(raw.repository);
  const base: GenericSearchItem = {
    id: asId(raw.id),
    title: asString(raw.name) ?? asString(raw.title) ?? 'Untitled',
    url: asString(raw.html_url) ?? asString(raw.url) ?? '',
    subtitle: null,
    description: asString(raw.description),
    state: null,
    author: asString(owner.login) ?? asString(user.login),
    repository: asString(repository.full_name),
    createdAt: asString(raw.created_at)
  };

  switch (type) {
    case 'CODE':
      return {
        ...base,
        title: asString(raw.name) ?? 'Code result',
        subtitle: asString(repository.full_name)
      };
    case 'COMMITS':
      return {
        ...base,
        title: asString(asRecord(raw.commit).message) ?? 'Commit',
        subtitle: asString(repository.full_name),
        author: asString(asRecord(asRecord(raw.commit).author).name) ?? base.author
      };
    case 'ISSUES_PULL_REQUESTS':
      return {
        ...base,
        title: asString(raw.title) ?? 'Issue/Pull request',
        state: asString(raw.state),
        repository: asString(raw.repository_url)
      };
    case 'LABELS':
      return {
        ...base,
        title: asString(raw.name) ?? 'Label',
        description: asString(raw.description),
        subtitle: asString(raw.color)
      };
    case 'REPOSITORIES':
      return {
        ...base,
        title: asString(raw.full_name) ?? asString(raw.name) ?? 'Repository',
        subtitle: asString(owner.login)
      };
    case 'TOPICS':
      return {
        ...base,
        title: asString(raw.name) ?? 'Topic',
        description: asString(raw.short_description) ?? base.description,
        subtitle: asString(raw.display_name)
      };
    case 'USERS':
      return {
        ...base,
        title: asString(raw.login) ?? 'User',
        subtitle: asString(raw.type)
      };
    default:
      return base;
  }
}
