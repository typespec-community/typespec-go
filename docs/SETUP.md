# TypeSpec Go Emitter - Setup Guide

## Prerequisites

- Node.js 18+  
- Bun (recommended) or npm/yarn
- TypeScript 5+

## Installation

```bash
bun install
```

## Configuration

### vitest.config.js - Critical Settings

The following configuration is **REQUIRED** for proper component rendering:

```javascript
import { defineConfig } from "vitest/config";
import alloyPlugin from "@alloy-js/rollup-plugin";

export default defineConfig({
  esbuild: {
    jsx: "preserve",  // ⚠️ CRITICAL: Must be "preserve", NOT "transform"
    sourcemap: "both",
  },
  resolve: {
    alias: {
      "@alloy-js/core/jsx-dev-runtime": "@alloy-js/core/jsx-runtime",
    },
  },
  plugins: [alloyPlugin()],  // Required for Alloy-JS JSX transformation
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

Create `src/test/vitest.setup.ts`:

```typescript
import "@alloy-js/core/testing";
```

This loads custom Vitest matchers (`toRenderTo`, `toStrictEqualOutput`, etc.).

## Running Tests

```bash
bun test          # Watch mode
bunx vitest run   # Single run
bunx vitest run src/test/components-basic.test.tsx  # Run specific file
```

## Building

```bash
bunx alloy build   # Build emitter
bunx tsc --noEmit  # Type check only
```

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
      <SourceFile path="test.go">
        {/* content */}
      </SourceFile>
    </SourceDirectory>
  </ModuleDirectory>
</Output>
```

### Issue: TypeScript compilation errors

**Symptom**: Type errors when running `tsc --noEmit`

**Solution**: Ensure all imports are correct and types are available

## Architecture

### Component Hierarchy

```
Output
  └─ ModuleDirectory (@alloy-js/go)
      └─ SourceDirectory (@alloy-js/go)
          └─ SourceFile (@alloy-js/go)
              └─ [Go Components]
```

### Domain Layer

- **Location**: `src/domain/`
- **Purpose**: Single source of truth for type mapping
- **Key Component**: `CleanTypeMapper`
- **Usage**: Import into components, use `CleanTypeMapper.mapTypeSpecType()`

### Component Pattern

```tsx
import { renderGoContent } from "../testing/test-utils.js";

const output = renderGoContent(<MyComponent />);
expect(output).toContain("expected output");
```

`renderGoContent()` automatically wraps content in proper directory structure.
