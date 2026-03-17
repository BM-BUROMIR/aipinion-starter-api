import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('config', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('uses default values when env vars are not set', async () => {
    vi.stubEnv('PORT', '');
    vi.stubEnv('AUTH_SERVER_URL', '');
    vi.stubEnv('CORS_ORIGINS', '');

    const { config } = await import('../../src/config.js');
    expect(config.port).toBe(3000);
    expect(config.authServerUrl).toBe('https://auth.aipinion.ru');
    expect(config.corsOrigins).toEqual(['http://localhost:3001']);
  });

  it('reads values from environment variables', async () => {
    vi.stubEnv('PORT', '4000');
    vi.stubEnv('AUTH_SERVER_URL', 'https://custom-auth.example.com');
    vi.stubEnv('CORS_ORIGINS', 'http://a.com, http://b.com');

    const { config } = await import('../../src/config.js');
    expect(config.port).toBe(4000);
    expect(config.authServerUrl).toBe('https://custom-auth.example.com');
    expect(config.corsOrigins).toEqual(['http://a.com', 'http://b.com']);
  });
});
