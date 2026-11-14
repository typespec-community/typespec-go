# TypeSpec Go Emitter

**Transform TypeSpec API definitions into production-ready Go code with 100% Alloy-JS component-based architecture.**

> **Status (2026-11-13):** 165/165 tests passing · local build green · real TypeSpec integration tests in place · CI workflow exists but currently red (build-tool compatibility — see [TODO_LIST](./TODO_LIST.md)).

---

## What is this?

TypeSpec Go Emitter is a **TypeSpec compiler plugin** that generates Go packages from TypeSpec definitions. It uses the official `createAssetEmitter` pattern and is built entirely on **Alloy-JS components** — a modern, type-safe approach to code generation.

### Key Features

- **100% Component-Based** — All Go code generation uses Alloy-JS components, not string manipulation
- **Native TypeSpec Integration** — Works with `tsp compile` and the TypeSpec compiler pipeline
- **Enterprise Type Safety** — Zero `any` types in production code, strict TypeScript throughout
- **Real TypeSpec Testing** — In-memory compilation tests via the official `createTester` API
- **Component-Driven Output** — Structs, enums, unions, interfaces, handlers, routes, and `go.mod` generated as components

### Quick Example

```typescript
// models.tsp
namespace Demo {
  model User {
    id: string;
    name: string;
    email?: string;
  }
}
```

**Generates:**

```go
// demo/models.go
package demo

type User struct {
    ID    string  `json:"id"`
    Name  string  `json:"name"`
    Email *string `json:"email,omitempty"`
}
```

---

## Installation & Usage

```bash
# Add to your TypeSpec project
npm install @typespec-community/typespec-go
```

```yaml
# tspconfig.yaml
emit:
  - "@typespec-community/typespec-go"
options:
  "@typespec-community/typespec-go":
    emitter-output-dir: "./api"
    base-package: "github.com/yourcompany/api"
```

```bash
# Generate Go code
tsp compile .
```

---

## Architecture

### Alloy-JS Component Architecture

This project uses **Alloy-JS** exclusively for code generation:

```typescript
import { refkey, For } from "@alloy-js/core";
import * as go from "@alloy-js/go";
const { StructTypeDeclaration, StructMember } = go;

export function GoModel({ model }: GoModelProps) {
  const modelRefkey = refkey(model);

  return (
    <StructTypeDeclaration name={model.name} refkey={modelRefkey}>
      <For each={model.properties} to={(prop) => (
        <StructMember
          name={prop.name}
          type={TypeExpression({ type: prop.type })}
        />
      )} />
    </StructTypeDeclaration>
  );
}
```

### Why Alloy-JS?

- **Type Safety** — Component-level typing prevents generation errors
- **Maintainability** — Declarative composition is easier to reason about
- **Performance** — Optimized rendering pipeline with caching
- **Composability** — Higher-order components for complex patterns

---

## Development

### Essential Commands

```bash
# Build Alloy-JS components (required before testing)
just build

# Run test suite
just test

# Lint code
just lint

# Type check
just check

# Full development workflow
just dev
```

### Project Structure

```
src/
├── components/          # Alloy-JS components for Go code generation
│   ├── go/             # Go-specific components (structs, imports, etc.)
│   └── TypeExpression.tsx
├── domain/             # Business logic and type mapping
├── services/           # Service layer
└── emitter/            # Main AssetEmitter implementation
```

---

## Status

Verified 2026-11-13 (HEAD `8205ea3`). Full inventory with evidence:
[FEATURES.md](./FEATURES.md).

### Test Coverage

| Category                      | Status                                       |
| ----------------------------- | -------------------------------------------- |
| Test suite                    | ✅ 165/165 tests, 36 files (`npm test`)      |
| Real TypeSpec integration     | ✅ `createTester` compilation tests in place |
| Enum / union / model coverage | ✅ dedicated suites passing                  |
| HTTP handler & route suites   | ✅ component-level suites passing            |

### Feature Completeness

- ✅ Basic TypeSpec to Go type mapping (string, boolean, int/uint/float, arrays, maps, time)
- ✅ Model generation with JSON tags, optional → pointer
- ✅ Enum, union, and interface generation
- ✅ `go.mod` + package directory generation
- ✅ Handler stubs and route registration (component level)
- 🔧 CLI end-to-end generation via `tsp compile` (verification in progress)
- ⚪ `@go.*` decorators, `@error` models, `@visibility` (planned)

---

## Resources

- [AGENTS.md](AGENTS.md) — Development guidelines and architecture
- [FEATURES.md](FEATURES.md) — Honest feature inventory with evidence
- [TODO_LIST.md](TODO_LIST.md) — Current actionable work
- [CHANGELOG.md](CHANGELOG.md) — What shipped, when
- [COMPONENTS.md](COMPONENTS.md) — Component reference (12 primary + 5 helpers)
- [docs/](docs/) — Setup, API reference, and type mapping guides

---

## Contributing

See [AGENTS.md](AGENTS.md) for development standards and contribution guidelines.

---

## License

MIT License
