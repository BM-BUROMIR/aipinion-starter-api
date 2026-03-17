import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { config } from './config.js';

import healthRoute from './routes/health.js';
import exampleRoute from './routes/example.js';

const app = new Hono();

// Global middleware
app.use('*', logger());
app.use(
  '*',
  cors({
    origin: config.corsOrigins,
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Routes
app.route('/health', healthRoute);
app.route('/api/examples', exampleRoute);

// 404
app.notFound((c) => c.json({ error: 'Not found' }, 404));

// Error handler
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

// Start server
console.log(`Server starting on port ${config.port}...`);
serve({ fetch: app.fetch, port: config.port }, (info) => {
  console.log(`Server running at http://localhost:${info.port}`);
});
