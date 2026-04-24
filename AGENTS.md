# TypeSpec Go Emitter - Agent Development Guide

**Last Updated:** December 4, 2025  
**Version:** 1.0 - TypeSpec AssetEmitter Edition

---

## 🎯 PROJECT IDENTITY

### **🚨 ALL IN: ALLOY-JS FRAMEWORK COMMITMENT**

**THIS IS AN ABSOLUTE, NON-NEGOTIABLE FOUNDATION DECISION:**

**🔥 WE ARE 100% ALL IN ON ALLOY-JS (CORE + GO)**
**🔥 ZERO EXCEPTIONS - ZERO COMPROMISES - ZERO ALTERNATIVES**

**What This Means:**

- **🚫 ABSOLUTELY NO STRING-BASED CODE GENERATION** - Forbidden forever
- **✅ 100% COMPONENT-BASED ARCHITECTURE** - JSX components only
- **✅ ALLOY-JS CORE** - For component system, refkey, JSX patterns
- **✅ ALLOY-JS GO** - For all Go code generation (imports, structs, etc.)
- **✅ DECLARATIVE APPROACH** - Describe WHAT to generate, not HOW
- **✅ TYPE-SAFE GENERATION** - Component-level typing and error boundaries

**Why This Is Non-Negotiable:**

- **Modern Architecture:** Alloy is the professional standard for code generation
- **Type Safety:** Components provide compile-time guarantees strings cannot
- **Maintainability:** Component composition is infinitely more maintainable
- **Composability:** Higher-order components enable complex patterns
- **Performance:** Optimized generation pipeline with intelligent caching
- **Future-Proof:** Alloy is actively developed and evolving

### **TypeSpec AssetEmitter for Go Code Generation**

This is a **professional TypeSpec compiler plugin** that generates production-ready Go code from TypeSpec definitions using the official AssetEmitter framework and **100% Alloy-JS component architecture**.

- **📍 TypeSpec Integration:** Native `createAssetEmitter` pattern
- **🏗️ 🚨 ALLOY-JS EXCLUSIVE:** Modern component-based code generation - NO ALTERNATIVES
- **⚡ Performance:** Sub-millisecond generation at enterprise scale
- **🔒 Type Safety:** Zero 'any' types with comprehensive coverage
- **📦 Package Generation:** TypeSpec namespaces → Go packages
- **🚫 ZERO STRING MANIPULATION:** All generation through components

---

## 🚀 ESSENTIAL COMMANDS

### **Primary Development Workflow** (Use Justfile Commands)

```bash
# 🔥 BUILD ALLOY-JS COMPONENTS (required before testing)
just build         # or: bunx alloy build

# 🔥 RUN TEST SUITE (verifies Alloy components work)
just test          # or: bunx vitest --run --testTimeout 30000

# 🔥 LINT CODE (ESLint with strict any-type enforcement)
just lint          # or: bun run lint

# 🔥 TYPE CHECKING (validates TypeScript + JSX compilation)
just check         # or: bunx tsc --noEmit --strict

# Full development workflow (build + test + lint)
just dev

# Quality assurance - comprehensive check
just qa

# Check project status (build + test validation)
just status
```

### **🚨 ALLOY-JS SPECIFIC BUILD PROCESS**

```bash
# 🔥 PRIMARY BUILD - ALLOY-JS COMPONENTS
bunx alloy build                    # Compiles JSX components to JavaScript
# Internally: Processes .tsx files, resolves refkeys, builds component tree

# 🔥 DEVELOPMENT BUILD WITH WATCH
bunx alloy build --watch            # Watch mode for component development
# Auto-recompiles when .tsx files change

# 🔥 TEST BUILD - VERIFIES COMPONENTS WORK
bunx vitest run                     # Runs component integration tests
# Uses @alloy-js/rollup-plugin for JSX compilation

# 🔥 TYPE CHECKING - VALIDATES COMPONENT TYPES
bunx tsc --noEmit --strict         # TypeScript compilation check
# Validates component props, refkey usage, JSX syntax
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

### **🚨 ALLOY-JS CORE FRAMEWORK PATTERNS**

#### **Alloy Core Fundamentals**

```typescript
// ALWAYS import from @alloy-js/core
import { refkey, For, createRefkey } from "@alloy-js/core";

// ALWAYS use refkey for component references
const modelRefkey = refkey(model); // For TypeSpec objects
const customRefkey = createRefkey("custom-name"); // For custom references

// ALWAYS use For loops for iteration
<For each={items} to={(item) => <Component item={item} />} />
```

#### **Alloy Go Components - THE ONLY WAY TO GENERATE GO CODE**

```typescript
// ALWAYS import from @alloy-js/go with destructuring
import * as go from "@alloy-js/go";
const {
  StructTypeDeclaration,
  StructMember,
  InterfaceDeclaration,
  FunctionDeclaration,
  Package,
  Import
} = go;

// NEVER use string concatenation for Go code
// NEVER use template literals for Go code
// ALWAYS use Alloy Go components

// CORRECT: Using Alloy Go components
<StructTypeDeclaration name={model.name} refkey={modelRefkey}>
  <StructMember name={field.name} type={fieldType} tag={jsonTag} />
</StructTypeDeclaration>

// FORBIDDEN: String-based generation
// const goCode = `type ${model.name} struct { ... }`; // NEVER DO THIS
```

#### **Component Architecture - STRICT PATTERNS**

```typescript
// ALL components must follow this exact structure
export function GoModel({ model, packageName, options }: GoModelProps) {
  const modelRefkey = refkey(model);

  return (
    <StructTypeDeclaration name={model.name} refkey={modelRefkey}>
      {/* Component composition - NO STRINGS */}
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

### **🚨 ALLOY-JS COMPONENT DEVELOPMENT - STRICT GUIDELINES**

#### **Component Creation - MANDATORY PATTERN**

```typescript
/**
 * Component Name - Brief Description
 * ALWAYS follow this exact pattern
 */

// 1. IMPORTS - EXACT ORDER
import type { Model, ModelProperty } from "@typespec/compiler"; // TypeSpec types first
import { refkey, For } from "@alloy-js/core";                 // Alloy Core second
import * as go from "@alloy-js/go";                            // Alloy Go third
const { StructTypeDeclaration, StructMember } = go;            // Destructure immediately

// 2. INTERFACE DEFINITIONS - ALWAYS typed
interface GoModelProps {
  model: Model;
  packageName?: string;
  options?: GenerationOptions;
}

// 3. COMPONENT FUNCTION - ALWAYS exported
export function GoModel({ model, packageName, options }: GoModelProps) {
  // 4. REFKEY CREATION - ALWAYS for main object
  const modelRefkey = refkey(model);

  // 5. JSX RETURN - ALWAYS component composition
  return (
    <StructTypeDeclaration name={model.name} refkey={modelRefkey}>
      {/* 6. ITERATION - ALWAYS use For component */}
      <For each={model.properties} to={(prop) => (
        <StructMember
          name={prop.name}
          type={TypeExpression({ type: prop.type })}
          {/* 7. CONDITIONAL ATTRIBUTES - spread pattern */}
          {...(prop.optional && { pointer: true })}
        />
      )} />
    </StructTypeDeclaration>
  );
}
```

#### **Component Testing - MANDATORY PATTERN**

```typescript
import { describe, test, expect } from "vitest";
import { render } from "@alloy-js/core";
import { GoModel } from "../go/GoModel.js";

describe("GoModel Component", () => {
  test("renders struct declaration correctly", async () => {
    const mockModel = createMockTypeSpecModel();

    const output = render(<GoModel model={mockModel} />);

    // 1. COMPONENT OUTPUT VERIFICATION
    expect(output).toContain("type TestModel struct");

    // 2. REFK VERIFICATION
    expect(output).toContain('refkey="TestModel"');

    // 3. PROPER GO SYNTAX
    expect(output).toMatch(/type \w+ struct \{[^}]+\}/);
  });
});
```

#### **Component Composition - HIGHER-ORDER PATTERNS**

```typescript
// HIGHER-ORDER COMPONENTS FOR COMPLEX PATTERNS
export function GoPackage({ namespace, children }: GoPackageProps) {
  return (
    <Package name={packageName}>
      <Import path="encoding/json" />
      <Import path="time" />
      {children}
    </Package>
  );
}

// COMPLEX COMPONENT COMPOSITION
export function GoModelsFromNamespace({ namespace }: { namespace: Namespace }) {
  return (
    <GoPackage namespace={namespace}>
      <For each={namespace.models} to={(model) => (
        <GoModel model={model} />
      )} />
    </GoPackage>
  );
}
```

### **🚨 ALLOY-JS FIRST DIRECTORY STRUCTURE**

```
src/
├── components/          # 🔥 100% ALLOY-JS COMPONENTS - NO STRINGS ALLOWED
│   ├── go/             # 🚀 ALLOY-JS GO COMPONENTS ONLY
│   │   ├── GoModel.tsx             # Struct generation (Alloy Go)
│   │   ├── GoEnumDeclaration.tsx    # Enum generation (Alloy Go)
│   │   ├── GoUnionDeclaration.tsx    # Union generation (Alloy Go)
│   │   ├── GoPackageDirectory.tsx   # Package organization (Alloy Core)
│   │   ├── GoStructDeclaration.tsx   # Struct declaration (Alloy Go)
│   │   ├── GoInterfaceDeclaration.tsx # Interface generation (Alloy Go)
│   │   ├── GoModFile.tsx            # Go mod generation (Alloy Go)
│   │   ├── GoHandlerMethodComponent.tsx # HTTP handlers (Alloy Go)
│   │   ├── GoRouteRegistrationComponent.tsx # Route reg (Alloy Go)
│   │   ├── GoHandlerStub.tsx        # Handler stubs (Alloy Go)
│   │   └── index.ts                 # Component exports (DISABLED - NO RE-EXPORTS)
│   └── TypeExpression.tsx             # Type mapping component (Alloy Core)
├── domain/             # Business logic - SUPPORTS ALLOY COMPONENTS
│   ├── clean-type-mapper.ts          # Type mapping logic (feeds components)
│   ├── error-entities.ts             # Error handling (component-safe)
│   └── structured-logging.ts          # Logging system (component-friendly)
├── services/           # Service layer - FEEDS ALLOY COMPONENTS
│   └── type-mapping.service.ts       # Type mapping delegation
├── contexts/           # React-like contexts for ALLOY COMPONENTS
│   └── TypeSpecContext.tsx           # TypeSpec compiler context
├── utils/              # Utilities SUPPORTING ALLOY COMPONENTS
│   ├── strings.ts                     # String utilities (NO CODE GEN)
│   ├── typespec-utils.ts              # TypeSpec helpers
│   └── bdd-framework.ts              # Testing framework
└── emitter/            # Main AssetEmitter - ORCHESTRATES ALLOY COMPONENTS
    └── typespec-go-emitter.tsx         # Primary export (Alloy orchestration)
```

### **🚨 FORBIDDEN PATTERNS - ABSOLUTELY NOT ALLOWED**

```
src/
├── forbidden/         # 🚫 NEVER CREATE - STRING-BASED GENERATION
│   ├── string-builders.ts      # 🚫 FORBIDDEN - Template literals
│   ├── code-concatenation.ts   # 🚫 FORBIDDEN - String concatenation
│   └── manual-generation.ts    # 🚫 FORBIDDEN - Manual code building
```

---

## 🧪 🚨 ALLOY-JS TESTING PATTERNS

### **🔥 ALLOY COMPONENT TESTING - MANDATORY APPROACH**

#### **Test Structure for Alloy Components**

- **Location:** `src/test/**/*.test.ts` and `src/test/**/*.test.tsx`
- **Framework:** Vitest with **Alloy-JS rollup plugin** for JSX support
- **Categories:**
  - **Component Tests** (`.tsx` files) - Direct component rendering
  - **Integration Tests** - End-to-end TypeSpec workflows
  - **Type Mapping Tests** - TypeSpec → Go type conversion
  - **Performance Tests** - Sub-millisecond generation validation

### **🚨 COMPONENT TESTING - STRICT PATTERNS**

#### **Basic Component Test Template**

```typescript
import { describe, test, expect } from "vitest";
import { render } from "@alloy-js/core";
import { GoModel } from "../go/GoModel.js";
import { createMockTypeSpecModel } from "./mocks/typespec-mocks.js";

describe("🔥 GoModel Component - ALLOY-JS", () => {
  test("renders struct declaration using Alloy Go components", async () => {
    const mockModel = createMockTypeSpecModel({
      name: "TestUser",
      properties: [
        { name: "id", type: { kind: "String" } },
        { name: "name", type: { kind: "String" }, optional: true }
      ]
    });

    // 🔥 RENDER COMPONENT - ALWAYS use render() from @alloy-js/core
    const output = render(<GoModel model={mockModel} />);

    // 🔥 VERIFY ALLOY OUTPUT
    expect(output).toContain("type TestUser struct");
    expect(output).toContain('ID string `json:"id"`');
    expect(output).toContain('Name *string `json:"name,omitempty"`');
  });
});
```

#### **Component Integration Test Template**

```typescript
describe("🔥 Component Integration - ALLOY-JS", () => {
  test("GoPackageDirectory composes multiple components", async () => {
    const mockNamespace = createMockNamespace({
      name: "TestAPI",
      models: [userModel, productModel]
    });

    const output = render(
      <GoPackageDirectory namespace={mockNamespace} />
    );

    // 🔥 VERIFY PACKAGE COMPOSITION
    expect(output).toContain("package testapi");
    expect(output).toContain("import");
    expect(output).toContain("type User struct");
    expect(output).toContain("type Product struct");
  });
});
```

### **Running Tests - ALLOY-JS FOCUSED**

```bash
# 🔥 ALL TESTS (validates Alloy components)
just test

# 🔥 COMPONENT-ONLY TESTS
bunx vitest run src/test/components-*.test.tsx

# 🔥 SPECIFIC COMPONENT TEST
bunx vitest run src/test/components-basic.test.tsx

# 🔥 INTEGRATION TESTS (TypeSpec + Alloy)
bunx vitest run src/test/integration-*.test.ts

# 🔥 PERFORMANCE TESTS (validates sub-millisecond generation)
bunx vitest run src/test/*performance*.test.ts

# 🔥 TESTS WITH COVERAGE
just test-cov

# 🔥 TYPESPEC INTEGRATION TESTS
bun run test:typespec
```

### **Test Status (Current)**

- **Pass Rate:** 111/125 tests passing (88.8%)
- **🚨 Critical:** 14 component tests failing due to TypeScript compilation errors
- **🚨 Critical:** JSX compilation issues with `verbatimModuleSyntax`
- **🚨 Critical:** Component exports missing from `src/components/go/index.ts`
- **✅ Working:** Basic type mapping, performance tests, E2E integration
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

## 🚫🚨 ABSOLUTELY FORBIDDEN PATTERNS - ZERO EXCEPTIONS

### **🔥 FORBIDDEN: STRING-BASED CODE GENERATION**

```typescript
// 🚫 NEVER DO THIS - STRING GENERATION
const goCode = `type ${model.name} struct {
  ${fields.map((f) => `${f.name} ${f.type} \`json:"${f.name}"\``).join("\n")}
}`;

// 🚫 NEVER DO THIS - TEMPLATE LITERALS
const goStruct = `type User struct {
  ID string \`json:"id"\`
  Name *string \`json:"name,omitempty"\`
}`;

// 🚫 NEVER DO THIS - STRING CONCATENATION
let goFile = "package api\n\n";
goFile += 'import "encoding/json"\n\n';
goFile += generateStruct(model);
```

### **🔥 FORBIDDEN: MANUAL CODE BUILDING**

```typescript
// 🚫 NEVER DO THIS - MANUAL CONSTRUCTION
function buildGoStruct(model) {
  let result = `type ${model.name} struct {\n`;
  for (const prop of model.properties) {
    result += `  ${prop.name} ${mapType(prop.type)}\n`;
  }
  result += "}";
  return result;
}

// 🚫 NEVER DO THIS - STRING ARRAYS
const goLines = [];
goLines.push("type User struct {");
goLines.push("  ID string;");
goLines.push("}");
return goLines.join("\n");
```

### **🔥 FORBIDDEN: NON-ALLOY APPROACHES**

```typescript
// 🚫 NEVER DO THIS - MANUAL JSX
const jsxCode = <div>
  <StructType name={model.name}>
    {model.properties.map(prop =>
      <StructMember name={prop.name} type={prop.type} />
    )}
  </StructType>
</div>;

// 🚫 NEVER DO THIS - CUSTOM RENDERING
function renderGoCode(ast) {
  // Custom AST traversal logic
  // Manual string building
  // Non-Alloy rendering
}
```

### **🔥 FORBIDDEN: DIRECT MANIPULATION**

```typescript
// 🚫 NEVER DO THIS - DIRECT MANIPULATION
const refkeyRegistry = {};
refkeyRegistry[model.name] = model; // Manual tracking

// 🚫 NEVER DO THIS - MANUAL CACHING
const componentCache = new Map();
if (!componentCache.has(model.id)) {
  componentCache.set(model.id, renderComponent(model));
}

// 🚫 NEVER DO THIS - MANUAL DEPENDENCY TRACKING
const dependencies = [];
for (const prop of model.properties) {
  if (isUserDefined(prop.type)) {
    dependencies.push(prop.type);
  }
}
```

---

### **✅✅ ABSOLUTELY REQUIRED PATTERNS - NO EXCEPTIONS**

### **🔥 REQUIRED: ALLOY-JS COMPONENTS ONLY**

```typescript
// ✅ ALWAYS DO THIS - ALLOY COMPONENTS
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
          {...(prop.optional && { pointer: true })}
        />
      )} />
    </StructTypeDeclaration>
  );
}
```

### **🔥 REQUIRED: ALLOY CORE UTILITIES**

```typescript
// ✅ ALWAYS DO THIS - ALLOY CORE
import { refkey, For, createRefkey } from "@alloy-js/core";

// ✅ ALWAYS USE REFK FOR TYPE MANAGEMENT
const modelRefkey = refkey(model);
const customRefkey = createRefkey("custom-name");

// ✅ ALWAYS USE FOR COMPONENT
<For each={items} to={(item) => <Component item={item} />} />
```

### **🔥 REQUIRED: COMPONENT COMPOSITION**

```typescript
// ✅ ALWAYS DO THIS - COMPOSITION
export function GoPackage({ namespace, children }: GoPackageProps) {
  return (
    <Package name={getPackageName(namespace)}>
      <Import path="encoding/json" />
      <Import path="time" />
      {children}
    </Package>
  );
}

// ✅ ALWAYS DO THIS - HIGHER-ORDER COMPONENTS
export function GoNamespacePackage({ namespace }: { namespace: Namespace }) {
  return (
    <GoPackage namespace={namespace}>
      <For each={namespace.models} to={(model) => (
        <GoModel model={model} />
      )} />
    </GoPackage>
  );
}
```

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

## 🎯 🚨 ALLOY-JS DEVELOPMENT PRIORITIES

### **🔥 IMMEDIATE FOCUS (ALLOY CRITICAL PATH)**

1. **🚨 ALLOY COMPONENT CRISIS:** Fix 38 TypeScript compilation errors in Alloy components
2. **🚨 COMPONENT EXPORT SYSTEM:** Complete component exports in `src/components/go/index.ts`
3. **🚨 ALLOY JSX COMPILATION:** Resolve `verbatimModuleSyntax` conflicts with JSX
4. **🚨 REFK SYSTEM INTEGRATION:** Fix component refkey references across all files

### **🔥 HIGH IMPACT (ALLOY EXCELLENCE)**

5. **🚨 ALLOY TYPE MAPPING:** Complete union and enum generation using Alloy components
6. **🚨 ALLOY INTEGRATION:** Achieve 100% component test success rate
7. **🚨 ASSETEMITTER COMPLETION:** Full `createAssetEmitter` with Alloy components
8. **🚨 ALLOY PERFORMANCE:** Optimize component rendering pipeline

### **🔥 MEDIUM IMPACT (ALLOY COMPLETION)**

9. **🚨 ADVANCED ALLOY COMPONENTS:** Complete HTTP handlers and route registration
10. **🚨 ALLOY ERROR HANDLING:** Unified error system with component boundaries
11. **🚨 ALLOY TEMPLATES:** Go generics from TypeSpec templates
12. **🚨 ALLOY DOCUMENTATION:** Component-level documentation generation

### **Quality Gates - ALLOY REQUIREMENTS**

- ✅ **TypeScript Strict:** Zero compilation errors (Alloy components only)
- ✅ **ESLint:** Clean codebase with zero any types
- ✅ **Alloy Components:** 100% component-based, zero string generation
- ✅ **Performance:** Sub-millisecond generation maintained
- ✅ **Tests:** 100% success rate (all component tests passing)

---

## 📚 🚨 ALLOY-JS KEY REFERENCE FILES

### **🔥 Core ALLOY-JS Implementation**

- `src/emitter/typespec-go-emitter.tsx` - **Main AssetEmitter (orchestrates all Alloy components)**
- `src/components/go/GoModel.tsx` - **Model generation (Alloy Go pattern)**
- `src/components/go/GoStructDeclaration.tsx` - **Struct generation (Alloy Go pattern)**
- `src/components/TypeExpression.tsx` - **Type mapping (Alloy Core pattern)**
- `src/services/type-mapping.service.ts` - **Type mapping delegation (feeds Alloy components)**

### **🔥 ALLOY Component Examples**

- `src/components/go/GoEnumDeclaration.tsx` - **Enum generation (Alloy Go)**
- `src/components/go/GoUnionDeclaration.tsx` - **Union generation (Alloy Go)**
- `src/components/go/GoPackageDirectory.tsx` - **Package organization (Alloy Core)**
- `src/components/go/GoInterfaceDeclaration.tsx` - **Interface generation (Alloy Go)**
- `src/components/go/GoRouteRegistrationComponent.tsx` - **HTTP routing (Alloy Go)**

### **🔥 ALLOY Testing Examples**

- `src/test/components-basic.test.tsx` - **Component testing pattern**
- `src/test/integration-working-e2e.test.ts` - **E2E Alloy component integration**
- `src/test/typespec-integration-basic.test.ts` - **TypeSpec + Alloy integration**
- `src/components/go/index.ts` - **Component exports (currently disabled)**

### **Type Integration**

- `src/domain/clean-type-mapper.ts` - Type mapping logic
- `src/types/emitter.types.ts` - Type definitions
- `src/contexts/TypeSpecContext.tsx` - TypeSpec compiler context

### **Testing Examples**

- `src/test/integration-working-e2e.test.ts` - E2E workflow
- `src/test/components-basic.test.tsx` - Component testing pattern
- `src/test/typespec-integration-basic.test.ts` - TypeSpec integration

---

## 🚫🚨 PROHIBITED PATTERNS - ALLOY-JS ENFORCEMENT

### **🔥 NEVER DO THESE - ABSOLUTE ZERO TOLERANCE**

- **🚫 NO STRING-BASED CODE GENERATION** - Forbidden under all circumstances
- **🚫 NO CLI Development** - Focus exclusively on AssetEmitter with Alloy components
- **🚫 NO MANUAL CODE BUILDING** - Use only Alloy-JS components
- **🚫 NO npm Commands** - Always use `bun` package manager
- **🚫 NO Any Types** - Zero tolerance for `(type as any)` casts
- **🚫 NO Manual Git Operations** - Use `git town` for branch management
- **🚫 NO TEMPLATE LITERALS FOR GO CODE** - Use Alloy Go components only
- **🚫 NO JSX OUTSIDE COMPONENTS** - All JSX must be in component functions

### **🔥 ALWAYS DO THESE - ALLOY-JS REQUIREMENTS**

- **✅ BUILD BEFORE TEST** - `just build` required before `just test`
- **✅ TYPE-ONLY IMPORTS** - Required with `verbatimModuleSyntax: true`
- **✅ COMPONENT REFK ONLY** - Always use `refkey()` for component IDs
- **✅ ALLOY COMPONENTS ONLY** - Generate Go code exclusively with Alloy Go
- **✅ ERROR BOUNDARIES** - Proper error handling in all components
- **✅ COMPOSITION PATTERNS** - Use higher-order components for complexity
- **✅ REFK SYSTEM** - Use `refkey()` for all TypeSpec object references
- **✅ FOR COMPONENT** - Use `<For each={} to={}>` for all iteration

### **🔥 ALLOY-JS VERIFICATION CHECKLIST**

Before committing ANY changes, verify:

- [ ] **No string-based code generation** anywhere in components
- [ ] **All Go code uses Alloy Go components** only
- [ ] **All components use refkey()** for TypeSpec objects
- [ ] **All iteration uses <For> component** not Array.map()
- [ ] **All imports follow order:** TypeSpec types → Alloy Core → Alloy Go
- [ ] **All components are exported functions** with typed props
- [ ] **No template literals for code generation** anywhere
- [ ] **TypeScript compilation succeeds** with zero errors

---

## 🔥 ALLOY-JS ARCHITECTURE SUMMARY

### **🚨 THIS IS OUR FOUNDATION - NO DEBATE - NO EXCEPTIONS**

1. **ALLOY-JS CORE** - Component system, refkey, JSX, For loops
2. **ALLOY-JS GO** - All Go code generation (imports, structs, interfaces)
3. **ZERO STRINGS** - Absolutely no string-based code generation
4. **COMPONENT COMPOSITION** - Higher-order components for complexity
5. **TYPE SPEC INTEGRATION** - refkey system for TypeSpec object tracking
6. **DECLARATIVE APPROACH** - Describe WHAT to generate, not HOW to generate

### **🚨 SUCCESS METRICS**

- **100% Component-Based:** All Go code generated through Alloy components
- **Zero String Generation:** No template literals or string concatenation for code
- **Type Safety:** Zero TypeScript compilation errors
- **Test Success:** 100% test pass rate with component integration
- **Performance:** Sub-millisecond generation maintained

---

**🚨 CRITICAL REMINDER: This guide documents the **ABSOLUTE ALLOY-JS FOUNDATION** of the TypeSpec Go Emitter project. Any deviation from these patterns is considered a critical architectural violation. Follow these patterns for consistent, professional development.**
