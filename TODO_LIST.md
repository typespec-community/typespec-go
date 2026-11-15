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

| Task                                                                      | Status    | Impact | Effort | Evidence                                                                                                                                                                                          |
| ------------------------------------------------------------------------- | --------- | ------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HTTP decorator extraction end-to-end (`@route`/`@get`/`@post` → handlers) | ✅ `DONE` | High   | 3h     | 2026-11-15: interfaces walk shipped; handlers/interfaces.go generated with real routes (`/widgets/{id}`), verbs, PathValue + body-decode closures; e2e-verified compilable                        |
| Consume `@go.nullable` and `@go.enumMode` in generation                   | ✅ `DONE` | High   | 2h     | 2026-11-15: consumed by `GoStructDeclaration` (`@go.nullable`) + `GoEnumDeclaration` (`@go.enumMode`), covered by `go-decorator-modes.test.tsx` and e2e; MAPPING-GUIDE table updated              |
| `@visibility` processing in generated output                              | ✅ `DONE` | High   | 3h     | 2026-11-15: read-shaped emission via `visibility-mode` option (`src/domain/visibility.ts`, compiler `isVisible` API); design note in MAPPING-GUIDE § Visibility; `visibility-filter.test.tsx` 5/5 |

## Medium Impact

| Task                                                                               | Status           | Impact | Effort | Evidence                                                                                                                                                        |
| ---------------------------------------------------------------------------------- | ---------------- | ------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Discriminated-union unmarshaler (real implementation, not placeholder)             | ✅ `DONE`        | Med    | 3h     | 2026-11-15: real `UnmarshalX` via `json.Unmarshal` + `fmt.Errorf`; `go build ./...` gate added to e2e (both examples compile)                                   |
| Generated-doc comments: one doc block per package, not per type                    | 🟡 `IN_PROGRESS` | Med    | 1h     | `// Go types from TypeSpec namespace: X` repeats above every struct (`GoStructDeclaration` default doc)                                                         |
| Cover `typespec/http` in the CI test harness                                       | ✅ `DONE`        | Med    | 2h     | 2026-11-15: `createTester(libraries: ["@typespec/http"])` works (repo-root baseDir); `src/test/http-harness.test.tsx` asserts collector + generation end to end |
| Union interface body indentation + blank-line separation (gofmt -l clean natively) | ✅ `DONE`        | Med    | 2h     | 2026-11-15: gofmt-style column alignment + decl separators; e2e `gofmt -l` clean on RAW output, `-w` normalize step removed                                     |
| Fix `// //` double doc-comment slash bug in union/enum docs                        | ✅ `DONE`        | Med    | 30min  | 2026-11-15: interfaceDoc no longer prepends `//`; package doc hoisted to models.go header (above package clause) instead of repeating above every struct        |
| Fix unused-import emission in generated unions.go                                  | ✅ `DONE`        | Med    | 1h     | 2026-11-15: imports now usage-driven (`encoding/json` + `fmt` consumed by the real unmarshaler); go.mod generation via `go-module-path` option                  |
| Remove `.docs-gates-preflight.json` from git; gitignore it                         | ✅ `DONE`        | Low    | 5min   | 2026-11-15: untracked + gitignored (T09)                                                                                                                        |
| Investigate `.go.mod.lock` (0-byte file at repo root)                              | ✅ `DONE`        | Low    | 5min   | 2026-11-15: 0-byte stray from old commit `38ee369`, zero references anywhere → deleted; also deleted orphan `working-emitter-demo.ts` + `build:webpack` script  |
| CI: cache the docs-gates go install or vendor the binary                           | 🔴 `TODO`        | Low    | 30min  | CI downloads the module every run; also verify the step actually succeeds (continue-on-error masks failure)                                                     |
| Pin the bun version in CI (`setup-bun` was `latest`)                               | ✅ `DONE`        | Low    | 5min   | 2026-11-15: `bun-version: 1.4.4` pinned to the locally deployed version (root-cleanup report item 30)                                                           |
| Verify auto-commit daemon lands the 10 root-cleanup `D` entries intact             | 🔴 `TODO`        | Low    | 10min  | Root-cleanup report item 3: confirm each deletion is separately reviewable in history (buildflow anti-pattern: "don't assume pma committed your work")          |
| Coordinate sessions before `src/`-adjacent work (root-cleanup §g3)                 | 🔴 `TODO`        | Low    | 5min   | Root-cleanup report item 32: this session and the root-cleanup session overlapped in src/ on 2026-11-15; agree a lock or split boundary                         |
| Unify `getOutputDirectory` + `namespaceToPackageName` (two name→path mappers)      | 🔴 `TODO`        | Low    | 30min  | `typespec-go-emitter.tsx` keeps two parallel namespace-name→path mappers; consolidate into one to prevent drift (status-report f37, Plan II T16/M56)            |
| Consumer quickstart doc + emitter generation-summary log                           | ✅ `DONE`        | Med    | 60min  | 2026-11-15: `docs/QUICKSTART.md` (install → tspconfig → output) + INFO-level per-namespace file list at emission end (commit cec59c6)                           |

## Done (2026-11-14 Pareto execution)

- ✅ CI green end-to-end: build, tests, lint (`--max-warnings 0`), strict typecheck (0 errors), dprint, CLI e2e, docs-gates job.
- ✅ (2026-11-15) Compile-level conformance: e2e runs `go build ./...` per module + native `gofmt -l`; real unmarshaler, usage-driven imports, go.mod via `go-module-path`.
- ✅ (2026-11-15) HTTP product chain: interface ops collected; handlers + route registration with verbs, path params (`r.PathValue`), body decoding; merge-patch bodies map to base model; `@typespec/http` in vitest harness.
- ✅ (2026-11-15) T13 `@visibility` read-shaped emission: `visibility-mode: "read"` drops non-Read properties via the compiler `isVisible` API; design note in MAPPING-GUIDE; 5 tests.
- ✅ (2026-11-15) T14 Go generics: template declarations emit as `type Page[T any] struct`; multi-param templates; template params resolve by name; first struct-property array support (`T[]`, `Scalar[]`); constraints emit as `any` (declare-only); e2e-verified compilable; 6 tests.
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
| `npm run test:typespec`                                  | ✅ 180/180 tests, 38 files              |
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
