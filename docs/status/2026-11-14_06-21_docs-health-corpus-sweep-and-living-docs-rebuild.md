# Docs-Health Corpus Sweep and Living-Docs Rebuild — Status Report

**Date:** 2026-11-14 06:21 CET
**Session scope:** single session — docs-gates remediation (3 red gates → all green), full ANNOTATE/ARCHIVE sweep of the historical report corpus, rebuild of all six living docs.
**Branch:** `lars/lets-rock` · **HEAD at session start:** `8205ea3`

> **Scope line — what this report VERIFIED:** every claim below was verified this
> session by running commands locally: `npm test -- --run` (twice), `npm run lint`,
> `./node_modules/.bin/tsc --noEmit --strict`, `./node_modules/.bin/alloy build`,
> `docs-gates run .` (final: 5/5 PASS), `git log --diff-filter=A` for evidence
> hashes, and the docs-health gate tools (`check-rows --strict`, `bare-rows`,
> `prose-items`, `freshness --pre-flight`) over every touched file.
> **What this report did NOT verify:** the CLI end-to-end path (`tsp compile` with a
> built emitter — no `dist/` built this session), gofmt conformance of generated Go
> (claim removed from README as unverified), COMPONENTS.md component counts (not
> recounted), anything inside the pre-canon `docs/status/archived-2025-12-04/`
> layer, and whether the auto-commit daemon has committed the working tree.

---

## Session context

The session opened with `docs-gates run .` failing 3 of 5 gates:

| Gate      | Start of session                                   | End of session |
| --------- | -------------------------------------------------- | -------------- |
| freshness | PASS                                               | PASS           |
| audit-all | PASS (28 reports, 0 unharvested)                   | PASS           |
| annotate  | FAIL — 9 rule-F spacing findings                   | PASS (0 findings, ~1,391 struck items) |
| routing   | FAIL — 98 unrouted open rows across 28 reports     | PASS (0 unarchived reports, 0 unrouted) |
| cadence   | FAIL — ARCHIVE-OVERDUE (28 reports, oldest 344 days) | PASS (ARCHIVE-HEALTHY) |

## a) FULLY DONE

1. **All five 2026-0* status reports read in full** (2026-01-01_11-09, 2026-01-01_14-57, 2026-01-02_06-32, 2026-01-02_09-00, 2026-01-02_09-55 — 4,302 lines) plus the 2025-12-04_20-28 report; every other corpus file annotated via five parallel subagent sweeps that verified each verdict against git history before striking.
2. **Corpus annotation:** all 28 unarchived reports fully annotated inline — every open checkbox, numbered item, and table data row carries a resolvable verdict (`done at <hash>` / `Won't implement` / `NOT-DO` / `Superseded` / routed) or was routed to the living docs. ~1,391 struck items total.
3. **All 9 rule-F spacing findings fixed** without corrupting the TypeScript snippets (single space inserted between tagged-template names and opening backticks — valid TSX).
4. **8 verdict-less TL;DR strikes repaired** (subagents struck claims without appending canonical verdict markers — caught by the annotate gate, fixed by hand).
5. **All 28 reports archived** to `docs/status/archived/` — gates run BEFORE `git mv` on every file, `> **Live remainder:**` banner inserted in each, bulk-archive manifest written to `docs/status/archived/README.md` (28 rows, classification + deciding reason).
6. **Completeness gate over the moved set:** every archived file carries strikethrough resolutions (`grep -L '~~'` over the 28 moved files: zero hits).
7. **TODO_LIST.md rebuilt** from scratch: 3 high-impact, 5 medium-impact, 3 low-impact rows — every row cites file:line evidence verified this session — plus a verified-baseline table (165/165 tests, local build green, CI red, lint red, strict-check red, zero `any` in production).
8. **FEATURES.md rebuilt** as a 41-row evidence-backed inventory (was internally self-contradictory: header claimed 165/165 passing while the body listed 16 features as broken).
9. **CHANGELOG.md** gained dated, hash-cited sections for 2026-01 integration breakthrough, 2026-04 hardening, 2026-11 tooling, and the 2026-11-14 docs sweep (append-only respected).
10. **ROADMAP.md** updated: routed items from all five sweeps merged (error boundaries, community plumbing, guides, v1.0 release, raw-ideas backlog block).
11. **README.md** de-hyped: sub-millisecond claim removed (never verified, no benchmark suite exists), status banner added (165/165, CI red), feature-completeness list corrected, Resources section completed.
12. **AGENTS.md** de-crisis'd: test-status section updated (111/125 → 165/165), stale "38 TypeScript errors" priorities replaced with the current 5-row sprint list, `go/index.ts` "exports disabled" claim corrected (all components are re-exported), and a NON-OBVIOUS GOTCHAS section added (placeholder `go.mod`, nix `bun` without `bunx`, CI crash anatomy, `alloy build` vs `tsc`, docs-gates ritual, dprint table-strike interaction).
13. **Harvest completed:** every genuinely-open item discovered by the sweeps was routed into TODO_LIST.md or ROADMAP.md in the same session — the freshness audit-all replay passes against the living lines.
14. **Root-cause formatter guard:** `pnpm-lock.yaml` and `docs/status/**` / `docs/reports/**` excluded from dprint so a formatter pass can never again re-wrap per-cell strike annotations (the 2026-10-15 damage class).
15. **Final verification:** `docs-gates run .` → 5/5 PASS; `npm test -- --run` → 165/165 tests, 36 files (twice).

## b) PARTIALLY DONE

1. **CI is still red.** The workflow exists (`.github/workflows/ci.yml`, added `bae8473`) but the build step crashes: `bunx alloy build` dies with `TypeError: Cannot read properties of undefined (reading 'getCurrentDirectory')` — the alloy CLI reads `ts.sys` at load time and the tree pins TypeScript 7.0.2. Local `./node_modules/.bin/alloy build` passes. Diagnosed, documented, not fixed (code change — out of this session's docs scope).
2. **Lint debt documented, not cleared:** 13 `no-explicit-any` errors + 1 unused-var warning across `src/test/enum-union-integration.test.tsx`, `src/test/doc-decorator-support.test.tsx`, `src/testing/go-component-test-utils.tsx`; `npm run lint` fails its `--max-warnings 0` bar.
3. **Strict type-check debt documented, not cleared:** 28 errors from `tsc --noEmit --strict` (missing `node` types in `src/domain/structured-logging.ts:267` and `src/emitter/typespec-go-emitter.tsx:11`; `unknown → Model` casts across 9 test files).
4. **Test-infra flake observed but not root-caused:** one of two test runs caught an unhandled `EnvironmentTeardownError` (late load of `jsx-runtime.js` via `GoSwitch.tsx:9`); recorded as a TODO row with the observed evidence instead of a guess-fix.
5. **`.config/metadata.yaml` dprint churn:** the yaml plugin re-formats it on every `dprint fmt`; I restored the collateral this session but only excluded the lockfile — the metadata churn will recur until excluded.
6. **Pre-canon archive layer untouched:** `docs/status/archived-2025-12-04/` still holds ~dozens of old reports that never passed the modern archive gates; the gates don't scan it, so this is latent, not broken.

## c) NOT STARTED (all harvested into TODO_LIST.md / ROADMAP.md — nothing lives only in this report)

1. Filter built-in TypeSpec-namespace models in the emitter (`collectTypesByNamespace` has no `TypeSpec` filter — verified absent this session).
2. Deduplicate type mapping into CleanTypeMapper (`mapTypeSpecToGoType` still at `src/components/go/GoStructDeclaration.tsx:130`).
3. HTTP decorator extraction coverage (`@typespec/http` loading in the test harness).
4. CLI end-to-end verification (`tsp compile` through the built emitter).
5. Coverage reporting with a threshold.
6. Everything in ROADMAP's new raw-ideas backlog: ghost-system dispositions (CALL_GRAPH split brain, StandaloneGoGenerator, dead test files, root-level legacy reports), CI/docs-gates wiring, generated-output conformance tests, and the long-term feature surface (`@go.*`, `@error`, `@visibility`, generics, benchmarks, error boundaries).

## d) TOTALLY FUCKED UP (session mistakes — brutally honest)

1. **Batch-split miss:** I assigned 27 of 28 reports to the five subagent batches and silently dropped `2025-12-04_20-28_CRITICAL-ALLOY-JS-ARCHITECTURE-EMERGENCY.md`. Caught only because the gate output still listed its rule-F finding after the sweeps started. An entire file was one careless list-edit away from being archived-unannotated — which the archive gates would have refused, but I should never have relied on that backstop.
2. **Rule-F assignment miss:** the four spacing findings in `2025-12-11_11-37_ALLOY-JS-FIX-IMPLEMENTATION-PLAN.md` were in a batch whose brief never mentioned them (I only injected rule-F fixes into two of five briefs). Had to fix them by hand afterwards.
3. **Archive script shipped with a relative-path bug:** first run failed all 28 files with GATE-FAIL because the gates executed from `/tmp/annotate-run` against repo-relative paths. The gates-before-mv discipline worked exactly as designed — but the bug existed only because I wrote the script assuming one cwd.
4. **Batch verification grep produced 28 false FAILs:** my pattern matched the literal tool name (`bare-rows` contains "bare"). All 28 files were green; my check said every one of them failed. Exit codes, not greps, should have been the interface.
5. **Formatter collateral damage:** bare `dprint fmt` over the repo mid-task re-formatted `pnpm-lock.yaml` (3,407 changed lines) and `.config/metadata.yaml`. I restored both, but a scoped `dprint fmt <files>` was the correct call from the start.
6. **Subagent quality gaps I then had to repair:** B5 died on a provider rate limit mid-pass (resumed with an explicit remainder list); B1/B2/B4 left TL;DR strikes without canonical verdict markers (8 gate findings); B2 deliberately left "NOT STARTED" narrative bullets bare in two files (defensible reading, but it was B2's judgment, not mine, and I accepted it without re-reading those lines myself).
7. **Three read-before-edit failures** on my own edits (stale reads after the dprint daemon re-wrapped files) — pure tool-discipline noise that cost round trips.
8. **I trusted the aggregate batch check before it worked:** my one full-corpus verification pass was the broken grep above; the real backstop was the per-file gates the subagents ran plus the archive script's own gate re-run. The corpus was safe by construction, not because my verification layer was sound.

## e) WHAT WE SHOULD IMPROVE

**Repo:**
1. Enforce the docs ritual mechanically: run `docs-gates run .` in CI, not from memory.
2. Add a dprint format check to CI (only prettier-over-`src/` is checked today) and settle the `.config/metadata.yaml` churn (exclude or accept).
3. Kill the placeholder `go.mod` (`module <module-path>` breaks every Go tool run inside the repo — this session's subagents all had to work around it).
4. Dispose of ghost systems deliberately: CALL_GRAPH pair, StandaloneGoGenerator, dead test files, root-level legacy reports (all queued in ROADMAP).
5. Generated-output conformance test (gofmt/goimports) so the README can re-claim formatting as a verified fact.

**Process (mine):**
6. Per-subagent briefs must enumerate EVERY in-scope file AND every known gate finding for those files — no "they'll notice" assumptions.
7. Scope formatter runs to touched files during multi-agent passes.
8. Batch verification must assert exit codes, never grep tool output text.
9. Re-run the full gate battery between waves of parallel writers, not only at the end.
10. Sample-verify subagent verdicts myself (read 2-3 struck lines per file) instead of trusting gate pass/fail as the only signal.

## f) Up to 50 things we should get done next

Items 1-11 are bounded TODO_LIST rows; 12-50 are ROADMAP raw ideas (brainstorm, not commitments).

1. Fix red CI build (bunx alloy build crashes: alloy CLI × TypeScript 7.0.2, `ts.sys` undefined)
2. Clear 13 no-explicit-any lint errors in test-support files
3. Make npm run build:check pass (28 strict-mode errors)
4. Verify CLI end-to-end generation (tsp compile with built emitter)
5. Filter built-in TypeSpec-namespace models in the emitter
6. Deduplicate type mapping into CleanTypeMapper
7. HTTP decorator extraction coverage (typespec/http in test harness)
8. Add test coverage reporting with a threshold
9. Remove GoHandlerStub.tsx.disabled leftover
10. Fix go.mod placeholder module path
11. Fix intermittent EnvironmentTeardownError in components-basic.test.tsx
12. Consolidate CALL_GRAPH.md and CALL_GRAPH_ACTUAL.md (split-brain pair)
13. Decide StandaloneGoGenerator's fate (integrate into emitter path or fence as test scaffold)
14. Delete or convert dead test files (test-minimal.tsx, test-components.tsx, test-components-directly.tsx)
15. Clean up stray src/test/temp-e2e-test/ directory
16. Audit root-level historical reports (PROJECT-COMPLETION-REPORT.md and six siblings) — annotate or archive
17. Resolve docs/status.md vs docs/status/ naming confusion
18. Review docs/github-issues-plan.md staleness
19. Normalize the archived-2025-12-04 layer under modern archive gates
20. Retire or re-sanction the deprecated justfile
21. Set rootDir in tsconfig to silence the TS 7 TS5011 warning
22. Exclude .config/metadata.yaml from dprint
23. Wire docs-gates into CI
24. Add dprint format check to CI
25. CI E2E job compiling a real .tsp file through the built emitter
26. Pick up the open dependabot branch
27. Reconcile typespec/compiler dependency vs peerDependency versioning
28. Document vitest jsx-preserve as the single JSX-config source of truth
29. Verify gofmt/goimports conformance of generated Go, then re-claim it in README
30. Verify the README tspconfig emitter-options example actually parses
31. Recount COMPONENTS.md coverage claims against src/components/go/
32. Generated-output snapshot tests
33. @go.name / @go.type / @go.tag / @go.package decorator support
34. @error model handling
35. @visibility decorator processing
36. Go generics emission end-to-end from TypeSpec templates
37. Discriminated-union error chains
38. Multi-file output splitting with test coverage
39. Performance benchmark suite for component generation
40. Component error boundaries in the generation pipeline
41. TypeSpec validation error-message clarity
42. More idiomatic generated Go (idiom lint pass on the generator)
43. .github/CODEOWNERS
44. .github/ISSUE_TEMPLATE
45. docs/ARCHITECTURE.md
46. Deployment guide and troubleshooting guide
47. TypeSpec → Go migration guide
48. Real-world example projects beyond examples/basic/
49. Test-surface expansion (visibility system, template types, cross-file references, HTTP metadata extraction)
50. Tagged v1.0 release with npm publish flow

## g) Questions I cannot answer myself

1. **CI build direction:** the tree deliberately pins TypeScript 7.0.2 (the 2026-11-13 "dependency upgrades" commit) and that is exactly what kills `alloy build` on CI. Do you want TypeScript reverted to a 5.x line until `@alloy-js/cli` ships TS7 compatibility, the alloy CLI upgraded past the crash, or the build moved off `alloy build` (tsc/webpack fallback)? All three work; the right one depends on why TS 7.0.2 was pinned.
2. **Root-level legacy layer:** `CALL_GRAPH.md` vs `CALL_GRAPH_ACTUAL.md`, `PROJECT-COMPLETION-REPORT.md`, `EXECUTION_PLAN.md`, `IMPROVEMENT_PLAN.md`, `PARTS.md`, `DEDUPLICATION_STATUS.md`, `INTEGRATION_REALITY_CHECK.md`, `PROJECT_SPLIT_EXECUTIVE_REPORT.md`, and `docs/status.md` sit at the repo root outside every gate's scan. Annotate-and-archive them like the status corpus, or are some of them load-bearing for you?
3. **StandaloneGoGenerator:** it powers the model-composition/template test suite but is not wired into the emitter path. Is it the intended product surface (wire it in) or test scaffolding to keep quarantined (fence it and say so in FEATURES)?

---

## Verification appendix

| Command | Result |
| ------- | ------ |
| `npm test -- --run` | 165/165 tests, 36 files (run twice; one intermittent teardown error observed once) |
| `npm run lint` | FAIL: 13 errors, 1 warning (test-support files) |
| `./node_modules/.bin/tsc --noEmit --strict` | 28 errors |
| `./node_modules/.bin/alloy build` | passes locally; one TS 7 TS5011 rootDir warning |
| `docs-gates run .` (final) | 5/5 PASS — freshness, audit-all, annotate, routing, cadence |
| `docs-gates freshness . --pre-flight` | SAFE — no historical item flips to DRIFT |
| `grep -L '~~'` over the 28 moved files | zero hits (completeness gate) |
| `git log --diff-filter=A` spot checks | ci.yml/COMPONENTS.md `bae8473`, CONTRIBUTING.md `e7e29ed`, SETUP.md `151579d`, integration tests `631185b`, sample-service.tsp `5dfa1e8` |

**Report generated:** 2026-11-14 06:21 CET
