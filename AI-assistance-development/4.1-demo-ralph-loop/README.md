# The Ralph Loop — Autonomous AI Agent Loop

## Overview

This demo uses [snarktank/ralph](https://github.com/snarktank/ralph), an open-source bash script that spawns fresh AI instances in a loop to autonomously implement a project from a PRD.

The key insight: **each iteration is a fresh AI instance with a clean context window**. Memory persists through git history, `prd.json`, and `progress.txt` — not through the AI's context.

## How Ralph Works

### Three-Step Workflow

1. **Write a PRD** — Define what you want built in plain markdown
2. **Generate `prd.json`** — Break the PRD into user stories, each with a `"passes": false` field
3. **Run `ralph.sh`** — The script loops, spawning a fresh AI instance per iteration

### The Loop

```
┌─────────────────────────────────────────┐
│  ralph.sh                               │
│                                         │
│  1. Read prd.json → find next story     │
│  2. Spawn fresh AI instance             │
│  3. AI implements story + runs tests    │
│  4. AI updates prd.json (passes: true)  │
│  5. AI appends learnings to progress.txt│
│  6. AI commits to git                   │
│  7. AI exits → loop back to step 1      │
│                                         │
│  Stop when: all stories pass            │
└─────────────────────────────────────────┘
```

### Why Fresh Context Matters

Traditional approach: one long AI session that accumulates context until the window overflows.

Ralph approach: each iteration starts fresh. The AI reads `prd.json` (what to do), `progress.txt` (what was learned), and git history (what was built). This means:

- **No context overflow** — each iteration uses a fraction of the context window
- **Compound learning** — `progress.txt` captures gotchas so later iterations avoid them
- **Natural checkpoints** — every iteration produces a git commit you can roll back to

## Files in This Demo

### Ralph Infrastructure
- `scripts/ralph/ralph.sh` — The loop script (adapted from snarktank/ralph)
- `prd.json` — User stories with pass/fail tracking
- `progress.txt` — Append-only learnings from each iteration
- `CLAUDE.md` — Prompt template for each AI instance

### Pagination Project (the task Ralph builds)
- `src/pagination-spec.md` — Requirements specification
- `src/paginate.ts` — Implementation (built by Ralph iterations)
- `tests/pagination.test.ts` — Acceptance criteria (7 test cases)

### Config
- `package.json`, `tsconfig.json`, `jest.config.js` — Build and test configuration

## Running the Demo

### Prerequisites
```bash
npm install
```

### Option 1: Run Ralph (fully autonomous)
```bash
./scripts/ralph/ralph.sh --tool claude
```

Ralph will loop through each user story, spawning a fresh Claude instance per iteration, until all stories in `prd.json` have `"passes": true`.

### Option 2: Inspect the completed state
This demo ships with all stories already passing. You can inspect:

```bash
# See the user stories and their status
cat prd.json

# See what Ralph learned across iterations
cat progress.txt

# Run the tests to verify everything passes
npm test
```

### Option 3: Reset and re-run
To watch Ralph work from scratch, reset `prd.json` (set all `"passes"` to `false`), delete `progress.txt`, and replace `src/paginate.ts` with a stub. Then run `ralph.sh`.

## Key Concepts

### Right-Sized Stories
Each story in `prd.json` should be small enough for one AI context window to implement. If a story is too big, the AI won't finish it in one iteration and the loop gets stuck.

### Memory via Git + Files (not AI context)
Ralph doesn't try to keep the AI's memory alive across iterations. Instead:
- **Git history** = what code was written
- **prd.json** = which stories are done vs. remaining
- **progress.txt** = what gotchas were discovered

### Supervision
Watch Ralph's progress in real-time:
```bash
# See which stories are passing
cat prd.json | python3 -c "import json,sys; d=json.load(sys.stdin); [print(f\"{'✅' if s['passes'] else '⬜'} {s['title']}\") for s in d['stories']]"

# See learnings accumulate
tail -f progress.txt
```

Set a max iteration limit to prevent infinite loops:
```bash
./scripts/ralph/ralph.sh --tool claude --max-iterations 10
```

## Learn More

- [snarktank/ralph on GitHub](https://github.com/snarktank/ralph) — The original open-source tool
- Geoffrey Huntley's pattern — The autonomous loop concept Ralph is based on
