# TypeSpec-Go Emitter Specification

## Core Concepts


### File and Package Generation

The emitter generates Go files and packages based on the TypeSpec namespace structure.

#### Package Mapping

A TypeSpec namespace maps directly to a Go package. Nested namespaces result in nested package directories. A TypeSpec namespace `Vendor.Service.API` will generate code in the directory path `vendor/service/api`, with the Go package declaration `package api`. specific namespaces can be excluded from creating another subpackage,

In the case of a naming conflict, a diagnostic error will be produced. Either the Go name of a clashing identifier will need to be overriden with `@go.name`, or a package will need to be split out.

As a special exception, a namespace with only operations is not treated as a separate package, but instead as a service with the name of the namespace. See [operations](#operations) for more information.

#### File Structure

The emitter ignores the file structure of the source `.tsp` files. All declarations within a single TypeSpec namespace are consolidated into a set of generated files (e.g., `models.go`, `enums.go`, `service.go`) within the corresponding Go package.

Go enforces a directed acyclic graph for package imports. If the emitter detects that the TypeSpec namespace structure would produce a cyclic package dependency in Go, it will raise an error. This can be resolved by restructuring the TypeSpec namespaces or by using the `@go.package` decorator.

### Name and Identifier Mapping

TypeSpec names are converted to `PascalCase` for exported Go types, functions, and constants. Model properties are converted to `PascalCase` to become exported struct fields. A model `person_response` becomes `type PersonResponse struct { ... }`. Characters that are illegal in Go identifiers are removed or replaced with an underscore. Alternatively, the go emitter configuration can provide a custom replace set for characters in the go emitter.

The emitter maintains a configurable list of common initialisms (e.g., `ID`, `URL`, `API`, `HTTP`, `JSON`). When a segment of a name matches an initialism, it is kept in uppercase. A property `apiUrl` becomes the Go field `APIURL`.

## TypeSpec Language Feature Mapping

### Built-in Types

| TypeSpec Type | Go Type | Notes |
| :--- | :--- | :--- |
| `string` | `string` | |
| `boolean` | `bool` | |
| `int8`, `int16`, `int32`, `int64` | `int8`, `int16`, `int32`, `int64` | |
| `uint8`, `uint16`, `uint32`, `uint64` | `uint8`, `uint16`, `uint32`, `uint64` | |
| `float32`, `float64` | `float32`, `float64` | |
| `bytes` | `[]byte` | |
| `plainDate` | `string` | Per ISO 8601 `YYYY-MM-DD`. Can be overridden with `@go.type`. |
| `plainTime` | `string` | Per ISO 8601 `HH:MM:SS`. Can be overridden with `@go.type`. |
| `utcDateTime` | `time.Time` | |
| `offsetDateTime` | `time.Time` | |
| `duration` | `time.Duration` | |
| `url` | `string` | Can be overridden with `@go.type("net/url.URL")`. |
| `null` | `any` | Mapped to `nil` where applicable. Types unioned with nullable become pointer types. |

### Models

Model properties become exported fields in the generated struct. JSON tags are added automatically (e.g., `json:"propertyName"`).

By default, an optional property (e.g., `name?: string`) is generated as a pointer field (e.g., `Name *string`). The `go.optional` decorator can be used to instead to prefer usage of the zero value, or a `Null` struct like
```go
type Null[T any] struct {
  V      T
  Exists bool
}
```

#### Composition

`extends` and the spread operator (`...`) are both implemented using Go's struct embedding.
```tsp
model Base {
  id: string;
}

model Widget extends Base {
  name: string;
}
```

Will result in

```go
type Base struct {
  ID string `json:"id"`
}

type Widget struct {
    Base
    Name string `json:"name"`
}
```

#### Template Models

Models with template parameters that are types (e.g., `model Page<T> { items: T[] }`) are generated as Go structs with generic type parameters (e.g., `type Page[T any] struct { Items []T }`). When `is` is used, the emitter will use the underlying type where possible.


#### Cycles 

If a model contains a property that creates a cyclic dependency (e.g., a `Node` model with a `Parent` property of type `Node`), the emitter will automatically convert **all** of the fields in the cycle to a pointer type to break the cycle and keep the emitter output consistent. To override this behavior, any of the fields in the cycle can be explicitly marked as optional.

### Enums

The TypeSpec enum

```ts
enum Status {
  Running,
  Stopped
}
```

is generated as:

```go
type Status string

const (
  StatusRunning Status = "Running"
  StatusStopped Status = "Stopped"
)
```

Optionally, an enum can be defined with the prefix of the type dropped, or using a different prefix altogether with the `go.enum` decorator. If a naming conflict occurs with any other identifier, a diagnostic error will be emitted.

By default, the enum member's name is used as its string value. If a value is specified in TypeSpec (e.g., `enum Status { Running: "RUN" }`), that value is used instead. The `go.enum` decorator provides an option to use `iota` for integer-based enums, as well as overriding this for all enums without a value in the emitter configuration.

The emitter generates `Stringer`, `MarshalJSON` `UnmarshalJSON` methods for enum types.

```go
func (s Status) MarshalJSON() ([]byte, error) { ... }
func (s *Status) UnmarshalJSON(data []byte) error { ... }
func (s Status) String() string { ... }
```

### Unions

TypeSpec enums represent a `oneOf` relationship.

A union `union Pet { Cat, Dog }` is generated as a sealed interface:

```go
type Pet interface {
    isPet()
}

func (Cat) isPet() {}
func (Dog) isPet() {}
```

Consumers of the union type will use a type switch to determine the concrete type at runtime:

```go
func main() {
  var p Pet
  switch v := p.(type) {
  case Cat:
    ...
  case Dog:
    ...
  }
}
```

If the union is discriminated by a property, the emitter will generate a custom `UnmarshalJSON` function that uses the discriminator field to correctly deserialize the JSON into the appropriate Go struct.

> Serializing and deserializing undiscriminated unions can be complex. The generated custom unmarshaler will attempt to unmarshal into each type in alphabetical order by type name. This process can be ambiguous and may not be suitable for all use cases. It is recommended to use discriminated unions where possible.

### Scalar Constants

A type that is a single scalar value (e.g., `scalar Etag is string; model Header { "if-match": Etag }`) is treated as a type definition (`type Etag string`). When a model property is defined as a constant value (e.g., `kind: "Widget"`), it is often part of a discriminated union. The emitter will treat this as a field with a constant value, which is particularly useful for the custom unmarshaler of a discriminated union.

### Operations

For a set of operations in a namespace, the emitter generates a Go interface that a service implementer must satisfy. Any generated Go RPC clients will correspondingly use the implementation for a given RPC procedure (e.g., for each HTTP endpoint).

```go
// op read(id: string): Pet;

type Service interface {
    Read(ctx context.Context, id string) (ReadResponse, error)
}
```

The emitter generates HTTP handler functions and a registration function.

```go
func RegisterHandlers(router *http.ServeMux, service Service) {
    router.HandleFunc("GET /pets/{id}", handleRead(service))
}

func handleRead(service Service) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        ...
        resp, err := service.Read(r.Context(), id)
        ...
    }
}
```

For operations with multiple possible responses, a response interface is generated.

```go
// op read(id: string): Pet | NotFoundError;
type ReadResponse interface {
    writeReadResponse(w http.ResponseWriter) error
}

// Generated Pet type implements the response interface.
func (p Pet) writeReadResponse(w http.ResponseWriter) error {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    return json.NewEncoder(w).Encode(p)
}
```

If an operation returns an error, a default marshaller will be used to convert it to a response. This can be overridden with an error handler, to customize the response code, headers, as well as the response body format.

If a sub-namespace exists exclusively with operations, the operations are grouped in a named Service instead:

```tsp
model Pet {
  id: string  
  name: string
}

namespace Pets {
  model NewPet {
    name: string;
  }

  op create(pet: NewPet): Pet;
  op find(tags: string[]): Pet[];
  op findPetById(id: string): Pet;
}
```

will generate

```go
type NewPet struct { ... }

type PetsService interface {
  Create(ctx context.Context, pet NewPet) (CreateResponse, error)
  Find(ctx context.Context, tags []string) (FindResponse, error)
  FindPetByID(ctx context.Context, id string) (FindPetByIDResponse, error)
}
```

### Documentation and Comments

TypeSpec doc comments (`@doc("...")`) and block comments (`/** ... */`) are translated into Go documentation comments.
The `@doc` decorator takes precedence over other comments.
The emitter provides a heuristic strategy to reformat comments to follow Go conventions (e.g., starting the comment with the name of the identifier it documents).

## Standard Library Decorator/Directive Support

`#deprecated`: appends a `// Deprecated: <message>` comment to the corresponding Go declaration.
- Decorators like `@minLength`, `@maxLength`, `@minValue`, and `@maxValue` are used to generate validation logic that is executed automatically during unmarshaling, and marshalling (optionally).

## Go-specific Emitter Decorators

The emitter provides a suite of decorators within a `@go` namespace to control Go-specific generation details.

| Decorator | Target(s) | Parameters | Description |
| :--- | :--- | :--- | :--- |
| `@go.name` | `Model`, `ModelProperty`, `Enum`, `EnumMember`, `Operation` | `name: string` | Overrides the generated Go name for the decorated element. |
| `@go.tag` | `ModelProperty` | `tag: string` | Appends a raw struct tag to the generated field. Example: `@go.tag("xml:\"name,attr\"")`. The `json` tag is handled automatically. |
| `@go.nullable` | `ModelProperty` | `mode: "pointer" \| "zeroValue" \| "nullable"` | Controls how optional properties are emitted. `"pointer"` (default), `"zeroValue"` (e.g., `string`), or `"nullable"` (e.g., `sql.NullString`). |
| `@go.type` | `ModelProperty`, `Scalar` | `type: string` | Overrides the Go type. Example: `@go.type("github.com/uuid.UUID")`. |
| `@go.package` | `Namespace` | `path: string` | Overrides the generated Go package path for a namespace. |
| `@go.enum` | `Enum` | `strategy: "value"` | "iota"`, `type?: "string" | "int"` | Controls enum generation strategy and underlying type. |

## Configuration

Emitter behavior can be configured in the `tspconfig.yaml` file.

```yaml
emit:
  - "@typespec-community/go"
options:
  "@typespec-community/go":
    emitter-output-dir: "./api"
    # The fully qualified go package path of the output.
    base-package: "github.com/typespec-community/typespec-go/example"
    # A list of common initialisms to preserve in PascalCase names.
    initialisms: ["API", "HTTP", "ID", "JSON", "URL"]
    # Default strategy for optional properties.
    default-nullable-strategy: "pointer" # "pointer" | "zeroValue" | "nullable"
    # Default strategy for enum value generation.
    default-enum-strategy: "string" # "string" | "iota"
```
