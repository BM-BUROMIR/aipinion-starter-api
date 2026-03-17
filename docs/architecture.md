# Architecture — aipinion-starter-api

## Overview

This is a starter template for building API-only services in the aipinion.ru ecosystem.
It provides a working Hono + TypeScript server with JWT authentication, CRUD examples,
comprehensive tests, and deployment tooling. Clone it to start a new API service.

## System Diagram

```
                         ┌──────────────────────┐
                         │  auth.aipinion.ru     │
                         │  (JWKS endpoint)      │
                         └──────────┬───────────┘
                                    │ /.well-known/jwks.json
                                    │
┌─────────┐   HTTP    ┌────────────▼────────────┐
│  Client  │ ───────→ │  aipinion-starter-api   │
│          │ ←─────── │  (Hono + Node.js)       │
└─────────┘   JSON    └─────────────────────────┘
                              │
                              │ In-memory store
                              │ (replace with DB)
                              ▼
                       ┌─────────────┐
                       │  Map<K, V>  │
                       └─────────────┘
```

## Request Flow

1. Client sends HTTP request to the API server.
2. Hono router matches the request to a route handler.
3. For protected routes, the `requireAuth` middleware runs first:
   a. Extracts the JWT from the `Authorization: Bearer` header.
   b. Fetches the JWKS from `auth.aipinion.ru/.well-known/jwks.json` (cached).
   c. Verifies the JWT signature and expiration using `jose`.
   d. Sets the decoded payload in the Hono context as `user`.
4. The route handler executes business logic via the service layer.
5. The service returns data, and the handler sends a JSON response.

## Project Structure

```
src/
├── index.ts              # App entry + server bootstrap
├── config.ts             # Environment configuration
├── middleware/
│   └── require-auth.ts   # JWT/JWKS verification middleware
├── routes/
│   ├── health.ts         # Health check endpoint
│   └── example.ts        # Example CRUD routes
├── services/
│   └── example.ts        # Business logic layer
└── types/
    └── index.ts          # Shared TypeScript interfaces
```

## Layers

### Routes (`src/routes/`)

Route handlers define HTTP endpoints. They parse request input, call services,
and return JSON responses. Protected routes use the `requireAuth` middleware.

### Middleware (`src/middleware/`)

Middleware intercepts requests before they reach route handlers.
The `requireAuth` middleware handles JWT verification via JWKS.

### Services (`src/services/`)

Services contain business logic. They are independent of HTTP concerns
and can be tested in isolation. The example service uses an in-memory Map;
replace it with your database client for production use.

### Types (`src/types/`)

Shared TypeScript interfaces used across layers.

## Authentication

JWT tokens are verified using the `jose` library:

- The JWKS is fetched from `AUTH_SERVER_URL/.well-known/jwks.json`.
- The JWKS fetcher is created once and cached in memory via `jose.createRemoteJWKSet`.
- The library handles key rotation automatically by re-fetching when needed.
- Tokens are expected in the `Authorization: Bearer <token>` header.

## Configuration

All configuration is loaded from environment variables via `src/config.ts`:

| Variable          | Default                    | Description                     |
| ----------------- | -------------------------- | ------------------------------- |
| `PORT`            | `3000`                     | Server port                     |
| `AUTH_SERVER_URL` | `https://auth.aipinion.ru` | JWKS endpoint base URL          |
| `CORS_ORIGINS`    | `http://localhost:3001`    | Comma-separated allowed origins |

## Testing Strategy

Three layers of tests ensure correctness:

### Unit Tests (`tests/unit/`)

- Test individual functions in isolation
- Mock external dependencies (jose)
- Fast feedback loop during development

### Integration Tests (`tests/integration/`)

- Test route handlers with mocked authentication
- Verify request/response contracts
- Test error handling and edge cases

### E2E Tests (`tests/e2e/`)

- Test against a running server instance
- Use Playwright's request context (no browser)
- Verify the full request lifecycle

### Coverage

All three layers combined must achieve 100% code coverage.
This is enforced by vitest coverage thresholds and the pre-push hook.

## Deployment

The project deploys via Coolify using a multi-stage Docker build:

1. **Builder stage**: Install dependencies, compile TypeScript.
2. **Production stage**: Copy compiled JS, install production dependencies only.
3. **Healthcheck**: Docker HEALTHCHECK pings `GET /health` via curl.

The `scripts/coolify.sh` helper provides deployment commands:

- `info` — show app status
- `deploy` — trigger redeployment
- `sync-env` — push `.env.prod` to Coolify
- `push-test` — git push + wait for deploy + smoke test
- `smoke` — health check on the deployed app
- `logs` — view deployment logs

## How to Extend

### Adding a new resource

1. Define types in `src/types/index.ts`.
2. Create a service in `src/services/` with CRUD operations.
3. Create a route in `src/routes/` using Hono.
4. Register the route in `src/index.ts`.
5. Write unit, integration, and E2E tests.

### Adding a database

1. Install your database client (e.g., `@supabase/supabase-js`).
2. Add connection config to `src/config.ts`.
3. Replace the in-memory store in services with DB queries.
4. Update tests with appropriate mocks or test database.

### Adding more middleware

1. Create a new middleware in `src/middleware/`.
2. Apply it to specific routes or globally in `src/index.ts`.
3. Write unit tests for the middleware.
