# Troubleshooting

Verified failure modes and their fixes, from real incidents in this repo.

## Build

### `alloy build` crashes with `ts.sys` undefined

TypeScript 7 removed the classic `ts.*` API surface the alloy CLI uses.
`typescript` is pinned to `6.0.2` in `package.json` — keep the pin until
`@alloy-js/cli` and `typescript-eslint` ship TypeScript-7-compatible
releases. Symptom on a fresh checkout without the pin: the CI build step
dies before compiling anything.

### Local build warns `TS5011: rootDir must be explicitly set`

Set by `tsconfig.json` (`rootDir: "./src"`). If you see it again, someone
removed the option — the output layout (`dist/main.js` vs `dist/src/main.js`)
depends on it.

### Build passes but Node can't load the emitter (`ERR_MODULE_NOT_FOUND`)

A relative import without a `.js` suffix compiles to an extensionless ESM
specifier. Fix the import in `src/` (add `.js`), not the `dist/` output.

## Running the emitter

### `emitter-not-found: Emitter "@typespec-community/typespec-go" not found`

The compiler resolves emitters from `node_modules`. In this repo, run
`npm run test:e2e-cli` (it self-links the package) or create the link
manually:

```bash
mkdir -p node_modules/@typespec-community
ln -s ../.. node_modules/@typespec-community/typespec-go
```

### `Unknown decorator @pkg` / `Namespace TypeSpec doesn't have member Go`

The `.tsp` file must `import "@typespec-community/typespec-go";` before
`using TypeSpec.Go;`, and the package must be resolvable (see above).

## Tests

### `EnvironmentTeardownError` in components-basic.test.tsx

Historically caused by an unawaited dynamic `import()` racing vitest's
teardown. Fixed with a static import. If it reappears, look for floating
promises that import modules after the test file completes.

### Coverage run fails with `coverageFilesDirectory is required`

`@vitest/coverage-v8` and `vitest` versions must match (both 4.1.12).
The config sets `coverage.reportsDirectory`; do not remove it.

## Tooling quirks (local nix shells)

- `bun` installed via nix has no `bunx` — call `./node_modules/.bin/<bin>`
  directly (CI's Bun install has `bunx`).
- Root `go.mod` now carries a real module path
  (`github.com/typespec-community/typespec-go`); `go run` works in-repo.

## Docs

### docs-gates failures

Run `docs-gates run .`. Annotate/routing findings in archived reports are
repaired with the toolkit in the docs-health skill; new reports must carry a
`§f` section listing what was harvested into the living docs. Historical
files are annotate-and-archive only — never rewritten.
