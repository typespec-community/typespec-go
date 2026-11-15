import { defineConfig } from "vitest/config";
import alloyPlugin from "@alloy-js/rollup-plugin";

export default defineConfig({
  test: {
    include: ["src/test/**/*.test.ts", "src/test/**/*.test.tsx"],
    exclude: ["src/test/**/*.d.ts"],
    setupFiles: ["./src/test/vitest.setup.ts"],
    environment: "node",
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      include: [
        "src/components/**",
        "src/domain/**",
        "src/emitter/**",
        "src/services/**",
        "src/utils/**",
      ],
      exclude: ["src/test/**", "src/testing/**", "**/*.d.ts"],
      thresholds: {
        statements: 45,
        branches: 35,
        functions: 53,
        lines: 45,
      },
    },
  },
  esbuild: {
    jsx: "preserve",
    sourcemap: "both",
  },
  resolve: {
    alias: {
      "@alloy-js/core/jsx-dev-runtime": "@alloy-js/core/jsx-runtime",
    },
  },
  plugins: [alloyPlugin()],
});
