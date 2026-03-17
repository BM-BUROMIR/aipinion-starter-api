import type { Example, ExampleInput } from '../types/index.js';

/** In-memory store for examples. */
const store = new Map<string, Example>();

let nextId = 1;

/** Generate a unique ID for a new example. */
function generateId(): string {
  return String(nextId++);
}

/** Get the current ISO timestamp. */
function now(): string {
  return new Date().toISOString();
}

/** List all examples. */
export function listExamples(): Example[] {
  return Array.from(store.values());
}

/** Get a single example by ID, or undefined if not found. */
export function getExample(id: string): Example | undefined {
  return store.get(id);
}

/** Create a new example and return it. */
export function createExample(input: ExampleInput): Example {
  const id = generateId();
  const timestamp = now();
  const example: Example = {
    id,
    title: input.title,
    description: input.description,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  store.set(id, example);
  return example;
}

/** Update an existing example. Returns the updated example, or undefined if not found. */
export function updateExample(id: string, input: ExampleInput): Example | undefined {
  const existing = store.get(id);
  if (!existing) return undefined;
  const updated: Example = {
    ...existing,
    title: input.title,
    description: input.description,
    updatedAt: now(),
  };
  store.set(id, updated);
  return updated;
}

/** Delete an example by ID. Returns true if deleted, false if not found. */
export function deleteExample(id: string): boolean {
  return store.delete(id);
}

/** Clear all examples (useful for testing). */
export function clearExamples(): void {
  store.clear();
  nextId = 1;
}
