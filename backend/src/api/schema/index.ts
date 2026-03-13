import { createSchema } from 'graphql-yoga';
import { createSearchRepositoriesResolver } from '../resolvers/search-repositories.resolver.js';
import { createSearchRepositoryIssuesResolver } from '../resolvers/search-repository-issues.resolver.js';
import { createSearchGithubResolver } from '../resolvers/search-github.resolver.js';
import { SearchRepositoriesUseCase } from '../../application/use-cases/search-repositories.use-case.js';
import { SearchRepositoryIssuesUseCase } from '../../application/use-cases/search-repository-issues.use-case.js';
import { SearchGithubUseCase } from '../../application/use-cases/search-github.use-case.js';

const REPOSITORY_SUMMARY_TYPE = `
    type RepositorySummary {
      id: ID!
      name: String!
      url: String!
      description: String
      watchersCount: Int!
      starsCount: Int!
      openIssuesCount: Int!
      ownerLogin: String!
    }
`;

const typeDefs = /* GraphQL */ `
    type Query {
      searchRepositories(input: SearchRepositoriesInput!): SearchRepositoriesPayload!
      searchRepositoryIssues(input: SearchRepositoryIssuesInput!): SearchRepositoryIssuesPayload!
      searchGithub(input: SearchGithubInput!): SearchGithubPayload!
    }

    input SearchRepositoriesInput {
      query: String!
      page: Int = 1
      perPage: Int = 10
      sort: RepositorySort = BEST_MATCH
    }

    input SearchRepositoryIssuesInput {
      owner: String!
      repository: String!
      page: Int = 1
      perPage: Int = 10
    }

    input SearchGithubInput {
      type: GithubSearchType!
      query: String!
      page: Int = 1
      perPage: Int = 10
      repositoryId: Int
    }

    enum RepositorySort {
      BEST_MATCH
    }

    enum GithubSearchType {
      CODE
      COMMITS
      ISSUES_PULL_REQUESTS
      LABELS
      REPOSITORIES
      TOPICS
      USERS
    }

    type SearchRepositoriesPayload {
      items: [RepositorySummary!]!
      pagination: PaginationMetadata!
      source: ResponseSource!
      error: ApiError
    }

    type SearchRepositoryIssuesPayload {
      items: [IssueSummary!]!
      pagination: PaginationMetadata!
      source: ResponseSource!
      error: ApiError
    }

    type SearchGithubPayload {
      items: [GithubSearchItem!]!
      pagination: PaginationMetadata!
      source: ResponseSource!
      error: ApiError
    }

    enum ResponseSource {
      LIVE
      CACHE
    }

${REPOSITORY_SUMMARY_TYPE}

    type IssueSummary {
      id: ID!
      title: String!
      url: String!
      state: String!
      authorLogin: String!
      repositoryFullName: String!
      commentsCount: Int!
      createdAt: String!
    }

    type GithubSearchItem {
      id: ID!
      title: String!
      url: String!
      subtitle: String
      description: String
      state: String
      author: String
      repository: String
      createdAt: String
    }

    type PaginationMetadata {
      page: Int!
      perPage: Int!
      totalCount: Int!
      hasNextPage: Boolean!
      hasPreviousPage: Boolean!
    }

    type ApiError {
      code: String!
      message: String!
      retryable: Boolean!
      details: String
    }
  `;

export function createAppSchema(
  repositoriesUseCase = new SearchRepositoriesUseCase(),
  repositoryIssuesUseCase = new SearchRepositoryIssuesUseCase(),
  githubSearchUseCase = new SearchGithubUseCase()
) {
  return createSchema({
    typeDefs,
    resolvers: {
      Query: {
        searchRepositories: createSearchRepositoriesResolver(repositoriesUseCase),
        searchRepositoryIssues: createSearchRepositoryIssuesResolver(repositoryIssuesUseCase),
        searchGithub: createSearchGithubResolver(githubSearchUseCase)
      }
    }
  });
}
