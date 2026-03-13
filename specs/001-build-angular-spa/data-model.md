# Data Model - 001-build-angular-spa

## 1. SearchQuery

Represents user search input and pagination/sort parameters consumed by backend.

### Fields
- `query: string` - repository search text.
- `page: number` - 1-based page index.
- `perPage: number` - items per page.
- `sort: string` - current sorting mode (`best-match` for MVP default).

### Validation Rules
- `query` MUST be non-empty after trim.
- `page` MUST be integer >= 1.
- `perPage` MUST be integer between 1 and 50.
- `sort` MUST be from allowed enum values.

## 2. RepositorySummary

Normalized repository projection returned to frontend.

### Fields
- `id: string`
- `name: string`
- `url: string`
- `description: string | null`
- `watchersCount: number`
- `starsCount: number`
- `openIssuesCount: number`
- `ownerLogin: string`

### Mapping Notes
- Data is mapped from GitHub Search API result item.
- Missing `description` remains `null`; frontend handles fallback text.
- Numeric counters are normalized to integer values.

## 3. PaginationMetadata

Provides pagination context for UI navigation.

### Fields
- `page: number` - current page (1-based).
- `perPage: number` - active page size.
- `hasNextPage: boolean`
- `hasPreviousPage: boolean`
- `totalCount: number` - total result count when available from upstream.

### Derivation Rules
- `hasPreviousPage = page > 1`
- `hasNextPage` derived from page window and `totalCount` (or conservative fallback when upstream total is unavailable).

## 4. SearchRepositoriesResult

Top-level successful payload returned by GraphQL query.

### Fields
- `items: RepositorySummary[]`
- `pagination: PaginationMetadata`
- `source: string` - `live` or `cache` for observability in degraded mode.

## 5. ApiError

Standardized, user-safe error contract.

### Fields
- `code: string` - stable app-level code (`VALIDATION_ERROR`, `RATE_LIMIT`, `UPSTREAM_ERROR`, `TIMEOUT`, `UNKNOWN`).
- `message: string` - user-safe message.
- `retryable: boolean`
- `details?: string` - optional sanitized hint, never stack trace or secrets.

### Error Mapping
- Upstream 403 rate-limit -> `RATE_LIMIT`, retryable depends on fallback availability.
- Timeout -> `TIMEOUT`, retryable true.
- Validation failures -> `VALIDATION_ERROR`, retryable false until input changes.
- Generic upstream failures -> `UPSTREAM_ERROR`.

## 6. CacheEntry (Infrastructure)

Internal cache record used by backend cache module.

### Fields
- `key: string` - `query+page+perPage+sort`
- `payload: SearchRepositoriesResult`
- `expiresAt: number` - epoch milliseconds

### Rules
- TTL fixed at 60 seconds for MVP.
- On rate-limit, resolver attempts cached response by same key before returning error.
