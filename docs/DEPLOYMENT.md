# Deployment Guide

Publishing and consuming `@typespec-community/typespec-go`.

## Release prerequisites (all must be green)

1. CI run green on the release commit (build, tests, lint, strict typecheck,
   dprint, CLI e2e proof).
2. `npm run test:e2e-cli` locally — proves the BUILT artifact generates
   correct, gofmt-conformant Go through the real `tsp` compiler.
3. `npm pack --dry-run` — inspect the tarball: `dist/`, `lib/main.tsp`,
   `README.md` present; no `src/`, no test artifacts.

## Package layout (what consumers get)

| Path                        | Role                                                                |
| --------------------------- | ------------------------------------------------------------------- |
| `dist/main.js`              | `$onEmit` entry (package `main`/`exports` default)                  |
| `lib/main.tsp`              | `TypeSpec.Go` decorator declarations (`tspMain`, `typespec` export) |
| `dist/emitter/tsp-index.js` | JS decorator bindings imported by `lib/main.tsp`                    |

## Version policy

- `peerDependencies: "@typespec/compiler": "^1.18.0"` — keep the caret range
  aligned with `dependencies`; a hard pin breaks consumer installs.
- `typescript` is pinned (dev-only) to `6.0.2`; see CHANGELOG 2026-11-14 for
  why (alloy CLI + typescript-eslint compatibility). Do not bump casually.

## Release steps

```bash
npm version <patch|minor|major>   # bumps package.json, creates git tag
# cut the CHANGELOG section for the new version
npm run build && npm run test:e2e-cli
npm pack --dry-run                # final tarball inspection
npm publish                       # requires npm credentials
git push --follow-tags            # only after publish succeeded
```

## Consumer setup

```bash
npm install @typespec-community/typespec-go
```

```yaml
# tspconfig.yaml
emit:
  - "@typespec-community/typespec-go"
options:
  "@typespec-community/typespec-go":
    emitter-output-dir: "{output-dir}/go"
```

`import "@typespec-community/typespec-go";` in your `.tsp` file brings the
`TypeSpec.Go` decorators into scope.
