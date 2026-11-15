# Pareto Plan II — Tiers 1%→20% Executed, Release Rehearsed — Status After the Run

**Date:** 2026-11-15 09:26 CET
**Scope:** THIS session's execution of Pareto Plan II
(`docs/planning/2026-11-14_18-45_SUPERB-PARETO-EXECUTION-PLAN-II.md`):
T01–T12, T18, T19 — fourteen of the twenty-two tasks, including the 1%
trust anchor, the full 4% HTTP product chain, and the complete 20%
polish/hygiene tier. **Verified with:** 190/190 tests (39 files), lint
0/0, strict 0, dprint clean, docs-gates 5/5 LOCAL, e2e green —
6 generated Go files across both examples passing `go build ./...` and
native `gofmt -l` on RAW output; tarball install-from-`.tgz` smoke test
green (73.5 kB / 114 files → crud spec → `go build`). **NOT verified / RED
at stop:** CI on `01d0da6` is RED — the freshly unmasked docs-gates step
exposed a tool-version skew (see d1/d2); the fix (ci.yml pin bump) is
written but **uncommitted**. Local tag `v1.0.0-rc.1` exists, NOT pushed.

**Eight commits this session:** `6036a91` (compile conformance +
gofmt-native), `2ffb8ca` (HTTP chain), `3b446fc` (decorator modes),
`59d427f` (CI truth + hygiene), `eaff4c5` (coverage ratchet + timing),
`cec59c6` (quickstart + summary log), `4ced201` (FEATURES/ROADMAP/API-REF
truth), `01d0da6` (rehearsal). Plan II T13–T17 and T22 remain; T20/T21
remain owner-gated and are re-asked in §g.

---

## a) FULLY DONE

1. **T01 — Compile-level Go conformance (the 1%).** Reproduced the real
   failure first: unused `encoding/json` + `fmt` imports AND the
   placeholder `return nil` swallowed into a glued comment (the function
   had NO return at all). Shipped: real discriminated-union unmarshaler
   (probe struct + per-variant `json.Unmarshal` + `fmt.Errorf` wrapping),
   usage-driven imports, new `go-module-path` emitter option emitting
   `go.mod` (via alloy core `SourceFile` — the Go one force-inserts a
   package clause), and `go build ./...` per module root on RAW output in
   the e2e net.
2. **T08 — Native gofmt-clean (M29–M32).** gofmt-style column alignment
   (struct members, enum consts), declaration separators (Go 1.27 gofmt
   requires blanks between declaration groups), corrected relative
   indentation in `GoIf`/`GoSwitch`/`GoCase`/`GoDefault`, enum
   `IsValid` switch rebuilt from raw strings into components. The
   `gofmt -w` normalization step is REMOVED — raw output must be clean.
3. **T02 — `namespace.interfaces` walk (M07–M09).** Red test first, then
   the walk in both collector paths; false TODO_LIST evidence line
   ("Interface operations are collected") rewritten honestly.
4. **T03 — HTTP decorator extraction e2e (M11–M13).** Basic example now
   emits `handlers.go` + `interfaces.go`: real routes (`/widgets/{id}`),
   verbs, parameter adaptation (`r.PathValue`, query `Get`, body decode
   closures), usage-driven `encoding/json` import. e2e asserts routes,
   verbs, param extraction, context adaptation.
5. **T04 — `@typespec/http` in vitest (M14–M16).** `createTester`
   with `libraries: ["@typespec/http"]` works with the repo root as
   baseDir; `http-harness.test.tsx` covers collector walk, merge-patch
   mapping, full generation.
6. **T05 — Doc-comment overhaul (M17–M20).** `// //` double-slash bug
   fixed; package doc hoisted to a single header comment ABOVE the
   package clause (was repeating above every struct); `@doc` on
   enums/unions verified rendering.
7. **T06 — `@go.nullable` + `@go.enumMode` consumption (M21–M25).**
   pointer/zeroValue/struct modes drive the optionality shape;
   iota/string/name modes drive the const block (iota emits a real
   `const ( … = iota )` — `var` cannot legally use iota, caught by the
   e2e build gate); `valueof EnumMode` arrives as a TypeSpec VALUE
   WRAPPER `{valueKind, value: EnumMember}` — the getter unwraps it.
   Both decorators fixture-verified on the crud example through e2e.
8. **T07 — Decorator completeness (M26–M28).** `@go.name` now overrides
   models, enums, AND operations; `@structTag` accepts the Record form
   (normalized to a raw tag string at decoration time); JS signatures
   aligned with `lib/main.tsp` targets (no silent widening — unions are
   NOT a declared `@go.name` target and were left alone).
9. **T09 — Repo hygiene (M33–M36).** preflight artifact untracked +
   gitignored; 0-byte `.go.mod.lock` deleted (traced to old commit
   `38ee369`, zero references); `working-emitter-demo.ts` deleted
   (unreferenced); orphan `build:webpack` script removed (no webpack
   config or dependency exists).
10. **T10 — CI truth (M37–M39).** Verified from run logs: the docs-gates
    step had been failing EVERY run (`go install …@2adbc73` — module root
    has no Go package) behind `continue-on-error`. Install path fixed to
    `cmd/docs-gates` (verified via the repo tree at that SHA), mask
    DROPPED, legacy prettier step + script removed.
11. **T12 — Coverage ratchet + bench (M45–M46).** Thresholds 40/30/48/40
    → 45/35/53/45 (actuals 51/42/58/51); ratchet policy documented in
    CONTRIBUTING.md; e2e now logs per-example compile wall-clock
    (415/422 ms).
12. **T18 — Consumer quickstart + summary log (M62–M63).**
    `docs/QUICKSTART.md`: install → tspconfig → verbatim crud example →
    generate → `go build`, plus the full decorator reference table.
    Emitter logs INFO-level per-package file list at emission end.
13. **T11 — Living-doc refresh (M40–M44).** FEATURES.md rewritten
    against verified state (was claiming shipped features PLANNED and
    citing dead evidence); ROADMAP shipped-items struck with dates;
    API-REFERENCE.md routed as historical (describes the fenced
    StandaloneGoGenerator scaffold — readers pointed to QUICKSTART/
    COMPONENTS; rebuild queued); CONTRIBUTING coverage section added.
14. **T19 — Release rehearsal (M64–M66).** `npm pack` 73.5 kB/114 files
    → installed from tarball into a fresh consumer → crud spec compiled
    with tarball-only installation → output passed `go build` + `gofmt
    -l`. SECURITY.md checked against the process. Local annotated
    `v1.0.0-rc.1` tag created (NOT pushed). Findings folded into
    docs/DEPLOYMENT.md (absolute `emitter-output-dir` requirement etc.).

Also in-passing: ghost strong-ID typing removed (emitted undefined
`IDID` types), `MergePatchUpdate<T>` → base-model mapping (instances
carry no templateMapper — name-suffix based, documented tradeoff),
CleanTypeMapper cache-key circular-JSON crash fixed, `<Pkg>Service`/
`<Pkg>API` naming split-brain resolved, alloy `InterfaceFunction` `func`
bug worked around (Scope + FunctionParameters), deleted the
GoRouteRegistrationComponent split brain + its 2 legacy tests, goVersion
default 1.21 → 1.22 (ServeMux PathValue requirement).

## b) PARTIALLY DONE

1. **CI docs-gates fix (d1/d2).** The install path is fixed and the mask
   is off, but CI is RED on `01d0da6`: the OLD tool pin (2adbc73,
   2026-11-14 10:31) enforces a stricter annotate rule (strike-wrap
   verdicts) than the local nix build (aac5c7c, 15:04, "annotate gate 0
   findings over 205 struck blocks"). The pin bump to
   `aac5c7c9288c1ea2e3354b8197c269c50b51b5b8` is written in ci.yml but
   UNCOMMITTED and UNVERIFIED in CI. This is f1 — the immediate action.
2. **Plan II progress: 14 of 22 tasks** (T01–T12, T18, T19) ≈ 11 h of the
   plan's ~29 h executed, ahead of the plan's estimates.
3. **Living docs.** FEATURES/ROADMAP/CONTRIBUTING/DEPLOYMENT/QUICKSTART
   are truthful now; API-REFERENCE is routed-not-rebuilt (deliberate,
   tracked); README still lacks the `go-module-path` option, the
   decorator table, and the `<Pkg>API` naming contract; CHANGELOG has no
   Unreleased section for this session's 8 commits; SETUP.md not yet
   audited (T11's M42/M43 remainder).
4. **TODO_LIST.** Rows flipped with dated verdicts for all done work and
   two harvests added (f37 mapper-unify, T18 quickstart); the DONE-row
   strike format may need the full `~~…~~` wrap convention under the
   pinned tool version — verify after f1.

## c) NOT STARTED

- **T13** `@visibility` semantics (design note → read-filter → tests)
- **T14** Generics → `[T any]` emission
- **T15** Emitter error context + receiver naming + goimports grouping
- **T16** Internal refactors (mapper unify — already harvested, MockFactory
  → functions, file-layout builder, cast reduction, filename case)
- **T17** Example #3 (versioned namespaces + discriminated unions)
- **T22** Dependabot recreation + first post-v1.0 bump — NOTE: a dependabot
  minor-and-patch PR already sits with a FAILING CI run (20 s,
  run 43684441446) that nobody has looked at
- **T20/T21** Owner-gated (publish; strays + StandaloneGoGenerator)

## d) TOTALLY FUCKED UP (honest)

1. **CI docs-gates has been failing EVERY run — masked — since the step
   was added in plan I**, and every prior "CI green" claim (including
   TODO_LIST's verified-baseline table and yesterday's status report)
   was therefore half-false. The mask was the plan's own M37 finding; I
   unmasked it this session, which immediately turned CI red and exposed
   BOTH the install-path bug AND the tool-version skew. Unmasking first,
   fixing second = a red CI on the main working branch for three
   commits. Correct order would have been: fix install path + pin, THEN
   drop the mask, in one commit.
2. **Version skew by construction.** When the docs-gates step was added,
   it was pinned to 2adbc73 while the local nix deployment tracked
   aac5c7c — guaranteeing local/CI gate divergence. The pin must always
   be the locally deployed version (now done, uncommitted).
3. **Half-done state left at STOP.** The ci.yml pin fix is uncommitted;
   the session ended mid-remediation. One clean commit remains.
4. **File-modified guard churn.** At least seven edit rejections this
   session (GoHandlerStub ×3, FEATURES ×1, TODO_LIST ×2, emitter Logger
   block ×1) because the auto-commit daemon touches files; each cost a
   re-read + retry cycle. The FEATURES write was silently BLOCKED once —
   caught only because I re-inspected.
5. **Blind range-delete.** `sed '/const …/,+1d'` deleted a constant plus
   the following line without checking what followed. Lucky, not safe.
6. **Assertion churn.** Column alignment broke text assertions in three
   waves (two unit files, e2e twice) — I fixed assertions reactively per
   failure instead of sweeping all exact-match assertions in one pass
   when alignment landed.
7. **ServeMux design miss.** First route registration emitted direct
   handler references that cannot type-check (handlers carry `ctx`);
   the compile net caught it, but a 5-minute signature check would have
   prevented the roundtrip.
8. **`valueof` wrapper discovery cost.** The enumMode state held a
   TypeSpec value WRAPPER, not an EnumMember — found via an instrumented
   debug patch cycle; the compiler's value-model documentation would
   have answered it upfront.
9. **Quoting.** Unquoted `--option key=value` args once failed a compile
   silently; combined with chained probes it produced a confusing
   "matched no packages". Always quote; don't chain dependent probes.
10. **Trust-but-verify on tool output.** `alloy build` prints "Build
    completed with 0 errors" even after TS errors — exit code is the
    only truth. Nearly accepted a red build once.

## e) WHAT WE SHOULD IMPROVE

- **The e2e net now earns its keep.** This session it caught: unused
  imports, a swallowed return statement, unresolved cross-file types,
  wrong switch/case indentation, iota-in-`var` illegality, untyped enum
  consts, missing go.mod, and the consumer-facing tarball path. It is
  the single most valuable asset added since green CI.
- **Native gofmt-clean output** removes a mutation step from the net —
  consumers receive final-form files.
- **`@typespec/http` in vitest** collapses the compile-inspect loop from
  ~15 s (tsp CLI) to ~2 s (harness) for HTTP work.
- **Evidence culture held:** every flipped TODO_LIST row carries a dated
  verdict; FEATURES rewrite killed every dead claim found.
- **Release path is rehearsal-proven** — the only remaining release
  actions are owner decisions.

## f) NEXT (priority order)

1. Commit + push the ci.yml pin bump (`aac5c7c…`); verify CI green on
   the same tree that passed locally (10 min) — IMMEDIATE.
2. If annotate still red under aac5c7c: inspect the diff vs local gate
   behavior; worst case convert the 8 DONE rows to full-strike verdict
   form (20 min).
3. Investigate the failing dependabot minor-and-patch PR (20 s CI
   failure — likely install/build, not tests) (20 min).
4. T13 `@visibility`: design note → property read-filter → tests (100 min).
5. T14 Generics: template params → `[T any]`, constraint note, e2e
   fixture `Box<T>` (100 min).
6. T15 Error clarity: emitter failures name namespace/type; receiver
   naming audit; goimports-style import grouping (90 min).
7. T16 Refactors: unify `getOutputDirectory`/`namespaceToPackageName`
   (harvested), MockFactory → module functions, file-layout builder
   extraction, clean-type-mapper cast reduction, filename-case decision
   (90 min).
8. T17 Example #3: versioned multi-namespace API + discriminated-union
   fixture exercising GetType + unmarshal in CI (75 min).
9. Runtime handler smoke test: mount `RegisterRoutes` in a Go test,
   fire GET + POST with body (30 min).
10. T22: recreate/verify dependabot group bump through the full gates;
    CHANGELOG entry (45 min).
11. CHANGELOG: seed `[Unreleased]` with the 8 session commits (20 min).
12. README: `go-module-path` option, decorator reference pointer,
    `<Pkg>API` naming contract, goVersion 1.22 requirement (20 min).
13. COMPONENTS.md recount (route component deleted; core components) (15 min).
14. SETUP.md audit: commands vs package.json + JSX-config source-of-truth
    note (M42/M43 remainder) (20 min).
15. API-REFERENCE rebuild from current `dist` exports (60 min).
16. `@query` param fixture in an example + e2e assertion (20 min).
17. crud interface fixture → assert `interfaces.go`/`handlers.go`
    content for the second example (20 min).
18. Surface `getHttpOperation` diagnostics instead of silently nulling (20 min).
19. Wire `handler.returnType` into stub bodies' commented examples (20 min).
20. Stable (alphabetical) route ordering in `RegisterRoutes` (10 min).
21. Alignment edge tests: empty/single-member structs, 0-member enum (15 min).
22. MergePatchUpdate heuristic: document + guard against user models
    genuinely named `XMergePatchUpdate` (15 min).
23. ARCHITECTURE.md: interfaces walk + HTTP pipeline section (30 min).
24. MAPPING-GUIDE.md: merge-patch mapping + `<Pkg>API` naming contract (15 min).
25. Nested-namespace interface-ops collector test (15 min).
26. Decide per-interface (`WidgetsAPI`) vs package-level (`DemoAPI`)
    interface naming (20 min).
27. Decide fallback-handler policy (undecorated ops → silent GET
    `/<name>`) — keep or hard-error (20 min).
28. CI: cache the go module path for the docs-gates install (15 min).
29. CI: gate duration watch — http-harness tester instances add ~2 s (5 min).
30. Upstream alloy-js issue: `InterfaceFunction` emits `func` inside
    interface bodies (verify against their tests before filing) (30 min).
31. Upstream docs-gates: suggest tagging releases so pins don't rot (15 min).
32. e2e: assert `go.mod` content (module line) in the net (10 min).
33. e2e: `@put`/`@patch`/`@delete` verbs visible in assertions (15 min).
34. gofmt-clean for `go.mod`? n/a — instead assert no trailing blank in
    all generated files via a unit check (10 min).
35. Consider deleting the local `v1.0.0-rc.1` tag if the tree moves
    before publish (5 min).
36. Extract `handlerArgument`/`routeRegistration` into their own
    component file (fold into T16) (15 min).
37. `TypeExpression` merge-patch suffix: add unit test for the
    non-match case (plain `Widget`) (10 min).
38. Sweep for other exact-match test assertions that depend on column
    padding — make them whitespace-tolerant where semantic (20 min).
39. Document the `Service` (handlers) vs `API` (contract) convention in
    DOMAIN_LANGUAGE.md or MAPPING-GUIDE (10 min).
40. Consider `const` for string enum blocks too (Go convention), not
    just iota mode (15 min).

## g) QUESTIONS FOR THE OWNER

1. **Release scope.** Fold this session's HTTP chain + decorator modes
   into v1.0.0 before publishing (my recommendation — the `<Pkg>API`
   rename and goVersion 1.22 are contract-level changes best frozen in
   the first release), or cut v1.0.0 from the pre-HTTP tree and ship the
   rest as v1.1.0?
2. **`pnpm-lock.yaml` + remaining root strays.** Keep the lockfile for
   the BuildFlow audit lane or delete it (bun is the package manager)?
   Same batch decision for the deprecated `justfile` (T21).
3. **Dependabot posture.** The open minor-and-patch PR fails CI in 20 s —
   should CI run the FULL gate set on dependabot PRs (strict, my
   recommendation) or a reduced lane so dependency bumps stay cheap?
