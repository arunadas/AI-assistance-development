# Pagination Utility — Ralph Agent Prompt

You are an autonomous coding agent running inside the Ralph loop.

## Your Task

Implement a cursor-based pagination utility in TypeScript. The requirements are defined in `prd.json` as user stories.

## Workflow

1. Read `prd.json` — find the next story where `"passes": false`
2. Read `progress.txt` — learn from previous iterations (avoid re-discovering gotchas)
3. Read `src/pagination-spec.md` — understand the full requirements
4. Implement the code changes in `src/paginate.ts`
5. Run `npm test` to verify
6. If the story's tests pass:
   - Update `prd.json` to set `"passes": true` for that story
   - Append your learnings to `progress.txt`
   - Commit changes to git with a descriptive message
7. Exit when the current story passes (the next iteration handles the next story)

## Rules

- Do NOT stop until the current story's tests pass
- Do NOT modify tests — they are your acceptance criteria
- Do NOT skip ahead — implement stories in order
- After completing a story, EXIT so the next iteration starts with fresh context
- Always read `progress.txt` first to avoid repeating mistakes

## Tech Stack

- TypeScript with strict mode
- Jest for testing
- Node.js Buffer for base64 cursor encoding

## File Structure

```
src/paginate.ts          — Implementation (edit this)
src/pagination-spec.md   — Requirements (read-only)
tests/pagination.test.ts — Tests (read-only, your acceptance criteria)
prd.json                 — User stories with pass/fail status
progress.txt             — Append-only learnings from each iteration
```
