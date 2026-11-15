# CI Truth, T13 @visibility, T14 Generics, T15 Start — and Two Concurrent-Session Collisions

**Date:** 2026-11-15 13:42 CET
**Branch:** `lars/lets-rock` @ `d289c86` (pushed, CI GREEN — run 43715054564)
**Session scope:** resuming Pareto Plan II per the 09:26 handoff: land the CI
pin fix, then execute T13–T17 + T22. TWO other sessions committed into this
branch mid-flight (root-cleanup at 13:11, toolchain-upgrade at ~13:30); their
commits captured my in-flight work twice. This report covers MY session only,
plus the reconciliation those collisions forced.

**Gates at HEAD:** 201/201 tests (41 files) · eslint 0/0 · strict 0 ·
dprint clean · e2e green (`go build ./...` + native `gofmt -l` on raw output
for both examples) · pnpm-audit 0 errors · docs-gates 5/5 · CI run
43715054564 success.

---

## a) FULLY DONE

1. **CI truth restored end-to-end (f1/f2 of the 09:26 report).** Three
   stacked defects found and fixed across four commits:
   - `d401edc` — docs-gates tool pin bumped 2adbc73 → aac5c7c (matches the
     locally deployed nix build; the old pin's annotate rule rejected the
     current TODO_LIST verdict style).
   - `74fe5f4` — CHANGELOG `[Unreleased]` seeded with the 8 prior commits
     (the only unharvested freshness item), 09:26 status report landed,
     deprecated justfile removed.
   - `a54d4c5` — **the real blocker: CI checked out with `fetch-depth: 1`.**
     The annotate gate verifies every `done at <hash>` verdict against real
     commits; a shallow clone cannot resolve the January-era hashes in
     archived reports → 675 unresolvable-citation findings. Locally the gate
     passed because local history is full. `fetch-depth: 0` fixed it. First
     fully-green CI: run 43710605652.
2. **Dependabot PR #13 root-caused (§f3).** The open minor-and-patch PR is
   STALE: branched before the TS 6.0.2 pin, bumps alloy 0.25→0.26 +
   emitter-framework 0.21→0.22, and its 20 s failure is `build:check`
   crashing on the old tree (`tsc` missing under TS 7). Recreation on the
   current tree (T22) is the correct path, not fixing that branch.
3. **T13 `@visibility` read-shaped emission (b4437bb).** New
   `visibility-mode` emitter option (`"all"` default — zero behavior
   change — or `"read"`). Under `read`, properties without
   `Lifecycle.Read` are dropped using the compiler's OFFICIAL
   `isVisible`/`getLifecycleVisibilityEnum` APIs (probed: the enum lives at
   `TypeSpec.Lifecycle`, not the doc-comment's stale
   `TypeSpec.Visibility.Lifecycle`). Domain module `src/domain/visibility.ts`
   (zero any), option validation with an actionable error
   (what/expected/fix), 5 integration tests via real compilation
   (createTester), design note in MAPPING-GUIDE § Visibility,
   FEATURES/TODO_LIST flipped with dated verdicts. Also corrected stale doc
   truth: `@go.nullable`/`@go.enumMode` were consumed by 3b446fc but still
   read "consumption pending" in MAPPING-GUIDE and TODO_LIST.
4. **T14 Go generics (domain+tests in daemon commit 9f93b91, completion in
   161043f).** Template declarations emit as Go generic types via alloy's
   `TypeDeclaration typeParameters`: `model Page<T>` → `type Page[T any]
   struct`, multi-parameter templates (`Pair[K any, V any]`), parameter
   references resolve by declared name (probed: TemplateParameter type has
   no name field — the name lives on the AST node, `node.id.sv`).
   Constraints deliberately emit as `any` (declare-only, documented).
   **First struct-property array support** (`items: T[]`, `tags:
   string[]`): `T[]` is NOT an indexer model in compiler 1.18 — it is an
   anonymous `Array`-named template instantiation with the element in
   `templateMapper.args[0]`; rendering it as a Reference produced
   `<Unresolved Symbol>` (caught by the CLI e2e because my unit tests
   initially missed the array render path — coverage gap closed with a
   dedicated test). `TypeExpression`'s hand-rolled `isArrayModel` guard was
   also silently broken (indexer-based) and now uses the official
   `isArrayModelType`. E2E needles added; `Page<T>` compiles under real
   `go build` in CI.
5. **Dev-tree audit errors overridden (161043f).** The root-cleanup
   session's `pnpm-lock.yaml` deletion made BuildFlow's audit step inspect
   the REAL dependency tree for the first time: 21 ERROR findings (nanoid,
   vite, rollup, @babel/core, fast-uri, picomatch, yaml, postcss,
   browserslist, source-map-js), all dev-toolchain transitives, none in the
   published emitter. Fixed honestly — `overrides` pinning patched versions
   within the same major (nanoid 3.3.20, vite 7.3.8, rollup 4.68.3, babel
   7.29.13, …) — not by weakening the gate. Audit now clean.
6. **Bun pinned in CI (root-cleanup item 30).** `bun-version: 1.4.4`
   (matches the locally deployed version).
7. **T15 core fixes (daemon commit c9e77e6 captured the code; 0975be1 the
   remainder).** Operation parameters written as property references
   (`@path id: Widget.id`) resolve to the referenced property's type
   (kind `ModelProperty` → unwrap `.type` → `string`) instead of degrading
   to `interface{}`; handlers.go imports emit as ONE SORTED std-lib group
   (goimports convention — the old order emitted `log` after `net/http`,
   which gofmt cannot merge across separate import statements, so the e2e
   `gofmt -l` net never caught it).
8. **TS 7 regression caught and reverted (d289c86).** The toolchain session
   bumped typescript to 7.0.2; CI failed at `alloy build` (`ts.sys`
   undefined — the documented 2026-11-14 crash). Local gates had passed
   ONLY because local node_modules still held the stale 6.0.2 install.
   Reverted to the 6.0.2 pin; CI green again (43715054564).
9. **Root-cleanup follow-ups harvested (3 items into TODO_LIST).** The
   docs-gates freshness gate flagged the 13:11 report's open items; bun pin
   DONE, daemon-verification and session-coordination rows added as TODO.

## b) PARTIALLY DONE

1. **T15 (2 of 4 sub-items).** DONE: property-ref parameter resolution +
   sorted handler imports. NOT DONE: (a) per-namespace try/catch in the
   emitter so generation failures name the namespace/package (the only
   enriched error today is the visibility-mode validation), (b) receiver
   naming + `Service` vs `API` convention documented in MAPPING-GUIDE,
   (c) TODO_LIST T15 rows not yet flipped.
2. **T22 dependabot.** Investigated (stale PR, root cause known) but the
   recreation-through-full-gates has not been executed.
3. **Freshness reconciliation for THIS report.** §f below must be harvested
   into TODO_LIST immediately after publication to keep the gate green
   (same ritual as the 09:26 report).

## c) NOT STARTED

- **T16 refactors:** unify `getOutputDirectory`/`namespaceToPackageName`,
  MockFactory → module functions, file-layout builder extraction,
  clean-type-mapper cast reduction, filename-case decision.
- **T17 example #3:** versioned multi-namespace API + discriminated-union
  fixture exercising GetType + unmarshal in CI.
- **T20 npm publish:** owner-gated (§g Q1 below).
- **Runtime handler smoke test** (mount RegisterRoutes in a Go test, fire
  GET + POST with body) — §f9 of the 09:26 report.

## d) TOTALLY FUCKED UP (honest)

1. **Twice, my in-flight work was swept into OTHER sessions' commits.** The
   auto-commit daemon (or the parallel sessions' daemons) committed at
   13:16 and ~13:30 while I had uncommitted changes on disk: my T14 domain
   code landed inside the root-cleanup commit (9f93b91), my T15 code landed
   inside the toolchain-upgrade commit (c9e77e6). Both foreign commits'
   messages honestly describe what they contain, but the history now mixes
   concerns across sessions and neither foreign author knew they were
   committing someone else's half-finished work. Correct order would have
   been: finish + commit my unit of work before yielding, or agree a
   working-set boundary up front.
2. **`git commit -m "test probe"`.** To diagnose why a commit seemed to
   fail, I ran a probe commit with a junk message — which COMMITTED
   everything staged. Had to `--amend` the message immediately (161043f).
   The right diagnostic was reading the hook's full output, not committing
   garbage. Zero data loss, but pure luck + amend.
3. **Trusted green gates on a stale dependency tree.** After the toolchain
   commit bumped TS to 7.0.2, my local build/test/e2e all passed — because
   local node_modules still contained 6.0.2. I pushed 0975be1 and CI
   failed in 11 s. The tell was visible earlier (bun install had run before
   the toolchain edits). Lesson: after ANY lockfile/dependency-touching
   commit from another session, `bun install --frozen-lockfile` before
   believing local gates.
4. **Coverage gap in the generics unit tests.** My first five generics
   tests never rendered an array-of-T property, so `<Unresolved Symbol>`
   shipped through unit tests and only the CLI e2e caught it. Fixed by
   adding the Page<T> render test — but the ordering matters: render-path
   tests should exist BEFORE wiring new type shapes, not after e2e failure.
5. **Broken edit chain waste.** A python patch failed its assert AFTER a
   prior edit had been rejected by the file-modified guard, leaving a
   missing `For` import that broke 7 tests; build passed (alloy prints
   success on TS errors — known gotcha) while tests caught it. One careful
   re-read would have saved the cycle.
6. **The 09:26 handoff was stale on two facts** (not my error, but it cost
   time): it said the working tree had exactly ONE uncommitted change
   (there were three: ci.yml, justfile deletion, the untracked 09:26
   report itself), and it predicted the annotate fix was only about tool
   version skew (the shallow-clone hash problem was invisible from local
   truth).

## e) WHAT WE SHOULD IMPROVE

1. **Session coordination.** With daemons auto-committing, two agents
   working one branch WILL steal each other's diffs. A git-town/branch
   split per session, or a simple lock file convention, is now mandatory
   hygiene, not ceremony (TODO_LIST row added).
2. **Post-foreign-commit ritual:** `bun install --frozen-lockfile` +
   `git log origin..HEAD` before trusting local gates. Worth an AGENTS.md
   bullet.
3. **CI lane for the interface surface.** The e2e needles check presence,
   not signature correctness — `id interface{}` shipped through four green
   gate layers and was found by manual audit. A generated-output review
   pass (or go vet-style signature assertions on interfaces.go) belongs in
   the e2e net.
4. **Import grouping as a gate.** `gofmt -l` cannot catch unsorted separate
   import statements; `goimports -l` can. Adding it to test-e2e-cli.mjs
   makes the goimports convention enforced rather than aspirational.
5. **Doc-comment drift.** The compiler's own .d.ts says
   `TypeSpec.Visibility.Lifecycle`; the shipped lib defines
   `TypeSpec.Lifecycle`. Probing beat reading — but a tiny
   "compiler API probes" note in AGENTS.md would save the next session the
   same roundtrip.

## f) NEXT (priority order)

1. T15 remainder: per-namespace error-context wrapping in the emitter (20 min).
2. T15 remainder: receiver naming + `<Pkg>Service` vs `<Pkg>API` conventions
   section in MAPPING-GUIDE (15 min).
3. T15 remainder: flip TODO_LIST rows with dated verdicts (5 min).
4. Harvest §f1–f3 of THIS report into TODO_LIST so freshness stays green (5 min).
5. T22: recreate the dependabot group bump (alloy 0.26, emitter-framework
   0.22) on the CURRENT tree through the full local gate set; report whether
   alloy 0.26 supports TS 6 (45 min).
6. T17: example #3 — versioned multi-namespace API + discriminated union
   (GetType + UnmarshalX exercised in CI) (75 min).
7. Return-union semantics: `Widget | Error` currently degrades to
   `interface{}`; strip @error-decorated variants and emit `*Widget`
   (design first — touches TypeExpression union branch) (90 min).
8. Interface signature assertions in the e2e net (interfaces.go must not
   contain `interface{}` for scalar path params) (30 min).
9. `goimports -l` added to test-e2e-cli.mjs so import grouping is
   gate-enforced (20 min).
10. Runtime handler smoke test: mount RegisterRoutes in a Go test, GET +
    POST with body (30 min).
11. T16: unify `getOutputDirectory`/`namespaceToPackageName` (30 min).
12. T16: MockFactory class → module functions (30 min).
13. T16: file-layout builder extraction from GoPackageDirectory (40 min).
14. T16: clean-type-mapper cast reduction sweep (30 min).
15. T16: filename-case decision (kebab vs snake for generated files) (15 min).
16. Decide the stale dependabot PR #13: close with a pointer to the
    recreation commit (5 min).
17. README: `visibility-mode` + `go-module-path` options, decorator table,
    `<Pkg>API` naming contract (30 min).
18. COMPONENTS.md recount after route-component deletion + core additions (15 min).
19. SETUP.md audit vs package.json (M42/M43 remainder) (20 min).
20. API-REFERENCE rebuild from current dist exports (60 min).
21. `@query` param fixture in an example + e2e assertion (20 min).
22. crud interface fixture → assert interfaces.go/handlers.go content for
    example #2 (20 min).
23. Surface `getHttpOperation` diagnostics instead of silently nulling (20 min).
24. Wire `handler.returnType` into stub bodies' commented examples (20 min).
25. Stable (alphabetical) route ordering in RegisterRoutes (10 min).
26. Alignment edge tests: empty/single-member structs, 0-member enum (15 min).
27. MergePatchUpdate heuristic guard against user models genuinely named
    `XMergePatchUpdate` (15 min).
28. ARCHITECTURE.md: interfaces walk + HTTP pipeline section (30 min).
29. MAPPING-GUIDE: merge-patch mapping + naming contract cross-links (15 min).
30. Nested-namespace interface-ops collector test (15 min).
31. Decide per-interface (`WidgetsAPI`) vs package-level (`DemoAPI`)
    interface naming (20 min).
32. Decide fallback-handler policy (undecorated ops → silent GET `/<name>`)
    — keep or hard-error (20 min).
33. CI: cache the docs-gates go install (15 min).
34. CI: gate duration watch — tester instances add ~2 s (5 min).
35. Upstream alloy-js issue: `InterfaceFunction` emits `func` inside
    interface bodies (verify against their tests before filing) (30 min).
36. Upstream docs-gates: suggest tagged releases so pins don't rot (15 min).
37. e2e: assert go.mod module line in the net (10 min).
38. e2e: `@put`/`@patch`/`@delete` verbs visible in assertions (15 min).
39. Unit check: no trailing blank line in any generated file (10 min).
40. Consider deleting the local `v1.0.0-rc.1` tag if the tree moves before
    publish (5 min).
41. Extract `handlerArgument`/`routeRegistration` into their own component
    file (15 min).
42. TypeExpression merge-patch suffix: unit test for the non-match case (10 min).
43. Sweep remaining exact-match assertions → whitespace-tolerant (20 min).
44. Document Service/API convention in DOMAIN_LANGUAGE.md (10 min).
45. Consider `const` blocks for string enums (Go convention) (15 min).
46. Root-cleanup item 3: verify the daemon's 10 deletions are separately
    reviewable in history (10 min).
47. Root-cleanup item 31: repo-wide sweep for lingering prettier references
    outside docs/status history (10 min).
48. CHANGELOG: fold the T13–T15 bullets into a `[1.1.0]` candidate section
    if the owner picks the fold-into-1.0.0 path (§g Q1) (15 min).
49. mise.toml runtime validation (root-cleanup §d1: never executed) (10 min).
50. ROADMAP: strike generics + visibility rows, add per-lifecycle variant
    structs + constraint translation as future work (10 min).

## g) QUESTIONS FOR THE OWNER

1. **Concurrent sessions on one branch.** Two other sessions committed into
   `lars/lets-rock` while I worked, and both auto-commit daemons captured
   my in-flight diffs into their commits (9f93b91, c9e77e6). Should we
   serialize sessions per repo (one working tree at a time), split per
   session onto own branches via git-town, or keep the chaos and accept
   reconciliation? (TODO_LIST row exists; policy needs your call.)
2. **TypeScript 7 posture.** The toolchain session re-upgraded TS to 7.0.2;
   CI crashed exactly as documented on 2026-11-14 (`ts.sys` removed from
   the classic surface; alloy CLI 0.22 reads it at load time). I reverted
   to the 6.0.2 pin (d289c86, CI green). Confirm the pin stays until
   @alloy-js/cli ships TS 7 compatibility — or tell me to upgrade alloy
   (0.26 exists per dependabot) and re-land TS 7 deliberately, gated on a
   local fresh-install verification this time.
3. **Return-union semantics.** `op read(): Widget | Error` currently
   generates `interface{}` returns. My recommendation: strip @error-model
   variants from return unions and emit `*Widget` (pointer = absent on
   success) with the error surface staying in Go's `error` convention.
   Agree, or keep the conservative `interface{}` until variants are typed?
