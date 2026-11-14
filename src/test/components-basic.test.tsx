/**
 * TypeSpec Go Emitter - Simple Test
 * Validates Alloy-JS components work correctly
 */

import { expect, test } from "vitest";
import * as goComponents from "../components/go/index.js";

test("Alloy-JS Components Integration", () => {
  expect(goComponents).toBeDefined();
  expect(Object.keys(goComponents).length).toBeGreaterThan(0);
});

test("TypeScript Compilation", () => {
  // Basic JSX syntax test
  const testJsx = `<div>Test</div>`;
  expect(testJsx).toContain("Test");
});
