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
    # optional: emit go.mod so `go build` works in the output tree
    go-module-path: "example.com/my-api"
```

`import "@typespec-community/typespec-go";` in your `.tsp` file brings the
`TypeSpec.Go` decorators into scope.

## Rehearsal findings (2026-11-15, v1.0.0-rc.1)

The release steps above were rehearsed locally; findings:

1. **Install-from-tarball smoke test is green.** `npm pack` (73.5 kB,
   114 files) installed into a fresh consumer project; `tsp compile` of
   the crud example produced packages that pass `go build ./...` and
   `gofmt -l` with the tarball-only installation.
2. **`emitter-output-dir` must be absolute.** Relative CLI values are
   rejected by TypeSpec config validation (`config-path-absolute`);
   use `{cwd}/out` or `{project-root}/...` when invoking `tsp compile`
   with `--option` overrides.
3. **Publish remains owner-gated.** The local annotated `v1.0.0-rc.1`
   tag is intentionally NOT pushed; `npm publish` and the final
   `v1.0.0` tag push require explicit owner approval.
