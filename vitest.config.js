import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/test/**/*.test.ts", "src/test/**/*.test.tsx"],
    exclude: ["src/test/**/*.d.ts"],
    environment: "node",
  },
  esbuild: {
    jsx: "preserve",  // Preserve JSX to match tsconfig.json
    sourcemap: "both"
  },
});