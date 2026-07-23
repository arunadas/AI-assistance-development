/**
 * Video 4.1: The Ralph Loop — Autonomous AI Agent Loop (snarktank/ralph)
 *
 * Performance acceptance criteria for the pagination utility.
 * See tasks/prd-pagination-performance.md for the full requirement.
 * Maps to story-8 in prd.json.
 *
 * 60 seconds is a hard ceiling, not a target — a correct in-memory
 * implementation should resolve in milliseconds. This guards against
 * accidental O(n^2) or full-rescan-per-page patterns as the utility evolves.
 */

import { paginate } from '../src/paginate';

interface LargeItem {
  id: string;
  value: number;
}

function buildLargeDataset(size: number): LargeItem[] {
  const items: LargeItem[] = new Array(size);
  for (let i = 0; i < size; i++) {
    items[i] = { id: `item-${i}`, value: i };
  }
  return items;
}

describe('paginate performance', () => {
  const DATASET_SIZE = 100_000;
  const TIME_BUDGET_MS = 60_000;
  const largeDataset = buildLargeDataset(DATASET_SIZE);

  it('completes a single page fetch within performance budget for 100k items', () => {
    const start = Date.now();
    const result = paginate(largeDataset, { first: 20 });
    const elapsed = Date.now() - start;

    expect(result.data).toHaveLength(20);
    expect(elapsed).toBeLessThan(TIME_BUDGET_MS);
  });

  it('completes 10 sequential page fetches within performance budget for 100k items', () => {
    const start = Date.now();

    let cursor: string | undefined;
    for (let page = 0; page < 10; page++) {
      const result = paginate(largeDataset, { first: 20, after: cursor });
      expect(result.data.length).toBeGreaterThan(0);
      cursor = result.nextCursor ?? undefined;
    }

    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(TIME_BUDGET_MS);
  });
});
