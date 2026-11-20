# API Reference — TypeSpec Go Emitter

Verified against the code on 2026-11-20. This emitter is a TypeSpec
**AssetEmitter plugin**: there is no standalone programmatic API. All
generation is driven by `tsp compile` with this package configured as the
emitter (see [SETUP](./SETUP.md) and [QUICKSTART](./QUICKSTART.md)).

## Emitter options

Passed via `tspconfig.yaml` `options` or `--option` flags.

| Option            | Type     | Default  | Effect                                                                                                                                                                  |
| ----------------- | -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `go-module-path`  | `string` | _(none)_ | Go module path for the generated `go.mod` (e.g. `github.com/acme/pets`). When unset, no `go.mod` is emitted.                                                            |
| `visibility-mode` | `string` | `all`    | `all` emits every property; `read` emits only properties visible in read scenarios (`@visibility` processing). Invalid values fail the compile with the supported list. |

Source: `parseEmitterOptions` in `src/emitter/typespec-go-emitter.tsx`.

## Decorators (`TypeSpec.Go` namespace)

Declared in `lib/main.tsp`, implemented in `src/emitter/go-decorators.ts`.
Import with `import "@typespec-community/typespec-go";` in your `.tsp` file.

| Decorator       | Targets                                                     | Argument                                             | Effect                                |
| --------------- | ----------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------- |
| `@go.pkg`       | `Namespace`                                                 | `path: string`                                       | output package path for the namespace |
| `@go.name`      | `Model`, `ModelProperty`, `Enum`, `EnumMember`, `Operation` | `name: string`                                       | Go identifier override                |
| `@go.type`      | `Model`, `ModelProperty`, `Enum`, `Scalar`                  | `type: string`                                       | Go type override                      |
| `@go.structTag` | `ModelProperty`                                             | `tag: string \| Record<string>`                      | raw struct tag override               |
| `@go.nullable`  | `ModelProperty`                                             | `NullableMode`: `pointer` \| `zeroValue` \| `struct` | optionality shape override            |
| `@go.enumMode`  | `Enum`                                                      | `EnumMode`: `iota` \| `string` \| `name`             | constant rendering mode for enums     |

Consumers: `@go.nullable` → `GoStructDeclaration`, `@go.enumMode` →
`GoEnumDeclaration` (covered by `go-decorator-modes.test.tsx`).

## Emitted layout

One Go package per user TypeSpec namespace (built-in `TypeSpec.*`
namespaces are skipped):

```
<emitter-output-dir>/
├── <namespace-path>/          # @go.pkg overrides this path
│   ├── go.mod                 # when go-module-path is set (one per module root)
│   ├── models.go              # structs + package doc
│   ├── enums.go               # enums (iota or string constants)
│   ├── unions.go              # named unions: sealed interface + GetType + UnmarshalX
│   ├── <interface>.go         # API contract interface, when operations exist
│   └── handlers.go            # RegisterRoutes + handler stubs (one mux.HandleFunc
│                              #   per route, switch r.Method dispatch, 405 fallback)
└── …                          # sibling namespace versions generate sibling packages
```

Type mapping: see [MAPPING-GUIDE](./MAPPING-GUIDE.md).

## Error contract

- Invalid `visibility-mode` fails the compile at option-parse time with the
  supported values.
- A failure while generating one namespace is rethrown naming the namespace
  and Go package, with the original error preserved as `cause`.
- An `@go.pkg` lookup failure surfaces the namespace context the same way
  (`go-pkg-error-context.test.ts`).

## Programmatic composition (maintainers)

The component library under `src/components/go/` (11 primary Alloy-JS Go
components + 5 core helpers) is importable for composition and testing —
see [COMPONENTS](./COMPONENTS.md). Rendering convention: Alloy `render()` +
`Output`, tab indentation, goimports-native import blocks via
`GoImportGroup`.
