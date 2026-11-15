# TypeSpec Go Emitter - Changelog

**Last Updated:** 2026-11-15

---

## [Unreleased]

Post-1.0.0 sprint (Pareto Plan II): generated Go now compiles, the HTTP
product chain is real, decorator modes are live.

- **Compile-level Go conformance:** generated output passes
  `go build ./...` and native `gofmt -l` on RAW output for both examples.
  Struct column alignment, iota const groups, union `UnmarshalX`
  (probe struct + per-variant decode + `fmt.Errorf`), interface methods
  without `func` (alloy bug workaround), package-doc hoisting, trailing
  blank line fixes.
- **HTTP product chain:** interface discovery in the emitter walk,
  parameter-aware route registration (path params via closures +
  `r.PathValue`, query params via `Get`, body decode with conditional
  `encoding/json` import), `<Pkg>API` contract vs `<Pkg>Service`
  struct split, handler stubs with corrected nesting.
- **Decorator modes live:** `@go.nullable` (pointer/zeroValue),
  `@go.enumMode` (iota/string/name), `@go.name` on models/operations,
  struct-tag `Record`→string normalization, `valueof` wrapper unwrap.
- **CI truth:** the docs-gates step was failing every run behind a
  mask; now unmasked, gate-blocking, and version-pinned to match the
  locally deployed gate build.
- **Coverage ratchet +5** and e2e wall-clock timing.
- **Consumer quickstart** (`docs/QUICKSTART.md`) + per-package
  generation summary log.
- **Docs truth refresh:** FEATURES.md rewritten, ROADMAP strikes,
  API-REFERENCE routed as historical, TODO_LIST dated verdicts.
- **Release rehearsal:** `npm pack` tarball smoke test green;
  `v1.0.0-rc.1` annotated tag created locally (intentionally unpushed).
- **Root hygiene:** single lockfile (`bun.lock`; pnpm artifacts and
  mise pnpm usage removed), legacy `prettier` config + devDependency
  dropped (dprint owns formatting), dead violations scanner + counter,
  orphan root `test/` dir and never-run root test file removed.

Gates: 190/190 tests (39 files) · eslint 0/0 · strict 0 · dprint clean ·
e2e green (`go build` + `gofmt -l` raw) · docs-gates 5/5.

## 1.0.0 — 2026-11-14

First stable release. Verified end-to-end: `tsp compile` with the published
package layout generates gofmt-conformant Go for two example projects.

- **Decorators:** the `TypeSpec.Go` namespace ships real decorators
  (`@go.pkg`, `@go.name`, `@go.type`, `@go.structTag`, plus declared
  `@go.nullable`/`@go.enumMode` pending consumption) and `@error` models
  generate `Error() string` methods.
- **Correctness:** built-in TypeSpec library namespaces are never emitted;
  inline unions map to Go primitives; cross-file references between
  models/enums/unions in one package resolve; union variants backed by
  models are not re-declared; scalar aliases (`safeint`, `decimal`, …)
  produce valid Go.
- **Output quality:** tab indentation (gofmt-style), CLI e2e gate parses and
  gofmt-normalizes every generated file from both examples.
- **Tooling:** coverage with thresholds (v8, matching vitest), dprint format
  gate and docs-gates in CI, benchmarks (`vitest bench`), npm `files`
  whitelist (289 kB tarball, was 4.8 MB).
- **Docs:** ARCHITECTURE/DEPLOYMENT/TROUBLESHOOTING/MAPPING-GUIDE guides;
  eleven root-layer legacy reports archived; npm-scripts-first workflow.

Gates at release: 177/177 tests · eslint `--max-warnings 0` ·
`tsc --noEmit --strict` 0 errors · `test:e2e-cli` green · docs-gates 5/5.

## 2026-11-14 — CI green, ESM packaging fixed, type debt cleared

- **CI build fix:** pinned `typescript` to `6.0.2`. WHY: `typescript@7.0.2` (the Go-native
  compiler) removed the classic `ts.*` API surface — `@alloy-js/cli@0.22` crashes with
  `ts.sys` undefined (CI run 43432825741), and `@typescript-eslint@8.x` caps `typescript`
  at `<6.1.0`, so lint breaks too. Re-upgrading to TS 7 stays a deliberate future decision
  blocked on alloy CLI + typescript-eslint shipping compatible releases.
- **ESM packaging fixed:** all relative imports in `src/` now carry `.js` suffixes and
  `tsconfig.json` gained `rootDir: "./src"` + `types: ["node"]`. The build now emits
  `dist/main.js`, matching `package.json` `main`/`exports` (previously they pointed at a
  nonexistent path while output landed in `dist/src/`). The built emitter now loads under
  plain Node ESM (`node -e "import('./dist/main.js')"` passes).
- **Lint debt cleared:** all 13 `no-explicit-any` errors + 1 unused-var warning fixed via
  typed mock factories (`MockFactory.createEnum` / `createUnion` / `createModelWithProps` /
  `createStringLiteral`); `extractGoCode` now narrows the real alloy output unions instead
  of `any`.
- **Strict-mode debt cleared:** all 28 `tsc --noEmit --strict` errors fixed (same factories;
  route-test mocks now typed as real `GoHandlerMethod[]` with required `source`/`optional`).
- **Dead code removed:** `GoHandlerStub.tsx.disabled`, scratch files `test-minimal.tsx`,
  `test-components.tsx`, `test-components-directly.tsx`, tracked
  `src/test/temp-e2e-test/generated-service.go` (e2e test now writes to the OS temp dir).
- **Teardown flake root-caused:** `expect(async () => import(...)).not.toThrow()` never
  awaits — the dynamic import raced vitest environment teardown and intermittently raised
  `EnvironmentTeardownError`. Fixed with a static import; 5 consecutive full-suite runs
  green.
- **Gates at HEAD:** build ✅ · dist loads as ESM ✅ · 165/165 tests (5× stable) ✅ ·
  `eslint --max-warnings 0` ✅ · `tsc --noEmit --strict` 0 errors ✅.

## 2026-11-13 — Documentation health sweep

- Annotated all 28 unarchived status reports in `docs/status/` inline (every open item struck with evidence or routed) and archived them to `docs/status/archived/` with a manifest — closes the docs-gates cadence drift (oldest report was 344 days unarchived).
- Rewrote living docs against verified code state: TODO_LIST (fresh sprint rows), FEATURES (status upsert with evidence), ROADMAP, README, AGENTS.
- New verified baseline recorded in TODO_LIST: 165/165 tests, local build green, CI red (alloy CLI × TypeScript 7.0.2 crash, run 43432825741), 13 lint errors in test-support files, 28 strict-mode type errors.

## 2026-11 (tooling & CI hardening)

- Pinned GitHub Actions to SHAs, added dprint formatter config, reworked lint config, dependency upgrades (`8205ea3`, `db6b4bd`).
- CI currently red on the build step: `bunx alloy build` crashes with `ts.sys` undefined (alloy CLI incompatible with the pinned TypeScript 7.0.2). Tracked as the top TODO_LIST row.

## 2026-04 — production hardening

- Comprehensive type-safety improvements across Alloy-JS components (`97f7f58`).
- HTTP handler e2e refactors: reusable helpers, direct-return error pattern (`52ae4fe`, `defeb38`, `fdef8c1`).
- golangci-lint config for generated-Go quality; TypeSpec/ESLint dependency upgrades (`5fde08f`, `46797fe`).
- Core dependency upgrades (`5b9b3b9`).

## 2026-01 — integration breakthrough

- Working real-TypeSpec integration tests via the `createTester` API (`631185b`, `bae8473`); sample service fixture `test/typespec/sample-service.tsp` (`5dfa1e8`).
- Eliminated all `any` types from production code and added comprehensive CONTRIBUTING.md (`e7e29ed`).
- Fixed the component-rendering blocker (`vitest` `jsx: "preserve"` + `<SourceFile filetype="go">`): 100% test pass rate restored (`87e2eb4`, `702d1bd`).
- Setup guide `docs/SETUP.md` (`151579d`); component reference `COMPONENTS.md` (`bae8473`).

---

## ✅ Completed Features

### Phase 1: Core Completeness

- [x] Basic type mapping (string, boolean, int, float)
- [x] Model generation with JSON tags
- [x] Package structure
- [x] Alloy-JS component architecture
- [x] 100% test pass rate (165 tests)
- [x] Zero TypeScript errors

### Component Coverage

- [x] Type Mapping (18 tests)
- [x] Model Generation (11 tests)
- [x] Enum Generation (6 tests)
- [x] Union Generation (6 tests)
- [x] Integration Tests (4 tests)
- [x] Component Tests (120 tests)

### AssetEmitter Integration

- [x] Basic AssetEmitter integration
- [x] Namespace to package mapping
- [x] File consolidation by namespace

### TypeSpec Features

- [x] String, Boolean, Integer types
- [x] Float types (float32, float64)
- [x] Array types
- [x] Map types
- [x] Enum types (string, integer)
- [x] Union types
- [x] Model types with properties
- [x] Optional properties
- [x] JSON tag generation

### Architecture

- [x] 100% Alloy-JS component-based code generation
- [x] Zero string-based code generation
- [x] Type-safe TypeScript compilation
- [x] AssetEmitter pattern implementation

---

## 📅 Version History

### v1.0.0 (2026-03-25)

- Initial release with core type mapping
- Alloy-JS component architecture
- 165 passing tests
- Zero TypeScript errors

---

## 📚 Quick Links

- [TODO_LIST.md](./TODO_LIST.md) - Current actionable items
- [ROADMAP.md](./ROADMAP.md) - Aspirational items
