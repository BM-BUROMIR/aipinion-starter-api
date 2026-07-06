/**
 * Read an environment variable, or use a fallback when it is missing or empty.
 *
 * @param name Environment variable name to read from `process.env`.
 * @param fallback Value returned when `process.env[name]` is unset or an empty string.
 * @returns The environment value when present, otherwise the fallback.
 */
function optional(name: string, fallback: string): string {
  return process.env[name] || fallback;
}

/**
 * Runtime configuration resolved from environment variables at module load time.
 *
 * @property port HTTP server port from `PORT`, defaulting to `3000`.
 * @property authServerUrl Auth server base URL from `AUTH_SERVER_URL`, defaulting to `https://auth.aipinion.ru`.
 * @property corsOrigins Allowed CORS origins from comma-separated `CORS_ORIGINS`, defaulting to `http://localhost:3001`.
 */
export const config = {
  port: Number(optional('PORT', '3000')),
  authServerUrl: optional('AUTH_SERVER_URL', 'https://auth.aipinion.ru'),
  corsOrigins: optional('CORS_ORIGINS', 'http://localhost:3001')
    .split(',')
    .map((s) => s.trim()),
} as const;
