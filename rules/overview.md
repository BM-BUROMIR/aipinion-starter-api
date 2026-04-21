# starter-api — обзор

Публичный стартер-шаблон для API-сервисов экосистемы `aipinion.ru`. Hono + TypeScript на Node.js 20. Репозиторий public.

## Tech stack

- **Node.js 20**
- **Hono** — HTTP-фреймворк (Web Standards API, portable to edge)
- **JWT RS256 через JWKS** (`jose`, `auth.aipinion.ru`)
- **Vitest** + **Playwright**

## Структура

| Путь                             | Назначение                                           |
| -------------------------------- | ---------------------------------------------------- |
| `src/index.ts`                   | Hono app + `@hono/node-server`                       |
| `src/config.ts`                  | Env vars (`PORT`, `AUTH_SERVER_URL`, `CORS_ORIGINS`) |
| `src/middleware/require-auth.ts` | JWT verification через JWKS (`jose`)                 |
| `src/routes/health.ts`           | `GET /health`                                        |
| `src/routes/example.ts`          | CRUD: `GET/POST/PUT/DELETE /api/examples`            |
| `src/services/example.ts`        | Business logic — in-memory store                     |
| `src/types/index.ts`             | TypeScript interfaces                                |

## Зависимости

- **`auth/`** — JWT через JWKS `https://auth.aipinion.ru/.well-known/jwks.json`
