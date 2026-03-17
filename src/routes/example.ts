import { Hono } from 'hono';
import { requireAuth } from '../middleware/require-auth.js';
import {
  listExamples,
  getExample,
  createExample,
  updateExample,
  deleteExample,
} from '../services/example.js';
import type { AppVariables, ExampleInput } from '../types/index.js';

const app = new Hono<{ Variables: AppVariables }>();

/** GET /api/examples — list all examples (public) */
app.get('/', (c) => {
  return c.json(listExamples());
});

/** GET /api/examples/:id — get one example (public) */
app.get('/:id', (c) => {
  const example = getExample(c.req.param('id'));
  if (!example) {
    return c.json({ error: 'Not found' }, 404);
  }
  return c.json(example);
});

/** POST /api/examples — create example (requires auth) */
app.post('/', requireAuth, async (c) => {
  const body = await c.req.json<ExampleInput>();
  if (!body.title || !body.description) {
    return c.json({ error: 'title and description are required' }, 400);
  }
  const example = createExample(body);
  return c.json(example, 201);
});

/** PUT /api/examples/:id — update example (requires auth) */
app.put('/:id', requireAuth, async (c) => {
  const body = await c.req.json<ExampleInput>();
  if (!body.title || !body.description) {
    return c.json({ error: 'title and description are required' }, 400);
  }
  const example = updateExample(c.req.param('id'), body);
  if (!example) {
    return c.json({ error: 'Not found' }, 404);
  }
  return c.json(example);
});

/** DELETE /api/examples/:id — delete example (requires auth) */
app.delete('/:id', requireAuth, async (c) => {
  const deleted = deleteExample(c.req.param('id'));
  if (!deleted) {
    return c.json({ error: 'Not found' }, 404);
  }
  return c.json({ success: true });
});

export default app;
