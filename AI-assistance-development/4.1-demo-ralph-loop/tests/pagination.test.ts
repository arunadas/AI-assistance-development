/**
 * Video 4.1: The Ralph Loop — Autonomous AI Agent Loop (snarktank/ralph)
 *
 * These tests define the acceptance criteria for the pagination utility.
 * Each test maps to a user story in prd.json.
 * Ralph iterates until all stories (and their tests) pass.
 */

import { paginate } from '../src/paginate';

interface TestItem {
  id: string;
  name: string;
}

const items: TestItem[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Charlie' },
  { id: '4', name: 'Diana' },
  { id: '5', name: 'Eve' },
];

describe('paginate', () => {
  it('returns correct data for first page', () => {
    const result = paginate(items, { first: 2 });
    expect(result.data).toEqual([
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
    ]);
    expect(result.hasMore).toBe(true);
    expect(result.nextCursor).toBeTruthy();
  });

  it('returns correct nextCursor for subsequent pages', () => {
    const page1 = paginate(items, { first: 2 });
    const page2 = paginate(items, { first: 2, after: page1.nextCursor! });
    expect(page2.data).toEqual([
      { id: '3', name: 'Charlie' },
      { id: '4', name: 'Diana' },
    ]);
    expect(page2.hasMore).toBe(true);
  });

  it('returns hasMore: false on last page', () => {
    const page1 = paginate(items, { first: 2 });
    const page2 = paginate(items, { first: 2, after: page1.nextCursor! });
    const page3 = paginate(items, { first: 2, after: page2.nextCursor! });
    expect(page3.data).toEqual([{ id: '5', name: 'Eve' }]);
    expect(page3.hasMore).toBe(false);
    expect(page3.nextCursor).toBeNull();
  });

  it('handles empty dataset', () => {
    const result = paginate([], { first: 10 });
    expect(result.data).toEqual([]);
    expect(result.hasMore).toBe(false);
    expect(result.nextCursor).toBeNull();
  });

  it('is type-safe — generic T matches item type', () => {
    const result = paginate(items, { first: 1 });
    // TypeScript should know result.data is TestItem[]
    const firstName: string = result.data[0].name;
    expect(firstName).toBe('Alice');
  });

  it('works with different page sizes', () => {
    const result = paginate(items, { first: 5 });
    expect(result.data).toHaveLength(5);
    expect(result.hasMore).toBe(false);
    expect(result.nextCursor).toBeNull();
  });

  it('cursor decodes correctly for continuation', () => {
    const page1 = paginate(items, { first: 1 });
    // Cursor should be base64-encoded
    const decoded = Buffer.from(page1.nextCursor!, 'base64').toString();
    expect(decoded).toBe('1'); // ID of last item in page
  });
});
