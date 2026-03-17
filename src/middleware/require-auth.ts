import type { MiddlewareHandler } from 'hono';
import * as jose from 'jose';
import { config } from '../config.js';
import type { AppVariables, JwtPayload } from '../types/index.js';

let cachedJWKS: ReturnType<typeof jose.createRemoteJWKSet> | null = null;

/** Returns a cached JWKS fetcher. The JWKS is fetched once and cached in memory. */
export function getJWKS(): ReturnType<typeof jose.createRemoteJWKSet> {
  if (!cachedJWKS) {
    const jwksUrl = new URL('/.well-known/jwks.json', config.authServerUrl);
    cachedJWKS = jose.createRemoteJWKSet(jwksUrl);
  }
  return cachedJWKS;
}

/** Reset the cached JWKS (useful for testing). */
export function resetJWKSCache(): void {
  cachedJWKS = null;
}

/**
 * Middleware that verifies JWT from Authorization: Bearer header.
 * On success, sets `user` in Hono context with the decoded payload.
 */
export const requireAuth: MiddlewareHandler<{ Variables: AppVariables }> = async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Missing or invalid Authorization header' }, 401);
  }

  const token = authHeader.slice(7);

  try {
    const jwks = getJWKS();
    const { payload } = await jose.jwtVerify(token, jwks);
    c.set('user', payload as unknown as JwtPayload);
    await next();
  } catch {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }
};
