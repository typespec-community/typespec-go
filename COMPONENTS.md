# TypeSpec Go Emitter - Components Documentation

**Last Updated:** January 2, 2026
**Version:** 1.0 - Component Reference Edition

---

## 🎯 Component Architecture Overview

The TypeSpec Go Emitter uses **100% Alloy-JS component-based architecture**. All Go code is generated through Alloy components, eliminating string-based code generation.

### Core Principles

- **Zero String Generation:** All code generation uses Alloy-JS components
- **Type Safety:** Component-level typing with comprehensive TypeScript support
- **Composability:** Higher-order components for complex patterns
- **Reference System:** Automatic import management using `refkey()`

---

## 📦 Component Library

### Primary Components (12)

| Component | Purpose | Status |
|-----------|---------|--------|
| `GoModel` | Basic model to struct conversion | ✅ Production Ready |
| `GoStructDeclaration` | Advanced struct with documentation | ✅ Production Ready |
| `GoEnumDeclaration` | String and iota enum generation | ✅ Production Ready |
| `GoUnionDeclaration` | Sealed interface pattern | ✅ Production Ready |
| `GoInterfaceDeclaration` | Service interface generation | ✅ Production Ready |
| `GoModFile` | Go module file generation | ✅ Production Ready |
| `GoPackageDirectory` | Package organization | ✅ Production Ready |
| `GoHandlerStub` | HTTP handler generation | ✅ Production Ready |
| `GoHandlerMethodComponent` | Handler method logic | ✅ Production Ready |
| `GoRouteRegistrationComponent` | Route registration | ✅ Production Ready |

### Core Helper Components (5)

| Component | Purpose | Status |
|-----------|---------|--------|
| `GoBlock` | Code block rendering | ✅ Production Ready |
| `GoIf` | Conditional logic | ✅ Production Ready |
| `GoReturn` | Return statements | ✅ Production Ready |
| `GoStringLiteral` | String literals | ✅ Production Ready |
| `GoSwitch` | Switch statements | ✅ Production Ready |

---

## 🔥 Component Reference

### GoModel

**Purpose:** Generates basic Go struct from TypeSpec model
**File:** `src/components/go/GoModel.tsx`

#### Props

```typescript
interface GoModelProps {
  model: Model; // TypeSpec model to convert
}
```

#### Usage

```typescript
import { GoModel } from "./src/components/go/GoModel.js";
import { render } from "@alloy-js/core";

const mockModel = createMockModel({
  name: "User",
  properties: [
    { name: "id", type: { kind: "String" } },
    { name: "name", type: { kind: "String" }, optional: true }
  ]
});

const output = render(<GoModel model={mockModel} />);
```

#### Generated Go Code

```go
type User struct {
  ID string `json:"id"`
  Name *string `json:"name,omitempty"`
}
```

#### Features

- **JSON Tags:** Automatic `json:"name"` tags
- **Optional Fields:** Pointer types (`*string`) for optional properties
- **Type Mapping:** Uses `TypeExpression` component for nested types

---

### GoStructDeclaration

**Purpose:** Advanced struct generation with documentation and reference system
**File:** `src/components/go/GoStructDeclaration.tsx`

#### Props

```typescript
interface GoStructDeclarationProps {
  model: Model;              // TypeSpec model
  documentation?: string;     // Override @doc decorator
  packageName?: string;       // Package name (default: "api")
  usePointersForOptional?: boolean; // Pointer for optional (default: true)
  program?: Program;         // Access @doc decorators
}
```

#### Usage

```typescript
import { GoStructDeclaration } from "./src/components/go/GoStructDeclaration.js";

const output = render(
  <GoStructDeclaration
    model={mockModel}
    packageName="api"
    usePointersForOptional={true}
    program={typeSpecProgram}
  />
);
```

#### Generated Go Code

```go
// Generated from TypeSpec model User
type User struct {
  ID string `json:"id"`
  Name *string `json:"name,omitempty"`
}
```

#### Features

- **Documentation:** Automatic extraction from `@doc` decorator
- **Reference System:** Uses `refkey()` for automatic import management
- **For Loop:** Uses `<For>` component for property iteration
- **Type Safety:** JSX.Element types for all type expressions

---

### GoEnumDeclaration

**Purpose:** Generates Go const blocks from TypeSpec enums
**File:** `src/components/go/GoEnumDeclaration.tsx`

#### Props

```typescript
interface GoEnumDeclarationProps {
  enum: Enum;              // TypeSpec enum
  packageName?: string;     // Package name (default: "api")
  useIota?: boolean;       // Use iota for integer enums (default: false)
  program?: Program;       // Access @doc decorators
}
```

#### Usage - String Enum

```typescript
import { GoEnumDeclaration } from "./src/components/go/GoEnumDeclaration.js";

const mockEnum = createMockEnum({
  name: "Status",
  members: [
    { name: "Pending", value: "pending" },
    { name: "Active", value: "active" },
    { name: "Completed", value: "completed" }
  ]
});

const output = render(
  <GoEnumDeclaration enum={mockEnum} useIota={false} />
);
```

#### Generated Go Code - String Enum

```go
type Status string

var (
  StatusPending Status = "pending"
  StatusActive Status = "active"
  StatusCompleted Status = "completed"
)

func (e Status) String() string {
  return string(e)
}

func (e Status) IsValid() bool {
  switch e {
  case StatusPending:
    return true
  case StatusActive:
    return true
  case StatusCompleted:
    return true
  default:
    return false
  }
}
```

#### Usage - Iota Enum

```typescript
const mockEnum = createMockEnum({
  name: "Priority",
  members: [
    { name: "Low", value: 0 },
    { name: "Medium", value: 1 },
    { name: "High", value: 2 }
  ]
});

const output = render(
  <GoEnumDeclaration enum={mockEnum} useIota={true} />
);
```

#### Generated Go Code - Iota Enum

```go
type Priority int

var (
  PriorityLow Priority = iota
  PriorityMedium
  PriorityHigh
)

func (e Priority) IsValid() bool {
  switch e {
  case PriorityLow:
    return true
  case PriorityMedium:
    return true
  case PriorityHigh:
    return true
  default:
    return false
  }
}
```

#### Features

- **Auto-Detection:** Determines string vs integer enum automatically
- **String Method:** `String()` for string enums
- **Validation Method:** `IsValid()` for both types
- **Iota Support:** `iota` pattern for integer enums

---

### GoUnionDeclaration

**Purpose:** Generates Go sealed interfaces from TypeSpec unions
**File:** `src/components/go/GoUnionDeclaration.tsx`

#### Props

```typescript
interface GoUnionDeclarationProps {
  union: Union;               // TypeSpec union
  packageName?: string;       // Package name (default: "api")
  discriminator?: string;      // Discriminator field for tagged unions
  program?: Program;         // Access @doc decorators
  templateParameters?: string[];  // Generic type parameters (e.g., ["T"])
  templateConstraints?: Array<{ param: string; constraint: string | Type }>;
}
```

#### Usage - Simple Union

```typescript
import { GoUnionDeclaration } from "./src/components/go/GoUnionDeclaration.js";

const mockUnion = createMockUnion({
  name: "PaymentMethod",
  variants: [
    { name: "Card" },
    { name: "Bank" },
    { name: "Cash" }
  ]
});

const output = render(<GoUnionDeclaration union={mockUnion} />);
```

#### Generated Go Code - Simple Union

```go
// PaymentMethod is a sealed interface representing a union type
type PaymentMethod interface {
  isPaymentMethod()
}

type Card struct {}
func (Card) isPaymentMethod() {}

type Bank struct {}
func (Bank) isPaymentMethod() {}

type Cash struct {}
func (Cash) isPaymentMethod() {}
```

#### Usage - Discriminated Union

```typescript
const mockUnion = createMockUnion({
  name: "Event",
  variants: [
    { name: "Created" },
    { name: "Deleted" },
    { name: "Updated" }
  ]
});

const output = render(
  <GoUnionDeclaration
    union={mockUnion}
    discriminator="type"
  />
);
```

#### Generated Go Code - Discriminated Union

```go
// Event is a sealed interface representing a union type
type Event interface {
  GetType() string
}

type Created struct {
  Type string `json:"type"`
}
func (Created) GetType() string {
  return "created"
}

type Deleted struct {
  Type string `json:"type"`
}
func (Deleted) GetType() string {
  return "deleted"
}

type Updated struct {
  Type string `json:"type"`
}
func (Updated) GetType() string {
  return "updated"
}

func UnmarshalEvent(data []byte) error {
  // Unmarshaler implementation
  // This would need to unmarshal into a temp struct to get the discriminator
  // and then unmarshal into the correct variant
  return nil
}
```

#### Features

- **Sealed Interface:** Go's sum type pattern
- **Discriminator Support:** Tagged unions with discriminator field
- **Unmarshaler:** Stub for JSON unmarshaling
- **Template Parameters:** Support for generic unions (experimental)

---

### GoInterfaceDeclaration

**Purpose:** Generates Go interfaces from TypeSpec operations
**File:** `src/components/go/GoInterfaceDeclaration.tsx`

#### Props

```typescript
interface GoInterfaceDeclarationProps {
  name: string;               // Interface name
  operations: Operation[];     // TypeSpec operations
  packageName?: string;       // Package name (default: "api")
  program?: Program;         // Access @doc decorators
}
```

#### Usage

```typescript
import { GoInterfaceDeclaration } from "./src/components/go/GoInterfaceDeclaration.js";

const mockOperations = createMockOperations([
  { name: "getUser", parameters: { id: "string" }, returnType: "User" },
  { name: "createUser", parameters: { name: "string" }, returnType: "User" }
]);

const output = render(
  <GoInterfaceDeclaration
    name="UserService"
    operations={mockOperations}
    packageName="api"
  />
);
```

#### Generated Go Code

```go
// UserService defines service interface
type UserService interface {
  GetUser(ctx context.Context, id string) (User, error)
  CreateUser(ctx context.Context, name string) (User, error)
}
```

#### Features

- **Context Parameter:** Automatic `context.Context` as first parameter
- **Error Returns:** Automatic `error` return type
- **PascalCase:** Automatic operation name capitalization
- **Documentation:** Extraction from `@doc` decorator

---

### GoModFile

**Purpose:** Generates go.mod file for Go modules
**File:** `src/components/go/GoModFile.tsx`

#### Props

```typescript
interface GoModFileProps {
  modulePath: string;  // Module path (e.g., github.com/yourcompany/api)
  goVersion?: string; // Go version (default: "1.21")
  requires?: Array<{ path: string; version: string }>;
}
```

#### Usage

```typescript
import { GoModFile } from "./src/components/go/GoModFile.js";

const output = render(
  <GoModFile
    modulePath="github.com/example/api"
    goVersion="1.21"
    requires={[
      { path: "github.com/gin-gonic/gin", version: "v1.9.1" }
    ]}
  />
);
```

#### Generated go.mod

```
module github.com/example/api

go 1.21

require (
	github.com/gin-gonic/gin v1.9.1
)
```

#### Features

- **Module Declaration:** Proper module path
- **Go Version:** Configurable Go version
- **Dependencies:** Automatic require block formatting

---

### GoPackageDirectory

**Purpose:** Organizes Go files into proper package structure
**File:** `src/components/go/GoPackageDirectory.tsx`

#### Props

```typescript
interface GoPackageDirectoryProps {
  models: Model[];           // Models to include
  enums?: Enum[];           // Enums to include
  unions?: Union[];         // Unions to include
  operations?: Operation[];  // Operations to include
  packageName?: string;      // Package name (default: "api")
  packageDocumentation?: string; // Additional package docs
  modulePath?: string;       // Module path for go.mod
  generateGoMod?: boolean;  // Generate go.mod (default: false)
  goVersion?: string;       // Go version (default: "1.21")
  program?: Program;        // Access @doc decorators
}
```

#### Usage

```typescript
import { GoPackageDirectory } from "./src/components/go/GoPackageDirectory.js";

const output = render(
  <GoPackageDirectory
    packageName="api"
    models={[userModel, productModel]}
    enums={[statusEnum]}
    unions={[paymentMethodUnion]}
    operations={[getUserOperation, createUserOperation]}
    generateGoMod={true}
    modulePath="github.com/example/api"
  />
);
```

#### Generated Directory Structure

```
.
├── go.mod
└── api
    ├── models.go       // Contains User, Product structs
    ├── enums.go       // Contains Status enum
    ├── unions.go      // Contains PaymentMethod union
    ├── interfaces.go  // Contains UserService interface
    └── handlers.go   // Contains handler stubs
```

#### Features

- **Conditional Files:** Only generates files when needed
- **Import Management:** Automatic `time`, `fmt`, `encoding/json` imports
- **Go Module:** Optional go.mod generation
- **Package Organization:** Logical file grouping

---

### GoHandlerStub

**Purpose:** Generates HTTP handler functions from TypeSpec operations
**File:** `src/components/go/GoHandlerStub.tsx`

#### Props

```typescript
interface GoHandlerStubProps {
  operations: Operation[];   // TypeSpec operations
  serviceName?: string;     // Service name (default: "Service")
  packageName?: string;     // Package name (default: "api")
  program?: Program;       // Access @doc decorators
}
```

#### Usage

```typescript
import { GoHandlerStub } from "./src/components/go/GoHandlerStub.js";

const output = render(
  <GoHandlerStub
    operations={[getUserOperation, createUserOperation]}
    serviceName="UserService"
    packageName="api"
  />
);
```

#### Generated Go Code

```go
package api

import "net/http"

// UserService implements HTTP handlers
type UserService struct{}

// GetUserHandler handles GET /users/{id}
func (s *UserService) GetUserHandler(w http.ResponseWriter, r *http.Request) {
  // TODO: Implement handler logic
}

// CreateUserHandler handles POST /users
func (s *UserService) CreateUserHandler(w http.ResponseWriter, r *http.Request) {
  // TODO: Implement handler logic
}
```

#### Features

- **Service Struct:** Automatic service struct generation
- **Handler Methods:** HTTP handler function stubs
- **TODO Comments:** Placeholder for implementation
- **HTTP Metadata:** Route and method extraction from decorators

---

### GoHandlerMethodComponent

**Purpose:** Generates individual handler method logic
**File:** `src/components/go/GoHandlerMethodComponent.tsx`

#### Props

```typescript
interface GoHandlerMethodProps {
  method: GoHandlerMethod;  // Handler method metadata
  packageName?: string;      // Package name (default: "api")
}
```

#### Usage

```typescript
import { GoHandlerMethodComponent } from "./src/components/go/GoHandlerMethodComponent.js";

const handlerMethod = {
  name: "GetUserHandler",
  httpMethod: "GET",
  route: "/users/{id}",
  parameters: [{ name: "id", type: "string" }],
  returnType: "User",
  doc: "Handle GET /users/{id}"
};

const output = render(
  <GoHandlerMethodComponent method={handlerMethod} />
);
```

#### Features

- **Type-Safe:** Proper parameter and return type handling
- **Documentation:** Automatic doc comment generation
- **HTTP Integration:** Support for route metadata

---

### GoRouteRegistrationComponent

**Purpose:** Generates route registration function
**File:** `src/components/go/GoRouteRegistrationComponent.tsx`

#### Props

```typescript
type GoRouteRegistrationComponentProps = {
  handlers: GoHandlerMethod[]; // Handler methods to register
  serviceName: string;          // Service name for receiver
};
```

#### Usage

```typescript
import { GoRouteRegistrationComponent } from "./src/components/go/GoRouteRegistrationComponent.js";

const output = render(
  <GoRouteRegistrationComponent
    serviceName="UserService"
    handlers={[
      { name: "GetUserHandler", route: "/users/{id}" },
      { name: "CreateUserHandler", route: "/users" }
    ]}
  />
);
```

#### Generated Go Code

```go
// RegisterRoutes registers all handlers with given router
func (s *UserService) RegisterRoutes(mux *http.ServeMux) {
  mux.HandleFunc("/users/{id}", s.GetUserHandler)
  mux.HandleFunc("/users", s.CreateUserHandler)
}
```

#### Features

- **ServeMux Integration:** Standard library HTTP routing
- **Receiver Pattern:** Method receiver for service struct
- **Multiple Routes:** Registers all handlers in one function

---

## 🛠️ Core Helper Components

### GoBlock

**Purpose:** Renders Go code blocks with proper formatting
**File:** `src/components/go/core/GoBlock.tsx`

#### Usage

```typescript
import { GoBlock } from "./src/components/go/core/index.js";

const output = render(
  <GoBlock>
    fmt.Println("Hello, World!")
  </GoBlock>
);
```

---

### GoIf

**Purpose:** Generates Go if statements with else support
**File:** `src/components/go/core/GoIf.tsx`

#### Usage

```typescript
import { GoIf } from "./src/components/go/core/index.js";

const output = render(
  <GoIf condition="x > 0">
    <Then>fmt.Println("positive")</Then>
    <Else>fmt.Println("negative")</Else>
  </GoIf>
);
```

#### Generated Go Code

```go
if x > 0 {
  fmt.Println("positive")
} else {
  fmt.Println("negative")
}
```

---

### GoReturn

**Purpose:** Generates Go return statements
**File:** `src/components/go/core/GoReturn.tsx`

#### Usage

```typescript
import { GoReturn } from "./src/components/go/core/index.js";

const output = render(
  <GoReturn value='{"result": "success"}' />
);
```

#### Generated Go Code

```go
return {"result": "success"}
```

---

### GoStringLiteral

**Purpose:** Renders Go string literals with proper escaping
**File:** `src/components/go/core/GoStringLiteral.tsx`

#### Usage

```typescript
import { GoStringLiteral } from "./src/components/go/core/index.js";

const output = render(
  <GoStringLiteral value='Say "Hello"' raw={false} />
);
```

#### Generated Go Code

```go
"Say \"Hello\""
```

#### Features

- **Auto-Escaping:** Proper quote and backslash escaping
- **Raw Strings:** Support for Go raw string literals (backticks)

---

### GoSwitch

**Purpose:** Generates Go switch statements with cases
**File:** `src/components/go/core/GoSwitch.tsx`

#### Usage

```typescript
import { GoSwitch, GoCase, GoDefault } from "./src/components/go/core/index.js";

const output = render(
  <GoSwitch expression="status">
    <GoCase value="pending">fmt.Println("Waiting")</GoCase>
    <GoCase value="active">fmt.Println("Running")</GoCase>
    <GoDefault>fmt.Println("Unknown")</GoDefault>
  </GoSwitch>
);
```

#### Generated Go Code

```go
switch status {
case pending:
  fmt.Println("Waiting")
case active:
  fmt.Println("Running")
default:
  fmt.Println("Unknown")
}
```

---

## 🏗️ Component Composition Patterns

### Higher-Order Components

```typescript
// Composition of multiple components
export function GoNamespacePackage({ namespace }: { namespace: Namespace }) {
  return (
    <GoPackageDirectory
      packageName={getPackageName(namespace)}
      models={Array.from(namespace.models?.values() || [])}
      enums={Array.from(namespace.enums?.values() || [])}
    />
  );
}
```

### Component with Children

```typescript
// Components that accept children for composition
export function GoPackage({ children, name }: GoPackageProps) {
  return (
    <Package name={name}>
      <Import path="encoding/json" />
      <Import path="time" />
      {children}
    </Package>
  );
}
```

---

## 📚 Best Practices

### 1. Always Use refkey()

```typescript
// ✅ CORRECT - Use refkey for TypeSpec objects
const modelRefkey = refkey(model);
const typeRefkey = refkey(prop.type);

<StructTypeDeclaration name={model.name} refkey={modelRefkey}>
  <StructMember type={<Reference refkey={typeRefkey} />} />
</StructTypeDeclaration>

// ❌ WRONG - No refkey tracking
<StructTypeDeclaration name={model.name}>
  <StructMember type="string" />
</StructTypeDeclaration>
```

### 2. Use For Component for Iteration

```typescript
// ✅ CORRECT - Use <For> from Alloy Core
<For each={model.properties} to={(prop) => (
  <StructMember name={prop.name} type={TypeExpression({ type: prop.type })} />
)} />

// ❌ WRONG - Array.map without <For>
{Array.from(model.properties.values()).map(prop => (
  <StructMember name={prop.name} type={...} />
))}
```

### 3. Never Use String Concatenation for Code

```typescript
// ✅ CORRECT - Use Alloy Go components
<StructTypeDeclaration name={model.name}>
  <StructMember name="ID" type="string" />
</StructTypeDeclaration>

// ❌ WRONG - String-based generation
const goCode = `type ${model.name} struct {\n  ID string\n}`;
```

### 4. Type All Props Explicitly

```typescript
// ✅ CORRECT - Explicit TypeScript interfaces
interface GoModelProps {
  model: Model;
  packageName?: string;
}

export function GoModel({ model, packageName }: GoModelProps) {
  // Component implementation
}

// ❌ WRONG - Implicit any types
export function GoModel({ model, packageName }) {
  // Component implementation
}
```

### 5. Provide Default Values

```typescript
// ✅ CORRECT - Default values for optional props
export function GoStructDeclaration({
  model,
  packageName = "api",
  usePointersForOptional = true,
}: GoStructDeclarationProps) {
  // Component implementation
}

// ❌ WRONG - No defaults
export function GoStructDeclaration({
  model,
  packageName,
  usePointersForOptional,
}: GoStructDeclarationProps) {
  // Component implementation - could fail if undefined
}
```

---

## 🎯 Component Testing Patterns

### Component Isolation Test

```typescript
import { describe, test, expect } from "vitest";
import { render } from "@alloy-js/core";
import { GoModel } from "../src/components/go/GoModel.js";

describe("GoModel Component", () => {
  test("renders struct declaration correctly", async () => {
    const mockModel = createMockTypeSpecModel({
      name: "TestUser",
      properties: [
        { name: "id", type: { kind: "String" } },
        { name: "name", type: { kind: "String" }, optional: true }
      ]
    });

    const output = render(<GoModel model={mockModel} />);

    // Verify component output
    expect(output).toContain("type TestUser struct");
    expect(output).toContain('ID string `json:"id"`');
    expect(output).toContain('Name *string `json:"name,omitempty"`');
  });
});
```

### Integration Test

```typescript
import { describe, test, expect } from "vitest";
import { render } from "@alloy-js/core";
import { GoPackageDirectory } from "../src/components/go/GoPackageDirectory.js";

describe("GoPackageDirectory Integration", () => {
  test("composes multiple components", async () => {
    const mockNamespace = createMockNamespace({
      models: [userModel, productModel]
    });

    const output = render(
      <GoPackageDirectory
        namespace={mockNamespace}
        packageName="testapi"
      />
    );

    // Verify package composition
    expect(output).toContain("package testapi");
    expect(output).toContain("import");
    expect(output).toContain("type User struct");
    expect(output).toContain("type Product struct");
  });
});
```

---

## 🔗 Related Documentation

- [CONTRIBUTING.md](./CONTRIBUTING.md) - Development guidelines
- [README.md](./README.md) - Project overview
- [TYPE-MAPPING-GUIDE.md](./TYPE-MAPPING-GUIDE.md) - Type mapping reference
- [docs/SETUP.md](./docs/SETUP.md) - Setup instructions

---

## 📞 Support & Community

- **GitHub Issues:** Report bugs and request features
- **Discord:** Join TypeSpec community discussions
- **Contributing:** See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

**Last Updated:** January 2, 2026
**Component Count:** 12 primary + 5 core helpers
**Architecture:** 100% Alloy-JS Component-Based
