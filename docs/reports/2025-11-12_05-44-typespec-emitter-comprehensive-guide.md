# Comprehensive Guide to TypeSpec Emitters
**Generated**: 2025-11-12 05:44:44 CET  
**Based on**: TypeSpec Official Documentation vLatest

---

## 📋 EXECUTIVE SUMMARY

This document provides a comprehensive analysis of TypeSpec emitter architecture, implementation patterns, and best practices. It serves as the foundation for implementing a production-ready TypeSpec-to-Go emitter following TypeSpec's experimental Alloy framework patterns.

---

## 🏗️ TYPESPEC EMITTER ARCHITECTURE

### Core Framework Components

TypeSpec emitter architecture consists of four interconnected layers:

#### 1. **Alloy Framework** (Foundation)
- **Purpose**: React-like functional component model for code generation
- **Features**: Symbol management, source text rendering, formatting
- **Scope**: Language-agnostic, reusable across any code generation task
- **Key Pattern**: JSX-like declarative syntax for code structure

#### 2. **Alloy Language Components** (Abstraction Layer)
- **Purpose**: Language-specific component libraries
- **Examples**: TypeScript interfaces, Go structs, JSON schemas
- **Features**: Automatic import management, dependency resolution
- **Pattern**: Declarative components that handle language-specific complexity

#### 3. **Typekits** (Type System API)
- **Purpose**: Convenient TypeSpec type graph introspection
- **Features**: Type relationship analysis, decorator metadata extraction
- **Extensibility**: Libraries can provide custom typekits
- **Core Coverage**: array, builtin, enum, model, operation, scalar, union, etc.

#### 4. **Emitter Framework** (TypeSpec Integration)
- **Purpose**: TypeSpec-aware components and utilities
- **Features**: Direct TypeSpec→Target language conversion
- **Pattern**: Accepts TypeSpec types, emits language-specific structures

---

## 🔧 IMPLEMENTATION PATTERNS & BEST PRACTICES

### 🎯 Emitter Declaration Pattern

**Core Structure**:
```typescript
export const $emitter = createEmitterEmitter("typespec-go", {
  // Core emitter configuration
});

// Main emission entry point
export const $onEmit = async (context: EmitContext) => {
  // Establish output structure using Alloy components
  return <Output program={context.program}>
    <SourceDirectory path="generated">
      <For each={getAllModels(context.program)}>
        {(model) => <GoStructDeclaration model={model} />}
      </For>
    </SourceDirectory>
  </Output>;
};
```

### 📦 Component Architecture Pattern

**Hierarchical Structure**:
```
Output (Alloy Core)
├── SourceDirectory (Directory Management)
│   ├── SourceFile (File Creation)
│   │   ├── PackageDeclaration (Go-specific)
│   │   ├── ImportDeclaration (Import Management)
│   │   ├── TypeDeclaration (Type Generation)
│   │   └── FunctionDeclaration (Operations)
│   └── TestsDirectory (Test Generation)
└── README.md (Documentation)
```

**Component Implementation Pattern**:
```typescript
// Go Struct Component
export function GoStructDeclaration({ model }: { model: Model }) {
  return <go.StructDeclaration name={model.name}>
    <For each={model.properties.values()}>
      {(prop) => <GoStructProperty property={prop} />}
    </For>
  </go.StructDeclaration>;
}

// Property Generation with Metadata Handling
export function GoStructProperty({ property }: { property: ModelProperty }) {
  const metadataInfo = useMetadataInfo();
  const visibility = useRequestVisibility();
  
  if (!metadataInfo.isPayloadProperty(property, visibility)) {
    return null; // Skip metadata properties (@header, @path, etc.)
  }
  
  const goType = mapTypeSpecTypeToGo(property.type);
  const isOptional = metadataInfo.isOptional(property, visibility);
  
  return <go.StructField 
    name={toPascalCase(property.name)}
    type={isOptional ? goPointerType(goType) : goType}
    tags={`json:"${property.name}${isOptional ? ',omitempty' : ''}"`}
  />;
}
```

---

## 🎯 TYPESPEC-TYPE → GO TYPE MAPPING STRATEGY

### Core Type Mapping Rules

```typescript
const TYPE_MAPPING: Record<TypeKind, (type: Type) => GoType> = {
  "String": () => ({ kind: "basic", name: "string" }),
  "Boolean": () => ({ kind: "basic", name: "bool" }),
  "Int32": () => ({ kind: "basic", name: "int32" }),
  "Int64": () => ({ kind: "basic", name: "int64" }),
  "Float32": () => ({ kind: "basic", name: "float32" }),
  "Float64": () => ({ kind: "basic", name: "float64" }),
  "Model": (type) => mapModelToStruct(type),
  "Enum": (type) => mapEnumToGoEnum(type),
  "Union": (type) => mapUnionToGoInterface(type),
  "Array": (type) => mapArrayToGoSlice(type),
};
```

### Advanced Type Handling Patterns

**Optionals with Visibility Context**:
```typescript
function mapPropertyWithVisibility(property: ModelProperty, visibility: Visibility): GoType {
  const metadataInfo = useMetadataInfo();
  const baseType = mapTypeSpecTypeToGo(property.type);
  
  // Handle optionality based on visibility context
  if (metadataInfo.isOptional(property, visibility)) {
    return { kind: "pointer", baseType };
  }
  
  // Handle array types with proper slice syntax
  if (property.type.kind === "Array") {
    return { 
      kind: "slice", 
      elementType: mapTypeSpecTypeToGo((property.type as ArrayType).elementType) 
    };
  }
  
  return baseType;
}
```

**Model Relationship Handling**:
```typescript
function mapModelToStruct(model: Model): GoStruct {
  const baseModels = model.baseModels;
  
  return {
    kind: "struct",
    name: model.name,
    fields: [
      // Handle inheritance via embedded structs
      ...baseModels.map(base => ({
        name: base.name,
        type: { kind: "struct", name: base.name },
        isEmbedded: true,
      })),
      // Add current model properties
      ...model.properties.values().map(prop => mapProperty(prop)),
    ],
  };
}
```

---

## 🚨 DIAGNOSTICS & ERROR HANDLING

### Diagnostic Declaration Pattern

**Comprehensive Error System**:
```typescript
export const $lib = createTypeSpecLibrary({
  name: "@typespec-go/emitter",
  diagnostics: {
    "unsupported-type": {
      severity: "error",
      messages: {
        default: paramMessage`Type '${"typeName"}' (${"kind"}) is not yet supported for Go generation.`,
      },
    },
    "invalid-enum-member": {
      severity: "error", 
      messages: {
        default: paramMessage`Enum member '${"memberName"}' has invalid value '${"value"}'. Only string and numeric values are supported.`,
      },
    },
    "duplicate-go-name": {
      severity: "warning",
      messages: {
        default: paramMessage`TypeSpec type '${"typeSpecName"}' maps to duplicate Go name '${"goName"}'. Consider using @goName decorator.`,
      },
    },
  },
});
```

### Error Reporting Strategies

**Context-Aware Reporting**:
```typescript
function validateTypeForGo(type: Type, context: EmitContext): readonly Diagnostic[] {
  const diagnostics = [];
  
  switch (type.kind) {
    case "Model":
      // Validate model properties
      for (const prop of type.properties.values()) {
        diagnostics.push(...validatePropertyForGo(prop, context));
      }
      break;
      
    case "Union":
      // Validate union types (Go doesn't have direct union support)
      if (!isValidGoUnion(type)) {
        diagnostics.push(reportDiagnostic(context.program, {
          code: "unsupported-type",
          target: type,
          format: { typeName: type.name, kind: "Union" },
        }));
      }
      break;
  }
  
  return diagnostics;
}
```

---

## 🧪 TESTING PATTERNS & INFRASTRUCTURE

### Emitter Testing Architecture

**Test Setup Pattern**:
```typescript
import { createTester } from "@typespec/compiler/testing";
import { $lib } from "../src/emitter.js";

export const GoEmitterTester = createTester({
  libraries: ["@typespec/http", $lib],
});

// Builder pattern for test configurations
export const createGoTest = GoEmitterTester
  .files({
    "helpers.tsp": `
      model Response<T> {
        data: T;
        status: string;
      }
    `,
  })
  .using("TypeSpec.Go");
```

**Comprehensive Test Cases**:
```typescript
describe("Go Emitter", () => {
  describe("Model Generation", () => {
    it("should generate basic struct", async () => {
      const { User } = await GoEmitterTester.compile(t.code`
        model ${t.model("User")} {
          name: string;
          age: int32;
        }
      `);
      
      // Verify emitted Go code
      const goCode = await emitGoCode(User);
      expect(goCode).toContain(`type User struct {`);
      expect(goCode).toContain(`Name string \`json:"name"\``);
      expect(goCode).toContain(`Age int32 \`json:"age"\``);
    });

    it("should handle optional properties", async () => {
      const { User } = await GoEmitterTester.compile(t.code`
        model ${t.model("User")} {
          name: string;
          email?: string;
        }
      `);
      
      const goCode = await emitGoCode(User);
      expect(goCode).toContain(`Email *string \`json:"email,omitempty"\``);
    });

    it("should handle model inheritance", async () => {
      const { Person, Employee } = await GoEmitterTester.compile(t.code`
        model ${t.model("Person")} {
          name: string;
        }
        
        model ${t.model("Employee")} extends Person {
          salary: decimal128;
        }
      `);
      
      const employeeCode = await emitGoCode(Employee);
      expect(employeeCode).toContain(`Person`); // Embedded struct
      expect(employeeCode).toContain(`Salary float64 \`json:"salary"\``);
    });
  });

  describe("Enum Generation", () => {
    it("should generate string enums", async () => {
      const { Status } = await GoEmitterTester.compile(t.code`
        enum ${t.enum("Status")} {
          Active,
          Inactive,
          Pending
        }
      `);
      
      const goCode = await emitGoCode(Status);
      expect(goCode).toContain(`type Status string`);
      expect(goCode).toContain(`const (`);
      expect(goCode).toContain(`StatusActive Status = "Active"`);
      expect(goCode).toContain(`StatusInactive Status = "Inactive"`);
      expect(goCode).toContain(`StatusPending Status = "Pending"`);
    });
  });

  describe("Error Handling", () => {
    it("should report unsupported types", async () => {
      const diagnostics = await GoEmitterTester.diagnose(`
        model Complex {
          data: unknown;
        }
      `);
      
      expectDiagnostics(diagnostics, {
        code: "unsupported-type",
        message: /Type 'Complex' \(Model\) is not yet supported/,
      });
    });
  });
});
```

---

## 🎯 DECORATORS & METADATA PROCESSING

### Custom Go-Specific Decorators

**@goName Decorator**:
```typescript
// Declaration
extern dec goName(target: unknown, name: valueof string);

// Implementation
export function $goName(context: DecoratorContext, target: Type, name: string) {
  context.program.stateMap(StateKeys.goName).set(target, name);
}

// Usage in TypeSpec
@goName("UserProfile")
model User {
  @goName("UserID") id: string;
}
```

**@goTag Decorator**:
```typescript
// Declaration
extern dec goTag(target: ModelProperty, tag: valueof string, value?: valueof string);

// Implementation
export function $goTag(context: DecoratorContext, target: ModelProperty, tag: string, value?: string) {
  const tags = context.program.stateMap(StateKeys.goTags).get(target) || {};
  tags[tag] = value || "";
  context.program.stateMap(StateKeys.goTags).set(target, tags);
}

// Usage
model User {
  @goTag("db", "primary_key") @goTag("validate", "required")
  id: string;
  
  @goTag("json", "email_address") 
  email: string;
}
```

### Metadata Processing Pipeline

**Metadata-Aware Emission**:
```typescript
function GoStructField({ property }: { property: ModelProperty }) {
  const metadataInfo = useMetadataInfo();
  const goName = useGoName(property);
  const goTags = useGoTags(property);
  
  // Skip HTTP metadata properties
  if (!metadataInfo.isPayloadProperty(property, visibility)) {
    return null;
  }
  
  // Generate field name with decorator override
  const fieldName = goName || toPascalCase(property.name);
  
  // Generate tags combining JSON and custom tags
  const jsonTag = `"${property.name}${property.optional ? ',omitempty' : ''}"`;
  const customTags = Object.entries(goTags)
    .map(([tag, value]) => `"${tag}:${value}"`)
    .join(" ");
  
  const allTags = `json:${jsonTag}${customTags ? " " + customTags : ""}`;
  
  return <go.StructField name={fieldName} type={mapType(property)} tags={allTags} />;
}
```

---

## 📊 EMITTER METADATA HANDLING STRATEGY

### Visibility-Aware Emission Pattern

**Request/Response Type Differentiation**:
```typescript
function generateOperationTypes(operation: Operation) {
  const metadataInfo = useMetadataInfo();
  
  // Determine request visibility
  const requestVisibility = resolveRequestVisibility(
    context.program, 
    operation, 
    operation.verb
  );
  
  // Determine response visibility (always Read)
  const responseVisibility = Visibility.Read;
  
  // Generate request type
  const requestType = metadataInfo.getEffectivePayloadType(
    operation.parameters?.body?.type,
    requestVisibility
  );
  
  // Generate response type
  const responseType = metadataInfo.getEffectivePayloadType(
    operation.returnType,
    responseVisibility
  );
  
  return {
    request: generateGoType(requestType, requestVisibility),
    response: generateGoType(responseType, responseVisibility),
  };
}
```

**Type Transformation Optimization**:
```typescript
function emitTypeWithOptimization(type: Type, visibility: Visibility) {
  const metadataInfo = useMetadataInfo();
  
  // Check if type changes with visibility
  if (!metadataInfo.isTransformed(type, visibility)) {
    // No transformation needed - use direct mapping
    return mapTypeSpecTypeToGo(type);
  }
  
  // Type changes - generate transformed version
  const effectiveType = metadataInfo.getEffectivePayloadType(type, visibility);
  return generateTransformedGoType(effectiveType);
}
```

---

## 🚀 IMPLEMENTATION ROADMAP

### Phase 1: Foundation Architecture
- [x] Alloy-based emitter structure
- [x] Basic TypeSpec→Go type mapping
- [x] Error handling and diagnostics system
- [x] Test infrastructure setup
- [ ] **Next**: Complete struct field generation with metadata

### Phase 2: Core Type System
- [ ] Model inheritance via embedded structs
- [ ] Enum generation (string + iota variants)
- [ ] Array/slice type handling
- [ ] Union type interface generation
- [ ] Optional property pointer types

### Phase 3: Advanced Features
- [ ] Operation method generation
- [ ] HTTP metadata processing (@header, @query, @path)
- [ ] Custom Go decorators (@goName, @goTag)
- [ ] Package and import management
- [ ] Integration with Go project structure

### Phase 4: Production Readiness
- [ ] Performance optimization
- [ ] Comprehensive test coverage
- [ ] Documentation and examples
- [ ] Error message improvement
- [ ] IDE integration support

---

## 🎯 CRITICAL SUCCESS FACTORS

### 1. **Type Safety First**
- Zero `any` usage in emitter code
- Comprehensive TypeScript interfaces
- Compile-time validation wherever possible

### 2. **Alloy Framework Adoption**
- Leverage React-like component patterns
- Use built-in import management
- Follow declarative structure patterns

### 3. **Metadata-Aware Design**
- Process HTTP metadata correctly
- Handle visibility transformations
- Support TypeSpec's single logical model concept

### 4. **Comprehensive Testing**
- Test every TypeSpec→Go mapping scenario
- Include negative testing (error cases)
- Performance testing for large specifications

### 5. **Developer Experience**
- Clear, actionable error messages
- Predictable Go code generation
- Comprehensive documentation

---

## 🔥 IMMEDIATE NEXT STEPS

1. **Complete Struct Field Generation**
   - Implement metadata-aware property filtering
   - Add proper Go tag generation
   - Handle pointer types for optionals

2. **Enhance Type Mapping**
   - Add array/slice type support
   - Implement model inheritance
   - Add basic enum generation

3. **Expand Test Coverage**
   - Add comprehensive model test cases
   - Include error scenario testing
   - Add performance benchmarks

4. **Improve Error Handling**
   - Implement diagnostic reporting
   - Add helpful error messages
   - Include fix suggestions where possible

---

## 📚 REFERENCE ARCHITECTURE

This guide establishes the foundation for a TypeSpec-to-Go emitter that:

- **Follows TypeSpec best practices** using the Alloy framework
- **Handles TypeSpec metadata correctly** for REST API generation
- **Generates idiomatic Go code** with proper type safety
- **Provides excellent developer experience** through clear errors and comprehensive testing

The implementation should prioritize **production quality** over feature completeness, ensuring that each generated Go type is correct, type-safe, and follows Go conventions.

---

**Status**: Ready for Implementation  
**Next Action**: Begin Phase 1.4 - Complete struct field generation with metadata handling