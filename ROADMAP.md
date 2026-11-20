# TypeSpec Go Emitter - Roadmap

> Long-term direction and raw ideas, not yet refined into actionable tasks.
> Short-term bounded work lives in [TODO_LIST.md](./TODO_LIST.md).
> **Last updated:** 2026-11-20

---

## 🎯 Vision

Become the standard way to generate production-ready Go code from TypeSpec
API definitions: a TypeSpec compiler plugin that emits idiomatic, formatted,
fully-typed Go packages through a 100% Alloy-JS component architecture.

## Phase 3: Advanced Features (aspirational, no timeline)

### Go Generics from TypeSpec Templates

- Template models with Go generics support, emitted end-to-end (scoping
  exists at the mapper level — `src/domain/go-generics.ts` — but full
  emission is the gap)
- Type parameter mapping
- Generic constraint generation

### Discriminated Unions for Error Handling

- Discriminated union error types
- Pattern-matching-friendly generated APIs
- Error chain generation

### Custom Go Decorators

- ~~`@go.name`, `@go.type`, `@go.tag`, `@go.package`~~ — **shipped 2026-11-14/15** (see
  FEATURES.md Decorators section; includes `@go.nullable` + `@go.enumMode`)
- Remaining: decorator coverage for union targets (needs a tsp declaration first)

### Model Inheritance/Composition (emitter-level)

- ~~Struct embedding generation~~ — **NOT implemented** in the live emitter
  path; the historical evidence exercised the removed ghost scaffold.
  Re-attempt requires real-emitter tests first (FEATURES Known limits).
- Interface composition
- Type hierarchy translation

### HTTP completeness

- ~~`@typespec/http` library loading inside the test harness~~ — **shipped 2026-11-15** (`src/test/http-harness.test.tsx`)
- ~~Handler/route generation from `@route`/`@get`/`@post` specs~~ — **shipped 2026-11-15** (interfaces walk + handlers + route registration, e2e-verified)
- ~~Runtime behavior tests for generated handlers~~ — **shipped 2026-11-20** (e2e smoke gate: mounts `RegisterRoutes`, fires GET/POST/DELETE, asserts 405)
- Full CRUD service generation from a real `.tsp` service via `tsp compile`
- Test-surface expansion: generics edge cases, more cross-file cases

---

## 🔧 Technical Debt (future)

- **Phantom type warnings** in generated code — consider branded types for common scalars (Email, Age, …)
- ~~**Coverage reporting**~~ — **shipped**: `test:coverage` gate; provider
  re-pinned to vitest lockstep and thresholds ratcheted to the measured
  floor 58/46/65/58 on 2026-11-20

---

## 🚀 Exploratory Ideas

### Performance

- ~~Performance benchmark suite~~ — **exists 2026-11-14/15**: `src/test/go-generation.bench.tsx` + e2e compile wall-clock timing
- Parallel package generation
- Incremental generation / build caching

### Developer Experience

- Interactive CLI with project scaffolding
- Hot-reload during TypeSpec development
- Visual type graph visualization
- Component error boundaries (structured, per-component error recovery in the generation pipeline; routed from 2025-12-06..08 reports)
- More idiomatic generated Go code (lint the generator against Go idiom guides)
- ~~Repo community plumbing: CODEOWNERS, issue templates~~ — **shipped 2026-11-14**

### Documentation site & guides (routed from 2026-01 reports)

- ~~`docs/ARCHITECTURE.md`~~ — **shipped 2026-11-14** (plus DEPLOYMENT/TROUBLESHOOTING/MAPPING-GUIDE/QUICKSTART/API-REFERENCE/SETUP)
- Public documentation site (Astro/Starlight pattern)
- Real-world examples and a TypeSpec → Go migration guide

### Community Growth

- Video tutorials and blog posts
- Conference talks
- Contributor base growth (starts with real-world examples + migration guide)

### Enterprise

- Multi-module project support
- Custom code generation templates
- Plugin system for extensions
- Tagged v1.0 release with npm publish flow — v1.0.0 version-bumped and
  release-rehearsal ready; publish + tag push await explicit owner approval
  (re-cut v1.0.0 vs v1.1.0 decision pending, T20)

---

## 🧠 Raw ideas backlog (refreshed 2026-11-20)

Supersedes the 2026-11-14 sweep list: items resolved since are struck or
removed. Brainstorm, not commitments — refined, bounded work belongs in
TODO_LIST.md.

### Open

- Exclude `.config/metadata.yaml` from dprint (re-formats every run, churns the tree)
- Reconcile dependency vs peerDependency versioning for `@typespec/compiler`
- Component error boundaries in the generation pipeline
- TS7 endgame: bump typescript when typescript-eslint ships support (tracked in AGENTS.md gotcha)
- Component-per-type file splitting with test coverage
- Generated-output snapshot tests to catch regressions in emitted Go shape
- Owner-gated (see 2026-11-20 18:15 report §g): return-union shape for
  operation return types (strip-`@error` → `*Widget` vs `Result[T]`, A5);
  publish verdict (T20); concurrency convention doc
- Real-world example projects beyond `examples/` trio
- Public documentation site

### Resolved since 2026-11-14 (evidence in git history)

- ~~Ghost scaffold `StandaloneGoGenerator`~~ — deleted 2026-11-20 (ghost sweep, 2229 lines)
- ~~`dev/` scratch tree~~ — deleted 2026-11-20 (broken imports of the removed scaffold)
- ~~Stray test files (`test-minimal.tsx`, …), `temp-e2e-test/`~~ — removed
- ~~CALL_GRAPH split-brain pair~~ — consolidated
- ~~docs-gates in CI~~ — **enforced** (unmasked, gate-blocking)
- ~~E2E job in CI compiling real `.tsp` files~~ — **shipped** (`test:e2e-cli`, 3 examples + go build + smoke + gofmt/goimports)
- ~~gofmt/goimports conformance of generated Go~~ — **proven** (e2e gates; `GoImportGroup` emits goimports-native blocks)
- ~~README emitter-options example parse risk~~ — rewritten with verified options (`go-module-path`, `visibility-mode`)
- ~~COMPONENTS.md coverage recount~~ — done 2026-11-20 (11 primary + 5 helpers)
- ~~`justfile` retirement~~ — deleted; npm scripts canonical
- ~~rootDir TS5011 warning~~ — tsconfig sets `rootDir: ./src`

---

## 📚 Quick Links

- [TODO_LIST.md](./TODO_LIST.md) — current actionable items
- [CHANGELOG.md](./CHANGELOG.md) — what's been completed
- [FEATURES.md](./FEATURES.md) — honest feature inventory
