import { test, expect } from "vitest";
import { GoPackageDirectory } from "../components/go/GoPackageDirectory.js";
import { Output, refkey } from "@alloy-js/core";

/**
 * Test that components work in proper Alloy-JS context
 */
test("Component Integration - Proper Context", async () => {
  // Test with proper Output wrapper (provides context)
  const mockModel = {
    name: "TestUser",
    kind: "Model",
    properties: new Map([
      ["id", { name: "id", type: { kind: "String" }, optional: false }],
      ["name", { name: "name", type: { kind: "String" }, optional: false }],
      ["age", { name: "age", type: { kind: "Scalar", name: "int32" }, optional: true }],
    ]),
  };

  try {
    // Test components work inside proper Output context
    const result = await import("@alloy-js/core").then(({ render }) =>
      render(
        <Output>
          <GoPackageDirectory
            models={[mockModel as any]}
            packageName="test"
            packageDocumentation="Test package"
          />
        </Output>,
      ),
    );

    console.log("✅ Component rendering successful in proper context");
    console.log("📄 Result type:", typeof result);

    // The key test: components should work in proper context
    expect(result).toBeDefined();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log("❌ Component failed in context:", errorMessage);
    throw error;
  }
});
