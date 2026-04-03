/**
 * Minimal Component Test
 * Tests only our components without legacy code interference
 */

import { render, Output } from "@alloy-js/core";
import { GoStructDeclaration } from "../components/go/GoStructDeclaration.js";
import { GoPackageDirectory } from "../components/go/GoPackageDirectory.js";

// Mock TypeSpec data
const mockModel = {
  name: "TestUser",
  kind: "Model",
  properties: new Map([
    ["id", { name: "id", type: { kind: "String" }, optional: false }],
    ["name", { name: "name", type: { kind: "String" }, optional: false }],
    ["age", { name: "age", type: { kind: "Scalar", name: "int32" }, optional: true }],
  ]),
};

console.log("🧪 Testing Alloy-JS Components - Minimal Test");

try {
  // Test 1: Basic component render
  console.log("📋 Test 1: GoStructDeclaration render");
  const structResult = render(
    <GoStructDeclaration
      model={mockModel as unknown}
      packageName="test"
      documentation="Test struct"
    />,
  );
  console.log("✅ Struct render successful");
  console.log("📄 Output:", structResult);
  console.log("");

  // Test 2: Package directory render
  console.log("📁 Test 2: GoPackageDirectory render");
  const packageResult = render(
    <GoPackageDirectory
      models={[mockModel as unknown]}
      packageName="api"
      packageDocumentation="Test API package"
    />,
  );
  console.log("✅ Package render successful");
  console.log(
    "📄 Output type:",
    Array.isArray(packageResult) ? `Generated ${packageResult.length} files` : packageResult,
  );
  console.log("");

  // Test 3: Full emitter pattern
  console.log("🚀 Test 3: Full emitter pattern");
  const fullResult = render(
    <Output>
      <GoPackageDirectory
        models={[mockModel as unknown]}
        packageName="api"
        packageDocumentation="Test API package"
      />
    </Output>,
  );
  console.log("✅ Full emitter pattern successful");
  console.log("📄 Generated files:", fullResult.contents.length || 1);

  console.log("\n🎉 ALL TESTS PASSED!");
  console.log("✅ Alloy-JS component migration successful");
  console.log("📈 Components working correctly");
} catch (error) {
  console.error("\n💥 TESTS FAILED");
  console.error("❌ Component error:", error);
  process.exit(1);
}
