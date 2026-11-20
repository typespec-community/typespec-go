# P2 completion, ghost sweep, ServeMux panic fix — and a broken coverage gate

**Date:** 2026-11-20 18:15 CET
**Session:** continuation from 00:07 handoff (Pareto plan execution: P1.15 → P3)
**Branch:** `lars/lets-rock`, HEAD at report time `05c3539` (CI green through `d70a45d`, run 44723893268; `05c3539` result not yet confirmed)

---

## §a FULLY DONE (verified, committed, CI-green unless noted)

1. **docs-gates red fixed (session start):** TODO_LIST row carrying
   `P4.2 concurrency owner-gated` tokens added; 5/5 gates green.
2. **T17/A3 landed (`dc206e0`, CI 44709890943 GREEN):** third e2e
   example `examples/versioned/main.tsp` — Petstore.V1/V2 → sibling
   packages `v1`/`v2` under one shared `@pkg` base, exactly one
   `go.mod`; version-isolation asserts (V1 has no `lizard`/`capacity`);
   MAPPING-GUIDE § Named unions corrected to the real
   `GetType()`/`UnmarshalX` shape (the `isPaymentMethod()` doc was
   stale); FEATURES/CHANGELOG/TODO updated.
   - Fixed on the way: e2e `goModCount` check read `generatedFiles`
     (which only collects `.go`) — always 0; new
     `collectGoModFilesInto` walks the versioned output dir.
   - `Capacity  int32` needle copied from a probe compile (2 spaces),
     confirming the handoff warning that it had been typed from
     imagination.
3. **P2 hygiene batch (`3191f8c`, first CI attempt red):**
   - A11a minimatch: VERIFIED MOOT — bun.lock has exactly one
     minimatch@11.0.8 (patched range ≥ 11.0.1); the BuildFlow
     pnpm-audit finding renders as a degenerate `{}` warning (lane is
     dark without a pnpm lockfile). No override added — cargo-cult
     avoided.
   - A11c: emitter-error-context `vi.mock` now spreads `importOriginal`.
   - A11d: new `go-pkg-error-context.test.ts` — host write failure
     through the `@go.pkg` path still surfaces namespace context +
     `cause`.
   - A11e + A6: e2e needles — exact goimports import-group block,
     `Read(ctx context.Context, id string)` /
     `Create(ctx context.Context, widget Widget)` positives,
     `id interface{}` / `widget interface{}` negatives (A6 scoped to
     parameter position; returns are still `interface{}` pending A5).
4. **GoImportGroup + goimports gate (`3191f8c` + `e4a76f9`):** new
   component emits one `import` for a single path, a sorted
   tab-indented grouped block for several (mirrors alloy
   `ImportStatements` internal shape, which does not export the bare
   form). handlers.go + unions.go are goimports-clean as emitted.
   e2e gates on `goimports -l` staying empty with an install hint;
   README dev note added; 3 component tests. Alloy's `PackageSymbol`
   route was evaluated and rejected (requires binder context we don't
   build).
5. **A7 runtime smoke test + ServeMux PANIC BUG FIXED (`37ea653`,
   `e4a76f9`; CI 44721834751 GREEN):** RegisterRoutes emitted one
   `mux.HandleFunc` per handler — routes shared by several methods
   were registered multiple times and Go's `http.ServeMux` **panics at
   runtime** on duplicate patterns. Generated servers compiled clean
   (which is why every prior gate missed it) but would panic on first
   mount. Now: one registration per route pattern with
   `switch r.Method` dispatch (proper `http.MethodGet` casing) and a
   405 fallback. The e2e copies
   `scripts/fixtures/handlers_smoke_test.go.tmpl` into the generated
   basic package and runs `go test ./...` (GET/POST/DELETE round trips
   + 405 on a POST-only route). **Verified the smoke test FAILS
   (panics) on the old shape** before trusting it on the new one.
6. **A13 `$onEmit` split (`d70a45d`, CI 44723893268 GREEN):**
   `parseEmitterOptions` (typed parse + visibility validation) and
   `generateNamespacePackage` (per-namespace render + write +
   namespace-context error wrap) extracted; `$onEmit` is now
   parse → loop → totals. The pre-existing oxlint ERROR
   (`namespaceGroups` only-used-in-recursion in
   `processNestedNamespace`) fixed by removing the dead parameter.
7. **A14 ghost sweep (`d70a45d`): 2229 lines removed.** Deleted via
   `git rm` (history-recoverable): 8 src/domain modules
   (struct-generator, union-generator, unified-errors, error-factory,
   error-types, error-entities, go-code-validation, generator-utils),
   `src/standalone-generator.ts`, `src/utils/bdd-framework.ts`, the
   unconsumed `src/components/index.ts` barrel, and 4 test files that
   exercised only the ghost path with hand-built mock shapes
   (model-composition, model-composition-research,
   typespec-integration-basic, union-type-generation).
   - **Truth consequence:** FEATURES `extends`→embedding and cyclic
     pointer-breaking rows were demoted to Known limits — their only
     evidence was the deleted ghost suite; the live emitter never
     handled `extends` at all.
   - Dangling metadata cleaned (BDD_FRAMEWORK LogContext member,
     `unified-errors` $lib string).
8. **A9 README consumer surface (`d862c15`):** emitter-options table,
   decorator quick-reference table, naming-contract paragraph +
   MAPPING-GUIDE link.
9. **A10 COMPONENTS.md recount (`d862c15`):** deleted
   `GoRouteRegistrationComponent` section, added `GoImportGroup`
   reference, counts corrected to 11 primary + 5 core helpers +
   `TypeExpression`; README link count fixed (said 12+5).
10. **A5 design note (`d862c15`):** MAPPING-GUIDE § Return types —
    strip-`@error` → `*Widget` recommendation recorded; implementation
    explicitly owner-gated (Q3).
11. **AGENTS truth pass (`05c3539`):** counts 206/206→182/182 (3
    places), references to deleted files replaced with live
    equivalents; the dated TS7 gotcha line kept at its historical 206
    deliberately.
12. **Suite state:** 182/182 tests across 41 files, eslint 0/0,
    strict 0, dprint + oxfmt clean, e2e green (build + smoke + gofmt +
    goimports), docs-gates 5/5.

## §b PARTIALLY DONE

1. **A12 coverage reporting:** `npm run test:coverage` is BROKEN —
   it runs only 12/41 test files (81/182 tests), reports 0% on every
   threshold, and `@vitest/coverage-v8` output shows repeated
   `takeCoverage` errors. Then the disk filled (ENOSPC,
   `/mnt/buildcache` npm cache) and cut the investigation short. At
   18:15 the disk shows 107G free again — the failure may have been
   transient pressure; the 12/41-files mystery is UNDIAGNOSED.
   FEATURES still claims the ratchet is FULLY_FUNCTIONAL — currently
   false.
2. **A23 dev/ noise:** `dev/` contains `debug/`, `tests/`,
   `typespec/` subdirectories — inventoried, not audited/disposed.
3. **CI on `05c3539`:** pushed seconds before this report; result not
   observed (only docs refs changed, low risk).
4. **docs-cadence half-strikes:** DONE rows without `~~verdict~~`
   wraps now exceed the old 20 threshold visually (cadence still
   reports PURGE-HEALTHY on struck rows = 0, but the half-strike
   warning count keeps growing every time I flip a row without
   `scripts/safe-strike.sh`).
5. **pnpm-audit `{}` finding:** verified moot for minimatch, but the
   degenerate empty-message finding itself (BuildFlow lane without a
   pnpm lockfile) was never reported upstream — left as-is per
   "not per-repo tooling".

## §c NOT STARTED

1. A15 API-REFERENCE rebuild (FEATURES already marks it
   PARTIALLY_FUNCTIONAL / refresh queued).
2. A16 ARCHITECTURE.md truth pass (needs GoImportGroup, route
   dispatch, ghost removals).
3. A24 SETUP.md audit.
4. A26 ROADMAP refresh.
5. A17–A22 edge-test batch (@query fixture, route ordering,
   returnType comments, diagnostics — exact definitions still in the
   Pareto plan, not re-read this session).
6. A25 root go.mod placeholder (`module <module-path>` breaks
   `go run` inside the repo).
7. A27 CHANGELOG automation probe.
8. A28 D-entries verify (10 root-cleanup deletions reviewable).
9. A29 benchmark suite scaffold.
10. GoHandlerStub `console.warn` → structured logging + assert.
11. P4 owner-gated docs: T20 publish verdict, TS7 endgame,
    concurrency convention (only the TODO row exists).
12. A5 return-union implementation (gated on Q3).
13. CI docs-gates install caching (TODO row).
14. Status-report archiving ritual for the 00-07 report + this one
    (10 unarchived, threshold 15).

## §d TOTALLY FUCKED UP

1. **The generated-server runtime panic (found, fixed — but it
   shipped):** every generated HTTP server from this emitter would
   panic on `RegisterRoutes` until today. Compilation gates cannot see
   ServeMux duplicate registrations; only the new `go test` smoke gate
   can. If anything from this emitter was consumed at runtime before
   today, it was broken.
2. **FEATURES was lying twice:** "Model composition (extends →
   embedding) FULLY_FUNCTIONAL" and "Cyclic dependency handling
   FULLY_FUNCTIONAL" were backed exclusively by a ghost generator
   testsuite running against hand-built mock shapes — the live emitter
   never implemented either. Also "Coverage ratchet FULLY_FUNCTIONAL"
   is currently false (broken gate). Fixed the first two by demotion;
   the coverage row still needs the fix-or-demote treatment after A12
   diagnosis.
3. **The ghost system itself:** ~2.3k lines of production-shaped code
   (standalone generator, BDD framework, error hierarchy) that nothing
   consumed, plus 28 tests validating it — false confidence, deleted.
4. **CI goimports (two red runs to get right):** I added the install
   step without reading how the sibling docs-gates step (also a
   `go install` + invoke pattern) handled PATH — it invokes the binary
   by `"$(go env GOPATH)/bin/..."`. Run 1: ENOENT. Run 2 (37ea653):
   install step green, still ENOENT (GOPATH/bin not on PATH). Run 3
   (`e4a76f9`): `echo "$(go env GOPATH)/bin" >> "$GITHUB_PATH"` —
   green. Should have copied the established pattern the first time.
5. **Disk-full mid-session (ENOSPC at 14:20):** npm cache on
   `/mnt/buildcache` filled; killed the coverage investigation.
   BuildFlow had warned for hours (state DB 1.01 GB, cache DB
   0.51 GB). Space is free again (107G at 18:15) but the root cause
   (what filled it) is unidentified.
6. **My own route-fix misstep (caught immediately):** the first
   multiedit deleted the `RegisterRoutes` FunctionDeclaration wrapper
   entirely; restored in the next edit. And the first dispatch output
   emitted nonexistent `http.MethodGET` — caught by probe-compile
   before any commit. No customer-visible damage, but both were
   avoidable with symbol-targeted edits and a compile-check of the
   probe before moving on.

## §e WHAT WE SHOULD IMPROVE

1. **Probe-compile FIRST, always** — the handoff explicitly warned the
   Capacity needle was unverified; I still burned one e2e cycle on it.
   The AGENTS gotcha exists; the habit must precede the needle, not
   follow the failure.
2. **Read the sibling step before writing a new CI step** — the repo
   already answered the GOPATH/bin question in the docs-gates step.
3. **Use `lsp_replace_symbol` for whole-symbol rewrites** — the
   multiedit wrapper-deletion mistake happened exactly where exact-match
   surgery exceeded its safe size.
4. **Use `scripts/safe-strike.sh` when flipping TODO rows** — plain
   DONE flips keep stacking unwrapped half-strikes that the cadence
   gate will eventually purge.
5. **Verify doc-claimed gates before trusting them** — coverage was
   claimed green for weeks; one `npm run test:coverage` at session
   start would have caught it before it became §d material.
6. **Ghost sweep belongs at the START of a feature arc, not the
   middle** — 28 tests died defending a system nobody used; a
   knip/ts-prune lane in CI would have flagged it months ago (knip is
   "binary not in PATH" in BuildFlow's tool list — worth installing).
7. **Disk headroom check before heavy lanes** — `df` before coverage/
   build cascades; BuildFlow's DB warnings were the canary.
8. **Keep FEATURES evidence column honest by construction** — every
   FULLY_FUNCTIONAL row should name a test that exists on the live
   path TODAY; rows citing files deleted in the same commit should be
   demoted in that commit (I did, but only because the sweep forced
   the audit).

## §f UP TO 50 NEXT TASKS (ordered by my recommendation)

1. **Fix A12 coverage:** diagnose why only 12/41 files run under
   `test:coverage` (suspect: coverage include list vs. test file
   locations, or v8 remapping failure on JSX-transformed files);
   re-baseline thresholds honestly; fix the FEATURES row.
2. **Confirm CI on `05c3539`** (`gh run list --limit 1`).
3. **A23:** audit `dev/{debug,tests,typespec}` — disposition pending
   owner answer (§g Q3).
4. **Disk hygiene:** identify what filled `/mnt/buildcache`; set a
   `df` guard before heavy lanes; consider moving the npm cache off
   the shared mount; VACUUM BuildFlow's 1.01 GB state DB.
5. **A16 ARCHITECTURE.md truth pass** (GoImportGroup, route dispatch,
   ghost removals, new emitter split).
6. **A15 API-REFERENCE rebuild** (FEATURES flags it stale).
7. **A24 SETUP.md audit.**
8. **A26 ROADMAP refresh** (composition/cyclic now Known limits;
   A5 pending Q3).
9. **A17–A22 edge-test batch** — re-read exact definitions in the
   Pareto plan first (not re-verified this session).
10. **GoHandlerStub `console.warn` → Logger + test assert** (TODO row).
11. **A25 root go.mod placeholder** (blocks `go run` inside repo).
12. **A28 D-entries verify** (10 root-cleanup deletions reviewable).
13. **A27 CHANGELOG automation probe.**
14. **A29 benchmark suite scaffold.**
15. **CI: cache/vendor docs-gates install** (TODO row).
16. **CI: pin goimports via nix or actions/cache** so the gate stops
    costing a fresh `go install` each run.
17. **safe-strike the ~21 unwrapped DONE rows** in TODO_LIST before
    cadence purge triggers.
18. **Archive the 00-07 status report + this report** when harvested
    (10 unarchived, threshold 15).
19. **A5 return-union implementation** (after §g Q1 verdict): TypeExpression
    strip + `*Widget` + unit/e2e tests.
20. **P4: T20 publish verdict doc** (after §g Q2 verdict).
21. **P4: TS7 endgame doc** (bump TS when typescript-eslint ships
    ≥7.1 support; typescript-eslint#10940 tracker).
22. **P4: concurrency convention doc** (claim-before-work vs
    reconciliation ritual) — TODO row exists.
23. **Report the BuildFlow pnpm-audit `{}` finding upstream**
    (degenerate empty advisory message) — verify-before-filing first.
24. **Add a knip/ts-prune lane** so dead modules surface in CI, not in
    annual sweeps (BuildFlow lists knip as "binary not in PATH").
25. **e2e: extend the smoke fixture to assert the 405 body shape**
    (`method not allowed`) — currently only status asserted.
26. **e2e: smoke-test the versioned example too** (two modules, both
    mountable) if a second fixture is cheap.
27. **MAPPING-GUIDE: document go.mod placement rule** (module root =
    `@pkg` base or lowercased namespace dir — behavior observed
    differing between basic and versioned examples during probes).
28. **Interface file import**: interfaces.go still emits a bare
    `import "context"` (fine for goimports) — consider GoImportGroup
    there too for consistency.
29. **`@error`-model doc on the Error() method** — check wording
    consistency with A5 once implemented.
30. **Handlers TODO comment**: generated stubs say
    "TODO: Implement …" — consider a doc-comment pointing at the
    `<Pkg>API` contract instead (user-facing polish).
31. **Versioned example: add an operation** so the smoke gate covers
    the @pkg + handlers combination (currently basic-only path).
32. **Route dispatch: emit `http.MethodHead`/OPTIONS fallback?** —
    ServeMux handles OPTIONS natively in 1.22+; document the choice.
33. **FEATURES: fix the Coverage ratchet row** once A12 lands.
34. **AGENTS size**: 858+ lines vs 220 BuildFlow max — split history
    into docs/ (persistent warning, low priority).
35. **oxlint advisories:** structured-logging static-only classes
    (3 errors) → module functions; GoImportGroup `.sort()` →
    `.toSorted()` (needs lib es2023 check first).
36. **vitest: investigate the `takeCoverage` stack** (v8 remap
    failure) as part of A12.
37. **e2e wall-clock:** compile times grew (~440ms → ~1.8s first run
    after rebuild; cached ~420ms) — note in benchmarks task A29.
38. **CHANGELOG Last Updated** bump next commit batch (still
    2026-11-20 — fine).
39. **CONTRIBUTING.md**: mentions coverage thresholds 45/35/53/45 —
    re-verify after A12 re-baseline.
40. **`@go.pkg` validation**: consider warning (not error) on pkg
    paths containing characters Go module paths forbid — low priority.
41. **Union unmarshaler returns `any`** — A5 follow-up: typed variant
    return would be the real fix; keep on ROADMAP.
42. **Fixture coverage**: handlers_smoke_test covers GET/POST/DELETE/
    405 but not PATCH (update route) — one more case is cheap.
43. **docs/QUICKSTART.md**: add the versioned example as the
    namespaces walkthrough (it's now the canonical demo).
44. **CI: smoke gate ordering** — go test runs before gofmt gates;
    swap so formatting failures fail fast (minor).
45. **package.json scripts**: `test:coverage` failing locally is a
    trap — consider `--run` + explicit fail message until A12 lands.
46. **Delete stale `docs/status/2026-11-20_00-07…` report** after
    harvest annotation (archiving ritual).
47. **The 4 deleted ghost test files' coverage concerns** — if
    composition/`extends` support is ever built, write the tests
    against the REAL emitter (lesson recorded in FEATURES Known
    limits).
48. **`getOutputDirectory`/`namespaceToPackageName`**: emit-path
    lowering now lives in two places (emitter split join + service) —
    fold into one helper during A16 review.
49. **eslint flat-config migration?** (not asked for — note only if
    toolchain drift forces it).
50. **Session-close ritual**: harvest this report's §f into
    TODO_LIST, annotate inline verdicts, archive both reports.

## §g QUESTIONS (I cannot answer these myself)

1. **Q3 — return-union verdict (blocks A5 implementation):** strip
   `@error` variants → `*Widget` (my recorded recommendation) vs
   generic `Result[T]`? The design note is in MAPPING-GUIDE; the
   moment you pick, implementation + tests land.
2. **Q2 — T20 publish posture:** re-cut `v1.0.0` (the existing rc.1
   tag is local-only) vs ship as `v1.1.0`? This decides the P4
   publish-verdict doc and the CHANGELOG release cut.
3. **dev/ disposition:** `dev/{debug,tests,typespec}` survived the
   sweep untouched. Keep as owner scratch space, or is it trashable?
   If keep: should it be gitignored so lint/audit lanes stop seeing
   it?
