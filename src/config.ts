function optional(name: string, fallback: string): string {
  return process.env[name] || fallback;
}

export const config = {
  port: Number(optional('PORT', '3000')),
  authServerUrl: optional('AUTH_SERVER_URL', 'https://auth.aipinion.ru'),
  corsOrigins: optional('CORS_ORIGINS', 'http://localhost:3001')
    .split(',')
    .map((s) => s.trim()),
} as const;
