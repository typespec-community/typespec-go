# Architecture

How the TypeSpec Go emitter works, verified against the code on 2026-11-20.

## Pipeline

```
tsp compile
  └─ $onEmit(context)                     src/emitter/typespec-go-emitter.tsx
       ├─ parseEmitterOptions()           typed option parse + visibility validation
       ├─ program.getGlobalNamespaceType()
       ├─ collectTypesByNamespace()       groups types per namespace
       │    └─ skips built-in TypeSpec library namespaces (TypeSpec.Http, …)
       └─ for each namespace group
            └─ generateNamespacePackage()  per-namespace render + write
                 ├─ @go.pkg overrides the output package path
                 ├─ <Output><GoPackageDirectory …/></Output>
                 └─ writeRenderedOutput()   renderAsync({ useTabs: true })
                      └─ emitFile() per rendered file (gofmt-style tab indentation)
```

One Go package is generated per user TypeSpec namespace. Files per package:
`models.go` (structs), `enums.go`, `unions.go`, handler/interface files when
operations exist, and a `go.mod` at the module root when enabled.

## Layers

| Layer      | Location             | Responsibility                                                                         |
| ---------- | -------------------- | -------------------------------------------------------------------------------------- |
| Emitter    | `src/emitter/`       | `$onEmit` entry, option parsing, namespace collection, decorator state, output writing |
| Components | `src/components/go/` | 11 primary Alloy-JS Go components (incl. `GoImportGroup`) + 5 core helpers (`core/`)   |
| Domain     | `src/domain/`        | type-mapping kernel, package-layout builder, visibility filter, structured logging     |
| Services   | `src/services/`      | type-mapping delegation, return-type extraction                                        |
| Testing    | `src/testing/`       | mock factory, render utilities                                                         |

### Type mapping (single source of truth)

`src/domain/go-primitive-types.ts` owns the TypeSpec-scalar → Go-primitive
table. Three consumers read it instead of keeping their own tables:

- `GoStructDeclaration.mapTypeSpecToGoType` (JSX-aware mapping)
- `CleanTypeMapper` (`GoTypeMapping` results with pointer/import policy)
- `src/services/type-mapping.service.ts` (`GoPrimitiveType` enum results)

### Decorators (`TypeSpec.Go` namespace)

Declared in `lib/main.tsp` (`extern dec`), implemented in
`src/emitter/go-decorators.ts` (JS bindings exported via
`src/emitter/tsp-index.ts`, wired through `package.json` `tspMain`), consumed
during generation:

| Decorator       | Consumed by         | Effect                                      |
| --------------- | ------------------- | ------------------------------------------- |
| `@go.pkg`       | emitter             | output package path for the namespace       |
| `@go.name`      | GoStructDeclaration | Go field name override                      |
| `@go.type`      | GoStructDeclaration | Go type override                            |
| `@go.structTag` | GoStructDeclaration | raw struct tag override                     |
| `@go.nullable`  | GoStructDeclaration | pointer vs zero value vs pass-through shape |
| `@go.enumMode`  | GoEnumDeclaration   | iota vs string rendering                    |

Models decorated with `@error` that carry a `message` property generate
`func (e X) Error() string`, making them Go `error` types.

### Route registration (runtime-safe)

`GoHandlerStub` groups handlers by route pattern before rendering:
`RegisterRoutes` emits ONE `mux.HandleFunc` per pattern with a
`switch r.Method` dispatch (`http.MethodGet` casing) and an
`http.Error` 405 fallback. The per-handler registration shape it
replaced compiled clean but panicked at runtime — Go's ServeMux
rejects duplicate patterns on first mount. The e2e runtime smoke test
(`scripts/fixtures/handlers_smoke_test.go.tmpl`) locks this in.

### Import blocks (goimports-native)

`GoImportGroup` renders one import as a single statement and several
as a sorted tab-indented group — the shape goimports itself writes —
so `handlers.go` and `unions.go` pass `goimports -l` as emitted.

## Build

`npm run build` runs `alloy build` (the only sanctioned build). Output lands
in `dist/` with `rootDir: ./src`, so `package.json` `main`/`exports` point at
`dist/main.js`. `lib/main.tsp` imports `dist/emitter/tsp-index.js` — the
TypeSpec compiler loads it via the `typespec` export condition when a
`.tsp` file does `import "@typespec-community/typespec-go"`.

## Testing

| Suite                                            | Command                                             | What it proves                                                                                  |
| ------------------------------------------------ | --------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Unit + integration (vitest, alloy rollup plugin) | `npm run test:typespec`                             | 182/182: component rendering, real TypeSpec compilation via `createTester`                      |
| Coverage                                         | `npm run test:coverage`                             | v8 coverage vs thresholds 58/46/65/58 (actuals 61.7/49.5/70.9/61.9)                             |
| CLI end-to-end                                   | `npm run test:e2e-cli`                              | 3 examples: needle asserts, `go build`, runtime smoke test (`go test`), gofmt + goimports clean |
| Benchmarks                                       | `npx vitest bench src/test/go-generation.bench.tsx` | generation performance baselines                                                                |
| Docs                                             | `docs-gates run .`                                  | living-doc freshness, report archival cadence                                                   |

## Known boundaries

- Inline anonymous unions map to the closest primitive (`string`, `float64`,
  `bool`, `interface{}`); named unions generate sealed interfaces with
  `GetType()` + `UnmarshalX`.
- Model `extends` (inheritance → embedding) and cyclic-reference pointer
  breaking are NOT implemented (their historical test evidence exercised a
  removed dead path; see FEATURES Known limits).
- Operation return types carrying `@error` models keep the union shape;
  the strip-`@error` → `*Widget` design is recorded in MAPPING-GUIDE
  § Return types pending the implementation decision.
