import { test, expect } from "vitest";
import { StandaloneGoGenerator } from "../src/standalone-generator.js";

/**
 * Step 3: Create Working Integration Test
 *
 * This test validates that the TypeSpec integration works correctly
 * and serves as a foundation for further development.
 */
test("TypeSpec Integration - Basic Model Generation", async () => {
  // Arrange
  const generator = new StandaloneGoGenerator();

  // Create a simple test model (TypeSpec format)
  const testModel = {
    name: "User",
    properties: new Map([
      ["id", { name: "id", type: { kind: "String" }, optional: false }],
      ["name", { name: "name", type: { kind: "String" }, optional: false }],
      ["age", { name: "age", type: { kind: "Uint8" }, optional: true }],
    ]),
    isErrorModel: false,
  };

  // Act
  const result = generator.generateModel(testModel);

  // Assert
  console.log("🔍 Full result object:", result);

  if (result._tag === "success") {
    console.log("🔍 Result data keys:", Array.from(result.data.keys()));
    const goCode = result.data.get("User.go") || "";
    console.log("🔍 Go code length:", goCode.length);

    // Verify basic Go struct generation
    expect(goCode).toContain("type User struct {");
    expect(goCode).toContain("ID string");
    expect(goCode).toContain("Name string");
    expect(goCode).toContain("Age *uint8"); // Optional fields should be pointers
    expect(goCode).toContain("}");

    console.log("✅ Generated Go code:");
    console.log(goCode);
  } else {
    // If it fails, show the error
    console.error("❌ Failed to generate Go code:", result);
    throw new Error(`Expected success, but got error: ${result._tag}`);
  }
});

/**
 * Test that our AssetEmitter pattern works with basic integration
 */
test("TypeSpec Integration - AssetEmitter Pattern", async () => {
  // This test validates that the basic AssetEmitter approach works
  // We'll expand this to full TypeSpec compiler integration once basic types are fixed

  const generator = new StandaloneGoGenerator();
  const result = generator.generateModel({
    name: "TestModel",
    properties: new Map([["field", { name: "field", type: { kind: "String" }, optional: false }]]),
    isErrorModel: false,
  });

  // Should succeed and generate valid Go code
  if (result._tag === "success") {
    expect(result.data.get("TestModel.go")).toContain("type TestModel struct {");
    expect(result.data.get("model.go")).toContain("field string");
  } else {
    throw new Error(`Failed to generate TestModel: ${result._tag}`);
  }
});
