import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  listExamples,
  getExample,
  createExample,
  updateExample,
  deleteExample,
  clearExamples,
} from '../../src/services/example.js';

describe('example service', () => {
  beforeEach(() => {
    clearExamples();
    vi.restoreAllMocks();
  });

  it('listExamples returns empty array initially', () => {
    expect(listExamples()).toEqual([]);
  });

  it('createExample creates and returns an example', () => {
    const example = createExample({ title: 'Test', description: 'Desc' });
    expect(example).toMatchObject({
      id: '1',
      title: 'Test',
      description: 'Desc',
    });
    expect(example.createdAt).toBeTruthy();
    expect(example.updatedAt).toBeTruthy();
  });

  it('listExamples returns created examples', () => {
    createExample({ title: 'A', description: 'a' });
    createExample({ title: 'B', description: 'b' });
    const list = listExamples();
    expect(list).toHaveLength(2);
    expect(list[0].title).toBe('A');
    expect(list[1].title).toBe('B');
  });

  it('getExample returns an existing example', () => {
    const created = createExample({ title: 'Test', description: 'Desc' });
    const found = getExample(created.id);
    expect(found).toEqual(created);
  });

  it('getExample returns undefined for non-existent ID', () => {
    expect(getExample('999')).toBeUndefined();
  });

  it('updateExample updates and returns the example', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
    const created = createExample({ title: 'Old', description: 'old' });

    vi.setSystemTime(new Date('2024-06-01T00:00:00.000Z'));
    const updated = updateExample(created.id, { title: 'New', description: 'new' });
    vi.useRealTimers();

    expect(updated).toBeDefined();
    expect(updated!.title).toBe('New');
    expect(updated!.description).toBe('new');
    expect(updated!.id).toBe(created.id);
    expect(updated!.createdAt).toBe('2024-01-01T00:00:00.000Z');
    expect(updated!.updatedAt).toBe('2024-06-01T00:00:00.000Z');
  });

  it('updateExample returns undefined for non-existent ID', () => {
    expect(updateExample('999', { title: 'X', description: 'x' })).toBeUndefined();
  });

  it('deleteExample returns true for existing example', () => {
    const created = createExample({ title: 'Test', description: 'Desc' });
    expect(deleteExample(created.id)).toBe(true);
    expect(getExample(created.id)).toBeUndefined();
  });

  it('deleteExample returns false for non-existent ID', () => {
    expect(deleteExample('999')).toBe(false);
  });

  it('clearExamples removes all examples and resets ID counter', () => {
    createExample({ title: 'A', description: 'a' });
    createExample({ title: 'B', description: 'b' });
    clearExamples();
    expect(listExamples()).toEqual([]);
    const next = createExample({ title: 'C', description: 'c' });
    expect(next.id).toBe('1');
  });
});
