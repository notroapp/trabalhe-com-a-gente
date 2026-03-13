# Spec Kit Prompt Pack - Desafio Fullstack (Angular + Node GraphQL)

Este arquivo consolida prompts prontos para executar o fluxo Spec-Driven do repositório, com foco em:

- Angular SPA tradicional (Angular 18+)
- Backend Node.js com GraphQL
- API externa do GitHub como fonte de dados
- Requisitos obrigatorios + diferenciais do desafio

Baseado no desafio descrito em `README.md` e no processo detalhado do Spec Kit:
[Spec Kit Detailed Process](https://github.com/github/spec-kit?tab=readme-ov-file#-detailed-process)

## 1) Prompt para `/speckit.constitution`

Use este comando com o texto abaixo:

```text
/speckit.constitution
Create a project constitution for a Fullstack technical challenge with Angular 18+ frontend and Node.js GraphQL backend.

The constitution must be practical, enforceable, and written in clear language with MUST/SHOULD rules.

Include these non-negotiable principles:

1) Code Quality and Architecture
- Clean code, naming clarity, small focused modules.
- SOLID and separation of concerns are mandatory.
- Prefer composition over inheritance.
- Frontend and backend must be organized by feature/module boundaries with clear interfaces.
- Use design patterns only when they reduce complexity; avoid accidental overengineering.

2) Testing Strategy
- Test pyramid required: unit tests first, integration tests for boundaries, selective e2e.
- Every bug fix must include at least one regression test.
- Critical paths (search, pagination, error handling, mapping external API -> internal contract) require automated tests.
- PRs without tests for changed behavior are rejected unless explicitly justified.

3) UX/UI and Accessibility Baseline
- UI must always expose loading, empty, success, and error states.
- Pagination and search must be predictable and responsive.
- Semantic HTML and keyboard accessibility baseline are required.
- Visual consistency and user feedback are mandatory.

4) Performance and Reliability
- Backend pagination must be server-side.
- Frontend search must use debounce and cancellation for stale requests.
- Define p95 response targets and monitor them.
- Cache policy must be explicit (TTL, invalidation scope, fallback behavior).

5) Security and Resilience
- Input validation on all external entry points.
- Centralized error handling; no stack traces or secrets in client responses.
- Handle upstream API failure, timeout, and rate limits gracefully.
- Environment secrets must not be hardcoded.

6) Delivery and Operability
- README must include run instructions, dependencies, and test commands for frontend/backend.
- Use consistent lint/format tooling and CI checks.
- Docker setup should be available for local full-stack execution.

7) Governance
- Constitution overrides ad-hoc decisions.
- Any exception requires a written rationale and expiration review.
- Complexity must be justified in plan documents.

Output a final constitution ready for this repository.
```

## 2) Prompt para `/speckit.specify`

Use este comando com o texto abaixo:

```text
/speckit.specify
Build a web application to search and explore GitHub repositories through a custom backend-for-frontend architecture.

Business goal:
Demonstrate fullstack engineering quality (frontend + backend), architecture clarity, testing discipline, and user-centric behavior in a technical challenge.

Product scope:
- User can search repositories by text query.
- Results are shown as a paginated list.
- Each card must show at least: repository name, URL, description, watchers count, stars count, open issues count.
- User can navigate pages without losing context.
- App must clearly communicate loading, empty result, and error states.

Behavior expectations:
- New search resets page to the first page.
- Empty query behavior must be defined (blocked with validation OR default trending-like behavior; specify one).
- Failed upstream requests must return friendly errors with retry guidance.
- Pagination metadata must be visible (current page, total items or best available equivalent).

Non-functional requirements:
- Maintainable, readable, testable codebase.
- Strong contract between frontend and backend; frontend must not depend on raw external API shape.
- Performance-conscious async flow (debounce/cancel stale requests).
- Basic accessibility and semantic markup.
- Security-oriented error and input handling.

User stories with acceptance criteria:
1) Repository Search
- Given a valid query, when user submits search, then a result list is displayed.
- Given invalid/empty query (as specified), user receives clear feedback.

2) Paginated Navigation
- Given result set > one page, user can navigate next/previous/specific page.
- Page transition keeps query context and updates metadata.

3) Result Inspection
- Each listed item shows required repository attributes and link.
- External URL is safe and usable.

4) Robust Error Handling
- Upstream API/network/rate-limit errors are translated into understandable messages.
- User can retry without reloading the entire application.

5) Quality and Delivery
- README documents setup/run/tests.
- Test coverage exists for critical domain and integration boundaries.

Out of scope for this phase:
- Authentication/authorization
- Write operations to GitHub
- Multi-tenant features

Generate a complete feature spec with clear acceptance criteria, edge cases, and constraints.
```

## 3) Prompt para `/speckit.clarify`

Use este comando e, se necessario, complemente com as perguntas sugeridas abaixo.

```text
/speckit.clarify
Run a structured clarification pass on the current feature spec and ask only high-impact questions that remove implementation ambiguity.

Prioritize clarifications for:
1) Pagination contract: page index base (0/1), page size default, max page size.
2) Sorting policy: default sort strategy and whether user can change sort.
3) Search behavior: minimum query length, empty query policy, debounce interval.
4) Rate-limit strategy: user-facing message, retry/backoff, optional cached fallback.
5) Cache policy: where cache lives, TTL, cache key composition, invalidation rules.
6) Error model: standardized backend error codes/messages for frontend.
7) MVP differential scope: which extras are in-scope now (Angular Material, Docker, CI checks, test depth).
8) Observability baseline: required logs/metrics for local and CI visibility.

When presenting questions:
- Ask one at a time in priority order.
- Propose a sensible default for each question.
- Append accepted answers into a Clarifications section in the spec.
```

Perguntas objetivas recomendadas (caso precise conduzir manualmente):

1. `page` comeca em 1 ou 0? (default recomendado: 1)  
2. `perPage` default/maximo? (default recomendado: 10, maximo: 50)  
3. Ordenacao inicial: `best match` da API ou `stars desc`?  
4. Busca vazia: bloquear com validacao ou listar tendencia? (recomendado: bloquear)  
5. Debounce no frontend: 300ms, 500ms, ou outro? (recomendado: 400ms)  
6. Cache backend ativo no MVP? TTL de quanto? (recomendado: sim, 60s por `query+page+perPage+sort`)  
7. Em rate-limit (403), usar fallback de cache quando houver? (recomendado: sim)  
8. Diferenciais no MVP: Angular Material, Docker Compose e testes de integracao FE/BE entram agora? (recomendado: sim)  

## 4) Prompt para `/speckit.plan`

Use este comando com o texto abaixo:

```text
/speckit.plan
Create a technical implementation plan for this challenge using:
- Frontend: Angular 18+ SPA
- Backend: Node.js with GraphQL as the contract for frontend
- External provider: GitHub Search API

Architecture requirements:

Frontend
- Feature-based folder structure.
- Clear layering: presentation -> application/service -> gateway/client.
- RxJS for async orchestration (debounce, switchMap cancellation, error mapping).
- UI states: loading/empty/error/success.
- Angular Material for consistent baseline components.
- Strong typing for view models and API contracts.

Backend
- Modular architecture with clear boundaries:
  - GraphQL API module
  - GitHub integration module
  - Mapping/normalization layer (external DTO -> internal DTO)
  - Error handling module
  - Optional cache module
- GraphQL schema must expose paginated repository search query and pagination metadata.
- Input validation and centralized error mapping.
- Rate limit and timeout handling strategy.

Testing
- Frontend: unit tests for components/services and integration tests for main search flow.
- Backend: unit tests for mappers/services and integration tests for GraphQL query behavior.
- Include contract-oriented tests for error scenarios.

Operational and DX requirements
- Docker Compose for local full stack run.
- Environment variable strategy documented.
- Lint/format/test commands standardized.
- README quickstart with frontend/backend/test instructions.

Design principles
- Apply SOLID and pragmatic DDD (bounded contexts/modules where useful).
- Prefer simple solutions first, document any justified complexity.
- Keep frontend decoupled from raw GitHub response shape.

Output required artifacts with clear rationale:
- research.md
- data-model.md
- contracts (GraphQL schema contract)
- quickstart.md
- plan.md with actionable phases and dependency-aware order
```

## 5) Gates de aprovacao antes de `/speckit.tasks` e `/speckit.analyze`

Use este checklist de Go/No-Go:

### Gate A - Spec completeness
- [ ] Todas as user stories possuem criterios de aceitacao testaveis.
- [ ] Estados `loading/empty/error/success` estao descritos.
- [ ] Regras de paginacao (default, limites, metadados) estao explicitas.
- [ ] Comportamento de erro e rate-limit esta definido.

### Gate B - Technical plan quality
- [ ] Arquitetura FE/BE possui separacao clara de responsabilidades.
- [ ] Contrato GraphQL cobre busca, paginacao e erros.
- [ ] Estrategia de testes esta definida por camada.
- [ ] Politica de cache e resiliencia foi decidida.
- [ ] Docker/README/commands de qualidade estao planejados.

### Gate C - Traceability
- [ ] Cada requisito funcional mapeia para pelo menos uma tarefa prevista.
- [ ] Cada requisito nao-funcional (performance, seguranca, qualidade) tem verificacao planejada.
- [ ] Riscos tecnicos principais possuem mitigacao documentada.

Se qualquer item critico estiver pendente, nao rodar `/speckit.tasks` ainda.

## Sequencia recomendada de execucao

1. Rodar `/speckit.constitution` com o prompt da secao 1.
2. Rodar `/speckit.specify` com o prompt da secao 2.
3. Rodar `/speckit.clarify` com o prompt da secao 3.
4. Rodar `/speckit.plan` com o prompt da secao 4.
5. Validar os Gates (secao 5).
6. Somente depois: `/speckit.tasks` e `/speckit.analyze`.
