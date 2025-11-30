/**
 * Isolated Component Test
 * Tests Alloy-JS components without legacy code interference
 */

import { expect, test } from "vitest";
import { render } from "@alloy-js/core";

test("Alloy-JS For component import", async () => {
  // Test we can import For component from @alloy-js/core
  const { For } = await import("@alloy-js/core");
  expect(For).toBeDefined();
});

test("GoStructDeclaration component import", async () => {
  // Test our component imports correctly
  const { GoStructDeclaration } = await import("../components/go/GoStructDeclaration.js");
  expect(GoStructDeclaration).toBeDefined();
});

test("GoPackageDirectory component import", async () => {
  // Test our component imports correctly
  const { GoPackageDirectory } = await import("../components/go/GoPackageDirectory.js");
  expect(GoPackageDirectory).toBeDefined();
});

test("Component index exports", async () => {
  // Test component index exports work
  const { GoStructDeclaration, GoPackageDirectory, For } = await import("../components/go/index.js");
  expect(GoStructDeclaration).toBeDefined();
  expect(GoPackageDirectory).toBeDefined();
  expect(For).toBeDefined();
});