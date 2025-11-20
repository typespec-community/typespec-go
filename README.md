# TypeSpec Go Emitter

A professional TypeSpec compiler emitter that generates type-safe Go code from TypeSpec models with discriminated union error handling and comprehensive type mappings.

## 🚀 Quick Start

### Installation

```bash
npm install @typespec-community/typespec-go
```

### Basic Usage

```typescript
import { StandaloneGoGenerator } from '@typespec-community/typespec-go';

const generator = new StandaloneGoGenerator();

const userModel = {
  name: "User",
  properties: new Map([
    ["id", { name: "id", type: { kind: "String" }, optional: false }],
    ["email", { name: "email", type: { kind: "String" }, optional: true }],
    ["age", { name: "age", type: { kind: "Uint8" }, optional: true }],
  ]),
};

// Generate Go code with professional error handling
const result = generator.generateModel(userModel);

if (result._tag === "Success") {
  const goCode = result.data.get("User.go");
  console.log("Generated Go code:");
  console.log(goCode);
} else {
  console.error("Generation failed:", result.message);
  console.log("Resolution:", result.resolution);
}
```

## 📋 Features

### ✅ **Professional Architecture**
- **Discriminated Union Error Handling**: Type-safe result handling with impossible states made unrepresentable
- **Zero Any Types**: Complete type safety with strict TypeScript compliance
- **Railway Programming**: Functional programming ready error handling patterns
- **Single Source of Truth**: Unified error system across all components

### ✅ **Comprehensive Type Support**
| TypeSpec Type | Go Type | Optional Handling | Notes |
|---------------|----------|------------------|-------|
| `String` | `string` | `*string` | UTF-8 strings |
| `Int8` | `int8` | `*int8` | 8-bit signed integer |
| `Int16` | `int16` | `*int16` | 16-bit signed integer |
| `Int32` | `int32` | `*int32` | 32-bit signed integer |
| `Int64` | `int64` | `*int64` | 64-bit signed integer |
| `Uint8` | `uint8` | `*uint8` | 8-bit unsigned integer |
| `Uint16` | `uint16` | `*uint16` | 16-bit unsigned integer |
| `Uint32` | `uint32` | `*uint32` | 32-bit unsigned integer |
| `Uint64` | `uint64` | `*uint64` | 64-bit unsigned integer |
| `Float32` | `float32` | `*float32` | 32-bit floating point |
| `Float64` | `float64` | `*float64` | 64-bit floating point |
| `Boolean` | `bool` | `*bool` | Boolean values |
| `Array<T>` | `[]T` | `*[]T` | Slices with element types |

### ✅ **Go Code Generation Quality**
- **Package Declaration**: Automatic `package api` generation
- **JSON Tags**: Complete JSON serialization with `json:"field"` tags
- **Optional Handling**: Proper pointer usage with `omitempty` tags
- **Professional Comments**: Auto-generation documentation
- **Valid Go Syntax**: 100% compilable Go code

### ✅ **Error Handling Excellence**
- **Type-Safe**: Discriminated unions prevent impossible states
- **Specific Error Types**: Detailed error classification and handling
- **Useful Messages**: Clear error descriptions and resolution guidance
- **Domain Intelligence**: Context-aware error messages

## 🎯 API Reference

### StandaloneGoGenerator

```typescript
class StandaloneGoGenerator {
  constructor(options?: GoEmitterOptions) { }
  
  generateModel(model: TypeSpecModel): GoEmitterResult
}
```

### GoEmitterResult

Discriminated union type for type-safe result handling:

```typescript
type GoEmitterResult = GoEmitterSuccess | GoEmitterError;

interface GoEmitterSuccess {
  readonly _tag: "Success";
  readonly data: Map<string, string>;           // Generated Go files
  readonly generatedFiles: readonly FileName[];     // List of generated files
  readonly typeSpecProgram: unknown;              // TypeSpec program reference
}

interface GoEmitterError {
  readonly _tag: string;                     // Error type discriminator
  readonly message: string;                   // Human-readable error message
  readonly resolution: string;                 // Suggested resolution
  readonly errorId: string;                   // Unique error identifier
}
```

### Usage Patterns

#### Railway Programming (Recommended)

```typescript
import { pipe } from 'effect/Function';

const processResult = (result: GoEmitterResult) => {
  if (result._tag === "Success") {
    return result.data; // Extract generated files
  } else {
    throw new Error(`Generation failed: ${result.message}`);
  }
};

const goFiles = pipe(
  generator.generateModel(model),
  processResult
);
```

#### Error Handling by Type

```typescript
const result = generator.generateModel(model);

switch (result._tag) {
  case "Success":
    console.log(`Generated ${result.generatedFiles.length} files`);
    break;
    
  case "ModelValidationError":
    console.error(`Model validation failed: ${result.reason}`);
    break;
    
  case "GoCodeGenerationError":
    console.error(`Code generation failed for ${result.fileName}`);
    break;
    
  default:
    console.error(`Unknown error: ${result.message}`);
}
```

## 🧪 Testing

Run the test suite:

```bash
bun test
```

Run specific test categories:

```bash
# Standalone generator tests
bun test src/test/standalone-generator.test.ts

# Integration tests  
bun test src/test/integration-basic.test.ts

# BDD framework tests
bun test src/test/bdd-framework.test.ts
```

## 🔧 Configuration

### GoEmitterOptions

```typescript
interface GoEmitterOptions {
  // Future extensibility - currently no options required
}
```

### TypeSpec Model Interface

```typescript
interface TypeSpecModel {
  name: string;
  properties: ReadonlyMap<string, TypeSpecPropertyNode>;
}

interface TypeSpecPropertyNode {
  name: string;
  type: TypeSpecTypeNode;
  optional: boolean;
  documentation?: string;
}
```

## 📚 Examples

### Basic User Model

```typescript
const user = {
  name: "User",
  properties: new Map([
    ["id", { name: "id", type: { kind: "String" }, optional: false }],
    ["username", { name: "username", type: { kind: "String" }, optional: false }],
    ["email", { name: "email", type: { kind: "String" }, optional: true }],
    ["age", { name: "age", type: { kind: "Uint8" }, optional: true }],
    ["active", { name: "active", type: { kind: "Boolean" }, optional: false }],
  ]),
};
```

**Generated Go:**
```go
package api

// Auto-generated from TypeSpec model: User
// Generated by Type-safe Professional Go Emitter
type User struct {
  Id string `json:"id"`
  Username string `json:"username"`
  Email *string `json:"email,omitempty"`
  Age *uint8 `json:"age,omitempty"`
  Active bool `json:"active"`
}
```

### Complex Product Model

```typescript
const product = {
  name: "Product", 
  properties: new Map([
    ["id", { name: "id", type: { kind: "String" }, optional: false }],
    ["name", { name: "name", type: { kind: "String" }, optional: false }],
    ["price", { name: "price", type: { kind: "Float64" }, optional: false }],
    ["inStock", { name: "inStock", type: { kind: "Boolean" }, optional: false }],
    ["tags", { 
      name: "tags", 
      type: { kind: "Array", element: { kind: "String" } }, 
      optional: true 
    }],
  ]),
};
```

**Generated Go:**
```go
package api

// Auto-generated from TypeSpec model: Product
// Generated by Type-safe Professional Go Emitter
type Product struct {
  Id string `json:"id"`
  Name string `json:"name"`
  Price float64 `json:"price"`
  InStock bool `json:"inStock"`
  Tags []string `json:"tags,omitempty"`
}
```

## 🛠️ Development

### Build

```bash
bun run build
```

### Type Checking

```bash
bun run build:check
```

### Linting

```bash
bun run lint
```

## 🤝 Contributing

We welcome contributions! Please see our development guidelines and run the full test suite before submitting.

### Development Requirements

- TypeScript 6.0.0+ with strict mode
- Bun test runner
- ESLint with Effect.TS plugin
- Zero any types policy
- Professional discriminated union patterns

## 📄 License

[MIT License](LICENSE)

## 🔗 Related Projects

- [@typespec/compiler](https://www.npmjs.com/package/@typespec/compiler) - TypeSpec compiler
- [@typespec/emitter-framework](https://www.npmjs.com/package/@typespec/emitter-framework) - TypeSpec emitter framework
- [Effect.TS](https://effect.website/) - Functional programming library for TypeScript

---

**Professional TypeSpec to Go code generation with type safety and comprehensive error handling.**
