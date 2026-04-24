import { defineConfig } from "vitest/config";
import alloyPlugin from "@alloy-js/rollup-plugin";

export default defineConfig({
  test: {
    include: ["src/test/**/*.test.ts", "src/test/**/*.test.tsx"],
    exclude: ["src/test/**/*.d.ts"],
    setupFiles: ["./src/test/vitest.setup.ts"],
    environment: "node",
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
