# TypeSpec Go Emitter - AI Agent Development Guide

**Last Updated:** November 23, 2025  
**Version:** 2.0 - ALLOY-INSPIRED ARCHITECTURE EDITION  
**Mission:** Professional TypeSpec AssetEmitter with Enterprise-Grade Go Code Generation

---

## 🎯 PROJECT IDENTITY & ARCHITECTURE

### **Core Mission**
TypeSpec Go Emitter is a **TypeSpec AssetEmitter** that transforms TypeSpec definitions into production-ready Go packages. This is **NOT** a standalone CLI tool - it's a compiler plugin that integrates with the TypeSpec ecosystem.

### **Current Architecture: String-Based Code Generation**
```typescript
// Current approach: Imperative string generation
private createGoFile(name: string, fields: string[]): string {
  return `package api

type ${structName} struct {
${fieldDefinitions}
}`;
}
```

### **Future Vision: Alloy-Inspired Declarative Approach**
```typescript
// Future direction: Declarative component-based generation
const template = (
  <Output>
    <go.SourceFile path={`${name}.go`} package="api">
      <go.StructDeclaration name={structName}>
        {fields.map(field => <go.Field {...fieldProps} />)}
      </go.StructDeclaration>
    </go.SourceFile>
  </Output>
);
```

---

## 🏗️ CURRENT IMPLEMENTATION PATTERNS

### **TypeSpec AssetEmitter Pattern**
```typescript
import { createAssetEmitter } from "@typespec/emitter-framework";
import type { EmitContext } from "@typespec/compiler";

export const $onEmit = createAssetEmitter(async (context: EmitContext) => {
  const program = context.program;
  const globalNamespace = program.getGlobalNamespaceType();
  
  // Process namespaces and generate Go packages
  for (const [name, namespace] of globalNamespace.namespaces) {
    await generateGoPackage(namespace, context);
  }
});
```

### **Domain-Driven Architecture**
- **`go-type-mapper.ts`**: Core type mapping logic
- **`standalone-generator.ts`**: High-level generation orchestration
- **`unified-errors.ts`**: Type-safe error handling system
- **`legacy-type-adapter.ts`**: Backward compatibility layer
- **`scalar-mappings.ts`**: TypeSpec scalar to Go type mappings

### **Key Type Mapping Flow**
```
TypeSpec Definition → TypeSpecType → GoTypeMapper → GoTypeString → Go Code
```

---

## 🚨 CRITICAL DEVELOPMENT MANDATES

### **Zero Any Types Policy** 🚨
- **ABSOLUTE PROHIBITION**: No `(type as any)` casts anywhere in the codebase
- **Type Safety First**: Make impossible states unrepresentable through strong typing
- **TypeScript Strict Mode**: All code must pass strict compilation
- **Domain Types**: Use proper TypeScript interfaces for all data structures

### **AssetEmitter Compliance** 📦
- **No CLI Approach**: This is a TypeSpec compiler plugin, not a standalone tool
- **createAssetEmitter Pattern**: Use proper TypeSpec AssetEmitter framework
- **Program Integration**: Work with TypeSpec compiler's program object
- **File Generation**: Use `emitFile` for proper asset generation

### **Performance Standards** ⚡
- **Sub-Millisecond Generation**: Target <1ms for simple models
- **Memory Efficiency**: Zero memory leaks, constant overhead
- **Enterprise Scale**: Handle large TypeSpec definitions efficiently
- **Benchmark Testing**: All generation must meet performance thresholds

---

## 🔧 DEVELOPMENT WORKFLOWS

### **Primary Development Commands**
```bash
# Always check Justfile first for preferred commands
just test                    # Run comprehensive test suite
just build                   # Build TypeScript to JavaScript
just lint                    # ESLint with Effect.TS plugin
just typecheck              # TypeScript strict compilation

# Manual commands (when Justfile unavailable)
bun test                     # Test runner
bun run build               # TypeScript compilation
bun run lint                # Code quality
bun run typecheck           # Type checking
```

### **Testing Strategy**
- **Build-Before-Test**: TypeScript must compile before running tests
- **Current Status**: 95% pass rate (79/83 tests passing)
- **Priority Areas**: Type safety, performance, memory management
- **Regression Prevention**: Full test suite after any changes

### **Git Workflow**
```bash
# ALWAYS use git town for branch management
git town sync               # Sync with remote
git town commit            # Commit with proper message
git town push              # Push changes

# Commit message format (use heredoc)
git commit -m "$(cat <<'EOF'
feat(generators): add template instantiation support

- Implement proper template parameter substitution
- Add template registry for common patterns
- Support generics-like syntax in Go structs

Fixes #123

Assisted-by: AI-Agent via Crush
EOF
)"
```

---

## 🚨 CRITICAL DEVELOPMENT MANDATES - UPDATED

### **ABSOLUTE PROHIBITIONS - ZERO TOLERANCE**

1. **🚨 CLI IMPLEMENTATION**
   - VIOLATION: Any CLI code (commander.js, etc.)
   - CORRECTION: Immediately remove and focus on AssetEmitter
   - AGENT RESPONSIBLE: Software Architect

2. **🚨 ANY TYPES IN CODEBASE**
   - VIOLATION: Any `(type as any)` casts
   - CORRECTION: Replace with proper type guards
   - AGENT RESPONSIBLE: Type Safety Specialist

3. **🚨 AS CASTS IN CODEBASE**
   - VIOLATION: Any `(type as Something)` casts
   - CORRECTION: Use proper type guards and discriminated unions
   - AGENT RESPONSIBLE: Type Safety Specialist

4. **🚨 WRONG TYPESPEC INTEGRATION**
   - VIOLATION: Not using createAssetEmitter pattern
   - CORRECTION: Implement proper TypeSpec AssetEmitter
   - AGENT RESPONSIBLE: Software Architect

5. **🚨 TYPE SAFETY VIOLATIONS**
   - VIOLATION: Using `(something as any)` to bypass TypeScript
   - CORRECTION: Remove all `as any` and `as` casts, implement proper type guards
   - AGENT RESPONSIBLE: Type Safety Specialist

### **IMMEDIATE ACTIONS REQUIRED**

- **AUDIT**: Search entire codebase for `as any` and `as` casts
- **ELIMINATE**: Replace with proper type guards
- **VALIDATE**: Ensure TypeScript strict compilation passes
- **DOCUMENT**: Add examples of proper type guard patterns

---

## 🧠 ARCHITECTURAL INSIGHTS FROM ALLOY

### **Current vs Future Approach**

| Aspect | Current Implementation | Alloy-Inspired Future |
|--------|----------------------|----------------------|
| **Code Generation** | String concatenation | Declarative components |
| **Import Management** | Manual tracking | Automatic refkey system |
| **Type Safety** | TypeScript strict | Component-level typing |
| **Composition** | Function composition | JSX-like composition |
| **Error Handling** | Unified error system | Component error boundaries |

### **Key Concepts from Alloy to Consider**

#### **1. refkey System for Import Management**
```typescript
// Current: Manual import tracking
const imports = new Set<string>();
if (needsTime) imports.add("time");

// Future: Automatic with refkey
const timeRef = refkey();
// Alloy automatically generates import when timeRef is used
```

#### **2. Component-Based Code Structure**
```typescript
// Current: String-based
private generateField(prop: TypeSpecPropertyNode): string {
  return `  ${goName} ${goType} \`${jsonTag}\``;
}

// Future: Component-based
const GoField = ({ name, type, optional }) => (
  <go.VarDeclaration 
    name={name} 
    type={type} 
    refkey={createRefkey(name)}
    exported={true}
  />
);
```

#### **3. Declarative vs Imperative**
```typescript
// Current: Imperative field generation
const fields = propArray.map((prop) => this.generateField(prop, modelContext));

// Future: Declarative structure
const fields = propArray.map(prop => 
  <GoField key={prop.name} {...prop} />
);
```

---

## 📋 PROJECT-SPECIFIC DEVELOPMENT RULES

### **Type Mapping System Development**
```typescript
// ✅ CORRECT: Use GoTypeMapper for all type conversions
const mappedType = GoTypeMapper.mapTypeSpecType(typeSpecType, fieldName);

// ❌ WRONG: Manual type mapping or any types
const goType = (type as any).goType; // NEVER DO THIS
```

### **Error Handling Patterns**
```typescript
// ✅ CORRECT: Use unified error system
return ErrorFactory.createSuccess(
  new Map([[`${model.name}.go`, goCode]]),
  { generatedFiles: [`${model.name}.go`] }
);

// ❌ WRONG: Throwing errors directly
throw new Error("Generation failed"); // NEVER DO THIS
```

### **Template and Generic Support**
```typescript
// ✅ CORRECT: Proper template handling
if (property.type.kind === "Model" && (property.type as any).template) {
  // Handle template types properly
  goType = templateInfo.name;
}

// ❌ WRONG: Ignoring template information
if (property.type.kind === "Model") {
  goType = "interface{}"; // LAZY - NEVER DO THIS
}
```

---

## 🚨 CRITICAL PROHIBITIONS (ZERO TOLERANCE)

### **Absolutely Forbidden**
- **❌ NO `any` Types**: Use proper TypeScript interfaces
- **❌ NO CLI Development**: This is an AssetEmitter only
- **❌ NO String Manipulation for Complex Logic**: Use proper abstractions
- **❌ NO Manual Import Tracking**: Consider component-based approach
- **❌ NO Legacy Type Systems**: Use unified type mapping
- **❌ NO Performance Regressions**: Maintain sub-millisecond generation

### **Code Quality Violations**
- **❌ NO Unused Imports**: Clean imports required
- **❌ NO Console.log**: Use proper logging
- **❌ NO Hardcoded Values**: Extract to constants
- **❌ NO Deep Nesting**: Early returns preferred
- **❌ NO Magic Strings**: Use named constants

---

## 🔄 EVOLUTIONARY PATH: TOWARD ALLOY-LIKE ARCHITECTURE

### **Phase 1: Current State (95% Complete)**
- ✅ String-based code generation working
- ✅ TypeSpec AssetEmitter integration
- ✅ 95% test pass rate
- 🔧 Final type safety elimination

### **Phase 2: Component Migration (Future)**
- **Extract Components**: Create Go-specific components (StructField, GoFile, Package)
- **Implement refkey System**: Automatic import management
- **JSX Integration**: Consider TSX for generation templates
- **Backward Compatibility**: Maintain existing string-based approach in parallel

### **Phase 3: Hybrid Architecture (Future)**
- **Declarative Preferred**: New features use component approach
- **String Legacy**: Maintain string generation for complex cases
- **Performance Validation**: Ensure no regressions
- **Developer Experience**: Improved maintainability and composition

---

## 🛠️ SPECIFIC DEVELOPMENT TASKS

### **Type Safety Excellence (Current Priority)**
1. **Eliminate Remaining `any` Types**: Systematic removal from codebase
2. **Strengthen Type Guards**: Enhanced TypeSpec type detection
3. **Domain Type Refinement**: Better interfaces for all data structures
4. **Generic Pattern Implementation**: Proper template handling

### **Performance Optimization**
1. **Sub-Millisecond Targets**: All generation under 1ms
2. **Memory Leak Prevention**: Zero leaks across all operations
3. **Scalability Testing**: Large TypeSpec definitions
4. **Benchmark Suite**: Comprehensive performance validation

### **Feature Completion**
1. **Enum Generation**: Complete enum support with stringer methods
2. **Union Types**: Sealed interface generation for discriminated unions
3. **Template Instantiation**: Proper generic-like support
4. **Go Decorator Support**: Full @go.* decorator ecosystem

---

## 🧪 TESTING STANDARDS

### **Test Categories**
- **Unit Tests**: Individual function and class testing
- **Integration Tests**: End-to-end TypeSpec to Go generation
- **Performance Tests**: Sub-millisecond generation validation
- **Memory Tests**: Zero leak detection across all operations
- **Type Safety Tests**: Strict TypeScript compilation

### **Test Data Patterns**
```typescript
// ✅ CORRECT: TypeSpec format test data
const testModel = {
  name: "User",
  properties: new Map([
    ["id", { name: "id", type: { kind: "scalar", name: "string" }, optional: false }],
    ["age", { name: "age", type: { kind: "scalar", name: "uint8" }, optional: true }]
  ])
};

// ❌ WRONG: Legacy or ambiguous formats
const badTestModel = {
  name: "User",
  properties: { id: "string", age: "uint8" } // WRONG - not TypeSpec format
};
```

---

## 📁 PROJECT STRUCTURE UNDERSTANDING

### **Domain Modules**
```
src/domain/
├── go-type-mapper.ts          # Core type mapping logic
├── standalone-generator.ts     # High-level generation
├── unified-errors.ts          # Error handling system
├── legacy-type-adapter.ts     # Backward compatibility
├── scalar-mappings.ts         # TypeSpec → Go mappings
└── type-interfaces.ts         # TypeScript interfaces
```

### **Type System**
```
src/types/
├── typespec-domain.ts         # TypeSpec domain types
├── typespec-type-guards.ts    # Type guard functions
└── go-emitter-types.ts       # Go emitter specific types
```

### **Test Organization**
```
src/test/
├── manual-basic-test.ts.test.ts    # Core functionality test
├── performance-tests.ts.test.ts    # Performance validation
└── type-mapping-tests.ts.test.ts   # Type system validation
```

---

## 🎯 SUCCESS METRICS

### **Immediate Goals (Next 24-48 hours)**
1. **100% Test Success**: All 83 tests passing (currently 79/83)
2. **Zero Any Types**: Complete elimination from codebase
3. **Performance Validation**: All thresholds met
4. **Type Safety**: Full TypeScript strict compliance

### **Quality Gates**
- **TypeScript Strict**: Zero compilation errors
- **ESLint Clean**: Minimal to no warnings
- **Test Coverage**: 95%+ pass rate required
- **Performance**: Sub-millisecond generation maintained
- **Memory**: Zero leaks confirmed

---

## 🤖 AI AGENT BEHAVIORAL GUIDELINES

### **Communication Style**
- **Concise Responses**: Under 4 lines unless detail requested
- **Direct Answers**: No preamble or postamble
- **Technical Accuracy**: Use precise terminology
- **File References**: Use `file:line` format for navigation

### **Development Approach**
- **Read First**: Always read files before editing
- **Exact Matches**: Match whitespace and formatting precisely
- **Incremental Changes**: Small, focused commits
- **Test After Changes**: Verify no regressions
- **Document Decisions**: Update comments and documentation

### **Problem-Solving Strategy**
1. **Understand Context**: Read existing code and patterns
2. **Identify Root Cause**: Look beyond surface symptoms
3. **Propose Solution**: Consider architectural implications
4. **Implement Incrementally**: Small, testable changes
5. **Verify Thoroughly**: Test suite must pass

---

## 🚀 FUTURE EVOLUTION INSPIRED BY ALLOY

### **Component-Based Generation (Long-term Vision)**
```typescript
// Potential future direction
const GoModel = ({ name, properties, extends }) => (
  <go.SourceFile path={`${name.toLowerCase()}.go`} package="api">
    <go.StructDeclaration name={name}>
      {extends && <go.EmbeddedType type={extends} />}
      {properties.map(prop => 
        <go.StructField 
          key={prop.name}
          name={prop.name}
          type={mapToGoType(prop.type)}
          optional={prop.optional}
          refkey={createRefkey(prop.name)}
        />
      )}
    </go.StructDeclaration>
  </go.SourceFile>
);
```

### **Automatic Import Management**
```typescript
// Future: refkey system eliminates manual import tracking
const timeTypeRef = refkey();
const uuidTypeRef = refkey();

// Alloy automatically generates:
// import "time"
// import "github.com/google/uuid"
```

### **Enhanced Type Safety**
```typescript
// Future: Component-level type safety
interface GoStructFieldProps {
  name: string;
  type: GoType;
  optional?: boolean;
  jsonTags?: Record<string, string>;
  refkey?: RefKey;
}

const GoStructField: React.FC<GoStructFieldProps> = (props) => {
  // Compile-time validation of Go struct field generation
};
```

---

*Last Updated: November 23, 2025*  
*Architecture Evolution: Inspired by Alloy framework insights*  
*Primary Focus: TypeSpec AssetEmitter excellence with future component-based vision*