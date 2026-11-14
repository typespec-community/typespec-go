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

## Named unions

`union PaymentMethod { card: Card, … }` → sealed interface pattern:

```go
type PaymentMethod interface { isPaymentMethod() }
type Card struct { … }
func (Card) isPaymentMethod()
```

With a discriminator, a `GetType() string` accessor is generated.

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

## Decorators quick reference

| Decorator                          | Target                   | Effect                        |
| ---------------------------------- | ------------------------ | ----------------------------- |
| `@go.pkg("path")`                  | namespace                | output package path           |
| `@go.name("X")`                    | property (types pending) | Go identifier override        |
| `@go.type("T")`                    | property                 | Go type override              |
| `@go.structTag("tag")`             | property                 | raw struct tag override       |
| `@go.nullable(pointer\|zeroValue)` | property                 | declared, consumption pending |
| `@go.enumMode(iota\|string\|name)` | enum                     | declared, consumption pending |
