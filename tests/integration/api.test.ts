import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import type { AppVariables } from '../../src/types/index.js';

// Mock jose for auth middleware
vi.mock('jose', () => ({
  createRemoteJWKSet: vi.fn(() => 'mock-jwks'),
  jwtVerify: vi.fn(),
}));

import * as jose from 'jose';
import { clearExamples } from '../../src/services/example.js';
import { resetJWKSCache } from '../../src/middleware/require-auth.js';
import healthRoute from '../../src/routes/health.js';
import exampleRoute from '../../src/routes/example.js';

function createApp() {
  const app = new Hono<{ Variables: AppVariables }>();
  app.route('/health', healthRoute);
  app.route('/api/examples', exampleRoute);
  app.notFound((c) => c.json({ error: 'Not found' }, 404));
  return app;
}

const validPayload = { sub: 'user-1', email: 'test@test.com' };

function mockAuth() {
  vi.mocked(jose.jwtVerify).mockResolvedValueOnce({
    payload: validPayload,
    protectedHeader: { alg: 'RS256' },
  } as never);
}

describe('API integration', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    vi.clearAllMocks();
    resetJWKSCache();
    clearExamples();
    app = createApp();
  });

  describe('GET /health', () => {
    it('returns status ok', async () => {
      const res = await app.request('/health');
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('ok');
      expect(body.service).toBe('aipinion-starter-api');
      expect(body.timestamp).toBeTruthy();
    });
  });

  describe('GET /api/examples', () => {
    it('returns empty list initially', async () => {
      const res = await app.request('/api/examples');
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual([]);
    });
  });

  describe('POST /api/examples', () => {
    it('returns 401 without auth', async () => {
      const res = await app.request('/api/examples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Test', description: 'Desc' }),
      });
      expect(res.status).toBe(401);
    });

    it('creates an example with valid auth', async () => {
      mockAuth();
      const res = await app.request('/api/examples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify({ title: 'Test', description: 'Desc' }),
      });
      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.title).toBe('Test');
      expect(body.id).toBeTruthy();
    });

    it('returns 400 when title is missing', async () => {
      mockAuth();
      const res = await app.request('/api/examples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify({ description: 'Desc' }),
      });
      expect(res.status).toBe(400);
    });

    it('returns 400 when description is missing', async () => {
      mockAuth();
      const res = await app.request('/api/examples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify({ title: 'Test' }),
      });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/examples/:id', () => {
    it('returns 404 for non-existent ID', async () => {
      const res = await app.request('/api/examples/999');
      expect(res.status).toBe(404);
    });

    it('returns an example by ID', async () => {
      mockAuth();
      const createRes = await app.request('/api/examples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify({ title: 'Test', description: 'Desc' }),
      });
      const created = await createRes.json();

      const res = await app.request(`/api/examples/${created.id}`);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.title).toBe('Test');
    });
  });

  describe('PUT /api/examples/:id', () => {
    it('returns 401 without auth', async () => {
      const res = await app.request('/api/examples/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New', description: 'new' }),
      });
      expect(res.status).toBe(401);
    });

    it('returns 404 for non-existent ID', async () => {
      mockAuth();
      const res = await app.request('/api/examples/999', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify({ title: 'New', description: 'new' }),
      });
      expect(res.status).toBe(404);
    });

    it('updates an existing example', async () => {
      mockAuth();
      const createRes = await app.request('/api/examples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify({ title: 'Old', description: 'old' }),
      });
      const created = await createRes.json();

      mockAuth();
      const res = await app.request(`/api/examples/${created.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify({ title: 'New', description: 'new' }),
      });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.title).toBe('New');
    });

    it('returns 400 when title is missing', async () => {
      mockAuth();
      const createRes = await app.request('/api/examples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify({ title: 'Test', description: 'Desc' }),
      });
      const created = await createRes.json();

      mockAuth();
      const res = await app.request(`/api/examples/${created.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify({ description: 'new' }),
      });
      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/examples/:id', () => {
    it('returns 401 without auth', async () => {
      const res = await app.request('/api/examples/1', { method: 'DELETE' });
      expect(res.status).toBe(401);
    });

    it('returns 404 for non-existent ID', async () => {
      mockAuth();
      const res = await app.request('/api/examples/999', {
        method: 'DELETE',
        headers: { Authorization: 'Bearer valid-token' },
      });
      expect(res.status).toBe(404);
    });

    it('deletes an existing example', async () => {
      mockAuth();
      const createRes = await app.request('/api/examples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify({ title: 'Test', description: 'Desc' }),
      });
      const created = await createRes.json();

      mockAuth();
      const res = await app.request(`/api/examples/${created.id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer valid-token' },
      });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);

      // Verify it's gone
      const getRes = await app.request(`/api/examples/${created.id}`);
      expect(getRes.status).toBe(404);
    });
  });

  describe('404 handler', () => {
    it('returns 404 for unknown routes', async () => {
      const res = await app.request('/unknown');
      expect(res.status).toBe(404);
      const body = await res.json();
      expect(body.error).toBe('Not found');
    });
  });
});
