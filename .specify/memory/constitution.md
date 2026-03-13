# Notro Fullstack Challenge Constitution

## Core Principles

### I. Code Quality and Modularity (MUST)
- Code MUST be readable, typed, and organized by clear module boundaries.
- Frontend and backend MUST enforce separation of concerns (presentation, application, integration/infrastructure).
- SOLID principles MUST guide design choices; composition SHOULD be preferred over inheritance.
- Design patterns MUST be used only when they reduce complexity and improve maintainability.
- Any non-trivial abstraction MUST include rationale in planning artifacts.

### II. Contract-First Boundaries (MUST)
- Frontend MUST consume only backend contracts and MUST NOT depend on raw external API response shapes.
- Backend MUST normalize data from GitHub API before returning it to frontend.
- API contracts (GraphQL schema, inputs, outputs, errors) MUST be explicit and version-aware.
- Contract changes MUST trigger integration/contract test updates.

### III. Test Discipline (NON-NEGOTIABLE)
- Every behavior change MUST include automated tests aligned with the test pyramid.
- Unit tests MUST cover business logic and mapping rules.
- Integration tests MUST cover external boundaries (GraphQL resolvers, GitHub integration, error mapping).
- Critical flows (search, pagination, error handling, retry paths) MUST be tested.
- Bug fixes MUST include a regression test that fails before fix and passes after fix.

### IV. UX, Accessibility, and Consistency (MUST)
- UI MUST expose loading, empty, success, and error states for data flows.
- Search and pagination interactions MUST be deterministic and understandable.
- Semantic HTML and keyboard accessibility baseline MUST be respected.
- Visual and interaction consistency MUST be maintained across screens/components.
- Error messages shown to users MUST be clear and actionable.

### V. Performance, Reliability, and Security (MUST)
- Pagination MUST be server-side and explicit (`page`, `perPage`, metadata).
- Frontend async calls MUST use cancellation/debounce patterns to prevent stale updates.
- Backend MUST implement resilient upstream handling (timeouts, retry/backoff policy, rate limit strategy).
- Input validation MUST exist on all public API entries.
- Error handling MUST be centralized and MUST NOT leak secrets or stack traces.
- Secrets and tokens MUST be configured via environment variables, never hardcoded.

## Engineering Standards

### Architecture and Stack Constraints
- Frontend MUST be Angular 18+ SPA.
- Backend MUST be Node.js with GraphQL endpoint(s) for frontend consumption.
- Repository layout MUST keep frontend/backend concerns clearly separated.
- Optional cache MAY be used, but TTL/invalidation behavior MUST be documented.

### Observability and Operability
- Backend logs MUST be structured for request tracing and error diagnosis.
- Failure modes (network, provider errors, rate limits) MUST be observable in logs.
- Local development SHOULD support containerized execution (Docker Compose) when feasible.

## Delivery and Quality Gates

- README MUST include:
  - setup prerequisites;
  - run instructions for frontend and backend;
  - test execution instructions.
- Pull requests MUST explain key technical decisions:
  - tools/libraries selected;
  - tradeoffs between chosen and rejected alternatives;
  - engineering principles applied;
  - known limitations and next improvements.
- Lint/test checks MUST pass before merge.

## Governance

- This constitution supersedes ad-hoc implementation preferences.
- Any exception MUST be documented with:
  - reason;
  - impacted scope;
  - expiration/review plan.
- During planning, complexity MUST be justified; simpler alternatives MUST be considered first.
- Compliance MUST be checked at least at these phases: `specify`, `plan`, `tasks`, and PR review.

**Version**: 1.0.0 | **Ratified**: 2026-03-13 | **Last Amended**: 2026-03-13
