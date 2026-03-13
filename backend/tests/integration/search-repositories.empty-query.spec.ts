import { describe, expect, it } from 'vitest';
import { createSearchRepositoriesResolver } from '../../src/api/resolvers/search-repositories.resolver.js';

describe('searchRepositories empty query validation', () => {
  it('returns validation error payload for empty query', async () => {
    const resolver = createSearchRepositoriesResolver();
    const result = await resolver({}, { input: { query: '   ', page: 1, perPage: 10 } } as never);

    expect(result.items).toHaveLength(0);
    expect(result.error).not.toBeNull();
    expect(result.error?.code).toBe('VALIDATION_ERROR');
  });
});
