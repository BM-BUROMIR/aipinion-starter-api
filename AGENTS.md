# aipinion-starter-api — AGENTS.md

## Quick Context

- **Stack:** Hono + TypeScript (Node.js 20)
- **Repo:** BM-BUROMIR/aipinion-starter-api (public)
- **Purpose:** Starter template for API-only services

## Architecture Decision Records

### ADR-001: Hono over Express

Hono provides built-in TypeScript support, lightweight middleware, and native ESM.
It follows the same patterns as Web Standards (Request/Response), making it
portable to edge runtimes if needed in the future.

### ADR-002: jose for JWT verification

The `jose` library is the standard for JWT/JWK/JWKS operations in modern JS.
It supports all key types, has zero dependencies, and works in Node.js and edge runtimes.

### ADR-003: In-memory store for examples

The starter uses an in-memory Map for CRUD examples. This makes the template
self-contained (no database setup required). Projects cloned from this template
should replace the store with their actual database.

### ADR-004: Three-layer testing strategy

- Unit tests: isolated functions, mocked externals
- Integration tests: route handlers with mocked auth
- E2E tests: Playwright request context against a running server

## Quality Gates

Pre-commit (lint-staged):

- ESLint --fix + Prettier --write for \*.{ts,tsx,js,jsx}
- Prettier --write for \*.{json,md,css}

Pre-push (full check):

1. `npm run lint` + `npm run format:check`
2. `npm run build`
3. `npm run test:coverage` (Vitest, threshold 100%)
4. `npm run test:e2e` (Playwright)

Push is rejected if any step fails.

## File Map

```
src/
  index.ts              # App entry point — Hono + @hono/node-server
  config.ts             # Env config (PORT, AUTH_SERVER_URL, CORS_ORIGINS)
  middleware/
    require-auth.ts     # JWT verification via JWKS endpoint
  routes/
    health.ts           # GET /health
    example.ts          # CRUD: GET/POST/PUT/DELETE /api/examples
  services/
    example.ts          # Business logic — in-memory store
  types/
    index.ts            # TypeScript interfaces (JwtPayload, Example, etc.)
tests/
  unit/                 # Unit tests (config, service, auth middleware)
  integration/          # Integration tests (full route handlers)
  e2e/                  # E2E tests (Playwright request context)
scripts/
  coolify.sh            # Coolify deployment helper
docs/
  architecture.md       # Architecture documentation
```

## Common Tasks

### Add a new API endpoint

1. Create route handler in `src/routes/{feature}.ts`
2. Create service in `src/services/{feature}.ts` with business logic
3. Add types to `src/types/index.ts`
4. Register route in `src/index.ts`
5. Write unit test for service: `tests/unit/{feature}.test.ts`
6. Write integration test: `tests/integration/{feature}.test.ts`
7. Write E2E test: `tests/e2e/{feature}.spec.ts`
8. Verify coverage: `npm run test:coverage`

### Replace in-memory store with a database

1. Add database client (e.g., `@supabase/supabase-js`, `drizzle-orm`)
2. Update `src/config.ts` with DB connection env vars
3. Rewrite `src/services/example.ts` to use DB instead of Map
4. Update tests with appropriate mocks

### Deploy

```bash
./scripts/coolify.sh push-test   # push + deploy + smoke test
./scripts/coolify.sh sync-env    # update env vars
./scripts/coolify.sh deploy      # manual redeploy
```

## External Integrations

- **auth.aipinion.ru** — JWT RS256 verification via JWKS endpoint
- **Coolify** — deployment, env vars sync, healthcheck

## Testing Strategy

- **Unit:** isolated functions, mocks for external services (jose)
- **Integration:** API endpoints with mocked auth middleware
- **E2E:** Playwright request context (no browser needed)
- **Coverage:** 100% required, enforced in pre-push hook

## Do NOT

- Push without passing all tests (`--no-verify` is forbidden)
- Commit `.env`, `.env.prod`, `.coolify.env`
- Modify `scripts/coolify.sh` without coordination
- Delete tests
- Lower coverage threshold below 100%
- Add `any` to TypeScript (ESLint: error)
