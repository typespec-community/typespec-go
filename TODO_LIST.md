# TODO List

> Short-term, actionable, bounded work, verified against the code on **2026-11-14** (HEAD after the 2026-11-14 CI/packaging sweep).
> Long-term vision lives in [ROADMAP.md](./ROADMAP.md); shipped work lives in [CHANGELOG.md](./CHANGELOG.md).

## Status legend

| Status           | Meaning                                                 |
| ---------------- | ------------------------------------------------------- |
| 🔴 `TODO`        | Not started. Needs doing.                               |
| 🟡 `IN_PROGRESS` | Actively being worked on.                               |
| 🔵 `BLOCKED`     | Cannot proceed; external dependency or decision needed. |

## High Impact

| Task                                                                | Status    | Impact | Effort | Evidence                                                                                                                                                    |
| ------------------------------------------------------------------- | --------- | ------ | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Filter built-in TypeSpec-namespace models in the emitter            | 🔴 `TODO` | High   | 1h     | `collectTypesByNamespace` in `src/emitter/typespec-go-emitter.tsx` has no `TypeSpec`-namespace filter (verified 2026-11-13; routed from 2026-01-02 report)   |
| Verify CLI end-to-end generation (`tsp compile` with built emitter) | 🔴 `TODO` | High   | 2h     | Emitter API-level works (integration tests pass); `dist/main.js` now loads under Node ESM (2026-11-14) — full `tsp compile` path still unverified            |

## Medium Impact

| Task                                                                  | Status    | Impact | Effort | Evidence                                                                                                                     |
| --------------------------------------------------------------------- | --------- | ------ | ------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Deduplicate type mapping into `CleanTypeMapper`                       | 🔴 `TODO` | Med    | 1h     | `mapTypeSpecToGoType` duplication still at `src/components/go/GoStructDeclaration.tsx:130` (verified 2026-11-13)              |
| HTTP decorator extraction coverage (`@typespec/http` in test harness) | 🔴 `TODO` | Med    | 2h     | `test/typespec/sample-service.tsp` exists; `@typespec/http` library loading + `@route`/`@get` e2e unverified                   |
| Add test coverage reporting with a threshold                          | 🔴 `TODO` | Med    | 30min  | No coverage config in `vitest` setup; `just test-cov` referenced in `justfile:71` but never wired                              |
| Fix `go.mod` placeholder module path                                  | 🔴 `TODO` | Med    | 5min   | `go.mod:1` = `module <module-path>` — breaks any `go run`/tooling executed inside the repo                                     |

## Done (2026-11-14 sweep)

- ✅ CI build fixed: `typescript` pinned to `6.0.2` (TS 7 removes `ts.sys`; eslint caps `<6.1.0`) — see CHANGELOG 2026-11-14.
- ✅ ESM packaging: `.js` import suffixes + `rootDir: "./src"` → `dist/main.js` matches `package.json`, loads under Node ESM.
- ✅ All 13 `no-explicit-any` lint errors + 1 unused-var warning cleared (typed mock factories).
- ✅ All 28 strict-mode type errors cleared (`tsc --noEmit --strict` = 0 errors).
- ✅ Dead files removed: `GoHandlerStub.tsx.disabled`, `test-minimal/test-components/test-components-directly`, tracked `temp-e2e-test/` artifact.
- ✅ `EnvironmentTeardownError` flake root-caused and fixed (unawaited dynamic import); 5× stable runs.

---

## Verified baseline (2026-11-14)

| Check                                                  | Result                                                 |
| ------------------------------------------------------ | ------------------------------------------------------ |
| `npm test` (vitest)                                    | ✅ 165/165 tests, 36 files, 5× consecutive stable runs  |
| `alloy build` (local)                                  | ✅ passes, no warnings                                  |
| Built emitter loads under Node ESM                     | ✅ `node -e "import('./dist/main.js')"`                 |
| CI (GitHub Actions)                                    | 🟡 pending green run after push                         |
| `npm run lint`                                         | ✅ 0 errors, 0 warnings (`--max-warnings 0`)            |
| `tsc --noEmit --strict`                                | ✅ 0 errors                                             |
| `any` types in src/components, src/domain, src/emitter | ✅ zero                                                 |
| Real TypeSpec integration tests                        | ✅ `src/test/integration-typespec-compiler-working.test.ts` + 4 more |

## Quick Links

- [ROADMAP.md](./ROADMAP.md) — long-term vision and unrefined ideas
- [CHANGELOG.md](./CHANGELOG.md) — what has been completed
- [FEATURES.md](./FEATURES.md) — honest feature inventory
