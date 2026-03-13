import { SearchGithubUseCase } from '../../application/use-cases/search-github.use-case.js';
import { mapUnknownError } from '../../shared/errors/app-error.js';
import { toApiError } from '../../shared/errors/error-mapper.js';

interface SearchGithubResolverArgs {
  input: {
    type?: 'CODE' | 'COMMITS' | 'ISSUES_PULL_REQUESTS' | 'LABELS' | 'REPOSITORIES' | 'TOPICS' | 'USERS';
    query?: string;
    page?: number;
    perPage?: number;
    repositoryId?: number;
  };
}

export function createSearchGithubResolver(useCase = new SearchGithubUseCase()) {
  return async (_: unknown, args: SearchGithubResolverArgs) => {
    try {
      return await useCase.execute(args.input);
    } catch (error) {
      const mappedError = mapUnknownError(error);
      const page = args.input?.page ?? 1;
      const perPage = args.input?.perPage ?? 10;
      return {
        items: [],
        pagination: {
          page,
          perPage,
          totalCount: 0,
          hasNextPage: false,
          hasPreviousPage: page > 1
        },
        source: 'LIVE',
        error: toApiError(mappedError)
      };
    }
  };
}
