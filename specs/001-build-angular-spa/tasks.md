# Tasks: GitHub Repository Search SPA

**Input**: Design documents from `/specs/001-build-angular-spa/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/graphql-schema.graphql`, `quickstart.md`

**Tests**: Included (explicitly requested in spec: `FR-011`, `FR-021`).  
**Organization**: Tasks grouped by user story for independent implementation and validation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no blocking dependency)
- **[Story]**: User story label (`[US1]` ... `[US5]`)
- All tasks include explicit file paths

## Path Conventions

- Backend: `backend/src/`, `backend/tests/`
- Frontend: `frontend/src/`, `frontend/tests/`
- Infra: repository root (`docker-compose.yml`, `.env.example`, `README.md`)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize project structure and shared tooling.

- [X] T001 Create backend and frontend base folders per plan in `backend/` and `frontend/`
- [X] T002 Initialize backend Node.js TypeScript project in `backend/package.json`
- [X] T003 Initialize Angular 18+ frontend project in `frontend/package.json`
- [X] T004 [P] Configure backend TypeScript build settings in `backend/tsconfig.json`
- [X] T005 [P] Configure frontend TypeScript settings in `frontend/tsconfig.json`
- [X] T006 [P] Configure backend lint/format scripts in `backend/eslint.config.js` and `backend/.prettierrc`
- [X] T007 [P] Configure frontend lint/format scripts in `frontend/eslint.config.js` and `frontend/.prettierrc`
- [X] T008 [P] Create shared environment example in `.env.example`
- [X] T064 [P] Configure Angular Material setup and base theme in `frontend/src/styles.scss` and `frontend/src/app/app.config.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core architecture and cross-cutting foundations required by all stories.

**CRITICAL**: No user story task starts before this phase is complete.

- [X] T009 Implement backend app bootstrap and server wiring in `backend/src/main.ts`
- [X] T010 Create GraphQL server setup and schema loader in `backend/src/api/schema/index.ts`
- [X] T011 Implement centralized error types and mapper in `backend/src/shared/errors/app-error.ts`
- [X] T012 [P] Implement backend input validation helpers in `backend/src/shared/validation/search-input.validator.ts`
- [X] T013 [P] Implement backend structured logger foundation in `backend/src/infrastructure/logging/logger.ts`
- [X] T014 Implement GitHub HTTP client with timeout handling in `backend/src/infrastructure/github/github-client.ts`
- [X] T015 [P] Implement in-memory cache provider with TTL in `backend/src/infrastructure/cache/memory-cache.ts`
- [X] T016 [P] Create backend test runner config in `backend/vitest.config.ts`
- [X] T017 [P] Create frontend test runner config in `frontend/vitest.config.ts`
- [X] T018 Create frontend core API gateway base in `frontend/src/app/core/api/graphql-client.service.ts`
- [X] T019 Create repository-search feature shell module/route in `frontend/src/app/features/repository-search/repository-search.routes.ts`

**Checkpoint**: Foundation ready for independent user story delivery.

---

## Phase 3: User Story 1 - Search repositories by name (Priority: P1) 🎯 MVP

**Goal**: Execute repository search with valid query and show results.

**Independent Test**: Submit valid query and receive rendered results with required fields.

### Tests for User Story 1

- [X] T020 [P] [US1] Add backend integration test for `searchRepositories` success path in `backend/tests/integration/search-repositories.success.spec.ts`
- [X] T021 [P] [US1] Add frontend integration test for search submit flow in `frontend/tests/integration/repository-search.submit.spec.ts`
- [X] T022 [P] [US1] Add frontend unit test for search service mapping in `frontend/tests/unit/repository-search.service.spec.ts`
- [X] T065 [P] [US1] Add backend integration test for empty query validation in `backend/tests/integration/search-repositories.empty-query.spec.ts`
- [X] T068 [P] [US1] Add frontend unit test for `debounceTime(400)` and stale-request cancellation in `frontend/tests/unit/repository-search.rx-flow.spec.ts`

### Implementation for User Story 1

- [X] T023 [P] [US1] Implement `SearchQuery` and `RepositorySummary` domain models in `backend/src/domain/entities/search.ts`
- [X] T024 [P] [US1] Implement GitHub-to-domain mapper in `backend/src/application/dto/github-repository.mapper.ts`
- [X] T025 [US1] Implement search use case in `backend/src/application/use-cases/search-repositories.use-case.ts`
- [X] T026 [US1] Implement GraphQL resolver for repository search in `backend/src/api/resolvers/search-repositories.resolver.ts`
- [X] T027 [P] [US1] Implement frontend repository search models in `frontend/src/app/features/repository-search/models/repository-search.models.ts`
- [X] T028 [US1] Implement frontend repository search service in `frontend/src/app/features/repository-search/services/repository-search.service.ts`
- [X] T029 [US1] Implement search page container in `frontend/src/app/features/repository-search/pages/repository-search.page.ts`
- [X] T030 [US1] Implement search form + result list components in `frontend/src/app/features/repository-search/components/search-form.component.ts` and `frontend/src/app/features/repository-search/components/repository-list.component.ts`
- [X] T066 [US1] Block empty query submissions with explicit validation in `frontend/src/app/features/repository-search/components/search-form.component.ts`
- [X] T067 [US1] Enforce `BEST_MATCH` as backend default sort when absent in `backend/src/application/use-cases/search-repositories.use-case.ts`

**Checkpoint**: US1 fully functional as MVP.

---

## Phase 4: User Story 2 - Navigate paginated results (Priority: P1)

**Goal**: Navigate result pages with stable query context and proper metadata.

**Independent Test**: Move between pages while preserving current query and metadata.

### Tests for User Story 2

- [X] T031 [P] [US2] Add backend integration test for pagination contract in `backend/tests/integration/search-repositories.pagination.spec.ts`
- [X] T032 [P] [US2] Add frontend integration test for pagination navigation in `frontend/tests/integration/repository-search.pagination.spec.ts`
- [X] T033 [P] [US2] Add frontend unit test for page reset on new query in `frontend/tests/unit/repository-search.pagination-reset.spec.ts`

### Implementation for User Story 2

- [X] T034 [US2] Enforce 1-based pagination + `perPage` limits in validator `backend/src/shared/validation/search-input.validator.ts`
- [X] T035 [US2] Implement pagination metadata derivation in `backend/src/application/dto/pagination.mapper.ts`
- [X] T036 [US2] Extend resolver payload with pagination metadata in `backend/src/api/resolvers/search-repositories.resolver.ts`
- [X] T037 [US2] Implement frontend pagination state management in `frontend/src/app/features/repository-search/state/repository-search.store.ts`
- [X] T038 [US2] Implement paginator component wiring in `frontend/src/app/features/repository-search/components/paginator.component.ts`
- [X] T039 [US2] Ensure new search resets page to 1 in `frontend/src/app/features/repository-search/services/repository-search.service.ts`

**Checkpoint**: US2 functional independently and integrated with US1.

---

## Phase 5: User Story 3 - Inspect relevant repository information (Priority: P2)

**Goal**: Display all required repository fields consistently.

**Independent Test**: Verify cards render required attributes and handle null description.

### Tests for User Story 3

- [X] T040 [P] [US3] Add backend contract test for required repository fields in `backend/tests/integration/search-repositories.fields.spec.ts`
- [X] T041 [P] [US3] Add frontend component test for repository card rendering in `frontend/tests/unit/repository-card.component.spec.ts`

### Implementation for User Story 3

- [X] T042 [US3] Ensure GraphQL type alignment for repository fields in `backend/src/api/schema/index.ts`
- [X] T043 [US3] Implement repository card component with required fields in `frontend/src/app/features/repository-search/components/repository-card.component.ts`
- [X] T044 [US3] Add null-description fallback rendering in `frontend/src/app/features/repository-search/components/repository-card.component.html`
- [X] T045 [US3] Ensure safe external URL rendering behavior in `frontend/src/app/features/repository-search/components/repository-card.component.ts`

**Checkpoint**: US3 independently testable and complete.

---

## Phase 6: User Story 4 - Handle failure and recovery paths (Priority: P2)

**Goal**: Provide robust error handling including rate-limit fallback behavior.

**Independent Test**: Simulate timeout/upstream/rate-limit and verify user-friendly outcomes.

### Tests for User Story 4

- [X] T046 [P] [US4] Add backend integration test for rate-limit fallback-to-cache in `backend/tests/integration/search-repositories.rate-limit-fallback.spec.ts`
- [X] T047 [P] [US4] Add backend integration test for timeout error mapping in `backend/tests/integration/search-repositories.timeout.spec.ts`
- [X] T048 [P] [US4] Add frontend integration test for error + retry flow in `frontend/tests/integration/repository-search.error-retry.spec.ts`

### Implementation for User Story 4

- [X] T049 [US4] Implement upstream error classification and sanitization in `backend/src/shared/errors/error-mapper.ts`
- [X] T050 [US4] Implement rate-limit cache fallback flow in `backend/src/application/use-cases/search-repositories.use-case.ts`
- [X] T051 [US4] Return user-safe `ApiError` payload in `backend/src/api/resolvers/search-repositories.resolver.ts`
- [X] T052 [US4] Implement frontend error state and retry actions in `frontend/src/app/features/repository-search/pages/repository-search.page.ts`
- [X] T053 [US4] Prevent stale-response overwrite using RxJS cancellation in `frontend/src/app/features/repository-search/services/repository-search.service.ts`

**Checkpoint**: US4 resilient behavior complete and testable.

---

## Phase 7: User Story 5 - Deliver challenge-ready quality package (Priority: P3)

**Goal**: Ensure reviewer can run project and tests from documentation.

**Independent Test**: Fresh setup run based only on docs succeeds.

### Tests for User Story 5

- [X] T054 [P] [US5] Add backend smoke test command and script validation in `backend/package.json`
- [X] T055 [P] [US5] Add frontend smoke test command and script validation in `frontend/package.json`

### Implementation for User Story 5

- [X] T056 [US5] Create Dockerfiles for backend and frontend in `backend/Dockerfile` and `frontend/Dockerfile`
- [X] T057 [US5] Create Docker Compose orchestration in `docker-compose.yml`
- [X] T058 [US5] Consolidate run/test instructions in repository `README.md`
- [X] T059 [US5] Add final quickstart consistency updates in `specs/001-build-angular-spa/quickstart.md`

**Checkpoint**: US5 complete with reproducible reviewer flow.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final quality hardening across all stories.

- [X] T060 [P] Add backend security headers and hardening middleware in `backend/src/main.ts`
- [X] T061 [P] Add frontend accessibility refinements for keyboard navigation in `frontend/src/app/features/repository-search/components/`
- [X] T062 Run full validation from quickstart and capture adjustments in `README.md`
- [X] T063 Perform code cleanup/refactor pass in `backend/src/` and `frontend/src/`
- [X] T069 [P] Add first-feedback performance budget verification (<=1s) in `frontend/tests/integration/repository-search.performance-budget.spec.ts` and timing instrumentation in `frontend/src/app/features/repository-search/pages/repository-search.page.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 (Setup): no dependencies.
- Phase 2 (Foundational): depends on Phase 1; blocks user stories.
- Phases 3-7 (User Stories): depend on Phase 2; execute in priority order or parallel by team capacity.
- Phase 8 (Polish): depends on completion of desired user stories.

### User Story Dependencies

- **US1 (P1)**: starts after Foundational; no dependency on other stories.
- **US2 (P1)**: starts after Foundational; functionally complements US1.
- **US3 (P2)**: starts after Foundational; depends on US1 data flow for rendering.
- **US4 (P2)**: starts after Foundational; integrates with US1/US2 request flow and cache.
- **US5 (P3)**: depends on baseline implementation from US1-US4 for final documentation and orchestration.

### Within Each Story

- Write tests first (where present), ensure failing baseline, then implement.
- Domain/model/mapping before service/use-case.
- Service/use-case before resolver/UI integration.
- Story checkpoint must pass before progressing.

---

## Parallel Opportunities

- Setup tasks: T004-T008 parallelizable.
- Foundational tasks: T012-T017 parallelizable.
- Per-story tests marked `[P]` can run in parallel.
- FE and BE tasks within a story marked `[P]` can run concurrently when file boundaries do not conflict.

---

## Parallel Example: User Story 1

```bash
# Parallel test creation:
T020 backend/tests/integration/search-repositories.success.spec.ts
T021 frontend/tests/integration/repository-search.submit.spec.ts
T022 frontend/tests/unit/repository-search.service.spec.ts

# Parallel model/mapping implementation:
T023 backend/src/domain/entities/search.ts
T024 backend/src/application/dto/github-repository.mapper.ts
T027 frontend/src/app/features/repository-search/models/repository-search.models.ts
```

---

## Implementation Strategy

### MVP First (US1 only)
1. Complete Phase 1 and Phase 2.
2. Deliver Phase 3 (US1).
3. Validate core search flow end-to-end.

### Incremental Delivery
1. Add US2 for pagination.
2. Add US3 for complete repository detail display.
3. Add US4 for robust error/recovery.
4. Add US5 for reviewer-ready delivery package.
5. Finish with Phase 8 polish.

### Suggested MVP Scope
- Minimum viable submission: US1 + foundational phases.
- Recommended challenge scope: US1-US5 complete.
