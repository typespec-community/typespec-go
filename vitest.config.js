import { defineConfig } from "vitest/config";
import alloyPlugin from "@alloy-js/rollup-plugin";

export default defineConfig({
  test: {
    include: ["src/test/**/*.test.ts", "src/test/**/*.test.tsx"],
    exclude: ["src/test/**/*.d.ts"],
    environment: "node",
  },
  esbuild: {
    jsx: "transform",
    jsxFactory: "jsx",
    jsxFragment: "Fragment",
    jsxInject: `import { jsx, Fragment } from "@alloy-js/core/jsx-runtime"`,
    sourcemap: "both",
  },
  resolve: {
    alias: {
      "@alloy-js/core/jsx-dev-runtime": "@alloy-js/core/jsx-runtime",
    },
  },
  plugins: [alloyPlugin()],
});
