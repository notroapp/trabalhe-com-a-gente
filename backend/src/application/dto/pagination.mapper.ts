import type { PaginationMetadata } from '../../domain/entities/search.js';

export function toPaginationMetadata(totalCount: number, page: number, perPage: number): PaginationMetadata {
  return {
    page,
    perPage,
    totalCount,
    hasPreviousPage: page > 1,
    hasNextPage: page * perPage < totalCount
  };
}
