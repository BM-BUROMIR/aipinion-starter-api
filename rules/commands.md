# starter-api — команды и API

## Команды

```bash
npm run dev / build / start / lint / lint:fix / format / format:check
npm run test / test:watch / test:coverage    # Vitest (100%)
npm run test:e2e                             # Playwright
```

## API

| Метод               | Путь                  | Auth | Описание     |
| ------------------- | --------------------- | ---- | ------------ |
| GET                 | `/health`             | нет  | Health check |
| GET/POST/PUT/DELETE | `/api/examples[/:id]` | JWT  | CRUD         |
