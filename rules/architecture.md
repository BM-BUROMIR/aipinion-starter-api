# starter-api — архитектура и тестирование

## ADRs

- **ADR-1: Hono вместо Express** — встроенный TypeScript, Web Standards (`Request`/`Response`), portable to edge
- **ADR-2: `jose` для JWT** — zero dependencies, поддержка всех key types, Node.js + edge
- **ADR-3: In-memory store** — шаблон самодостаточен без БД. При клонировании заменяется на реальную БД.

## Типовые задачи

### Добавить API endpoint

1. Route handler — `src/routes/{feature}.ts`
2. Service — `src/services/{feature}.ts`
3. Типы — `src/types/index.ts`
4. Зарегистрировать route в `src/index.ts`
5. Unit-тест — `tests/unit/{feature}.test.ts`
6. Integration-тест — `tests/integration/{feature}.test.ts`
7. E2E-тест — `tests/e2e/{feature}.spec.ts`

### Заменить in-memory store на БД

1. Добавить DB-клиент (`@supabase/supabase-js`, `drizzle-orm`, ...)
2. Обновить `src/config.ts` — добавить env vars подключения
3. Переписать `src/services/example.ts` для работы с БД
4. Обновить тесты с подходящими моками

## Тестирование

- **Unit** — изолированные функции, моки для `jose`
- **Integration** — API endpoints с мокнутым auth middleware
- **E2E** — Playwright request context (браузер не нужен)
- **Coverage** — 100% required
