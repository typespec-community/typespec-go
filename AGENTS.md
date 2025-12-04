# TypeSpec Go Emitter - Agent Development Guide

**Last Updated:** December 4, 2025  
**Version:** 1.0 - TypeSpec AssetEmitter Edition

---

## 🎯 PROJECT IDENTITY

### **TypeSpec AssetEmitter for Go Code Generation**
This is a **professional TypeSpec compiler plugin** that generates production-ready Go code from TypeSpec definitions using the official AssetEmitter framework.

- **📍 TypeSpec Integration:** Native `createAssetEmitter` pattern
- **🏗️ Modern Architecture:** Alloy-JS component-based code generation  
- **⚡ Performance:** Sub-millisecond generation at enterprise scale
- **🔒 Type Safety:** Zero 'any' types with comprehensive coverage
- **📦 Package Generation:** TypeSpec namespaces → Go packages

---

## 🚀 ESSENTIAL COMMANDS

### **Primary Development Workflow** (Use Justfile Commands)
```bash
# Build the project (required before testing)
just build         # or: bunx alloy build

# Run test suite with comprehensive coverage
just test          # or: bunx vitest --run --testTimeout 30000

# Lint code (ESLint with strict any-type enforcement)
just lint          # or: bun run lint

# Type checking without emitting
just check         # or: bunx tsc --noEmit --strict

# Full development workflow (build + test + lint)
just dev

# Quality assurance - comprehensive check
just qa

# Check project status (build + test validation)
just status
```

### **Package Management**
```bash
# Install dependencies (ALWAYS use bun, never npm)
bun install

# Add new dependency
bun add <package-name>
```

### **TypeSpec Commands**
```bash
# Generate Go code from TypeSpec definitions
tsp compile .

# Validate TypeSpec configuration
tsp validate
```

---

## 🏗️ ARCHITECTURE PATTERNS

### **Core AssetEmitter Pattern**
```typescript
// src/emitter/typespec-go-emitter.tsx
export const $onEmit = createAssetEmitter(async (context: EmitContext) => {
  const program = context.program;
  const globalNamespace = program.getGlobalNamespaceType();
  
  // Process namespaces and generate Go packages
  for (const [name, namespace] of globalNamespace.namespaces) {
    await generateGoPackage(namespace, context);
  }
});
```

### **Alloy-JS Component Architecture**
- **Component-Based:** JSX syntax for Go code generation
- **Type Safety:** Refkey system for dependency tracking
- **Composition:** Higher-order components for complex patterns
- **Modern Pattern:** Zero string manipulation for code generation

### **Directory Structure**
```
src/
├── components/          # Alloy-JS components for Go generation
│   ├── go/             # Go-specific components
│   │   ├── GoModel.tsx         # Struct generation
│   │   ├── GoEnumDeclaration.tsx # Enum generation
│   │   ├── GoUnionDeclaration.tsx # Union generation
│   │   └── GoPackageDirectory.tsx # Package organization
│   └── TypeExpression.tsx       # Type mapping component
├── domain/             # Business logic and validation
│   ├── clean-type-mapper.ts     # Type mapping logic
│   ├── error-entities.ts         # Error handling
│   └── structured-logging.ts     # Logging system
├── services/           # Service layer
│   └── type-mapping.service.ts  # Type mapping delegation
├── contexts/           # React-like contexts
│   └── TypeSpecContext.tsx      # TypeSpec compiler context
└── emitter/            # Main AssetEmitter
    └── typespec-go-emitter.tsx   # Primary export
```

---

## 🧪 TESTING PATTERNS

### **Test Structure** 
- **Location:** `src/test/**/*.test.ts` and `src/test/**/*.test.tsx`
- **Framework:** Vitest with JSX support
- **Categories:**
  - Component tests (`.tsx` files)
  - Integration tests
  - Type mapping tests
  - Performance tests

### **Running Tests**
```bash
# All tests
just test

# Specific test file
bunx vitest run src/test/components-basic.test.tsx

# Tests with coverage
just test-cov

# TypeSpec-specific tests
bun run test:typespec
```

### **Test Status (Current)**
- **Pass Rate:** 111/125 tests passing (88.8%)
- **Critical Issues:** TypeScript compilation errors (38+)
- **Focus Areas:** Type safety, component integration, type mapping

---

## 🔧 CODE CONVENTIONS

### **TypeScript Standards**
- **Strict Mode:** `strict: true` with enhanced strictness options
- **Zero Any Types:** `(type as any)` casts prohibited
- **Type-Only Imports:** `verbatimModuleSyntax: true` enforced
- **ESLint Rules:** `@typescript-eslint/no-explicit-any: error`

### **Component Patterns**
```typescript
// Component structure - follow GoModel.tsx pattern
export function GoModel({ model }: { model: Model }) {
  const modelRefkey = refkey(model);

  return (
    <StructTypeDeclaration name={model.name} refkey={modelRefkey}>
      {Array.from(model.properties?.values() || []).map((prop) => (
        <StructMember
          name={prop.name}
          type={TypeExpression({ type: prop.type })}
          tag={{
            json: prop.name,
            ...(prop.optional && { omitempty: "" }),
          }}
        />
      ))}
    </StructTypeDeclaration>
  );
}
```

### **Service Layer Pattern**
```typescript
// Follow type-mapping.service.ts pattern
export class TypeMappingService {
  mapTypeSpecType(program: Program, type: Type): TypeMappingResult {
    // Zero any types implementation
    // Type-safe handling throughout
    // Proper error boundaries
  }
}
```

---

## 🚨 CRITICAL GOTCHAS & NON-OBVIOUS PATTERNS

### **TypeSpec Integration**
- **AssetEmitter Only:** This is NOT a standalone CLI tool
- **Namespace Mapping:** `Vendor.Service.API` → `vendor/service/api/package api`
- **Cyclic Detection:** Automatic pointer generation for recursive types
- **File Consolidation:** All declarations in namespace → consolidated Go files

### **Alloy-JS Specific**
- **JSX Preservation:** `jsx: "preserve"` in tsconfig.json
- **Refkey System:** Always use `refkey()` for component references
- **Go Components:** Import from `@alloy-js/go` with proper destructuring

### **Build System**
- **Alloy Build:** Use `bunx alloy build`, not TypeScript compiler directly
- **Rollup Plugin:** Required for JSX processing in tests
- **Output Directory:** `dist/` for compiled artifacts

### **Type Safety Requirements**
- **Strict Compilation:** All TypeScript errors must be resolved
- **Any-Type Elimination:** Active policy to remove all `(type as any)` casts
- **Type Guards:** Comprehensive type validation instead of type assertions

---

## 📦 TYPEPEC FEATURE COMPLETION STATUS

### **✅ WORKING FEATURES**
- Basic TypeSpec to Go type mapping (String, Boolean, int8-64, uint8-64, float32/64)
- Simple model generation with JSON tags
- Package structure generation
- Basic AssetEmitter integration
- Performance optimization (sub-millisecond generation)

### **🔧 IN PROGRESS**
- Complete AssetEmitter pattern implementation
- Type safety excellence (zero any types)
- Union type generation with sealed interfaces
- Enum generation with string and iota support
- Model composition (Go struct embedding)

### **📋 PLANNED FEATURES**
- Go decorator support (@go.name, @go.type, @go.tag, @go.package)
- HTTP operations and handler generation
- Template models with Go generics
- Discriminated union error handling
- Route registration component

---

## 🛠️ TROUBLESHOOTING COMMON ISSUES

### **TypeScript Compilation Errors**
```bash
# Check current build status
just status

# Fix common issues
just fix          # ESLint auto-fix
just format       # Prettier formatting
```

### **Test Failures**
- **Component Tests:** Ensure JSX compilation with `jsx: "preserve"`
- **Type Mapping:** Verify TypeSpec model interfaces have required properties
- **Integration:** Check `tspconfig.yaml` for correct emitter configuration

### **Build Issues**
- **Alloy Build:** Use `bunx alloy build` not `tsc`
- **Dependencies:** Always use `bun install`, never `npm`
- **Module Resolution:** `verbatimModuleSyntax: true` requires type-only imports

---

## 🎯 DEVELOPMENT PRIORITIES

### **Immediate Focus (Critical Path)**
1. **Type Safety Excellence:** Eliminate all TypeScript compilation errors
2. **Component Integration:** Fix failing component tests (14/125 failing)
3. **AssetEmitter Completion:** Full `createAssetEmitter` implementation
4. **Type Mapping:** Complete union and enum generation

### **Quality Gates**
- ✅ **TypeScript Strict:** Zero compilation errors required
- ✅ **ESLint:** Clean codebase with zero any types
- ✅ **Performance:** Sub-millisecond generation maintained
- ✅ **Tests:** 100% success rate required for production

---

## 📚 KEY REFERENCE FILES

### **Core Implementation**
- `src/emitter/typespec-go-emitter.tsx` - Main AssetEmitter
- `src/components/go/GoModel.tsx` - Model generation pattern
- `src/services/type-mapping.service.ts` - Type mapping delegation

### **Type Integration**
- `src/domain/clean-type-mapper.ts` - Type mapping logic
- `src/types/emitter.types.ts` - Type definitions
- `src/contexts/TypeSpecContext.tsx` - TypeSpec compiler context

### **Testing Examples**
- `src/test/integration-working-e2e.test.ts` - E2E workflow
- `src/test/components-basic.test.tsx` - Component testing pattern
- `src/test/typespec-integration-basic.test.ts` - TypeSpec integration

---

## 🚫 PROHIBITED PATTERNS

### **Never Do These**
- **No CLI Development:** Focus exclusively on AssetEmitter
- **No String Manipulation:** Use component-based generation
- **No npm Commands:** Always use `bun` package manager
- **No Any Types:** Zero tolerance for `(type as any)` casts
- **No Manual Git Operations:** Use `git town` for branch management

### **Always Do These**
- **Build Before Test:** `just build` required before `just test`
- **Type-Only Imports:** Required with `verbatimModuleSyntax: true`
- **Component References:** Always use `refkey()` for component IDs
- **Error Boundaries:** Proper error handling in all components

---

*This guide documents the current state and architectural patterns of the TypeSpec Go Emitter project. Follow these patterns for consistent, professional development.*