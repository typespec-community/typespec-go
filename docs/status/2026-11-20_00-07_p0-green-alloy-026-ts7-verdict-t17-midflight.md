# Status Report — P0 CI green, alloy 0.26 + TS7 verdict landed, T17 example #3 mid-flight

**Date:** 2026-11-20 00:07 CET (clock verified against GitHub API epoch — no drift)
**Branch:** `lars/lets-rock` · **HEAD:** `a7f9917` (pushed; CI run 44609062195 GREEN)
**Gates local (at HEAD):** 206/206 tests (43 files) · eslint 0/0 · strict 0 · dprint clean · e2e green (2 examples) · docs-gates 5/5
**Working tree:** UNCOMMITTED T17 work in flight — `examples/versioned/` (main.tsp + tspconfig.yaml) and `scripts/test-e2e-cli.mjs` (3-example wiring + needles + version-isolation block). E2E NOT yet re-run against the edits; the `Capacity         int32` needle alignment is an unverified guess.
**Prior reports:** [11-19 20:36 close](./2026-11-19_20-36_session-close-red-ci-flagged-plan-harvested.md) · [11-15 16:55](./2026-11-15_16-55_t15-complete-t16-complete-error-context-layout-builder.md)

## Session arc (this run)

| Commit | What | CI |
| --- | --- | --- |
| `5a3ce93` | **P0 complete**: TS re-pinned 6.0.2 + parked eslint/coverage bumps landed in one reconciled dependency commit (intermediate state un-gateable) | **GREEN 44602994912** |
| `3bed34a` | **T22 complete**: alloy core/go/cli/typescript 0.26, rollup-plugin 0.2.0, emitter-framework 0.22.0; babel 8 overrides (core 8.0.1 + plugin-syntax-jsx ^8.0.1); mock-factory generic-arrow fix; CHANGELOG verdict | **GREEN 44608275473** |
| `a7f9917` | **A4 complete**: AGENTS.md truth pass (counts, tree, priorities, gotchas) + TODO_LIST flips (CI-red, T22, AGENTS rows) | **GREEN 44609062195** |
| *(uncommitted)* | T17 example #3 fixture + e2e wiring — probe-verified standalone, e2e integration pending | — |

## a) FULLY DONE

- **P0 — green CI restored** (the 1%→51% slice): `5a3ce93` re-pinned TypeScript 6.0.2 and landed the concurrent session's parked eslint/@typescript-eslint 8.73.0 + coverage-v8 5.1.1 bumps. Decision recorded in the commit: land-not-park, combined into one commit because bumps-alone-under-TS-7 cannot pass gates. CI run 44602994912 GREEN.
- **T22 — alloy 0.26 through full gates** (`3bed34a`): three build breakages root-caused and fixed (see d1-d3 for the mechanisms). All gates green; e2e compile wall-clock roughly HALVED (basic 975→555 ms, crud 822→469 ms).
- **THE TS7 QUESTION IS ANSWERED WITH EVIDENCE** (owner Q1 from the 11-19 report is moot): alloy 0.26 FIXES the `ts.sys` crash — under TS 7.0.2 with alloy 0.26, build + 206/206 tests + strict tsc all pass. The remaining blocker is typescript-eslint 8.73.0, which hard-refuses TS 7.0 and points at typescript-eslint#10940 (TS >=7.1 support). Verdict recorded in CHANGELOG + AGENTS gotchas: **TS stays pinned 6.0.2 until typescript-eslint ships TS 7 support.**
- **PR #13 closed** with a pointer comment to `3bed34a` (its pnpm-era base is stale; the bump is recreated and extended on the current tree).
- **A4 — AGENTS.md truth pass** (`a7f9917`): 177/177 counts fixed (3 places, grep-clean verified), both `GoRouteRegistrationComponent.tsx` references removed (RegisterRoutes lives in `GoHandlerStub.tsx`), directory tree now matches the real `src/` layout, sprint-priorities section struck with dated verdicts (4 of 5 done; coverage reporting remains), stale gotchas replaced with the new TS-pin/babel-8 facts. TODO_LIST rows flipped: CI-red ✅, T22 ✅ with verdict, AGENTS truth ✅.
- **docs ritual:** all three commits kept docs-gates 5/5; CHANGELOG carries the dependency reconciliation + alloy verdict entries.
- **BuildFlow noise collapse** (unplanned win): the eslint parse errors in `dev/tests` and ~3358 oxlint findings from `45fa15e`'s dev/ reformat are GONE after the alloy/babel bump — findings dropped 3365→2 (one info, one audit warning). A23 (dev/ noise scoping) looks moot; needs one verification pass, not a work item.

## b) PARTIALLY DONE

- **T17/A3 example #3 (~80%)**: `examples/versioned/main.tsp` + `tspconfig.yaml` written (Petstore.V1/V2, discriminated `Pet` union Dog|Cat vs Dog|Cat|Lizard, PetKind enum, Shelter with V2-only capacity). Fixture probe-verified standalone: ONE go.mod under the shared `@pkg("github.com/acme/pets/api")` base, `api/v1/` + `api/v2/` packages, `go build ./...` GREEN, gofmt clean, v1 lizard-free, v2 has lizard, `UnmarshalPet` in both. E2E script wired: third example added, 8 content needles added, per-file version-isolation block added (v1-not-lizard, v2-lizard, exactly-1-go.mod). **NOT done:** e2e has not been re-run since the wiring edit; the `Capacity         int32` needle column-alignment is guessed, not copied from real output; docs (MAPPING-GUIDE link, FEATURES row, CHANGELOG) not touched; no commit yet.
- **CI truth on the T17 edits:** last green run covers `a7f9917`, not the working tree.

## c) NOT STARTED (in priority order per the Pareto plan)

- **P2 proof hardening:** A6 interface e2e asserts (no `interface{}` for scalar path params) · A8 `goimports -l` gate · A7 runtime handler smoke test (httptest GET+POST).
- **A5 return-union semantics** (owner Q3 blocks design): strip `@error` variants → `*Widget` vs `Result[T]`.
- **Consumer docs:** A9 README emitter-options/decorator table/naming contract · A10 COMPONENTS.md recount.
- **A11 remainder:** minimatch override (or verify the audit finding vanished with the dep changes — the pnpm-audit finding now renders as `: {}`, shape changed) · mock `importActual` hardening · `@go.pkg` error-context test · sorted-import e2e needle.
- **P3:** A12 coverage wiring · A13 `$onEmit` split · A14 dead-code audit `src/domain/` (+ the now-suspect dead dep `@typespec/emitter-framework`, imported nowhere in src) · A15 API-REFERENCE · A16 ARCHITECTURE.md · A17-A22 edge tests/@query/route-order/returnType-comments/diagnostics/logging · A24 SETUP audit · A25 root go.mod · A26 ROADMAP refresh · A27-A29 probes/verification/benchmarks.
- **P4 owner-gated:** A30 T20 publish verdict · P4.2 concurrency convention · P4.3 TS7 endgame (now a typescript-eslint watch, alloy contribution no longer needed).

## d) TOTALLY FUCKED UP

1. **Three-step babel breakage during the alloy bump, each step discovered only by running the build** (T22 cost ~3× the estimate): (a) the root `@babel/core: 7.29.13` override starved alloy CLI 0.26 of Babel 8 → AST-shape crash on ANY enum (`translateEnumValues: Cannot read properties of undefined (reading 'members')`); (b) with core 8, alloy's published 0.2.1 plugins (stale `^7` peer metadata + nested old helper-plugin-utils) hard-crashed on `assertVersion` — the official `BABEL_7_TO_8_DANGEROUSLY_DISABLE_VERSION_CHECK` escape hatch works but is warning-noisy; the clean fix is the `@babel/plugin-syntax-jsx ^8.0.1` override mirroring alloy's own workspace catalog; (c) Babel 8 parses JSX-enabled `.ts` as TSX, so expression-position generic arrows (`<T>(...) =>`) became build-fatal — fixed in mock-factory via contextually-typed non-generic arrows, and now a permanent codebase constraint.
2. **First T17 fixture design produced two competing go.mod modules** (`@pkg` ending in `/v1` + the namespace-derived `v1` append → `v1/v1/` double directory, two sibling module roots; `go build ./...` from the found root would silently verify only V1). Caught by probing before wiring, but the design flaw (per-namespace GoModFile emission + @pkg/namespace path concatenation) should have been considered BEFORE writing the fixture.
3. **Unverified needle in the working tree:** `Capacity         int32` column alignment was typed from imagination instead of copied from a probe compile — exactly the class of guess that fails e2e and costs a fix cycle. The 11-15 lesson (probe first, then write) applied to the fixture but not to the needle.
4. **Multiedit stale-read miss on the e2e script** (file reformatted to tabs by dprint on 11-17, my read predated it) — cost one wasted edit round-trip; the tooling rule "view before edit" caught it, but I had read the file earlier in the session and skipped re-viewing after the git-state delta.
5. **Process:** P0.1's "decide land vs park" ran 20 minutes late relative to the plan's `12min` budget because I over-inspected the lockfile hunks before deciding; harmless, but the plan's micro-task timeboxes exist to prevent exactly this drift.

## e) WHAT WE SHOULD IMPROVE

- **Probe-compile before needle-writing:** every e2e needle should be copy-pasted from a probe compile of the fixture, never typed from memory. This is the second needle-alignment incident class (crud needles got this right by construction; T17 didn't yet).
- **Fixture design checklist for new examples:** where does go.mod land? how many namespace groups → how many GoModFile emissions? does @pkg's trailing path segment duplicate the namespace-derived segment? Write the checklist into MAPPING-GUIDE or the plan when T17 lands.
- **Dependency-bump drill:** for alloy bumps, read the alloy workspace `pnpm-workspace.yaml` catalog FIRST — it is the ground truth for which babel versions the alloy toolchain actually resolves, and it predicted both override fixes exactly.
- **Land-or-park decisions** should be made from `git diff` + peer-range inspection alone (10 minutes), not full lockfile archaeology.
- **Working-tree hygiene across sessions:** the T17 work sits uncommitted over a green HEAD — fine mid-task, but if this session dies here, the next session inherits an unverified needle. Commit T17 (even red) with a clear message before parking, or finish it.
- **oxlint advisory error** in `typespec-go-emitter.tsx:127` (`only-used-in-recursion` on `collectTypesByNamespace`) is pre-existing and ungated, but it is a real design smell (threaded accumulator parameter used only in recursion) — fold into A13/A14 refactors rather than leaving it forever.
- **AGENTS.md size** (858 lines vs BuildFlow's 220 guidance) keeps growing with every truth pass; consider moving the component-pattern cookbook sections to `docs/` and keeping AGENTS.md as context-only.

## f) NEXT (ranked, ~50 items)

1. Run `npm run test:e2e-cli` on the working tree; fix the `Capacity` needle alignment from real output if it fails.
2. Add wall-clock reporting sanity: confirm the versioned example appears in the compile wall-clock line.
3. P1.15 docs: MAPPING-GUIDE §Namespaces → link `examples/versioned/main.tsp` as the versioned-package example.
4. FEATURES.md: flip/add rows — versioned namespaces ✅, discriminated unions with per-version isolation ✅.
5. CHANGELOG [Unreleased]: T17 bullet (third example, version isolation gate).
6. TODO_LIST: flip the T17 row with dated verdict + commit hash.
7. Commit T17 (fixture + e2e + docs), push, verify CI green (P1.16).
8. A6: extend e2e to capture interfaces.go content; assert no `interface{}` in signatures for scalar path params.
9. A8a: `goimports` availability probe + baseline run on generated output.
10. A8b: add `goimports -l` gate to the e2e script + README dev note.
11. A7a-d: runtime handler smoke test — scaffold Go test in a generated dir (or testdata copy), mount RegisterRoutes via httptest, GET + POST assertions, wire `go test` into e2e.
12. A9a-c: README consumer docs (emitter options section, decorator quick-reference table, `<Pkg>API` naming-contract paragraph linking MAPPING-GUIDE).
13. A10a-b: COMPONENTS.md recount from current `src/components/` tree (inventory script or manual diff + docs-gates).
14. A11a: minimatch override in package.json `overrides` — OR verify the pnpm-audit finding is already resolved post-bump (shape changed from `>=7.0.0 <11.0.1` to `: {}`) and close the row as moot.
15. A11c: harden `emitter-error-context.test.ts` with `importActual` spread.
16. A11d: add `@go.pkg` invalid-value → namespace-context failure test.
17. A11e: e2e needle asserting the single sorted std import group in handlers.go.
18. P2.25: batch-commit P2 hygiene items, push, CI green.
19. A5/P2.19: return-union design note in MAPPING-GUIDE (blocked on owner Q3 — see g).
20. A5/P2.20-23: implement `@error`-variant strip → `*Widget` in TypeExpression (red test first), mixed/error-only/empty union tests, e2e needle on crud return types.
21. A12a: vitest coverage reporter + thresholds config.
22. A12b: wire coverage into npm script + CI with a ratcheted baseline.
23. A13a-b: `$onEmit` split — extract `parseEmitterOptions` and `generateNamespacePackage` helpers (206/206 must stay green).
24. A14a: map live consumers of the 5 suspect `src/domain/` modules (struct-generator, union-generator, generator-utils, go-code-validation, error-*).
25. A14b: delete dead modules + their tests; build+test green after deletion.
26. A14c: decide `@typespec/emitter-framework` fate (imported nowhere in src — candidate for removal; PR #13 bumped it, but if it's a dead dep, remove instead).
27. A15a-b: extract public exports from dist, rebuild API-REFERENCE.md with resolving links.
28. A16: ARCHITECTURE.md interfaces walk + HTTP pipeline section.
29. A17a: alignment edge tests (empty/single-member structs, 0-member enum).
30. A17b: MergePatchUpdate name-collision guard test.
31. A18: `@query` param fixture in an example + e2e assertion.
32. A19: stable alphabetical route ordering in RegisterRoutes + e2e needle.
33. A20: `handler.returnType` surfaced in stub-body comments (snapshot diff review).
34. A21: surface `getHttpOperation` diagnostics (structured warn + test, no silent nulls).
35. A22: GoHandlerStub `console.warn` → structured Logger + test assertion (note: vitest suppresses console; assert via Logger capture).
36. A23: verify dev/ noise is actually gone post-bump (evidence: BuildFlow findings 3365→2); if gone, close the row as moot with the evidence line.
37. A24: SETUP.md audit vs package.json (scripts, node version, bun-only).
38. A25: root go.mod decision — fix placeholder module path or document the gotcha (BuildFlow also flags `dist` not ignored in go.mod — same touchpoint).
39. A26: ROADMAP refresh (per-lifecycle visibility variants, benchmarks, generics constraints, TS 7.1 watch entry).
40. A27: CHANGELOG gates-count automation probe (script or explicit won't-do verdict).
41. A28: verify the 10 daemon D-entries landed as separate reviewable commits (git log evidence).
42. A29a-b: benchmark scaffold (renderAsync wall-clock per example) + docs/ROADMAP strike.
43. A30: T20 npm publish verdict doc (owner-gated, Q1 in g).
44. P4.2: concurrency convention doc (owner-gated, Q2 in g).
45. P4.3: TS7 endgame — replace the alloy-fix plan with a typescript-eslint#10940 watch; add the version-pin guard idea to ROADMAP.
46. Fix the oxlint `only-used-in-recursion` finding in `collectTypesByNamespace` (fold into A13 refactor).
47. go-mod-ignore-check info finding: add `dist` to the placeholder go.mod's ignore semantics or resolve via A25.
48. AGENTS.md restructure: move cookbook/pattern sections to docs/, keep session context (BuildFlow flags 858 vs 220 lines).
49. Status-report hygiene: annotate + archive the two 11-15 reports into `docs/status/archived/` with live-remainder banners (docs-gates cadence will eventually demand it).
50. Update TODO_LIST with the two new rows this session surfaced: dead-dep `@typespec/emitter-framework` (see 26) and needle-probe discipline (process note, e).

## g) OWNER QUESTIONS (blocking)

1. **Return-union semantics** (blocks A5, ~90min task + P2.19-23): when an operation's return type is a union containing `@error` variants, should the emitter strip them and emit `*Widget` (my recommendation — Go-idiomatic, error via second return or handler-internal mapping), or emit `Result[T]`-style structs carrying the error variants? This decides both the TypeExpression change and the interface signatures.
2. **T20 npm publish posture** (blocks A30): fold the current HTTP chain + decorator modes into `v1.0.0` (re-cut, the existing tag is local-only and unpushed) or cut `v1.1.0` on top of the published 1.0.0? The tarball smoke test passed at rc.1 but the tree has moved a lot since.
3. **Session concurrency convention** (blocks P4.2): after two daemon-sweep incidents in two days, do you want a claim-before-work row protocol in TODO_LIST (sessions mark `🔴 IN PROGRESS — <session>` before touching `src/`), or keep the current post-foreign-commit reconciliation ritual?
