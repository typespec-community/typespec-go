# Quickstart: TypeSpec → Go in 5 minutes

Generate a compilable Go package (models, enums, unions, error types) from
a TypeSpec spec. The output is gofmt-clean and machine-verified to build.

## 1. Prerequisites

- [TypeSpec compiler](https://typespec.io) (`npm install -g @typespec/compiler`)
- Go 1.22+ (only if you want to build the generated output)

## 2. Project setup

```bash
mkdir my-api && cd my-api
npm init -y
npm install @typespec/compiler @typespec-community/typespec-go
```

Create `tspconfig.yaml`:

```yaml
emit:
  - "@typespec-community/typespec-go"
options:
  "@typespec-community/typespec-go":
    emitter-output-dir: "{output-dir}/generated"
    # optional: emit a go.mod at the package root so `go build` works
    go-module-path: "example.com/my-api"
```

## 3. Write a spec

Create `main.tsp` — this is the CRUD example from this repo, verbatim:

```typespec
import "@typespec-community/typespec-go";

using TypeSpec.Go;

@pkg("github.com/acme/orders/api")
namespace Orders;

enum OrderStatus {
  pending,
  confirmed: "confirmed",
  shipped: "shipped",
  cancelled: "cancelled",
}

@enumMode(EnumMode.iota)
enum OrderPriority {
  low,
  normal,
  high,
}

union PaymentMethod {
  creditCard: CreditCard,
  bankTransfer: BankTransfer,
}

model CreditCard {
  last4: string;
  brand: string;
}

model BankTransfer {
  iban: string;
  bankName: string;
}

model Order {
  id: string;
  status: OrderStatus;
  payment?: PaymentMethod;
  total: float64;
  createdAt: utcDateTime;

  @nullable(NullableMode.zeroValue)
  notes?: string;

  @name("OrderReference")
  externalRef?: string;
}

@error
model OrderError {
  message: string;
  code: int32;
}
```

## 4. Generate

```bash
tsp compile .
```

Output (what the emitter logs per package):

```
Package 'orders' written
  outputDirectory: <...>/generated/github.com/acme/orders/api
  files: go.mod, orders/enums.go, orders/models.go, orders/unions.go
```

## 5. Build the generated Go

```bash
cd generated/github.com/acme/orders/api
go build ./...
```

Green, first try. The e2e net in this repo proves this for both examples
on every commit (`go build ./...` + `gofmt -l` on raw output).

## 6. HTTP APIs (optional)

Import `@typespec/http` and declare an interface — the emitter generates
`handlers.go` (handler methods + `RegisterRoutes` with path-param and
body adaptation) and `interfaces.go` (an API contract interface):

```typespec
import "@typespec/http";
using Http;

@route("/orders")
interface OrdersApi {
  @get list(): Order[];
  @post create(@body order: Order): Order;
}
```

## Decorator reference

| Decorator    | Target                           | Effect                                               |
| ------------ | -------------------------------- | ---------------------------------------------------- |
| `@pkg`       | namespace                        | Go output package path (and module layout)           |
| `@name`      | model, property, enum, operation | Override generated Go name                           |
| `@type`      | model, property, enum, scalar    | Override generated Go type                           |
| `@structTag` | property                         | Custom struct tag (string or Record form)            |
| `@nullable`  | property                         | `pointer` / `zeroValue` / `struct` optionality shape |
| `@enumMode`  | enum                             | `iota` / `string` / `name` constant style            |
