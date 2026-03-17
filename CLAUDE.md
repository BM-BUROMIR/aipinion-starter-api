# aipinion-starter-api — CLAUDE.md

## Project Overview

Public starter template for API-only services in the aipinion.ru ecosystem.
Hono + TypeScript running on Node.js 20. Deploy via Coolify.

## Commands

```bash
npm run dev              # Development with hot reload (tsx watch)
npm run build            # TypeScript compilation
npm run start            # Production server (requires .env)
npm run lint             # ESLint check
npm run lint:fix         # ESLint auto-fix
npm run format           # Prettier format all files
npm run format:check     # Prettier check (CI)
npm run test             # Run unit + integration tests (vitest)
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with 100% coverage threshold
npm run test:e2e         # Run E2E tests (Playwright request context)
```

## Quality Gates

Pre-commit (lint-staged): ESLint --fix + Prettier --write
Pre-push: lint + format:check + build + test:coverage + test:e2e

Coverage threshold: **100%** (statements, branches, functions, lines).
Pushing is blocked if any check fails.

## Key Files

| File                             | Purpose                                    |
| -------------------------------- | ------------------------------------------ |
| `src/index.ts`                   | Hono app setup, route registration, server |
| `src/config.ts`                  | Environment variable loading               |
| `src/middleware/require-auth.ts` | JWT verification via JWKS (jose)           |
| `src/routes/health.ts`           | GET /health endpoint                       |
| `src/routes/example.ts`          | CRUD routes for /api/examples              |
| `src/services/example.ts`        | Business logic (in-memory store)           |
| `src/types/index.ts`             | TypeScript interfaces                      |

## Architecture

- **JWT RS256 verification**: Tokens verified via JWKS from auth.aipinion.ru
- **In-memory store**: Example CRUD — replace with your database
- **Hono**: Lightweight web framework with built-in TypeScript support
- **Three-layer tests**: Unit (vitest), Integration (vitest), E2E (Playwright)

## Do NOT

- Push without passing all quality gates (`--no-verify` is forbidden)
- Commit `.env`, `.env.prod`, `.coolify.env`
- Add `any` to TypeScript (ESLint: error)
- Lower coverage threshold below 100%
- Delete tests
