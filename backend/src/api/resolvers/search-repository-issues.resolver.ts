import { SearchRepositoryIssuesUseCase } from '../../application/use-cases/search-repository-issues.use-case.js';
import { mapUnknownError } from '../../shared/errors/app-error.js';
import { toApiError } from '../../shared/errors/error-mapper.js';

interface SearchRepositoryIssuesResolverArgs {
  input: {
    owner?: string;
    repository?: string;
    page?: number;
    perPage?: number;
  };
}

export function createSearchRepositoryIssuesResolver(useCase = new SearchRepositoryIssuesUseCase()) {
  return async (_: unknown, args: SearchRepositoryIssuesResolverArgs) => {
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
