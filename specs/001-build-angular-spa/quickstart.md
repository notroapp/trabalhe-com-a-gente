# Quickstart - 001-build-angular-spa

## Objective

Run the implemented fullstack solution locally (Angular frontend + Node GraphQL backend), execute tests, and validate the main user flows.

## Prerequisites

- Node.js 22 LTS
- npm 10+
- Docker + Docker Compose (optional path)

## Environment Variables

Reference file: `.env.example` (project root).

- `BACKEND_PORT` (default `4000`)
- `GITHUB_TOKEN` (optional but recommended)
- `FRONTEND_GRAPHQL_URL` (default `http://localhost:4000/graphql`)

## Local Run (without Docker)

1. Backend:
   - `cd backend`
   - `npm install`
   - `npm run dev`

2. Frontend (new terminal):
   - `cd frontend`
   - `npm install`
   - `npm run start`

3. Access:
   - Frontend: `http://localhost:4200`
   - Backend GraphQL: `http://localhost:4000/graphql`

## Local Run (Docker Compose)

From repository root:

- `docker compose up --build`

Access:

- Frontend: `http://localhost:4200`
- Backend GraphQL: `http://localhost:4000/graphql`

## Test Execution

Backend:
- `npm run test`
- `npm run smoke`

Frontend:
- `npm run test:unit`
- `npm run smoke`

## Manual Validation Checklist

- Search by repository name returns repository cards.
- Empty query is blocked with clear validation feedback.
- Pagination navigation works and preserves query context.
- Required fields are rendered: name, URL, description/fallback, watchers, stars, open issues, owner.
- Error states are user-friendly and retry action is available.
- Rate-limit path uses cached fallback when available.
