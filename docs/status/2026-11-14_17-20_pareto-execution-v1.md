# Pareto Plan Execution: v1.0.0 Prepared, Full CI Pipeline Green

**Date:** 2026-11-14
**Scope:** Execution of `docs/planning/2026-11-14_08-42_SUPERB-PARETO-EXECUTION-PLAN.md`
(T01–T27) against the branch `lars/lets-rock`.

## a. What was the state before?

CI red (alloy CLI × TypeScript 7.0.2), 13 lint errors, 28 strict-mode type
errors, CLI path unverified, placeholder `go.mod`, teardown flake, dead files,
no coverage, no guides, legacy docs split brains.

## b. What is the state after?

- **CI fully green** end-to-end: build, 177/177 tests, lint
  (`--max-warnings 0`), strict typecheck (0 errors), dprint, CLI e2e proof,
  docs-gates job (warn-first), artifact archival.
- **CLI product proof:** `npm run test:e2e-cli` compiles BOTH examples
  (`examples/basic`, `examples/crud`) with the BUILT emitter through the real
  `tsp` compiler, asserts generated content (models, inline-union mapping,
  cross-file enum/union references, `@error` method), and gofmt-parses +
  normalizes every generated file.
- **Decorators shipped:** `TypeSpec.Go` namespace with `@go.pkg`,
  `@go.name`, `@go.type`, `@go.structTag` consumed in generation;
  `@go.nullable`/`@go.enumMode` declared with JS bindings;
  `@error` models generate `func (e X) Error() string`.
- **Packaging:** `files` whitelist + dist pruning (4.8 MB → 289 kB tarball),
  `rootDir`-correct `dist/main.js`, ESM-loadable, `tspMain` wired.
- **v1.0.0 prepared:** version bumped, CHANGELOG section cut,
  `npm pack --dry-run` verified. Publish and tag push await explicit owner
  approval (irreversible external actions).
- **Guides:** `docs/ARCHITECTURE.md`, `docs/DEPLOYMENT.md`,
  `docs/TROUBLESHOOTING.md`, `docs/MAPPING-GUIDE.md`.
- **Hygiene:** coverage with thresholds, benchmarks, CODEOWNERS + issue
  templates, 11 root-layer legacy reports archived, stale dependabot PR
  closed for recreation, peerDep `^1.18.0`, `just` references retired from
  living docs.

## c. Evidence

- CI run 43614262527 (green) on commit `402c42b`.
- E2E output verified: `widget/demoservice/models.go`,
  `github.com/acme/orders/api/orders/{models,enums,unions}.go`.
- 177/177 tests across 3 consecutive full-suite runs; teardown-flake fix
  verified over 5 runs earlier in the session.

## d. Key decisions

- TypeScript pinned to `6.0.2` (TS 7 removed `ts.sys`; typescript-eslint
  caps `<6.1.0`) — recorded in CHANGELOG.
- StandaloneGoGenerator fenced as a documented test scaffold (works on
  domain shapes, consumed only by tests; emitter path stays Alloy-only).
- CALL_GRAPH pair resolved by archive + new `docs/ARCHITECTURE.md`, not by
  merging stale graphs.
- Timing assertions in perf tests defused to 100 ms regression bounds
  (sub-millisecond claims flake under parallel load).

## e. Bugs the richer e2e net caught (invisible to unit suites)

1. Missing refkey declarations on enum/union TypeDeclarations → unresolved
   cross-file references.
2. Union variants backed by models re-declared → duplicate Go types.
3. Jammed sibling imports/declarations → syntax errors in enums.go/unions.go.

## f. Harvested into living docs

All open work items from this session are recorded in `TODO_LIST.md`
(High/Medium impact tables) and routed as listed in the freshness pre-flight.
Remaining plan items not executable this session are decision- or scope-
gated: full `@visibility` semantics, HTTP-metadata-driven generation,
`@go.nullable`/`@go.enumMode` consumption, real union unmarshaler, native
`gofmt -l`-clean output.

## g. Verification

`docs-gates run .` 5/5 PASS · `dprint check` clean · all gates listed in the
TODO_LIST verified-baseline table.
