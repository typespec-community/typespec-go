# TODO List

> Short-term, actionable, bounded work, verified against the code on **2026-11-13** (HEAD `8205ea3`).
> Long-term vision lives in [ROADMAP.md](./ROADMAP.md); shipped work lives in [CHANGELOG.md](./CHANGELOG.md).

## Status legend

| Status           | Meaning                                                 |
| ---------------- | ------------------------------------------------------- |
| 🔴 `TODO`        | Not started. Needs doing.                               |
| 🟡 `IN_PROGRESS` | Actively being worked on.                               |
| 🔵 `BLOCKED`     | Cannot proceed; external dependency or decision needed. |

## High Impact

| Task                                                                | Status    | Impact | Effort | Evidence                                                                                                                                                                                   |
| ------------------------------------------------------------------- | --------- | ------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Fix red CI build (`bunx alloy build` crashes: alloy CLI × TS 7.0.2) | 🔴 `TODO` | High   | 1-2h   | `.github/workflows/ci.yml:27`; run 43432825741 (2026-11-13): `ts.sys` undefined. Local `./node_modules/.bin/alloy build` passes                                                            |
| Clear 13 `no-explicit-any` lint errors in test-support files        | 🔴 `TODO` | High   | 1h     | `npm run lint` fails (`--max-warnings 0`): `src/test/enum-union-integration.test.tsx` (10), `src/test/doc-decorator-support.test.tsx:85,109`, `src/testing/go-component-test-utils.tsx:54` |
| Make `npm run build:check` pass (28 strict-mode errors)             | 🔴 `TODO` | High   | 2h     | `tsc --noEmit --strict`: missing `node` types (`src/domain/structured-logging.ts:267`, `src/emitter/typespec-go-emitter.tsx:11`) + `unknown → Model` casts in 9 test files                 |

## Medium Impact

| Task                                                                  | Status           | Impact | Effort | Evidence                                                                                                                                                                                                                      |
| --------------------------------------------------------------------- | ---------------- | ------ | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Verify CLI end-to-end generation (`tsp compile` with built emitter)   | 🟡 `IN_PROGRESS` | Med    | 2h     | `src/emitter/typespec-go-emitter.tsx` works at API level (integration tests pass); CLI path unverified at HEAD — historical blockers: `@alloy-js/core/jsx-dev-runtime` import + `writeOutput()` (preserved in `test/broken/`) |
| Filter built-in TypeSpec-namespace models in the emitter              | 🔴 `TODO`        | Med    | 1h     | `collectTypesByNamespace` in `src/emitter/typespec-go-emitter.tsx` has no `TypeSpec`-namespace filter (verified 2026-11-13; routed from 2026-01-02 report)                                                                    |
| Deduplicate type mapping into `CleanTypeMapper`                       | 🔴 `TODO`        | Med    | 1h     | `mapTypeSpecToGoType` duplication still at `src/components/go/GoStructDeclaration.tsx:130` (verified 2026-11-13)                                                                                                              |
| HTTP decorator extraction coverage (`@typespec/http` in test harness) | 🔴 `TODO`        | Med    | 2h     | `test/typespec/sample-service.tsp` exists; `@typespec/http` library loading + `@route`/`@get` e2e unverified (routed from 2026-01-02 report)                                                                                  |
| Add test coverage reporting with a threshold                          | 🔴 `TODO`        | Med    | 30min  | No coverage config in `vitest` setup; `just test-cov` referenced in `justfile:71` but never wired                                                                                                                             |

## Low Impact

| Task                                                                       | Status    | Impact | Effort | Evidence                                                                                                                        |
| -------------------------------------------------------------------------- | --------- | ------ | ------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Remove `GoHandlerStub.tsx.disabled` leftover                               | 🔴 `TODO` | Low    | 5min   | `src/components/go/GoHandlerStub.tsx.disabled` superseded by active `GoHandlerStub.tsx`                                         |
| Fix `go.mod` placeholder module path                                       | 🔴 `TODO` | Low    | 5min   | `go.mod:1` = `module <module-path>` — breaks any `go run`/tooling executed inside the repo                                      |
| Fix intermittent `EnvironmentTeardownError` in `components-basic.test.tsx` | 🔴 `TODO` | Low    | 30min  | Observed 2026-11-13: unhandled rejection loading `jsx-runtime.js` after teardown (`GoSwitch.tsx:9`); 1 of 2 local runs affected |

---

## Verified baseline (2026-11-13)

| Check                                                  | Result                                                               |
| ------------------------------------------------------ | -------------------------------------------------------------------- |
| `npm test` (vitest)                                    | ✅ 165/165 tests, 36 files                                           |
| `alloy build` (local)                                  | ✅ passes (one TS 7 `rootDir` warning)                               |
| CI (GitHub Actions)                                    | 🔴 red — build step crash (row above)                                |
| `npm run lint`                                         | 🔴 13 errors, 1 warning (test-support files)                         |
| `tsc --noEmit --strict`                                | 🔴 28 errors                                                         |
| `any` types in src/components, src/domain, src/emitter | ✅ zero                                                              |
| Real TypeSpec integration tests                        | ✅ `src/test/integration-typespec-compiler-working.test.ts` + 4 more |

## Quick Links

- [ROADMAP.md](./ROADMAP.md) — long-term vision and unrefined ideas
- [CHANGELOG.md](./CHANGELOG.md) — what has been completed
- [FEATURES.md](./FEATURES.md) — honest feature inventory
