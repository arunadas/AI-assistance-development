# Task: Build a Pagination Utility

## Requirements

- **Cursor-based pagination** (not offset-based)
- **Works with any array of items** (generic type parameter)
- **Returns** `{ data, nextCursor, hasMore }`
- **Handles**: empty results, single page, multi-page navigation
- **TypeScript** with strict generics for type safety
- **Cursor format**: Base64-encoded item ID (opaque to caller)

## Acceptance Criteria (tests must pass)

- [ ] Returns correct data for first page
- [ ] Returns correct nextCursor for subsequent pages
- [ ] Returns `hasMore: false` on last page
- [ ] Handles empty dataset without throwing
- [ ] Type-safe — generic T matches item type
- [ ] Works with different page sizes (1, 2, 5, etc.)
- [ ] Cursor decodes correctly for continuation

## Interface

```typescript
export interface PaginationResult<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export function paginate<T extends { id: string }>(
  items: T[],
  options: { first: number; after?: string }
): PaginationResult<T>;
```

## Design Notes

### Cursor Format
Cursors are **opaque to the caller**. Internally, they encode the ID of the last item returned:

```
Page 1: Return items 0-1, nextCursor = base64("2") [ID of next item]
Page 2: Caller passes after: "MiI=", we decode to "2", return items 2-3
Page 3: Continue pattern...
```

### Error Handling
- Empty dataset: return `{ data: [], nextCursor: null, hasMore: false }` (don't throw)
- Invalid cursor: return empty results or fall back to beginning (spec choice)
- Page size ≤ 0: throw `Error` or `ValidationError`

### Generics
The constraint `<T extends { id: string }>` ensures every item has an ID. This is **required** for cursor-based pagination.

## Example Usage

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

const users: User[] = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
  { id: '3', name: 'Charlie', email: 'charlie@example.com' },
];

// Page 1
const page1 = paginate(users, { first: 2 });
console.log(page1);
// {
//   data: [
//     { id: '1', name: 'Alice', email: 'alice@example.com' },
//     { id: '2', name: 'Bob', email: 'bob@example.com' }
//   ],
//   nextCursor: 'MiI=',  // base64("2")
//   hasMore: true
// }

// Page 2
const page2 = paginate(users, { first: 2, after: page1.nextCursor });
console.log(page2);
// {
//   data: [{ id: '3', name: 'Charlie', email: 'charlie@example.com' }],
//   nextCursor: null,
//   hasMore: false
// }
```

## Testing

Run with:
```bash
npm run test:pagination
```

All 7 test cases must pass.
