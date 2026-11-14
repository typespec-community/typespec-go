# Features

> Honest inventory of what this project does, by status — verified against the
> code on **2026-11-13** (HEAD `8205ea3`, 165/165 tests passing). Status labels
> answer one question: does working code exist, and if not, why not?

## Status legend

| Status                    | Meaning                                        |
| ------------------------- | ---------------------------------------------- |
| 🟢 `FULLY_FUNCTIONAL`     | Works as intended, exercised by passing tests. |
| 🟡 `PARTIALLY_FUNCTIONAL` | Ships but has known gaps or unverified paths.  |
| 🔴 `BROKEN`               | Present in code but failing.                   |
| ⚪ `PLANNED`              | No code yet; genuinely next on the build path. |

## Overview

| Domain                    | Rows   | 🟢     | 🟡    | ⚪    |
| ------------------------- | ------ | ------ | ----- | ----- |
| Core Type System          | 11     | 11     | 0     | 0     |
| Code Organization         | 5      | 3      | 2     | 0     |
| HTTP & APIs               | 4      | 3      | 1     | 0     |
| Advanced Patterns         | 7      | 3      | 1     | 3     |
| Real TypeSpec Integration | 4      | 3      | 1     | 0     |
| Documentation             | 3      | 3      | 0     | 0     |
| Tooling & CI              | 7      | 3      | 4     | 0     |
| **Total**                 | **41** | **29** | **9** | **3** |

## Core Type System

| Feature                                        | Status                | Evidence                                                                   | Notes                                    |
| ---------------------------------------------- | --------------------- | -------------------------------------------------------------------------- | ---------------------------------------- |
| Basic model → Go struct                        | 🟢 `FULLY_FUNCTIONAL` | `src/test/struct-isolated.test.tsx`, `model-generation` suite              | JSON-tagged structs                      |
| Scalar mapping (int8-64, uint8-64, float32/64) | 🟢 `FULLY_FUNCTIONAL` | `src/test/extended-scalars.test.tsx`                                       | Via `src/domain/clean-type-mapper.ts`    |
| Optional props → pointers                      | 🟢 `FULLY_FUNCTIONAL` | `src/test/pointer-types.test.tsx`                                          | `*T` + `omitempty`                       |
| JSON tag generation                            | 🟢 `FULLY_FUNCTIONAL` | `src/test/components-basic.test.tsx`                                       | PascalCase → json name                   |
| Array/slice types                              | 🟢 `FULLY_FUNCTIONAL` | `src/test/array-type-generation.test.ts`, `array-type-integration.test.ts` | `T[]` → `[]T`                            |
| Map/record types                               | 🟢 `FULLY_FUNCTIONAL` | `src/test/map-type-generation.test.ts`                                     | `Record<K,V>` / `map<K,V>` → `map[K]V`   |
| Time/duration types                            | 🟢 `FULLY_FUNCTIONAL` | `src/test/extended-scalars.test.tsx`; `clean-type-mapper.ts`               | `utcDateTime` → `time.Time`, auto-import |
| Enum generation                                | 🟢 `FULLY_FUNCTIONAL` | `src/test/enum-union-integration.test.tsx`; `GoEnumDeclaration.tsx`        | String + integer enums                   |
| Union type generation                          | 🟢 `FULLY_FUNCTIONAL` | `src/test/union-type-generation.test.ts`; `GoUnionDeclaration.tsx`         |                                          |
| `@doc` decorator support                       | 🟢 `FULLY_FUNCTIONAL` | `src/test/doc-decorator-support.test.tsx`                                  | Comments emitted on declarations         |
| Go code formatting                             | 🟢 `FULLY_FUNCTIONAL` | `src/test/go-formatter.test.ts`; `src/utils/go-formatter.ts`               | gofmt-style output                       |

## Code Organization

| Feature                        | Status                    | Evidence                                                 | Notes                                                                  |
| ------------------------------ | ------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------- |
| `go.mod` generation            | 🟢 `FULLY_FUNCTIONAL`     | `src/test/go-mod-generation.test.tsx`; `GoModFile.tsx`   |                                                                        |
| Package directory structure    | 🟢 `FULLY_FUNCTIONAL`     | `src/test/go-package-directory.test.tsx`                 | `GoPackageDirectory.tsx`                                               |
| Interface declaration          | 🟢 `FULLY_FUNCTIONAL`     | `src/test/go-interface-declaration.test.tsx`             | `GoInterfaceDeclaration.tsx`                                           |
| Namespace → package mapping    | 🟡 `PARTIALLY_FUNCTIONAL` | `src/emitter/typespec-go-emitter.tsx`; integration tests | Verified at API level; CLI path unverified (see Tooling)               |
| Multi-file output organization | 🟡 `PARTIALLY_FUNCTIONAL` | `GoPackageDirectory.tsx`                                 | Organizes by namespace; per-type file splitting not exercised by tests |

## HTTP & APIs

| Feature                                                | Status                    | Evidence                                                                                                        | Notes                                                                   |
| ------------------------------------------------------ | ------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Handler stub generation                                | 🟢 `FULLY_FUNCTIONAL`     | `src/test/go-handler-stub.test.tsx`, `go-handler-stub-improvements.test.ts`, `go-handler-return-types.test.tsx` | `GoHandlerStub.tsx`, `GoHandlerMethodComponent.tsx`                     |
| Route registration                                     | 🟢 `FULLY_FUNCTIONAL`     | `src/test/test-route-registration-fixed.test.tsx`, `test-route-registration-simple.test.tsx`                    | `GoRouteRegistrationComponent.tsx`                                      |
| HTTP decorator extraction (@route/@get from real .tsp) | 🟡 `PARTIALLY_FUNCTIONAL` | `src/test/typespec-emitter-integration.test.ts`                                                                 | Components verified; decorator-driven e2e handler generation unverified |
| HTTP library wiring in tests (@typespec/http)          | 🟡 `PARTIALLY_FUNCTIONAL` | `test/typespec/sample-service.tsp`                                                                              | Fixture exists; `@typespec/http` library loading in tests not wired     |

## Advanced Patterns

| Feature                                   | Status                    | Evidence                             | Notes                                                       |
| ----------------------------------------- | ------------------------- | ------------------------------------ | ----------------------------------------------------------- |
| Model composition (`extends` → embedding) | 🟢 `FULLY_FUNCTIONAL`     | `src/test/model-composition.test.ts` | Via `StandaloneGoGenerator`                                 |
| Spread/property merging                   | 🟢 `FULLY_FUNCTIONAL`     | `src/test/model-composition.test.ts` |                                                             |
| Cyclic dependency handling                | 🟢 `FULLY_FUNCTIONAL`     | `src/test/model-composition.test.ts` | Pointer-breaking for recursive types                        |
| Template models (generics)                | 🟡 `PARTIALLY_FUNCTIONAL` | `src/test/model-composition.test.ts` | Generator-level support; no Go generics emission end-to-end |
| `@go.*` custom decorators                 | ⚪ `PLANNED`              | No implementation in `src/`          | `@go.name`, `@go.type`, `@go.tag`, `@go.package`            |
| `@error` model handling                   | ⚪ `PLANNED`              | No implementation in `src/`          |                                                             |
| `@visibility` decorator processing        | ⚪ `PLANNED`              | No implementation in `src/`          |                                                             |

## Real TypeSpec Integration

| Feature                          | Status                    | Evidence                                                                                                                 | Notes                                                               |
| -------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| `createTester` compilation tests | 🟢 `FULLY_FUNCTIONAL`     | `src/test/integration-typespec-compiler-working.test.ts` (added `631185b`)                                               | Compiles real TypeSpec in-memory                                    |
| E2E emitter pipeline (API level) | 🟢 `FULLY_FUNCTIONAL`     | `src/test/integration-working-e2e.test.ts`, `typespec-emitter-integration.test.ts`, `typespec-integration-basic.test.ts` | TypeSpec → Program → components → output                            |
| `.tsp` test fixtures             | 🟢 `FULLY_FUNCTIONAL`     | `src/test/*.tsp`, `test/typespec/sample-service.tsp` (`5dfa1e8`)                                                         |                                                                     |
| CLI `tsp compile` end-to-end     | 🟡 `PARTIALLY_FUNCTIONAL` | `src/emitter/typespec-go-emitter.tsx`                                                                                    | Unverified at HEAD; historical blockers preserved in `test/broken/` |

## Documentation

| Feature             | Status                | Evidence                                             | Notes                  |
| ------------------- | --------------------- | ---------------------------------------------------- | ---------------------- |
| Contributor docs    | 🟢 `FULLY_FUNCTIONAL` | `CONTRIBUTING.md` (`e7e29ed`), `AGENTS.md`           |                        |
| Component reference | 🟢 `FULLY_FUNCTIONAL` | `COMPONENTS.md` (`bae8473`)                          | 12 primary + 5 helpers |
| Setup & API guides  | 🟢 `FULLY_FUNCTIONAL` | `docs/SETUP.md` (`151579d`), `docs/API-REFERENCE.md` |                        |

## Tooling & CI

| Feature                       | Status                    | Evidence                                                 | Notes                                                                                             |
| ----------------------------- | ------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Test infrastructure (vitest)  | 🟢 `FULLY_FUNCTIONAL`     | 165/165 tests, 36 files (`npm test`)                     | Alloy matchers via `src/test/vitest.setup.ts`                                                     |
| Local build (`alloy build`)   | 🟢 `FULLY_FUNCTIONAL`     | passes locally at `8205ea3`                              | One TS 7 `rootDir` warning (TS5011)                                                               |
| Zero `any` in production code | 🟢 `FULLY_FUNCTIONAL`     | `src/components`, `src/domain`, `src/emitter` grep-clean | Eliminated `e7e29ed`, hardened `97f7f58`                                                          |
| Formatters (dprint/prettier)  | 🟢 `FULLY_FUNCTIONAL`     | `dprint.json`, `package.json` format script              |                                                                                                   |
| CI workflow                   | 🟡 `PARTIALLY_FUNCTIONAL` | `.github/workflows/ci.yml` (`bae8473`)                   | Exists since 2026-01-02; RED at HEAD — build step crashes (alloy CLI × TS 7.0.2), run 43432825741 |
| Lint (eslint)                 | 🟡 `PARTIALLY_FUNCTIONAL` | `npm run lint`                                           | 13 `no-explicit-any` errors + 1 warning in test-support files                                     |
| Strict type check             | 🟡 `PARTIALLY_FUNCTIONAL` | `npm run build:check`                                    | 28 errors: missing `node` types + test-file casts                                                 |

## Usage example (verified working)

```tsp
namespace Demo {
  model User {
    id: string;
    name: string;
    email?: string;
    tags: string[];
    createdAt: utcDateTime;
  }
}
```

Generates (shape verified by the model/type suites):

```go
package demo

import "time"

type User struct {
    ID        string    `json:"id"`
    Name      string    `json:"name"`
    Email     *string   `json:"email,omitempty"`
    Tags      []string  `json:"tags"`
    CreatedAt time.Time `json:"createdAt"`
}
```

## Related documentation

- [TODO_LIST.md](./TODO_LIST.md) — current actionable work
- [ROADMAP.md](./ROADMAP.md) — long-term vision
- [CHANGELOG.md](./CHANGELOG.md) — what shipped, when
- [docs/API-REFERENCE.md](./docs/API-REFERENCE.md) — emitter API
- [docs/TYPE-MAPPING-GUIDE.md](./docs/TYPE-MAPPING-GUIDE.md) — type conversion details
