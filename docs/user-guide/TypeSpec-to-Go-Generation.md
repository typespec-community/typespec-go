# TypeSpec to Go Code Generation Guide

## Overview

The TypeSpec-Go emitter is a professional-grade code generator that converts TypeSpec models into idiomatic Go structs with advanced features like domain intelligence, composition, and template support.

## Quick Start

### Installation

```bash
# Install globally
bun install -g @typespec-community/typespec-go

# Or install locally
bun add @typespec-community/typespec-go
```

### Basic Usage

```bash
# Generate Go code from TypeSpec file
typespec-go generate model.tsp --package api --output ./generated

# Show version information
typespec-go version

# Run performance benchmarks
typespec-go benchmark --iterations 1000
```

## TypeSpec to Go Type Mapping

### Supported TypeSpec Types

| TypeSpec | Go Type | Notes |
|----------|----------|--------|
| `string` | `string` | - |
| `int8` | `int8` | - |
| `int16` | `int16` | - |
| `int32` | `int32` | - |
| `int64` | `int64` | - |
| `uint8` | `uint8` | - |
| `uint16` | `uint16` | - |
| `uint32` | `uint32` | - |
| `uint64` | `uint64` | - |
| `float32` | `float32` | - |
| `float64` | `float64` | - |
| `bool` | `bool` | - |
| `string[]` | `[]string` | Arrays |
| `Model` | `ModelName` | Struct reference |

### Optional Fields

TypeSpec optional fields (`fieldName?: string`) become Go pointers:

```typescript
// TypeSpec
model User {
  name: string;
  email?: string;  // Optional
  age?: uint8;     // Optional
}

// Generated Go
type User struct {
  Name  string  `json:"name"`
  Email *string `json:"email,omitempty"`
  Age   *uint8  `json:"age,omitempty"`
}
```

## Advanced Features

### Domain Intelligence

The emitter automatically detects and optimizes unsigned integer types:

```typescript
// TypeSpec
model User {
  id: int32;      // → uint32 (id field)
  userID: int64;   // → uint64 (id field)
  count: int16;     // → uint16 (count field)
  age: int8;        // → uint8 (age field)
}

// Generated Go
type User struct {
  ID    uint32 `json:"id"`
  UserID uint64 `json:"userId"`
  Count  uint16 `json:"count"`
  Age    uint8  `json:"age"`
}
```

### Model Composition

#### Extends Keyword

TypeSpec `extends` creates Go struct embedding:

```typescript
// TypeSpec
model BaseEntity {
  id: string;
  createdAt: string;
}

model User extends BaseEntity {
  username: string;
  email?: string;
}

// Generated Go
type User struct {
  BaseEntity  // Embedded struct
  Username  string  `json:"username"`
  Email     *string `json:"email,omitempty"`
}
```

#### Spread Operator

Merge properties from multiple models:

```typescript
// TypeSpec
model Profile {
  bio: string;
  avatar: string;
}

model User {
  id: string;
  username: string;
  ...Profile;  // Spread operator
}

// Generated Go
type User struct {
  ID       string `json:"id"`
  Username string `json:"username"`
  Bio      string `json:"bio"`
  Avatar   string `json:"avatar"`
}
```

### Template Support

Create reusable templates with generic type parameters:

```typescript
// TypeSpec
template PaginatedResponse<T> {
  data: T;
  pagination: PaginationInfo;
  total: uint32;
}

// Template instantiation
model UserList = PaginatedResponse<User>;

// Generated Go
type UserList struct {
  Data        User          `json:"data"`
  Pagination PaginationInfo `json:"pagination"`
  Total       uint32         `json:"total"`
}
```

## CLI Options

### Generate Command

```bash
typespec-go generate <input.tsp> [options]
```

**Options:**
- `-o, --output <dir>`: Output directory (default: `./generated`)
- `-p, --package <name>`: Go package name (default: `api`)
- `-v, --verbose`: Enable verbose logging

### Examples

```bash
# Basic generation
typespec-go generate models/user.tsp

# Custom package and output
typespec-go generate models/user.tsp --package myapi --output ./src/api

# Verbose logging
typespec-go generate models/user.tsp --verbose
```

## Performance

The TypeSpec-Go emitter is optimized for performance:

- **Generation Speed**: Sub-5ms per model
- **Memory Usage**: <1MB overhead
- **Domain Intelligence**: 0.0001ms per field detection
- **Throughput**: 67,000+ models per second

### Performance Benchmarks

```bash
# Run built-in benchmarks
typespec-go benchmark --iterations 1000

# Expected output:
# ⏱️  Average generation time: 0.0148ms
# 🚀 Throughput: 67,408 models/sec
```

## Error Handling

### Common Errors

1. **Invalid TypeSpec Types**
   ```
   Error: Unsupported TypeSpec type: customType
   Resolution: Use supported TypeSpec types: string, int8-64, uint8-64, float32/64, bool, arrays
   ```

2. **Empty Models**
   ```
   Error: Invalid model: must have at least one property
   Resolution: Add at least one property to the model
   ```

3. **Invalid Model Names**
   ```
   Error: Invalid model: name must be a non-empty string
   Resolution: Provide a valid model name
   ```

### Best Practices

1. **Use supported TypeSpec types** - See type mapping table
2. **Follow naming conventions** - Use PascalCase for model names
3. **Leverage domain intelligence** - Use idiomatic field names (id, count, age)
4. **Use composition wisely** - Prefer extends for inheritance, spread for property merging
5. **Template for reusability** - Define templates for common patterns

## Troubleshooting

### Build Issues

**"go build" fails with "undefined types"**
- Verify all model references are valid
- Check for circular dependencies
- Ensure template parameters are correctly specified

**Missing fields in generated code**
- Verify TypeSpec model definitions
- Check spread operator syntax
- Ensure extends relationships are correct

### Performance Issues

**Slow generation times**
- Check for complex inheritance chains
- Verify template instantiation is correct
- Run performance benchmarks to identify bottlenecks

## Integration

### With Go Projects

1. Generate code to your project directory:
   ```bash
   typespec-go generate models.tsp --output ./internal/models
   ```

2. Add to your Go build:
   ```bash
   go build ./internal/models/...
   ```

3. Import and use:
   ```go
   package main
   
   import (
     "encoding/json"
     "yourproject/internal/models"
   )
   
   func main() {
     user := models.User{
       ID:       "123",
       Username:  "john",
       Email:     StringPtr("john@example.com"),
     }
     
     data, _ := json.Marshal(user)
     fmt.Println(string(data))
   }
   ```

### CI/CD Integration

Add to your build pipeline:

```yaml
# GitHub Actions
- name: Generate Go models
  run: |
    bun install
    typespec-go generate models/*.tsp --package api --output ./generated
    go build ./generated/...
```

## Migration Guide

### From Other Generators

1. **Update TypeSpec models** - Ensure compatibility with supported types
2. **Adjust Go code** - Update imports and usage patterns
3. **Test compilation** - Verify generated code compiles correctly
4. **Run tests** - Ensure existing functionality works

### Breaking Changes

- Field naming: `id` → `ID` (Go convention)
- Optional fields: Now use pointers (`*string`)
- Template syntax: Updated to match TypeSpec standards

---

For more information, visit the [TypeSpec-Go GitHub repository](https://github.com/typespec-community/typespec-go).