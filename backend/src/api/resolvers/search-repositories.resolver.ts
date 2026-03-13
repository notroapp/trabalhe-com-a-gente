import { SearchRepositoriesUseCase } from '../../application/use-cases/search-repositories.use-case.js';
import { mapUnknownError } from '../../shared/errors/app-error.js';
import { toApiError } from '../../shared/errors/error-mapper.js';

interface SearchRepositoriesResolverArgs {
  input: {
    query?: string;
    page?: number;
    perPage?: number;
    sort?: 'BEST_MATCH';
  };
}

export function createSearchRepositoriesResolver(useCase = new SearchRepositoriesUseCase()) {
  return async (_: unknown, args: SearchRepositoriesResolverArgs) => {
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
