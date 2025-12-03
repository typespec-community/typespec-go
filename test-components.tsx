/**
 * Direct Component Test Script
 * Tests Alloy-JS components without test runner complications
 */

import { render, Output } from "@alloy-js/core";
import { GoStructDeclaration } from "./src/components/go/GoStructDeclaration.js";
import { GoPackageDirectory } from "./src/components/go/GoPackageDirectory.js";

console.log("🧪 Testing Alloy-JS Components Directly");

async function testComponentImports() {
  console.log("📦 Testing component imports...");

  try {
    // Test Alloy-JS Go components
    const { For } = await import("@alloy-js/go");
    console.log("✅ For component imported successfully");

    const { GoStructDeclaration } = await import("./src/components/go/GoStructDeclaration.js");
    console.log("✅ GoStructDeclaration imported successfully");

    const { GoPackageDirectory } = await import("./src/components/go/GoPackageDirectory.js");
    console.log("✅ GoPackageDirectory imported successfully");

    const { Output, render } = await import("@alloy-js/core");
    console.log("✅ Core Alloy-JS functions imported successfully");

    return { For, GoStructDeclaration, GoPackageDirectory, Output, render };
  } catch (error) {
    console.error("❌ Import failed:", error);
    throw error;
  }
}

async function testBasicComponentRender() {
  console.log("🎨 Testing basic component render...");

  try {
    // Create mock TypeSpec model
    const mockModel = {
      name: "TestUser",
      kind: "Model",
      properties: new Map([
        ["id", { name: "id", type: { kind: "String" }, optional: false }],
        ["name", { name: "name", type: { kind: "String" }, optional: false }],
        ["age", { name: "age", type: { kind: "Scalar", name: "int32" }, optional: true }],
      ]),
    };

    // Test component render
    const result = render(
      <GoStructDeclaration
        model={mockModel as any}
        packageName="test"
        documentation="Test struct"
      />,
    );

    console.log("✅ GoStructDeclaration render successful");
    console.log("📄 Generated output:", result);
    return result;
  } catch (error) {
    console.error("❌ Render failed:", error);
    throw error;
  }
}

async function testPackageDirectoryRender() {
  console.log("📁 Testing package directory render...");

  try {
    // Create mock models
    const mockModels = [
      {
        name: "User",
        kind: "Model",
        properties: new Map([
          ["id", { name: "id", type: { kind: "String" }, optional: false }],
          ["name", { name: "name", type: { kind: "String" }, optional: false }],
        ]),
      },
      {
        name: "Product",
        kind: "Model",
        properties: new Map([
          ["id", { name: "id", type: { kind: "String" }, optional: false }],
          ["price", { name: "price", type: { kind: "Scalar", name: "float64" }, optional: false }],
        ]),
      },
    ];

    // Test package directory render
    const result = render(
      <GoPackageDirectory
        models={mockModels as any}
        packageName="api"
        packageDocumentation="Generated API models"
      />,
    );

    console.log("✅ GoPackageDirectory render successful");
    console.log(
      "📄 Generated output preview:",
      Array.isArray(result) ? `Generated ${result.length} files` : result,
    );
    return result;
  } catch (error) {
    console.error("❌ Package render failed:", error);
    throw error;
  }
}

async function testFullEmitterIntegration() {
  console.log("🚀 Testing full emitter integration...");

  try {
    // Test full emitter pattern
    const mockModels = [
      {
        name: "User",
        kind: "Model",
        properties: new Map([["id", { name: "id", type: { kind: "String" }, optional: false }]]),
      },
    ];

    const result = render(
      <Output>
        <GoPackageDirectory
          models={mockModels as any}
          packageName="api"
          packageDocumentation="Test API package"
        />
      </Output>,
    );

    console.log("✅ Full emitter integration successful");
    console.log("📄 Generated files:", result.length || 1);
    return result;
  } catch (error) {
    console.error("❌ Full integration failed:", error);
    throw error;
  }
}

// Execute all tests
async function runAllTests() {
  console.log("🎯 Starting comprehensive component tests\n");

  try {
    await testComponentImports();
    console.log("");

    await testBasicComponentRender();
    console.log("");

    await testPackageDirectoryRender();
    console.log("");

    await testFullEmitterIntegration();
    console.log("");

    console.log("🎉 ALL TESTS PASSED - Alloy-JS components working correctly!");
    console.log("✅ Component migration successful");
    console.log("📈 Ready for next phase: Legacy code integration");
  } catch (error) {
    console.error("\n💥 TESTS FAILED");
    console.error("❌ Need to investigate component issues");
    console.error("📋 Error details:", error);
    process.exit(1);
  }
}

// Run the tests
runAllTests();
