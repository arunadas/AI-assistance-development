# PRD: Pagination Performance Guarantee (Large Datasets Under 60s)

## Introduction

The cursor-based pagination utility (`src/paginate.ts`) currently has no defined performance bound. As datasets grow large, the existing implementation risks slow lookups (e.g., if cursor resolution or slicing is implemented with `O(n)` scans in a way that compounds badly, or if the design is later extended in ways that regress performance). This feature adds a concrete, testable performance requirement: `paginate()` must return a page for a 100,000-item dataset in under 60 seconds, verified by an automated benchmark test rather than a runtime timer.

This is a quality/non-functional requirement layered on top of the existing pagination stories (`prd.json`, `src/pagination-spec.md`) — it does not change the public API or add new pagination behavior.

## Goals

- Guarantee `paginate()` completes in well under 60 seconds when called against a 100,000-item in-memory array.
- Add an automated, repeatable benchmark test that fails CI/local runs if the budget is exceeded.
- Document the performance expectation so future changes to `paginate()` don't silently regress it.
- Do not introduce runtime timers, timeouts, or thrown errors inside `paginate()` itself — this is a test-time guarantee, not a runtime guard.

## User Stories

### US-001: Add a large-dataset performance benchmark test
**Description:** As a developer maintaining `paginate()`, I want an automated test that measures execution time against a 100,000-item dataset, so that performance regressions are caught before they ship.

**Acceptance Criteria:**
- [ ] New test file (e.g. `tests/pagination.perf.test.ts`) generates a synthetic array of 100,000 items, each with a unique `id` field, using a helper (no manual fixture data).
- [ ] Test calls `paginate()` requesting a first page (e.g. `first: 20`) and measures wall-clock time using `Date.now()` or `performance.now()`.
- [ ] Test asserts the call completes in under 60,000ms (60 seconds). The assertion should be written with a clear, generous margin comment noting that 60s is a ceiling, not a target — the function is expected to run in milliseconds.
- [ ] Test also exercises a "middle of dataset" case: paginate through several pages via `nextCursor` (e.g. 10 sequential page fetches) against the 100,000-item dataset, asserting total time for all 10 fetches combined stays under 60 seconds.
- [ ] Test does not modify or depend on modifying `src/paginate.ts`'s public interface (`PaginationResult<T>`, `paginate<T>()` signature) defined in `src/pagination-spec.md`.
- [ ] `npm test` runs the new perf test alongside existing tests and it passes with the current/expected implementation.
- [ ] Typecheck passes (`tsc --noEmit` or project's existing typecheck script).

### US-002: Document the performance expectation
**Description:** As a future contributor to `paginate()`, I want the performance budget documented alongside the functional spec, so I understand the non-functional constraint when making changes.

**Acceptance Criteria:**
- [ ] `src/pagination-spec.md` gains a new "Performance" section stating: `paginate()` must handle a 100,000-item dataset and return a single page in under 60 seconds (target: well under 1 second; 60s is a hard ceiling verified by test, not a runtime-enforced timeout).
- [ ] Section notes there is no runtime timer or thrown timeout error — the guarantee is enforced only via the benchmark test in `tests/pagination.perf.test.ts`.
- [ ] Section briefly notes the expected algorithmic shape (e.g., cursor lookup should not require re-scanning the full array from the start on every call if avoidable) as guidance, without mandating a specific implementation.

## Functional Requirements

- FR-1: A benchmark test must generate a 100,000-item array with unique string `id` values (e.g. `item-${i}`) without hardcoding 100,000 literal fixture entries in the test file.
- FR-2: The benchmark test must call the existing `paginate<T>()` function exactly as specified in `src/pagination-spec.md` — no modification to the function's signature or behavior for the purpose of this feature.
- FR-3: The benchmark test must assert single-page-fetch time and cumulative 10-page sequential-fetch time are each under 60,000ms.
- FR-4: The benchmark test must not be flaky under normal CI conditions — avoid asserting sub-second thresholds that could fail on slow CI runners; 60s is the enforced ceiling.
- FR-5: `src/pagination-spec.md` must be updated with a "Performance" section documenting the 100,000-item / 60-second requirement.
- FR-6: This feature must not alter any of the 7 existing acceptance criteria/tests already defined in `prd.json` and `tests/pagination.test.ts`.

## Non-Goals (Out of Scope)

- No runtime timeout, `TimeoutError`, or retry mechanism inside `paginate()` — the function remains purely synchronous with no time-based branching logic.
- No support for datasets larger than 100,000 items in this iteration (e.g., 1M+ item stress tests are out of scope).
- No changes to the cursor format, encoding, or the `PaginationResult<T>` / `paginate<T>()` public interface.
- No UI, web page, or network-loading-spinner work — this repo has no web pages; this PRD is purely about the in-memory pagination function's performance.
- No changes to `scripts/ralph/ralph.sh` or the Ralph loop's iteration/exit behavior.

## Design Considerations

Not applicable — no UI component. This is a backend/library-only performance requirement.

## Technical Considerations

- Must integrate with the existing Jest test setup (`jest.config.js`) and TypeScript strict mode config (`tsconfig.json`).
- The 100,000-item array should be generated in a `beforeAll`/setup step or inline helper to avoid slowing down unrelated test runs; keep the perf test isolated in its own file so it can be run/skipped independently if needed.
- Follow the existing project convention: tests are acceptance criteria and should not be modified once written to pass a specific implementation — write the perf test to validate the *contract* (time budget), not implementation details.

## Success Metrics

- The new perf test passes consistently across local runs (target: paginate() actually completes in low milliseconds, not seconds, for a single page fetch against 100k items).
- No regression introduced to the 7 existing pagination test cases.
- Future changes to `paginate()` that introduce an accidental `O(n^2)` or similarly slow pattern would cause the perf test to fail, catching the regression before merge.

## Open Questions

- Should this become `story-8` in `prd.json` so the Ralph loop picks it up automatically, or should it remain a standalone follow-up PRD outside the current Ralph story sequence? (Recommend: add as `story-8` once `story-1` through `story-7` all pass, to preserve the "implement stories in order" rule in CLAUDE.md.)
- Should the perf test run as part of the default `npm test` command, or be split into a separate `npm run test:perf` script to keep the default test suite fast? (Recommend: include in default `npm test` since 100k items should resolve in milliseconds if `paginate()` is implemented reasonably.)
