/**
 * Video 4.1: The Ralph Loop — Autonomous AI Agent Loop (snarktank/ralph)
 *
 * This file was built by Ralph iterations — each iteration is a fresh AI instance
 * that reads prd.json, implements the next user story, and exits.
 *
 * See prd.json for the user stories and progress.txt for iteration learnings.
 */

export interface PaginationResult<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export function paginate<T extends { id: string }>(
  items: T[],
  options: { first: number; after?: string },
): PaginationResult<T> {
  const { first, after } = options;

  // Handle empty dataset
  if (items.length === 0) {
    return {
      data: [],
      nextCursor: null,
      hasMore: false,
    };
  }

  // Decode the cursor if provided
  let startIndex = 0;
  if (after) {
    try {
      const decodedId = Buffer.from(after, 'base64').toString();
      const foundIndex = items.findIndex(item => item.id === decodedId);
      if (foundIndex !== -1) {
        startIndex = foundIndex + 1;
      }
    } catch {
      // Invalid cursor, start from beginning
      startIndex = 0;
    }
  }

  // Get the slice of items
  const endIndex = startIndex + first;
  const data = items.slice(startIndex, endIndex);

  // Check if there are more items
  const hasMore = endIndex < items.length;

  // Generate next cursor if there are more items
  const nextCursor = hasMore && data.length > 0
    ? Buffer.from(data[data.length - 1].id).toString('base64')
    : null;

  return {
    data,
    nextCursor,
    hasMore,
  };
}
