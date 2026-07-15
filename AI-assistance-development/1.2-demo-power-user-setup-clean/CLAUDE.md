# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

This is the **clean starting point** for the "Power User Setup" demo: a minimal Express.js + TypeScript app used to demonstrate Claude Code hooks, settings, and custom commands. `src/app.ts` and `src/app.test.ts` currently contain only TODO stubs (skipped tests, no routes implemented) — the exercise is to implement them.

A separate, fully-implemented sibling project (`1.2-demo-power-user-setup`) exists elsewhere with the completed `app.ts`/`app.test.ts` for comparison.

## Commands

- `npm run dev` — run the app directly via ts-node
- `npm run build` — compile TypeScript to `dist/` (tsc)
- `npm test` — run the Jest test suite
- `npx jest src/app.test.ts` — run a single test file
- `npx jest -t "test name"` — run a single test by name
- `npm run lint` — ESLint over `src/**/*.ts`
- `npm run format` — Prettier write over `src/**/*.{ts,json,md}`

There is no `.claude/` directory (hooks/settings/commands) present in this copy of the repo, despite the README describing PreCommit/PostFileWrite hooks and model/permission settings — those are part of the demo materials, not currently configured here.

## Architecture

- Single-file Express app: `src/app.ts` exports the `Express` app instance (no `app.listen` call at module scope pattern expected — check before adding one, since tests import the app directly via `supertest` rather than hitting a running server).
- Tests (`src/app.test.ts`) use `supertest` against the exported `app`, one `describe` block per route: `GET /health`, `GET /features`, `POST /tasks`, `GET /tasks/:id`.
- `tsconfig.json` excludes `**/*.test.ts` from the build; `jest.config.json` (ts-jest, node env) restricts test discovery to `src/`.
- No persistence layer — tasks created via `POST /tasks` are expected to be held in memory only (no DB is configured anywhere in this project).
