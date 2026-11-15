# Features

> Honest inventory of what this project does, by status — verified against the
> code on **2026-11-15** (compile-level Go conformance + HTTP product chain
> shipped; 190/190 tests, all gates green). Status labels answer one question:
> does working code exist, and if not, why not?

## Status legend

| Status                    | Meaning                               |
| ------------------------- | ------------------------------------- |
| 🟢 `FULLY_FUNCTIONAL`     | Implemented, tested, machine-verified |
| 🟡 `PARTIALLY_FUNCTIONAL` | Works with known limits (noted)       |
| 🔵 `EXPERIMENTAL`         | Works but untested edge cases         |
| ⚪ `PLANNED`              | Not implemented                       |

## Core Type System

| Feature                                        | Status                | Evidence                                                  | Notes                                           |
| ---------------------------------------------- | --------------------- | --------------------------------------------------------- | ----------------------------------------------- |
| Basic model → Go struct                        | 🟢 `FULLY_FUNCTIONAL` | `src/test/struct-isolated.test.tsx`                       | JSON-tagged, gofmt-aligned columns              |
| Scalar mapping (int8-64, uint8-64, float32/64) | 🟢 `FULLY_FUNCTIONAL` | `src/test/extended-scalars.test.tsx`                      | Kernel: `src/domain/go-primitive-types.ts`      |
| Optional props → pointers                      | 🟢 `FULLY_FUNCTIONAL` | `src/test/pointer-types.test.tsx`                         | `*T` + `omitempty`; override via `@go.nullable` |
| JSON tag generation                            | 🟢 `FULLY_FUNCTIONAL` | `src/test/components-basic.test.tsx`                      | PascalCase → json name                          |
| Array/slice types                              | 🟢 `FULLY_FUNCTIONAL` | `src/test/array-type-generation.test.ts`                  | `T[]` → `[]T`                                   |
| Map/record types                               | 🟢 `FULLY_FUNCTIONAL` | `src/test/map-type-generation.test.ts`                    | `Record<K,V>` → `map[K]V`                       |
| Time/duration types                            | 🟢 `FULLY_FUNCTIONAL` | `src/test/extended-scalars.test.tsx`                      | `utcDateTime` → `time.Time`, auto-import        |
| Enum generation                                | 🟢 `FULLY_FUNCTIONAL` | `src/test/enum-union-integration.test.tsx`                | String + iota consts; `IsValid`/`String`        |
| Union generation + real unmarshaler            | 🟢 `FULLY_FUNCTIONAL` | e2e crud `unions.go` compiles; `UnmarshalX` uses json+fmt | Discriminated unions; cross-file refs           |
| `@doc` decorator support                       | 🟢 `FULLY_FUNCTIONAL` | `src/test/doc-decorator-support.test.tsx`                 | No `// //` double-slash bug                     |
| Native gofmt-clean output                      | 🟢 `FULLY_FUNCTIONAL` | e2e `gofmt -l` green on RAW output (no normalize step)    | Column alignment + decl separators              |

## Code Organization

| Feature                     | Status                | Evidence                                     | Notes                                        |
| --------------------------- | --------------------- | -------------------------------------------- | -------------------------------------------- |
| `go.mod` generation         | 🟢 `FULLY_FUNCTIONAL` | `go-module-path` emitter option; e2e builds  | Plain module text, no package clause         |
| Package directory structure | 🟢 `FULLY_FUNCTIONAL` | `src/test/go-package-directory.test.tsx`     | Per-namespace packages                       |
| Interface declaration       | 🟢 `FULLY_FUNCTIONAL` | `src/test/go-interface-declaration.test.tsx` | `<Pkg>API` contract; `<Pkg>Service` handlers |
| Namespace → package mapping | 🟢 `FULLY_FUNCTIONAL` | e2e both examples                            | `Vendor.Service` → nested packages           |
| Package doc comment         | 🟢 `FULLY_FUNCTIONAL` | models.go header above package clause        | One doc block per package, not per type      |
| Generation summary log      | 🟢 `FULLY_FUNCTIONAL` | INFO log: output dir + file list per package |                                              |

## HTTP & APIs

| Feature                                      | Status                | Evidence                                        | Notes                                              |
| -------------------------------------------- | --------------------- | ----------------------------------------------- | -------------------------------------------------- |
| Interface operations collected               | 🟢 `FULLY_FUNCTIONAL` | `src/test/advanced-surface.test.ts` (walk test) | `namespace.interfaces` walked recursively          |
| Handler methods from `@route`/`@get`/`@post` | 🟢 `FULLY_FUNCTIONAL` | e2e basic example `handlers.go` compiles        | Real routes + verbs; framework trio signature      |
| Route registration with request adaptation   | 🟢 `FULLY_FUNCTIONAL` | e2e asserts `r.PathValue`, body decode closures | `encoding/json` import only when body params exist |
| API contract interface                       | 🟢 `FULLY_FUNCTIONAL` | `src/test/http-harness.test.tsx`                | No `func` keyword inside interface bodies          |
| MergePatchUpdate bodies → base model         | 🟢 `FULLY_FUNCTIONAL` | `src/test/http-harness.test.tsx`                | Compiler names instances `<Arg>MergePatchUpdate`   |
| `@typespec/http` in vitest harness           | 🟢 `FULLY_FUNCTIONAL` | `src/test/http-harness.test.tsx`                | `createTester(libraries)` with repo-root baseDir   |
| Return-type extraction                       | 🟢 `FULLY_FUNCTIONAL` | `src/test/go-handler-return-types.test.tsx`     |                                                    |

## Decorators (TypeSpec.Go)

| Feature                                 | Status                | Evidence                                      | Notes                                        |
| --------------------------------------- | --------------------- | --------------------------------------------- | -------------------------------------------- |
| `@pkg` namespace output path            | 🟢 `FULLY_FUNCTIONAL` | crud example + e2e                            |                                              |
| `@name` (model/property/enum/operation) | 🟢 `FULLY_FUNCTIONAL` | `src/test/go-decorator-modes.test.tsx`        | All four targets consumed                    |
| `@type` override                        | 🟢 `FULLY_FUNCTIONAL` | `src/test/go-decorators-consumption.test.tsx` |                                              |
| `@structTag` (string AND Record form)   | 🟢 `FULLY_FUNCTIONAL` | `src/test/go-decorator-modes.test.tsx`        | Record normalized to raw tag string          |
| `@nullable` (pointer/zeroValue/struct)  | 🟢 `FULLY_FUNCTIONAL` | `src/test/go-decorator-modes.test.tsx`; e2e   | `valueof` wrappers unwrapped                 |
| `@enumMode` (iota/string/name)          | 🟢 `FULLY_FUNCTIONAL` | `src/test/go-decorator-modes.test.tsx`; e2e   | iota emits real `const ( … = iota )`         |
| `@error` models → `Error() string`      | 🟢 `FULLY_FUNCTIONAL` | `src/test/go-decorators-consumption.test.tsx` |                                              |
| `@visibility` processing                | ⚪ `PLANNED`          | —                                             | Needs a read/create/update design note first |

## Advanced Patterns

| Feature                                   | Status                | Evidence                                     | Notes                                  |
| ----------------------------------------- | --------------------- | -------------------------------------------- | -------------------------------------- |
| Model composition (`extends` → embedding) | 🟢 `FULLY_FUNCTIONAL` | `src/test/model-composition.test.ts`         |                                        |
| Cyclic dependency handling                | 🟢 `FULLY_FUNCTIONAL` | `src/test/model-composition.test.ts`         | Pointer-breaking for recursive types   |
| Template instances → argument types       | 🟢 `FULLY_FUNCTIONAL` | `TypeExpression` unwraps templateMapper args | Go generics emission itself is PLANNED |
| Go generics (`[T any]`) emission          | ⚪ `PLANNED`          | —                                            |                                        |

## Verification & Tooling

| Feature                              | Status                | Evidence                                                | Notes                                                    |
| ------------------------------------ | --------------------- | ------------------------------------------------------- | -------------------------------------------------------- |
| Test infrastructure (vitest)         | 🟢 `FULLY_FUNCTIONAL` | 190/190 tests, 39 files                                 | Alloy matchers via `src/test/vitest.setup.ts`            |
| Compile-level conformance (e2e)      | 🟢 `FULLY_FUNCTIONAL` | `scripts/test-e2e-cli.mjs`: `go build ./...` per module | Raw output; both examples, every commit                  |
| Native gofmt conformance (e2e)       | 🟢 `FULLY_FUNCTIONAL` | `gofmt -l` clean on raw output; `-w` step removed       |                                                          |
| Coverage ratchet                     | 🟢 `FULLY_FUNCTIONAL` | `vitest.config.js` thresholds 45/35/53/45               | Documented in CONTRIBUTING.md                            |
| Benchmarks                           | 🟢 `FULLY_FUNCTIONAL` | `src/test/go-generation.bench.tsx`; e2e wall-clock log  |                                                          |
| CI workflow                          | 🟢 `FULLY_FUNCTIONAL` | `.github/workflows/ci.yml`                              | docs-gates step unmasked + install path fixed 2026-11-15 |
| Lint (eslint `--max-warnings 0`)     | 🟢 `FULLY_FUNCTIONAL` | `npm run lint`                                          | 0 errors, 0 warnings                                     |
| Strict type check                    | 🟢 `FULLY_FUNCTIONAL` | `npm run build:check`                                   | 0 errors                                                 |
| Zero `any` in production code        | 🟢 `FULLY_FUNCTIONAL` | `src/components`, `src/domain`, `src/emitter`           |                                                          |
| docs-gates (freshness/audit/routing) | 🟢 `FULLY_FUNCTIONAL` | `docs-gates run .` 5/5 locally; CI now unmasked         |                                                          |

## Documentation

| Feature             | Status                    | Evidence                  | Notes                                     |
| ------------------- | ------------------------- | ------------------------- | ----------------------------------------- |
| Consumer quickstart | 🟢 `FULLY_FUNCTIONAL`     | `docs/QUICKSTART.md`      | Install → spec → generate → go build      |
| Architecture guide  | 🟢 `FULLY_FUNCTIONAL`     | `docs/ARCHITECTURE.md`    |                                           |
| Troubleshooting     | 🟢 `FULLY_FUNCTIONAL`     | `docs/TROUBLESHOOTING.md` |                                           |
| Deployment          | 🟢 `FULLY_FUNCTIONAL`     | `docs/DEPLOYMENT.md`      |                                           |
| Mapping guide       | 🟢 `FULLY_FUNCTIONAL`     | `docs/MAPPING-GUIDE.md`   |                                           |
| API reference       | 🟡 `PARTIALLY_FUNCTIONAL` | `docs/API-REFERENCE.md`   | Pre-dates decorator modes; refresh queued |

## Known limits

- `@go.name` on unions is not declared in `lib/main.tsp` (by design;
  follow the tsp declaration — no silent widening).
- `MergePatchUpdate<T>` mapping is name-suffix based (compiler instances
  carry no templateMapper); a user model genuinely named
  `XMergePatchUpdate` would unwrap — documented tradeoff.
- Handlers are compile-verified stubs (`StatusNotImplemented`); runtime
  behavior testing is queued.
- CI docs-gates module caching (install cost ~seconds) deliberately
  deferred.
