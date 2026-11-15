# TODO List

> Short-term, actionable, bounded work, verified against the code on **2026-11-14** (post Pareto-plan execution, v1.0.0 prepared).
> Long-term vision lives in [ROADMAP.md](./ROADMAP.md); shipped work lives in [CHANGELOG.md](./CHANGELOG.md).

## Status legend

| Status           | Meaning                                                 |
| ---------------- | ------------------------------------------------------- |
| 🔴 `TODO`        | Not started. Needs doing.                               |
| 🟡 `IN_PROGRESS` | Actively being worked on.                               |
| 🔵 `BLOCKED`     | Cannot proceed; external dependency or decision needed. |

## High Impact

| Task                                                                      | Status    | Impact | Effort | Evidence                                                                                                                                                                                                            |
| ------------------------------------------------------------------------- | --------- | ------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HTTP decorator extraction end-to-end (`@route`/`@get`/`@post` → handlers) | 🔴 `TODO` | High   | 3h     | Interface operations are NOT collected (`collectTypesByNamespace` never walks `namespace.interfaces`; `totalOperations: 0` in the basic-example emission log), so no handler files can be generated from real specs |
| Consume `@go.nullable` and `@go.enumMode` in generation                   | 🔴 `TODO` | High   | 2h     | Declared in `lib/main.tsp`, JS bindings exist (`src/emitter/go-decorators.ts`); no consumption point in components yet                                                                                              |
| `@visibility` processing in generated output                              | 🔴 `TODO` | High   | 3h     | `@visibility(Lifecycle.Read)` on properties compiles but does not filter output; needs a defined read/update/create model before coding                                                                             |

## Medium Impact

| Task                                                                               | Status           | Impact | Effort | Evidence                                                                                                                                       |
| ---------------------------------------------------------------------------------- | ---------------- | ------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Discriminated-union unmarshaler (real implementation, not placeholder)             | ✅ `DONE`        | Med    | 3h     | 2026-11-15: real `UnmarshalX` via `json.Unmarshal` + `fmt.Errorf`; `go build ./...` gate added to e2e (both examples compile)                  |
| Generated-doc comments: one doc block per package, not per type                    | 🟡 `IN_PROGRESS` | Med    | 1h     | `// Go types from TypeSpec namespace: X` repeats above every struct (`GoStructDeclaration` default doc)                                        |
| Cover `typespec/http` in the CI test harness                                       | 🔴 `TODO`        | Med    | 2h     | `createTester(libraries: [])` everywhere; HTTP fixtures compile only via `tsp` e2e, not vitest                                                 |
| Union interface body indentation + blank-line separation (gofmt -l clean natively) | ✅ `DONE`        | Med    | 2h     | 2026-11-15: gofmt-style column alignment + decl separators; e2e `gofmt -l` clean on RAW output, `-w` normalize step removed                    |
| Fix `// //` double doc-comment slash bug in union/enum docs                        | 🔴 `TODO`        | Med    | 30min  | Generated `unions.go` shows `// // PaymentMethod is a sealed interface` (interfaceDoc prepends `//`, renderer adds another)                    |
| Fix unused-import emission in generated unions.go                                  | ✅ `DONE`        | Med    | 1h     | 2026-11-15: imports now usage-driven (`encoding/json` + `fmt` consumed by the real unmarshaler); go.mod generation via `go-module-path` option |
| Remove `.docs-gates-preflight.json` from git; gitignore it                         | 🔴 `TODO`        | Low    | 5min   | Committed accidentally in `6f5bfb1` via `git add -A` — tool artifact, not repo content                                                         |
| Investigate `.go.mod.lock` (0-byte file at repo root)                              | 🔴 `TODO`        | Low    | 5min   | Present since before 2026-11-14; purpose unknown, never documented                                                                             |
| CI: cache the docs-gates go install or vendor the binary                           | 🔴 `TODO`        | Low    | 30min  | CI downloads the module every run; also verify the step actually succeeds (continue-on-error masks failure)                                    |

## Done (2026-11-14 Pareto execution)

- ✅ CI green end-to-end: build, tests, lint (`--max-warnings 0`), strict typecheck (0 errors), dprint, CLI e2e, docs-gates job.
- ✅ CLI product proof: `npm run test:e2e-cli` compiles BOTH examples with the built emitter, verifies content, gofmt conformance.
- ✅ `TypeSpec.Go` decorator library shipped and consumed (`@go.pkg`/`@go.name`/`@go.type`/`@go.structTag`); `@error` → `Error() string`.
- ✅ Cross-file type references (enum/union refkeys); union variants backed by models no longer duplicated.
- ✅ Single-source scalar mapping kernel (`src/domain/go-primitive-types.ts`); invalid Go aliases fixed.
- ✅ ESM packaging: `.js` suffixes, `rootDir`, `files` whitelist (289 kB tarball), dist pruning.
- ✅ Coverage reporting with thresholds; benchmarks; docs guides (ARCHITECTURE/DEPLOYMENT/TROUBLESHOOTING/MAPPING-GUIDE).
- ✅ Community plumbing: CODEOWNERS, issue templates; stale dependabot PR closed for recreation; peerDep `^1.18.0`.
- ✅ 11 root-layer legacy reports archived with manifest; CALL_GRAPH split brain resolved.
- ✅ v1.0.0 prepared: version bumped, CHANGELOG cut, `npm pack --dry-run` verified. Publish + tag push await explicit approval.

---

## Verified baseline (2026-11-14, 3× consecutive stable runs)

| Check                                                    | Result                                  |
| -------------------------------------------------------- | --------------------------------------- |
| `npm run test:typespec`                                  | ✅ 178/178 tests, 39 files              |
| `npm run build` (alloy + dist pruning)                   | ✅ passes                               |
| Built emitter loads under Node ESM                       | ✅ `node -e "import('./dist/main.js')"` |
| `npm run test:e2e-cli` (both examples, go build + gofmt) | ✅ green                                |
| CI (GitHub Actions)                                      | ✅ green (run 43614262527)              |
| `npm run lint`                                           | ✅ 0 errors, 0 warnings                 |
| `npm run build:check`                                    | ✅ 0 errors                             |
| `npm run test:coverage` (thresholds 40/30/48/40)         | ✅ 43.5% lines                          |
| `dprint check` / `docs-gates run .`                      | ✅ green / 5/5 PASS                     |

## Quick Links

- [ROADMAP.md](./ROADMAP.md) — long-term vision and unrefined ideas
- [CHANGELOG.md](./CHANGELOG.md) — what has been completed
- [FEATURES.md](./FEATURES.md) — honest feature inventory
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — how the emitter works
