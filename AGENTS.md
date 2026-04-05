# AGENTS.md — aipinion-starter-api

## Project context

Публичный стартер-шаблон для API-сервисов экосистемы aipinion.ru. Hono + TypeScript на Node.js 20. Репозиторий public.

## Architecture decisions

- **ADR-1: Hono over Express** — built-in TypeScript, Web Standards (Request/Response), portable to edge
- **ADR-2: jose для JWT** — zero dependencies, поддержка всех key types, Node.js + edge
- **ADR-3: In-memory store** — шаблон самодостаточен без БД. Заменить на реальную БД при клонировании

## File map

| Path                             | Purpose                                          |
| -------------------------------- | ------------------------------------------------ |
| `src/index.ts`                   | Hono app + @hono/node-server                     |
| `src/config.ts`                  | Env config (PORT, AUTH_SERVER_URL, CORS_ORIGINS) |
| `src/middleware/require-auth.ts` | JWT verification via JWKS                        |
| `src/routes/health.ts`           | GET /health                                      |
| `src/routes/example.ts`          | CRUD: GET/POST/PUT/DELETE /api/examples          |
| `src/services/example.ts`        | Business logic — in-memory store                 |
| `src/types/index.ts`             | TypeScript interfaces                            |

## Common tasks

### Add a new API endpoint

1. Create route handler in `src/routes/{feature}.ts`
2. Create service in `src/services/{feature}.ts`
3. Add types to `src/types/index.ts`
4. Register route in `src/index.ts`
5. Write unit test: `tests/unit/{feature}.test.ts`
6. Write integration test: `tests/integration/{feature}.test.ts`
7. Write E2E test: `tests/e2e/{feature}.spec.ts`

### Replace in-memory store with a database

1. Add database client (e.g., `@supabase/supabase-js`, `drizzle-orm`)
2. Update `src/config.ts` with DB connection env vars
3. Rewrite `src/services/example.ts` to use DB
4. Update tests with appropriate mocks

## Testing

- **Unit:** isolated functions, mocks for jose
- **Integration:** API endpoints with mocked auth middleware
- **E2E:** Playwright request context (no browser needed)
- **Coverage:** 100% required

## Project-specific rules

- Шаблон публичный — не содержит секретов и prod-конфигов
- Не снижать порог coverage ниже 100%
