# TypeSpec Go Emitter

**Transform TypeSpec API definitions into production-ready Go code with 100% Alloy-JS component-based architecture.**

---

## What is this?

TypeSpec Go Emitter is a **TypeSpec compiler plugin** that generates Go packages from TypeSpec definitions. It uses the official `createAssetEmitter` pattern and is built entirely on **Alloy-JS components** — a modern, type-safe approach to code generation.

### Key Features

- **100% Component-Based** — All Go code generation uses Alloy-JS components, not string manipulation
- **Native TypeSpec Integration** — Works with `tsp compile` and the TypeSpec compiler pipeline
- **Enterprise Type Safety** — Zero `any` types, strict TypeScript throughout
- **Sub-millisecond Generation** — High-performance code generation at any scale
- **Production-Ready Output** — Go code that passes `gofmt`, `goimports`, and `gofumpt`

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

### Test Coverage

| Category         | Status             |
| ---------------- | ------------------ |
| Type Mapping     | ✅ Working         |
| Model Generation | ✅ Working         |
| Enum Generation  | ✅ Working         |
| Union Generation | ✅ Working         |
| Performance      | ✅ Sub-millisecond |

### Feature Completeness

- ✅ Basic TypeSpec to Go type mapping (string, boolean, int, float, etc.)
- ✅ Model generation with JSON tags
- ✅ Package structure generation
- ✅ AssetEmitter integration
- ✅ Alloy-JS component architecture
- 🔧 Advanced union/enum features
- 🔧 HTTP operations and handlers

---

## Resources

- [AGENTS.md](AGENTS.md) — Development guidelines and architecture
- [docs/](docs/) — Technical documentation and research

---

## Contributing

See [AGENTS.md](AGENTS.md) for development standards and contribution guidelines.

---

## License

MIT License
