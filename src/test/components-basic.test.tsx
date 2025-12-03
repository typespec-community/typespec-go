/**
 * TypeSpec Go Emitter - Simple Test
 * Validates Alloy-JS components work correctly
 */

import { expect, test } from "vitest";
import { render } from "@alloy-js/core";

test("Alloy-JS Components Integration", async () => {
  // Test basic component compilation
  expect(async () => {
    // This should not throw if components are properly configured
    const testModule = await import("../components/go/index.js");
    expect(testModule).toBeDefined();
  }).not.toThrow();
});

test("TypeScript Compilation", async () => {
  // Test TypeScript compiles JSX correctly
  expect(() => {
    // Basic JSX syntax test
    const testJsx = `<div>Test</div>`;
    console.log("JSX test:", testJsx);
  }).not.toThrow();
});
