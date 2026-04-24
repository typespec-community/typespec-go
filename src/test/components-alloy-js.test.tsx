/**
 * Test our Alloy-JS Go components
 * Validates basic component functionality with proper Output context
 */

import { expect, test } from "vitest";
import { render, Output } from "@alloy-js/core";
import { ModuleDirectory, SourceDirectory, SourceFile } from "@alloy-js/go";
import { GoPackageDirectory } from "../components/go/GoPackageDirectory.js";
import { GoStructDeclaration } from "../components/go/GoStructDeclaration.js";

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
  // Must wrap in Output to provide Alloy-JS binder context
  const result = render(
    <Output basePath="./">
      <GoPackageDirectory
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        models={[mockModel as any]}
        packageName="test"
        packageDocumentation="Test package"
      />
    </Output>,
  );

  // Should render successfully without throwing
  expect(result).toBeDefined();
});

test("GoStructDeclaration renders without errors", async () => {
  // GoStructDeclaration uses @alloy-js/go components which require Go scope context
  // Must wrap in Output + Go module structure to provide proper scope
  const result = render(
    <Output basePath="./">
      <ModuleDirectory name="github.com/test/api">
        <SourceDirectory path="api">
          <SourceFile path="models.go">
            <GoStructDeclaration
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              model={mockModel as any}
              packageName="test"
              documentation="Test struct"
            />
          </SourceFile>
        </SourceDirectory>
      </ModuleDirectory>
    </Output>,
  );

  // Should render successfully without throwing
  expect(result).toBeDefined();
});
