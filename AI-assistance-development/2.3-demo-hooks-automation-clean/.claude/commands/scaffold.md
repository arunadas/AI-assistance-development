# /scaffold $ARGUMENTS

Generate a new feature module with route and test files.

The feature name is provided as: $ARGUMENTS

## Steps

1. Read the existing `src/example-project/server.ts` to understand the current patterns (route structure, error handling, types).
2. Create a new route file at `src/example-project/$ARGUMENTS.ts` that:
   - Exports an Express Router
   - Includes GET (list all), GET by ID, POST (create), PUT (update), and DELETE endpoints
   - Uses the same error handling pattern as server.ts
   - Includes TypeScript interfaces for the resource
   - Uses in-memory Map storage (matching the existing pattern)
3. Create a test file at `src/example-project/$ARGUMENTS.test.ts` that:
   - Tests all CRUD operations
   - Tests error cases (404, 400)
   - Uses supertest (matching the existing test pattern)
4. Show how to wire the new router into server.ts (but don't modify server.ts automatically).

## Success Criteria

- New files follow the exact patterns from the existing codebase
- Tests pass when run with `npx jest`
- TypeScript compiles without errors
