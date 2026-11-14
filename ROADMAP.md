# TypeSpec Go Emitter - Roadmap

> Long-term direction and raw ideas, not yet refined into actionable tasks.
> Short-term bounded work lives in [TODO_LIST.md](./TODO_LIST.md).
> **Last updated:** 2026-11-13

---

## 🎯 Vision

Become the standard way to generate production-ready Go code from TypeSpec
API definitions: a TypeSpec compiler plugin that emits idiomatic, formatted,
fully-typed Go packages through a 100% Alloy-JS component architecture.

## Phase 3: Advanced Features (aspirational, no timeline)

### Go Generics from TypeSpec Templates

- Template models with Go generics support (generator-level support exists — see `src/test/model-composition.test.ts`; full emission end-to-end is the gap)
- Type parameter mapping
- Generic constraint generation

### Discriminated Unions for Error Handling

- Discriminated union error types
- Pattern-matching-friendly generated APIs
- Error chain generation

### Custom Go Decorators

- `@go.name`, `@go.type`, `@go.tag`, `@go.package` (see FEATURES.md Advanced Patterns — PLANNED)

### Model Inheritance/Composition (emitter-level)

- Struct embedding generation through the main emitter path (works via `StandaloneGoGenerator` today)
- Interface composition
- Type hierarchy translation

### HTTP completeness

- `@typespec/http` library loading inside the test harness (`@route`, `@get`, `@path`, `@body` end-to-end)
- Full CRUD service generation from a real `.tsp` service via `tsp compile`
- Test-surface expansion: TypeSpec visibility system, template types, cross-file references, HTTP metadata extraction (routed from 2026-01-02 report)

---

## 🔧 Technical Debt (future)

- **Phantom type warnings** in generated code — consider branded types for common scalars (Email, Age, …)
- **Coverage reporting** — no visibility into test coverage today (TODO_LIST, medium impact)

---

## 🚀 Exploratory Ideas

### Performance

- Performance benchmark suite (none exists today; "sub-millisecond" claim in older docs is unverified)
- Parallel package generation
- Incremental generation / build caching

### Developer Experience

- Interactive CLI with project scaffolding
- Hot-reload during TypeSpec development
- Visual type graph visualization
- Component error boundaries (structured, per-component error recovery in the generation pipeline; routed from 2025-12-06..08 reports)
- Error-recovery tests and improved TypeSpec validation error-message clarity (routed from 2025-12 reports)
- More idiomatic generated Go code (lint the generator against Go idiom guides)
- Repo community plumbing: `.github/CODEOWNERS`, `.github/ISSUE_TEMPLATE` (routed from 2026-01-01 report)

### Documentation site & guides (routed from 2026-01 reports)

- `docs/ARCHITECTURE.md` — domain layer, component hierarchy, emitter pipeline
- Deployment + troubleshooting guides beyond `docs/SETUP.md`
- Real-world examples and a TypeSpec → Go migration guide

### Community Growth

- Video tutorials and blog posts
- Conference talks
- Contributor base growth (starts with real-world examples + migration guide)

### Enterprise

- Multi-module project support
- Custom code generation templates
- Plugin system for extensions
- Tagged v1.0 release with npm publish flow (no git tags/releases exist yet; routed from 2026-01-01 report)

---

## 🧠 Raw ideas backlog (2026-11-14 docs sweep session)

Unrefined observations from the 2026-11-14 docs-health sweep — brainstorm, not
commitments. Refined, bounded work belongs in TODO_LIST.md.

### Ghost systems / dead weight

- Consolidate `CALL_GRAPH.md` and `CALL_GRAPH_ACTUAL.md` (split-brain pair at repo root)
- Decide the fate of `StandaloneGoGenerator` (tested via `src/test/model-composition.test.ts` but not wired into the emitter path — ghost system: integrate or fence it)
- Delete or convert `src/test/test-minimal.tsx`, `test-components.tsx`, `test-components-directly.tsx` (not picked up by vitest's `*.test.*` glob, carry strict-mode errors)
- Clean up stray `src/test/temp-e2e-test/` directory
- Audit root-level historical reports (`PROJECT-COMPLETION-REPORT.md`, `PROJECT_SPLIT_EXECUTIVE_REPORT.md`, `EXECUTION_PLAN.md`, `IMPROVEMENT_PLAN.md`, `PARTS.md`, `DEDUPLICATION_STATUS.md`, `INTEGRATION_REALITY_CHECK.md`) — annotate or archive like the docs/status corpus
- Resolve `docs/status.md` vs `docs/status/` naming confusion
- Review `docs/github-issues-plan.md` staleness
- Normalize the pre-canon `docs/status/archived-2025-12-04/` layer under the modern archive gates (check-rows/bare-rows)
- Retire or re-sanction the deprecated `justfile` (global policy: flake/npm scripts own automation)

### Build, CI, tooling

- Set `rootDir` in tsconfig to silence the TS 7 TS5011 warning
- Exclude `.config/metadata.yaml` from dprint (re-formats every run, churns the tree)
- Wire docs-gates into CI so the docs ritual is enforced, not remembered
- Add dprint format check to CI (CI only checks prettier over `src/` today)
- Make CI run an E2E job that compiles a real `.tsp` file through the built emitter
- Pick up the open dependabot branch (`dependabot/npm_and_yarn/minor-and-patch-a08edd544e`)
- Reconcile dependency vs peerDependency versioning for `@typespec/compiler` (`^1.18.0` vs `1.18.0`)
- Document vitest `jsx: "preserve"` as the single JSX-config source of truth (tsconfig vs vitest.config vs alloy plugin)

### Generated-output quality

- Verify and then re-claim gofmt/goimports/gofumpt conformance of generated Go (claim was removed from README as unverified; a conformance test would make it true)
- Verify the README `tspconfig.yaml` emitter options example actually parses (`base-package` etc.)
- Recount COMPONENTS.md coverage claims (12 primary + 5 helpers) against `src/components/go/`
- Add generated-output snapshot tests to catch regressions in emitted Go shape

### Feature surface (long-term)

- `@go.name` / `@go.type` / `@go.tag` / `@go.package` decorator support
- `@error` model handling
- `@visibility` decorator processing
- Go generics emission end-to-end from TypeSpec templates
- Discriminated-union error chains
- Multi-file output splitting (per-type files) with test coverage
- Performance benchmark suite for component generation
- Component error boundaries in the generation pipeline
- TypeSpec validation error-message clarity
- More idiomatic generated Go (idiom lint pass on the generator)
- Repo community plumbing: `.github/CODEOWNERS`, `.github/ISSUE_TEMPLATE`
- `docs/ARCHITECTURE.md`, deployment guide, troubleshooting guide
- TypeSpec → Go migration guide
- Real-world example projects beyond `examples/basic/`
- Test-surface expansion: visibility system, template types, cross-file references, HTTP metadata extraction
- Examples & tutorials; video/blog content; conference talks
- Tagged v1.0 release with npm publish flow

---

## 📚 Quick Links

- [TODO_LIST.md](./TODO_LIST.md) — current actionable items
- [CHANGELOG.md](./CHANGELOG.md) — what's been completed
- [FEATURES.md](./FEATURES.md) — honest feature inventory
