# TypeSpec → Go Mapping Guide

What the emitter generates, verified 2026-11-14. Example input in
`examples/basic/main.tsp`.

## Scalars

TypeSpec scalar names are matched case-insensitively
(`src/domain/go-primitive-types.ts`):

| TypeSpec                                                                           | Go                           |
| ---------------------------------------------------------------------------------- | ---------------------------- |
| `string`, `url`, `uri`, `email`, `uuid`, `ipAddress`, `ipv4Address`, `ipv6Address` | `string`                     |
| `boolean` / `bool`                                                                 | `bool`                       |
| `int8` `int16` `int32` `int64` `uint8` `uint16` `uint32` `uint64`                  | same name                    |
| `integer`, `safeint`                                                               | `int64`                      |
| `float32`, `float64`, `float`, `numeric`, `decimal*`                               | `float32` / `float64`        |
| `bytes`                                                                            | `[]byte`                     |
| `plainDate`, `plainTime`, `utcDateTime`, `offsetDateTime`, `zonedDateTime`         | `time.Time`                  |
| `duration`                                                                         | `time.Duration`              |
| unknown scalar                                                                     | emitted as its name verbatim |

## Models

- `model X { … }` → `type X struct` in the namespace's `models.go`.
- Field names get their first letter capitalized (`id` → `ID`); override with
  `@go.name("FullGoName")`.
- JSON tags: `json:"<propName>"`, plus `,omitempty` for optional properties;
  override with `@go.structTag(`json:"…"`)`.
- Optional nested-model fields get a pointer (`*Other`) when
  `usePointersForOptional` is on (default).
- Scalar fields keep their value type (`string`, `int32`, `time.Time`), never
  pointers.

## Inline unions

`"red" | "blue"` in a property maps to the closest primitive: homogeneous
string unions → `string`, number unions → `float64`, boolean unions → `bool`,
mixed → `interface{}`.

## Generics

Template declarations emit as Go generic types with `any` constraints:

```tsp
model Page<T> {
  items: T[];
  total: int32;
}
```

→ `type Page[T any] struct { Items []T; Total int32 }`. Multi-parameter
templates emit each parameter with its own `any` constraint
(`Pair[K, V]` → `type Pair[K any, V any] struct`). Type parameter
references inside the declaration (`content: T`) resolve to the declared
parameter name. Template CONSTRAINTS are deliberately untranslated
(declare-only): every Go constraint is `any` until a TypeSpec→Go
constraint mapping is designed. Template INSTANCES used as property
types (`Box<string>`) still map to their argument type, not to a Go
instantiation site.

## Named unions

`union PaymentMethod { creditCard: CreditCard, … }` → sealed interface
pattern with a `GetType()` discriminator accessor and a JSON unmarshaler
(`UnmarshalPaymentMethod`): probe struct reads the discriminator,
per-variant decode returns the concrete variant, unknown discriminators
error with `fmt.Errorf`:

```go
type PaymentMethod interface { GetType() string }
func (CreditCard) GetType() string { return "creditCard" }
func UnmarshalPaymentMethod(data []byte) (any, error)
```

Discriminator strings are the variant names. Working example:
[examples/crud/main.tsp](../examples/crud/main.tsp).

## Enums

- String-valued enums → `type Status string` with typed constants
  (`StatusPending Status`), `String()` and `IsValid()`.
- Number-valued enums → `type Priority int` with `iota` constants.

## Errors

```tsp
@error
model NotFound { message: string }
```

→ plain struct plus `func (e NotFound) Error() string { return e.Message }`,
so the type satisfies Go's `error` interface.

## Namespaces

`namespace Vendor.Service.API` → package path `vendor/service/api`. Override
with `@go.pkg("github.com/org/repo/custom")`.

Versioned namespaces each become their own package: `namespace
Petstore.V1` + `namespace Petstore.V2` → sibling packages `v1` and `v2`
under the shared `@go.pkg` base, with ONE `go.mod` at the base. Each
version's types are fully independent — a union variant added in V2
never leaks into V1's generated code. Working example:
[examples/versioned/main.tsp](../examples/versioned/main.tsp).

## Naming conventions

Generated Go identifiers follow fixed conventions derived from the package
name (the last path segment of the namespace or `@go.pkg` override,
capitalized):

| Artifact                           | Name                      | Receiver |
| ---------------------------------- | ------------------------- | -------- |
| Handler struct (`handlers.go`)     | `<Pkg>Service`            | `s`      |
| Handler methods                    | `<operation.name>Handler` | `s`      |
| Service constructor                | `New<Pkg>Service`         | -        |
| API contract (`interfaces.go`)     | `<Pkg>API`                | -        |
| Enum methods (`String`, `IsValid`) | -                         | `e`      |
| `@error` model `Error()` method    | -                         | `e`      |

The `<Pkg>Service` struct owns the HTTP handlers and implements the
`<Pkg>API` interface; handlers take `s *<Pkg>Service`, enum and error
methods take value receivers named `e`. Example for package `crud`:
`CrudService` (receiver `s`) implements `CrudAPI`.

Generated filenames are lowercase (`models.go`, `enums.go`, `handlers.go`,
`interfaces.go`, `unions.go`, `go.mod`); any future multi-word filename
uses snake_case (the Go norm, e.g. `route_registration.go`), never
kebab-case (dashes are not valid in Go identifiers).

## Visibility

`@visibility` on properties is evaluated with the compiler's official
visibility APIs. By default (`visibility-mode: "all"`) every property is
emitted and `@visibility` is ignored. Set the emitter option
`visibility-mode: "read"` to emit read-shaped structs: properties without
`Lifecycle.Read` in their modifier set are dropped, so create-only fields
such as secrets disappear from generated types. Undecorated properties are
visible in every lifecycle and never disappear.

```tsp
using TypeSpec;

model User {
  id: string;
  @visibility(Lifecycle.Create)
  password: string;
}
```

With `visibility-mode: "read"`, `User` emits only `ID`; under the default
mode both fields are emitted. Per-lifecycle variant structs (Create/Update
suffixed types) are future work tracked in ROADMAP.md.

## Decorators quick reference

| Decorator                          | Target                     | Effect                       |
| ---------------------------------- | -------------------------- | ---------------------------- |
| `@go.pkg("path")`                  | namespace                  | output package path          |
| `@go.name("X")`                    | model, property, operation | Go identifier override       |
| `@go.type("T")`                    | property                   | Go type override             |
| `@go.structTag("tag")`             | property                   | raw struct tag override      |
| `@go.nullable(pointer\|zeroValue)` | property                   | optional-field emission mode |
| `@go.enumMode(iota\|string\|name)` | enum                       | const generation mode        |
