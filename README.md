# aipinion-starter-api

Starter template for API-only services in the [aipinion.ru](https://aipinion.ru) ecosystem.
Clone this repo, install, and start building your API immediately.

## Features

- **Hono** — lightweight, fast web framework with native TypeScript support
- **JWT authentication** — verify tokens via JWKS from auth.aipinion.ru
- **CRUD example** — in-memory resource with full REST endpoints
- **Three-layer testing** — unit, integration, and E2E (Playwright request context)
- **100% test coverage** — enforced by vitest thresholds and pre-push hook
- **Docker-ready** — multi-stage Dockerfile with healthcheck
- **Coolify deployment** — `scripts/coolify.sh` for one-command deploys
- **Code quality** — ESLint + Prettier + Husky pre-commit/pre-push hooks

## Quick Start

```bash
# Clone the template
git clone https://github.com/BM-BUROMIR/aipinion-starter-api.git my-api
cd my-api

# Install dependencies
npm install

# Copy and edit environment variables
cp .env.example .env

# Start development server (hot reload)
npm run dev
```

The server starts at `http://localhost:3000`. Try it:

```bash
curl http://localhost:3000/health
# {"status":"ok","service":"aipinion-starter-api","timestamp":"..."}

curl http://localhost:3000/api/examples
# []
```

## API Endpoints

| Method | Path                | Auth     | Description       |
| ------ | ------------------- | -------- | ----------------- |
| GET    | `/health`           | Public   | Health check      |
| GET    | `/api/examples`     | Public   | List all examples |
| POST   | `/api/examples`     | Required | Create example    |
| GET    | `/api/examples/:id` | Public   | Get one example   |
| PUT    | `/api/examples/:id` | Required | Update example    |
| DELETE | `/api/examples/:id` | Required | Delete example    |

### Authentication

Protected endpoints require a valid JWT in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

The server verifies tokens by fetching the JWKS from `AUTH_SERVER_URL/.well-known/jwks.json`.
By default, this points to `https://auth.aipinion.ru`.

### Example: Create a resource

```bash
curl -X POST http://localhost:3000/api/examples \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title": "My Example", "description": "A test resource"}'
```

## Project Structure

```
src/
├── index.ts              # App entry point — Hono + @hono/node-server
├── config.ts             # Environment configuration
├── middleware/
│   └── require-auth.ts   # JWT verification via JWKS
├── routes/
│   ├── health.ts         # GET /health
│   └── example.ts        # CRUD routes for /api/examples
├── services/
│   └── example.ts        # Business logic (in-memory store)
└── types/
    └── index.ts          # TypeScript interfaces
tests/
├── unit/                 # Unit tests (config, service, auth)
├── integration/          # Integration tests (route handlers)
└── e2e/                  # E2E tests (Playwright request context)
```

## Scripts

```bash
npm run dev              # Development server with hot reload
npm run build            # Compile TypeScript to dist/
npm run start            # Start production server
npm run lint             # Run ESLint
npm run lint:fix         # Run ESLint with auto-fix
npm run format           # Format all files with Prettier
npm run format:check     # Check formatting (CI)
npm run test             # Run unit + integration tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with 100% coverage threshold
npm run test:e2e         # Run E2E tests (Playwright)
```

## Environment Variables

| Variable          | Default                    | Description                     |
| ----------------- | -------------------------- | ------------------------------- |
| `PORT`            | `3000`                     | Server port                     |
| `AUTH_SERVER_URL` | `https://auth.aipinion.ru` | JWKS endpoint for JWT verify    |
| `CORS_ORIGINS`    | `http://localhost:3001`    | Comma-separated allowed origins |

Copy `.env.example` to `.env` and adjust as needed.

## Testing

The project uses three layers of tests:

- **Unit tests** (`tests/unit/`) — isolated function tests with mocked dependencies
- **Integration tests** (`tests/integration/`) — route handler tests with mocked auth
- **E2E tests** (`tests/e2e/`) — full HTTP tests against a running server

Run all tests:

```bash
npm run test              # Unit + integration
npm run test:coverage     # With 100% coverage check
npm run test:e2e          # E2E (starts server automatically)
```

Coverage thresholds are set to 100% for statements, branches, functions, and lines.

## Quality Gates

Git hooks enforce code quality:

- **Pre-commit**: `lint-staged` runs ESLint + Prettier on staged files
- **Pre-push**: Full pipeline — lint, format check, build, test with coverage, E2E

Pushing is blocked if any check fails. Do not use `--no-verify`.

## Docker

Build and run with Docker:

```bash
docker build -t my-api .
docker run -p 3000:3000 --env-file .env my-api
```

The Dockerfile uses a multi-stage build:

1. Builder stage compiles TypeScript
2. Production stage copies only compiled JS and production dependencies
3. Built-in healthcheck pings `/health` every 30 seconds

## Deployment

Deploy via Coolify using the included helper script:

```bash
./scripts/coolify.sh deploy       # Trigger redeployment
./scripts/coolify.sh sync-env     # Push .env.prod to Coolify
./scripts/coolify.sh push-test    # Git push + wait + smoke test
./scripts/coolify.sh logs         # View recent logs
```

See `./scripts/coolify.sh help` for all commands.

## How to Customize

1. **Replace the example resource** — modify `src/services/example.ts` and `src/routes/example.ts`
2. **Add a database** — install your client, update `src/config.ts`, rewrite the service layer
3. **Add new endpoints** — create files in `src/routes/` and `src/services/`, register in `src/index.ts`
4. **Add middleware** — create files in `src/middleware/`, apply in route files or globally

## License

MIT — see [LICENSE](./LICENSE).
