/**
 * Test our Alloy-JS Go components
 * Validates basic component functionality
 */

import { expect, test } from "vitest";
import { render } from "@alloy-js/core";
import { GoPackageDirectory } from "../components/go/index.js";

// Create a mock TypeSpec model for testing
const mockModel = {
  name: "TestUser",
  kind: "Model",
  properties: new Map([
    ["id", { name: "id", type: { kind: "String" }, optional: false }],
    ["name", { name: "name", type: { kind: "String" }, optional: false }],
    ["age", { name: "age", type: { kind: "Scalar", name: "int32" }, optional: true }],
  ]),
};

test("GoPackageDirectory renders without errors", async () => {
  const result = render(
    <GoPackageDirectory 
      models={[mockModel as any]}
      packageName="test"
      packageDocumentation="Test package"
    />
  );
  
  // Should render successfully without throwing
  expect(result).toBeDefined();
  expect(Array.isArray(result)).toBe(true);
});

test("GoStructDeclaration renders without errors", async () => {
  const { GoStructDeclaration } = await import("../components/go/GoStructDeclaration.js");
  
  const result = render(
    <GoStructDeclaration 
      model={mockModel as any}
      packageName="test"
      documentation="Test struct"
    />
  );
  
  // Should render successfully without throwing
  expect(result).toBeDefined();
});