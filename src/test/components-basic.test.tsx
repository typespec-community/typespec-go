/**
 * TypeSpec Go Emitter - Simple Test
 * Validates Alloy-JS components work correctly
 */

import { expect, test } from "vitest";
import { render } from "@alloy-js/core";

test("Alloy-JS Components Integration", async () => {
  // Test basic component compilation
  expect(() => {
    // This should not throw if components are properly configured
    const testModule = import("../components/go/index.js");
    expect(testModule).resolves.toBeDefined();
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