import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.json({
    status: 'ok',
    service: 'aipinion-starter-api',
    timestamp: new Date().toISOString(),
  });
});

export default app;
