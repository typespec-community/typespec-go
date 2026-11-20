# TypeSpec Go Emitter - Setup Guide

Verified against the code on 2026-11-20. For end-consumer setup (using the
emitter from a TypeSpec project), start with [QUICKSTART](./QUICKSTART.md);
this guide covers working ON the emitter.

## Prerequisites

- Node.js 18+
- bun (package manager; the only lockfile is `bun.lock`)
- TypeScript 6 (repo pins 6.0.2 — do NOT bump to 7 until typescript-eslint
  supports it; see AGENTS.md)
- Go toolchain (for the e2e gates: `go build`, `gofmt`, `go test`)
- `goimports` on PATH (e2e conformance gate; `go install
  golang.org/x/tools/cmd/goimports@v0.53.0`)

## Install

```bash
bun install
```

## Canonical commands (npm scripts)

npm scripts are the shell-agnostic source of truth (npm puts
`node_modules/.bin` on PATH, so they work in nix shells and CI alike):

```bash
npm run build          # alloy build + dist pruning (the ONLY sanctioned build)
npm run test:typespec  # vitest single run (182 tests, 41 files)
npm run lint           # eslint --max-warnings 0
npm run build:check    # tsc --noEmit --strict
npm run format:check   # dprint check (markdown/json/yaml) + oxfmt (src/)
npm run test:coverage  # v8 coverage vs thresholds 58/46/65/58
npm run test:e2e-cli   # 3 examples: tsp compile → needles → go build →
                       #   runtime smoke test → gofmt/goimports gates
```

Watch mode for tests: `npm run test` (plain vitest watch).

## Configuration

### vitest.config.js - Critical Settings

The following configuration is **REQUIRED** for proper component rendering:

```javascript
import { defineConfig } from "vitest/config";
import alloyPlugin from "@alloy-js/rollup-plugin";

export default defineConfig({
  esbuild: {
    jsx: "preserve", // ⚠️ CRITICAL: Must be "preserve", NOT "transform"
    sourcemap: "both",
  },
  resolve: {
    alias: {
      "@alloy-js/core/jsx-dev-runtime": "@alloy-js/core/jsx-runtime",
    },
  },
  plugins: [alloyPlugin()], // Required for Alloy-JS JSX transformation
});
```

### Why `jsx: "preserve"` is Critical

The Alloy-JS framework requires Babel plugin transformation for JSX:

1. **`jsx: "transform"` (WRONG)**:
   - Esbuild tries to transform JSX directly
   - Conflicts with Babel plugin
   - Results in empty contents array
   - Component children not rendered

2. **`jsx: "preserve"` (CORRECT)**:
   - Esbuild passes JSX through unchanged
   - Babel plugin handles JSX transformation
   - Components render correctly
   - Children propagate through render tree

### Test Setup File

`src/test/vitest.setup.ts` imports `@alloy-js/core/testing`, which loads the
custom Vitest matchers (`toRenderTo`, `toStrictEqualOutput`, etc.).

## Common Issues

### Issue: Components render but output is empty

**Symptom**: Rendered `result.contents` is empty array

**Solution**: Check vitest.config.js has `jsx: "preserve"`, not `jsx: "transform"`

### Issue: "A module is not in scope" error

**Symptom**: Error when using @alloy-js/go SourceDirectory

**Solution**: Wrap SourceDirectory in ModuleDirectory:

```tsx
<Output basePath="./test-output">
  <ModuleDirectory name="github.com/test/api">
    <SourceDirectory path="api">
      <SourceFile path="test.go">{/* content */}</SourceFile>
    </SourceDirectory>
  </ModuleDirectory>
</Output>
```

### Issue: `<T>(...) =>` arrow fails `alloy build` in a `.ts` file

**Symptom**: "Unexpected token `>`" during alloy build

**Solution**: alloy 0.26/Babel 8 parses JSX-enabled `.ts` as TSX, so
expression-position generic arrows are illegal there. Use contextually-typed
non-generic arrows or function declarations (`.tsx` files are unaffected).

## Architecture

### Component Hierarchy

```
Output
  └─ ModuleDirectory (@alloy-js/go)
      └─ SourceDirectory (@alloy-js/go)
          └─ SourceFile (@alloy-js/go)
              └─ [Go Components]
```

See [ARCHITECTURE](./ARCHITECTURE.md) for the full pipeline and
[COMPONENTS](../COMPONENTS.md) for the component inventory.

### Domain Layer

- **Location**: `src/domain/`
- **Purpose**: single source of truth for TypeSpec → Go primitives
  (`go-primitive-types.ts`), type mapping (`CleanTypeMapper.mapTypeSpecType`,
  static), package file layout (`buildPackageFileLayout`), visibility
  filtering, structured logging

### Component Test Pattern

```tsx
import { renderGoContent } from "../testing/test-utils.js";

const output = renderGoContent(<MyComponent />);
expect(output).toContain("expected output");
```

`renderGoContent()` automatically wraps content in proper directory structure.
