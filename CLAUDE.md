# CLAUDE.md — aipinion-starter-api

## Обзор

Стартер-шаблон для API-сервисов aipinion.ru. Hono + TypeScript, Node.js 20.

## Tech Stack

Node.js 20, Hono, JWT RS256 JWKS (jose, auth.aipinion.ru), Vitest + Playwright.

## Структура

| Файл                             | Назначение                       |
| -------------------------------- | -------------------------------- |
| `src/index.ts`                   | Hono app, роуты, сервер          |
| `src/config.ts`                  | Env vars                         |
| `src/middleware/require-auth.ts` | JWT через JWKS (jose)            |
| `src/routes/health.ts`           | GET /health                      |
| `src/routes/example.ts`          | CRUD /api/examples               |
| `src/services/example.ts`        | In-memory store (заменить на БД) |
| `src/types/index.ts`             | TypeScript-интерфейсы            |

## Команды

```bash
npm run dev / build / start / lint / lint:fix / format / format:check
npm run test / test:watch / test:coverage    # Vitest (100%)
npm run test:e2e                             # Playwright
```

## API

| Метод               | Путь                  | Auth | Описание     |
| ------------------- | --------------------- | ---- | ------------ |
| GET                 | `/health`             | Нет  | Health check |
| GET/POST/PUT/DELETE | `/api/examples[/:id]` | JWT  | CRUD         |

## Зависимости

- **auth/** — JWT через JWKS `https://auth.aipinion.ru/.well-known/jwks.json`

## Правила

- In-memory store — пример, заменить на БД
- Три уровня тестов: unit, integration (vitest), E2E (Playwright)
- Публичный шаблон — без секретов
