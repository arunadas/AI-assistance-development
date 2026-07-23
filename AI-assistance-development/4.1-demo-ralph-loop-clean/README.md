# Chapter 4.1: The Ralph Loop — Clean Starting Point

## Overview

This is a clean starting point for the Ralph Loop demo. Use this to demonstrate how [snarktank/ralph](https://github.com/snarktank/ralph) autonomously iterates through user stories until all tests pass.

## What's Here

### Ralph Infrastructure (ready to go)
- `scripts/ralph/ralph.sh` — The loop script
- `prd.json` — 7 user stories, all with `"passes": false`
- `CLAUDE.md` — Prompt template for each AI instance

### Pagination Project (the task Ralph will build)
- `src/paginate.ts` — Stub implementation (throws "Not implemented")
- `src/pagination-spec.md` — Full requirements specification
- `tests/pagination.test.ts` — 7 acceptance tests (all will fail initially)

## Quick Start

```bash
npm install
npm test          # See 7 test failures — this is expected!
```

## Run Ralph

```bash
./scripts/ralph/ralph.sh --tool claude
```

Ralph will spawn fresh Claude instances in a loop. Each instance:
1. Reads `prd.json` to find the next incomplete story
2. Implements the code for that story
3. Runs `npm test` to verify
4. Updates `prd.json` (marks `"passes": true`)
5. Appends learnings to `progress.txt`
6. Commits to git and exits

The loop continues until all 7 stories pass.

## What to Watch For

- **`prd.json`** — Stories flip from `false` to `true` as Ralph progresses
- **`progress.txt`** — Created automatically, captures learnings from each iteration
- **`src/paginate.ts`** — Grows from a stub to a full implementation
- **Git log** — Each iteration produces a clean commit

## Success Criteria

All 7 tests pass and all stories in `prd.json` show `"passes": true`.
