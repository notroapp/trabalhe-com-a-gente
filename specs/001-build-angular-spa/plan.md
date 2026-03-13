# Implementation Plan: GitHub Repository Search SPA

**Branch**: `001-build-angular-spa` | **Date**: 2026-03-13 | **Spec**: `/home/jadsonmattos/projects/trabalhe-com-a-gente/specs/001-build-angular-spa/spec.md`
**Input**: Feature specification from `/specs/001-build-angular-spa/spec.md`

## Summary

Build a fullstack challenge solution with Angular SPA frontend and Node.js GraphQL backend that searches GitHub repositories with server-side pagination, robust error handling, and testable contracts. The architecture follows contract-first boundaries: backend normalizes external GitHub responses into stable GraphQL types consumed by frontend view models.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 22 LTS; Angular 18+  
**Primary Dependencies**: Angular, Angular Material, RxJS, GraphQL Yoga, GraphQL, Zod (input validation), Axios (GitHub client), Vitest/Jest (unit), Playwright/Cypress optional for e2e  
**Storage**: In-memory cache (TTL 60s) keyed by `query+page+perPage+sort`; no persistent DB required for MVP  
**Testing**: Frontend unit + component/integration tests; backend unit + integration tests for GraphQL resolver boundary  
**Target Platform**: Linux/macOS/Windows local development, containerized via Docker Compose  
**Project Type**: Web application (separate frontend + backend)  
**Performance Goals**: First user feedback <= 1s (loading or response); avoid stale result overwrite; pagination deterministic  
**Constraints**: 1-based pagination, default page size 10, max 50, default sort GitHub best match, empty query blocked, secure error surfaces only  
**Scale/Scope**: Technical challenge MVP; single search workflow; one primary query contract; FE/BE integration tests required

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code quality/modularity**: PASS - layered FE/BE plan with explicit boundaries.
- **Contract-first boundaries**: PASS - GraphQL schema is the only FE-facing contract.
- **Test discipline**: PASS - unit + integration tests included in plan scope.
- **UX/accessibility consistency**: PASS - loading/empty/error/success states explicitly required.
- **Performance/reliability/security**: PASS - debounce, pagination contract, rate-limit fallback, validation and centralized error handling included.
- **Delivery gates**: PASS - README + run/test instructions + Docker Compose in scope.

Post-Design Re-check (after Phase 1 artifacts): PASS

## Project Structure

### Documentation (this feature)

```text
specs/001-build-angular-spa/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── graphql-schema.graphql
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/
│   │   ├── schema/
│   │   └── resolvers/
│   ├── application/
│   │   ├── use-cases/
│   │   └── dto/
│   ├── domain/
│   │   └── entities/
│   ├── infrastructure/
│   │   ├── github/
│   │   ├── cache/
│   │   └── logging/
│   ├── shared/
│   │   ├── errors/
│   │   └── validation/
│   └── main.ts
└── tests/
    ├── unit/
    └── integration/

frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   ├── shared/
│   │   └── features/
│   │       └── repository-search/
│   │           ├── pages/
│   │           ├── components/
│   │           ├── services/
│   │           ├── models/
│   │           └── state/
│   └── main.ts
└── tests/
    ├── unit/
    └── integration/
```

**Structure Decision**: Separate `frontend/` and `backend/` with feature-based organization and explicit application/domain/infrastructure boundaries to satisfy contract-first and testability requirements.

## Phase 0 - Research Decisions

1. **GraphQL over REST for internal contract**
   - Decision: Use GraphQL Yoga as backend interface.
   - Rationale: Aligns with challenge emphasis on GraphQL and enables precise frontend data selection.
   - Alternatives considered: REST with Express. Rejected due to weaker contract expressiveness for this challenge.

2. **Normalization layer between GitHub API and frontend**
   - Decision: Map GitHub API responses into stable internal DTO/entities.
   - Rationale: Prevents frontend coupling to upstream payload changes.
   - Alternatives considered: pass-through GitHub payload. Rejected due to constitution contract-first rule.

3. **Caching strategy**
   - Decision: In-memory TTL cache 60s by `query+page+perPage+sort`.
   - Rationale: Reduces repeated API calls and helps with rate-limit recovery.
   - Alternatives considered: no cache; Redis. No cache rejected (rate-limit risk). Redis deferred as unnecessary MVP complexity.

4. **Frontend async pattern**
   - Decision: RxJS with 400ms debounce + switchMap cancellation.
   - Rationale: Prevent stale response race and unnecessary network traffic.
   - Alternatives considered: immediate submit-only. Rejected for poorer UX under fast typing.

## Phase 1 - Design Artifacts to Produce

- `research.md` containing final technical decisions and tradeoffs.
- `data-model.md` defining `SearchQuery`, `RepositorySummary`, `PaginationMetadata`, `ApiError` and validation rules.
- `contracts/graphql-schema.graphql` with query + types + error envelope strategy.
- `quickstart.md` with setup/run/test flow and Docker Compose path.

## Phase 2 - Task Planning Readiness

Planning is considered complete and ready for `/speckit.tasks` when:
- All clarified rules are encoded (pagination, debounce, cache, rate-limit fallback).
- Contract and data model are aligned.
- Test strategy is mapped to concrete layers/files.
- No unresolved "NEEDS CLARIFICATION" remains.

## Complexity Tracking

No constitution violations requiring exception handling were identified.
