# Research - 001-build-angular-spa

## Decision 1: Backend interface style

- **Decision**: Use GraphQL (GraphQL Yoga) as the backend contract consumed by frontend.
- **Rationale**: The challenge explicitly values GraphQL experience; GraphQL provides explicit schema contracts and allows frontend to request only required fields.
- **Alternatives considered**:
  - REST with Express: simpler baseline, but less expressive for typed contract evolution in this challenge context.
  - NestJS GraphQL: robust option, but adds framework overhead for MVP scope.

## Decision 2: Upstream integration boundary

- **Decision**: Introduce a dedicated GitHub gateway + mapper layer in backend.
- **Rationale**: Keeps frontend decoupled from GitHub payload shape and centralizes mapping/validation/error translation.
- **Alternatives considered**:
  - Direct resolver-to-GitHub calls with inline mapping: rejected due to lower testability and higher coupling.

## Decision 3: Pagination semantics

- **Decision**: Internal contract uses 1-based `page`, default `perPage = 10`, max `perPage = 50`.
- **Rationale**: Matches clarified spec and keeps pagination predictable.
- **Alternatives considered**:
  - 0-based pagination: rejected to avoid confusion with clarified requirements.
  - Larger default page size: rejected due to potential UX/performance cost.

## Decision 4: Search behavior

- **Decision**: Empty query is blocked with validation; default ordering uses GitHub best match.
- **Rationale**: Avoids meaningless upstream calls and keeps behavior aligned with search intent.
- **Alternatives considered**:
  - Show default/trending list on empty query: rejected because it changes product intent and acceptance scope.
  - Force `stars desc` as default: rejected because clarified preference is best match.

## Decision 5: Caching and rate-limit handling

- **Decision**: In-memory cache with TTL 60s keyed by `query+page+perPage+sort`, plus fallback to cached response on rate-limit when available.
- **Rationale**: Improves resilience and reduces repeated external requests without introducing external infrastructure.
- **Alternatives considered**:
  - No cache: rejected due to increased chance of API throttling and poorer resilience.
  - Redis cache: deferred as unnecessary complexity for MVP.

## Decision 6: Frontend async orchestration

- **Decision**: Use RxJS with `debounceTime(400)` and cancellation (`switchMap`) to prevent stale response race.
- **Rationale**: Improves UX responsiveness and consistency under rapid input changes.
- **Alternatives considered**:
  - Trigger requests only on submit button click: rejected for less fluid user experience.

## Decision 7: Test strategy

- **Decision**: Enforce layered tests:
  - Frontend unit tests for services/components and integration tests for search flow.
  - Backend unit tests for mappers/use cases and integration tests for GraphQL query/resolver behavior.
- **Rationale**: Matches constitution non-negotiable test discipline and challenge evaluation criteria.
- **Alternatives considered**:
  - Unit tests only: rejected as insufficient for contract and error-path validation.

## Decision 8: UI baseline and DX

- **Decision**: Use Angular Material in MVP and provide Docker Compose for FE+BE local run.
- **Rationale**: Both were selected in clarifications; improves consistency and reviewer setup speed.
- **Alternatives considered**:
  - Custom CSS-only components: rejected for slower iteration in challenge context.
  - No containers: rejected due to weaker reproducibility.
