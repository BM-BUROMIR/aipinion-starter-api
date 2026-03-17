import { test, expect } from '@playwright/test';

test.describe('API E2E', () => {
  test('GET /health returns ok', async ({ request }) => {
    const res = await request.get('/health');
    expect(res.ok()).toBe(true);
    const body = await res.json();
    expect(body.status).toBe('ok');
    expect(body.service).toBe('aipinion-starter-api');
    expect(body.timestamp).toBeTruthy();
  });

  test('GET /api/examples returns array', async ({ request }) => {
    const res = await request.get('/api/examples');
    expect(res.ok()).toBe(true);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('POST /api/examples returns 401 without token', async ({ request }) => {
    const res = await request.post('/api/examples', {
      data: { title: 'E2E Test', description: 'e2e' },
    });
    expect(res.status()).toBe(401);
  });

  test('GET /api/examples/:id returns 404 for missing', async ({ request }) => {
    const res = await request.get('/api/examples/nonexistent');
    expect(res.status()).toBe(404);
  });

  test('PUT /api/examples/:id returns 401 without token', async ({ request }) => {
    const res = await request.put('/api/examples/1', {
      data: { title: 'Updated', description: 'updated' },
    });
    expect(res.status()).toBe(401);
  });

  test('DELETE /api/examples/:id returns 401 without token', async ({ request }) => {
    const res = await request.delete('/api/examples/1');
    expect(res.status()).toBe(401);
  });

  test('GET /unknown returns 404', async ({ request }) => {
    const res = await request.get('/unknown');
    expect(res.status()).toBe(404);
  });
});
