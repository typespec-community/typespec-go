# Architecture

How the TypeSpec Go emitter works, verified against the code on 2026-11-14.

## Pipeline

```
tsp compile
  └─ $onEmit(context)                     src/emitter/typespec-go-emitter.tsx
       ├─ program.getGlobalNamespaceType()
       ├─ collectTypesByNamespace()       groups types per namespace
       │    └─ skips built-in TypeSpec library namespaces (TypeSpec.Http, …)
       ├─ for each namespace group
       │    ├─ @go.pkg overrides the output package path
       │    └─ <Output><GoPackageDirectory …/></Output>
       └─ writeRenderedOutput()           renderAsync({ useTabs: true })
            └─ emitFile() per rendered file (gofmt-style tab indentation)
```

One Go package is generated per user TypeSpec namespace. Files per package:
`models.go` (structs), `enums.go`, `unions.go`, handler/interface files when
operations exist, and a `go.mod` at the module root when enabled.

## Layers

| Layer      | Location             | Responsibility                                                         |
| ---------- | -------------------- | ---------------------------------------------------------------------- |
| Emitter    | `src/emitter/`       | `$onEmit` entry, namespace collection, decorator state, output writing |
| Components | `src/components/go/` | 11 primary Alloy-JS Go components + 5 core helpers (`core/`)           |
| Domain     | `src/domain/`        | type mapping kernel, generators, logging, error entities               |
| Services   | `src/services/`      | type-mapping delegation, return-type extraction                        |
| Testing    | `src/testing/`       | mock factory, render utilities                                         |

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

| Decorator       | Consumed by                   | Effect                                |
| --------------- | ----------------------------- | ------------------------------------- |
| `@go.pkg`       | emitter                       | output package path for the namespace |
| `@go.name`      | GoStructDeclaration           | Go field name override                |
| `@go.type`      | GoStructDeclaration           | Go type override                      |
| `@go.structTag` | GoStructDeclaration           | raw struct tag override               |
| `@go.nullable`  | declared, consumption pending | pointer vs zero value                 |
| `@go.enumMode`  | declared, consumption pending | iota vs string rendering              |

Models decorated with `@error` that carry a `message` property generate
`func (e X) Error() string`, making them Go `error` types.

## Build

`npm run build` runs `alloy build` (the only sanctioned build). Output lands
in `dist/` with `rootDir: ./src`, so `package.json` `main`/`exports` point at
`dist/main.js`. `lib/main.tsp` imports `dist/emitter/tsp-index.js` — the
TypeSpec compiler loads it via the `typespec` export condition when a
`.tsp` file does `import "@typespec-community/typespec-go"`.

## Testing

| Suite                                            | Command                                             | What it proves                                                                                           |
| ------------------------------------------------ | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Unit + integration (vitest, alloy rollup plugin) | `npm run test:typespec`                             | component rendering, real TypeSpec compilation via `createTester`                                        |
| CLI end-to-end                                   | `npm run test:e2e-cli`                              | `tsp compile examples/basic` with the built emitter writes Go to disk, content-correct, gofmt-conformant |
| Benchmarks                                       | `npx vitest bench src/test/go-generation.bench.tsx` | generation performance baselines                                                                         |
| Docs                                             | `docs-gates run .`                                  | living-doc freshness, report archival cadence                                                            |

## Known boundaries

- Inline anonymous unions map to the closest primitive (`string`, `float64`,
  `bool`, `interface{}`); named unions generate sealed interfaces.
- Interface operations are collected but HTTP route metadata extraction is
  not applied end-to-end yet (see TODO_LIST).
- `@visibility` semantics are not applied to generated output yet.
