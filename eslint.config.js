// @ts-check
import eslint from "@eslint/js";
import tsEslint from "typescript-eslint";

export default [
  {
    ignores: ["**/dist/**/*", "**/.temp/**/*", "**/node_modules/**/*"],
  },
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
];
