import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import type { AppVariables } from '../../src/types/index.js';

// Mock jose before importing the middleware
vi.mock('jose', () => ({
  createRemoteJWKSet: vi.fn(() => 'mock-jwks'),
  jwtVerify: vi.fn(),
}));

import * as jose from 'jose';
import { requireAuth, resetJWKSCache, getJWKS } from '../../src/middleware/require-auth.js';

function createTestApp() {
  const app = new Hono<{ Variables: AppVariables }>();
  app.use('/protected', requireAuth);
  app.get('/protected', (c) => {
    const user = c.get('user');
    return c.json({ user });
  });
  return app;
}

describe('requireAuth middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetJWKSCache();
  });

  it('returns 401 when Authorization header is missing', async () => {
    const app = createTestApp();
    const res = await app.request('/protected');
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Missing or invalid Authorization header');
  });

  it('returns 401 when Authorization header has wrong scheme', async () => {
    const app = createTestApp();
    const res = await app.request('/protected', {
      headers: { Authorization: 'Basic abc123' },
    });
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Missing or invalid Authorization header');
  });

  it('returns 401 when token verification fails', async () => {
    vi.mocked(jose.jwtVerify).mockRejectedValueOnce(new Error('token expired'));
    const app = createTestApp();
    const res = await app.request('/protected', {
      headers: { Authorization: 'Bearer invalid-token' },
    });
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Invalid or expired token');
  });

  it('sets user in context on successful verification', async () => {
    const mockPayload = { sub: 'user-123', email: 'test@example.com', roles: ['admin'] };
    vi.mocked(jose.jwtVerify).mockResolvedValueOnce({
      payload: mockPayload,
      protectedHeader: { alg: 'RS256' },
    } as never);
    const app = createTestApp();
    const res = await app.request('/protected', {
      headers: { Authorization: 'Bearer valid-token' },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.user).toEqual(mockPayload);
  });

  it('caches JWKS across calls', () => {
    const jwks1 = getJWKS();
    const jwks2 = getJWKS();
    expect(jwks1).toBe(jwks2);
    expect(jose.createRemoteJWKSet).toHaveBeenCalledTimes(1);
  });

  it('resetJWKSCache clears the cache', () => {
    getJWKS();
    resetJWKSCache();
    getJWKS();
    expect(jose.createRemoteJWKSet).toHaveBeenCalledTimes(2);
  });
});
