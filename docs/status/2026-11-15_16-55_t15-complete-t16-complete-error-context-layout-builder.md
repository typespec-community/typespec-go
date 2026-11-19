# Status Report — T15 Complete, T16 Complete (error context, layout builder, mock functions)

**Date:** 2026-11-15 16:55
**Branch:** `lars/lets-rock` · **HEAD:** `4990924` (pushed, CI GREEN 43723542135)
**Gates at HEAD:** 206/206 tests (43 files) · eslint 0/0 · strict 0 · dprint clean · e2e green (`go build` + `gofmt -l` raw, both examples) · docs-gates 5/5
**Prior report:** [13:42 session report](./2026-11-15_13-42_ci-truth-t13-visibility-t14-generics-t15-start-and-concurrent-session-reconciliation.md) (its §f1–f3 and §f11–f15 are done at `02b3e9f` / `4990924`, annotated there)

## Session arc

Three commits, each gate-verified and CI-green:

1. `9ccc599` — landed the 13:42 status report + TODO_LIST harvest rows that were
   uncommitted at session start.
2. `02b3e9f` — **T15 finished** (all three remaining sub-items):
   - Per-namespace try/catch in `$onEmit`: generation failures now rethrow as
     `Failed to generate Go package for namespace 'X' (package 'y'): <cause>`
     with the original error preserved as `cause` (ES2022 ErrorOptions).
  - New test `src/test/emitter-error-context.test.ts` uses `vi.mock` on
    GoPackageDirectory to throw, asserting the enriched message AND the cause
    identity. Test count 201 → 202.
   - MAPPING-GUIDE § Naming conventions (new section): receiver table (`s` for
     handlers, `e` for enum/error methods), `<Pkg>Service` (handlers.go) vs
     `<Pkg>API` (interfaces.go), handler methods named `<operation.name>Handler`
     — every row verified against the components, not invented.
   - TODO_LIST Service/API row flipped with dated verdict (landed in
     MAPPING-GUIDE, not DOMAIN_LANGUAGE.md — that file does not exist).
3. `4990924` — **T16 finished** (all five sub-items):
   - Mapper unify: `getOutputDirectory` now delegates to
     `namespaceToPackageName` (single source of truth for namespace→path).
   - MockFactory class → named module functions (`createModel`,
     `createProgram`, …) across 16 consumer files; the private
     `createPropertiesMap` is a module function; `createEmitContext` no longer
     uses `this`.
   - File-layout builder: new pure `buildPackageFileLayout` in
     `src/domain/package-layout.ts` (which optional files exist, which imports
     they need, Service/API identifiers); GoPackageDirectory now only renders.
     New `src/test/package-layout.test.ts` (4 tests). Test count 202 → 206.
   - Cast sweep: clean-type-mapper.ts has **zero structural casts** —
     discriminated-union narrowing on `kind` replaced `(type as {kind…})` at
     every typed site; one runtime-safe `hasKind` helper holds the single
     remaining cast for the deliberately-`unknown` type guards; cache key
     reads `type.name` directly.
   - Filename-case decision (report item 15): lowercase generated filenames;
     multi-word names use snake_case, never kebab-case — recorded in
     MAPPING-GUIDE § Naming conventions.
   - CHANGELOG [Unreleased] gained error-clarity + T16 bullets; gates line
     ratcheted 201→206.

## a) FULLY DONE

| Item | Evidence |
| --- | --- |
| Uncommitted 13:42 report + harvest landed | `9ccc599`, CI 43719006683 green |
| T15 (a) per-namespace error context | `src/emitter/typespec-go-emitter.tsx` try/catch; test asserts namespace + package + cause (`02b3e9f`) |
| T15 (b) receiver + Service/API conventions doc | MAPPING-GUIDE § Naming conventions (`02b3e9f`) |
| T15 (c) TODO_LIST flips | Service/API row DONE with dated verdict (`02b3e9f`) |
| T16 mapper unify | emitter `getOutputDirectory` delegates (`4990924`) |
| T16 MockFactory → functions | 16 consumers rewritten, imports sorted, oxfmt clean (`4990924`) |
| T16 file-layout builder | `src/domain/package-layout.ts` + GoPackageDirectory render-only + 4 tests (`4990924`) |
| T16 cast reduction | 0 structural casts left in clean-type-mapper (`4990924`) |
| T16 filename-case decision | MAPPING-GUIDE (lowercase / snake_case) (`4990924`) |
| CHANGELOG ratchet | error-clarity + T16 bullets; 206/206 (43 files) |
| CI green on every landed commit | runs 43719006683, 43722607495, 43723542135 |

## b) PARTIALLY DONE

- **13:42 report annotation.** Its §b1 (T15 remainder) and §f items 11–15 are
  done at `02b3e9f`/`4990924` and now struck in that report; items 5–10 and
  16–18 (T22, T17, return-union, interface assertions, goimports gate, runtime
  smoke test, PR #13 close, README, COMPONENTS.md) remain open and unstruck.
- **Docs truth.** CHANGELOG and TODO_LIST are current; AGENTS.md is not (see d).

## c) NOT STARTED

- **T17** — third example (versioned namespaces + discriminated unions).
- **T22** — recreate the dependabot bump (alloy 0.26 + emitter-framework 0.22)
  on the current tree through full gates; answer alloy-0.26×TS-6 compatibility.
- **T20** — npm publish: owner-gated (13:42 §g Q1), correctly untouched.
- **Return-union semantics** (`Widget | Error` → `interface{}` today) — design
  first, then TypeExpression union branch.
- **Interface signature e2e assertions**, **`goimports -l` gate**, **runtime
  handler smoke test**, **README options section**, **COMPONENTS.md recount**,
  **dependabot PR #13 closure** — all still open from the 13:42 list.

## d) TOTALLY FUCKED UP

Nothing landed broken; every commit is CI-green and the tree is clean. Honest
incidents, in order of severity:

1. **AGENTS.md staleness left behind (forgotten work).** It still claims
   "177/177 tests, 37 files, HEAD `8205ea3`, 2026-11-13" (three places) and
   references the deleted `GoRouteRegistrationComponent.tsx` (twice). Test
   count moved 201→202→206 this session and I updated CHANGELOG/TODO_LIST but
   not AGENTS.md. Harvested as §f2 below.
2. **Brace imbalance in mapMapType.** My multiedit removed one nesting level of
   the map branch but left the old closers — syntax error caught immediately by
   file diagnostics, fixed in the next edit. A whole-function
   `lsp_replace_symbol` would have made this impossible.
3. **Edit-tracker churn.** Three edit attempts failed with "file modified since
   read" because I read files via bash (`sed`/`grep`), which does not register
   as a read. Cost ~3 wasted round trips; no damage.
4. **sed indent litter.** Indenting the loop body for the try/catch added
   trailing whitespace to blank lines; cleaned in a follow-up sed. Cosmetic,
   but I should not create it.
5. **First MAPPING-GUIDE table draft had a wrong claim** (handler methods as
   "`<Operation> PascalCase`") — corrected to the verified
   `<operation.name>Handler` before landing. Caught during research, never
   committed.

## e) WHAT WE SHOULD IMPROVE

- **Read-before-edit discipline:** always register file reads through `view`
  before editing; bash reads don't sync the edit tracker.
- **Whole-function rewrites** via `lsp_replace_symbol` (no whitespace
  matching, no brace-count risk) instead of sed-indent + two edits.
- **Doc-count ratchet:** AGENTS.md/FEATURES.md numeric claims (test counts,
  HEAD) rot silently. Either drop exact counts from AGENTS.md (point at
  TODO_LIST/CHANGELOG) or teach docs-gates freshness to verify them.
- **Mock fragility:** `emitter-error-context.test.ts` replaces the
  GoPackageDirectory module with a factory exposing only one export; if the
  real module gains exports consumed through that import path, the mock breaks
  it. Use `importActual` spread + override (§f9).
- **pnpm-audit warning:** minimatch `>=7.0.0 <11.0.1` (globparts
  amplification) now warns on every BuildFlow run. Not gate-blocking, but it
  will nag forever until overridden or bumped (§f8).
- **Concurrent-session hygiene:** the daemon-capture risk from yesterday did
  not bite this session (tree was clean at every step), but the ritual
  (`bun install --frozen-lockfile` + `git log` + `git status` after any foreign
  dependency-touching commit) remains manual — see §g Q1.

## f) NEXT (priority order)

1. T22: recreate dependabot bump (alloy 0.26 + emitter-framework 0.22) on the
   current tree through the full local gate set; report alloy-0.26×TS-6 status.
2. T17: example #3 — versioned multi-namespace API + discriminated union,
   GetType + UnmarshalX exercised by the e2e gate.
3. T20 (owner-gated, §g Q1): npm publish decision — fold HTTP chain into
   v1.0.0 vs ship v1.1.0; document the verdict either way.
4. Return-union semantics: strip `@error`-decorated variants → emit `*Widget`
   instead of `interface{}` (design first, touches TypeExpression union
   branch).
5. Interface signature assertions in the e2e net (interfaces.go must not
   contain `interface{}` for scalar path params).
6. Add `goimports -l` to `scripts/test-e2e-cli.mjs` so import grouping is
   gate-enforced.
7. Runtime handler smoke test: mount RegisterRoutes in a Go test, GET + POST
   with body.
8. minimatch audit finding: override to a patched version in package.json
   `overrides` (same ritual as the 10 existing pins) or accept with rationale.
9. Harden `emitter-error-context.test.ts`: `vi.importActual` spread + override
   for GoPackageDirectory so future extra exports don't break the mock.
10. AGENTS.md truth pass: fix 177/177 → current counts (or drop exact counts),
    remove both `GoRouteRegistrationComponent.tsx` references, refresh HEAD
    pointer.
11. Close stale dependabot PR #13 with a pointer to the recreation commit.
12. README: document `visibility-mode` + `go-module-path` options, decorator
    quick-reference, `<Pkg>API`/`<Pkg>Service` naming contract.
13. COMPONENTS.md recount after route-component deletion + core additions.
14. TODO_LIST: verify the 10 root-cleanup `D` entries landed as separate
    reviewable commits (daemon-trust check).
15. TODO_LIST: agree the session-coordination convention (root-cleanup §g3,
    see §g Q1).
16. TODO_LIST: cache the docs-gates go install in CI (or vendor the binary);
    verify the step isn't masked by continue-on-error.
17. Generated-doc comments: one doc block per package, not per type
    (IN_PROGRESS row — `GoStructDeclaration` default doc still repeats).
18. Dead-code audit in `src/domain/`: `struct-generator.ts`, `union-generator.ts`,
    `generator-utils.ts`, `go-code-validation.ts`, `error-*.ts` — confirm each
    has a live consumer or remove it (ghost-system sweep).
19. Root `go.mod` is a placeholder (`module <module-path>`) so `go run` fails
    inside the repo — either fix the module path or keep it documented as a
    gotcha in AGENTS.md only.
20. ROADMAP: per-lifecycle visibility variants (Create/Update suffixed types)
    after the read-mode option proved the compiler-API approach.
21. ROADMAP: benchmark suite (AGENTS.md success-metrics gap, unchanged).
22. Coverage reporting: wire vitest coverage with thresholds (pre-existing
    sprint item, still absent).
23. Emitter logging: the `console.warn` inside GoHandlerStub return-type
    extraction is invisible under vitest — route it through structured-logging
    and assert in a test.
24. CHANGELOG gates-count ratchet is manual per commit; consider a tiny script
    or docs-gates freshness check keyed off `npm run test:typespec` output.
25. `GoPackageDirectory` still imports both `SourceFile as CoreSourceFile` and
    `go.SourceFile` — after the layout extraction, consider naming clarity
    (one import, explicit alias) in a follow-up T16 pass.
26. Extend the emitter wrap context: `@go.pkg` resolution errors are inside the
    try (good) — verify in a test that an invalid `@go.pkg` value surfaces with
    namespace context rather than raw.
27. e2e: add a needle asserting the handlers.go import block is a single
    grouped std block (locks in the T15 sorted-imports fix against regressions).
28. Docs: MAPPING-GUIDE could use a Generics § note that constraints are
    declare-only `any` (currently implied, not stated).
29. Naming: `unionsEmitUnmarshalImports` logic now lives in
    `buildPackageFileLayout` as `imports.unionsJsonFmt` — sweep MAPPING-GUIDE
    for any stale mention of the old helper name. (None found this session;
    re-check after T17.)
30. Consider `typespec-go-emitter.tsx` split (50-statement `$onEmit`) — extract
    option parsing + per-namespace generation into helpers; pure mechanical,
    improves testability of option validation.

## g) OWNER QUESTIONS

1. **Session concurrency policy:** two concurrent sessions committed into this
   branch mid-flight twice on 2026-11-15, and daemons captured in-flight diffs.
   Do you want a lock/claim convention (e.g., a "claimed by" row in TODO_LIST
   before `src/`-adjacent work, honored by all sessions), or is the
   post-foreign-commit ritual (`bun install --frozen-lockfile` + `git log` +
   `git status`) enough?
2. **TS 7 posture:** TypeScript is pinned 6.0.2 because alloy CLI 0.22 crashes
   under TS 7 (`ts.sys` undefined, commit `d289c86`). Should T22 (alloy 0.26)
   also try TS 7 in a throwaway branch to learn whether 0.26 fixed it, or do
   we stay on 6.0.2 until alloy documents TS 7 support?
3. **Return-union semantics:** operation return types like `Widget | Error`
   currently degrade to `interface{}`. My recommendation: strip
   `@error`-decorated variants and emit `*Widget` (pointer implies
   absence-of-error), tracking real error channels later. Confirm, or do you
   want a different shape (e.g., result structs `Result[Widget]`)?

## Annotate

- 13:42 report §b1 (T15 remainder a/b/c): done at `02b3e9f`
- 13:42 report §f1 (per-namespace wrap): done at `02b3e9f`
- 13:42 report §f2 (conventions section): done at `02b3e9f`
- 13:42 report §f3 (TODO_LIST flips): done at `02b3e9f`
- 13:42 report §f11 (mapper unify): done at `4990924`
- 13:42 report §f12 (MockFactory → functions): done at `4990924`
- 13:42 report §f13 (file-layout builder): done at `4990924`
- 13:42 report §f14 (cast reduction): done at `4990924`
- 13:42 report §f15 (filename-case decision): done at `4990924`

## Addendum — 2026-11-19 (post-publication events)

This report is a point-in-time snapshot of 2026-11-15 ~16:55; the header
claim "HEAD `4990924`, CI GREEN" was true then and is historical now:

- **2026-11-17 (`45fa15e`, concurrent session):** TypeScript was upgraded
  6.0.2 → 7.0.2 again — the exact crash recipe reverted at `d289c86`. CI run
  44059374575 fails at `alloy build` with the documented signature
  (`TypeError: Cannot read properties of undefined (reading
  'getCurrentDirectory')` — alloy CLI 0.22 × TS 7). **CI has been red on
  HEAD since 2026-11-17.** This session's commit also swept this report, the
  TODO_LIST harvest rows, and the 13:42 §b1/§c annotations (all uncommitted
  at the time) into its commit.
- Local gates do NOT catch this: the local `node_modules` still holds the
  stale TS 6.0.2 install (the trap documented in AGENTS.md).
- A further in-flight, uncommitted `package.json`/`bun.lock` diff (eslint
  8.73.0, coverage-v8 5.1.1) belongs to that session — untouched here.
- Disposition: pinned as TODO_LIST "Re-land TS 6.0.2 pin (or fix alloy×TS7)"
  — owner question 2 below still stands unanswered.

