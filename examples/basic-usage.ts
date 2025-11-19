/**
 * TypeSpec Go Emitter - Basic Usage Example
 *
 * Demonstrates the correct API usage patterns for GoEmitterResult handling
 * with discriminated unions and professional error handling
 */

import { StandaloneGoGenerator } from "../src/standalone-generator.js";
import type { GoEmitterResult } from "../src/domain/unified-errors.js";

/**
 * Example 1: Basic Go struct generation
 * Shows the correct way to handle GoEmitterResult
 */
function generateUserStruct(): void {
  console.log("🏗️ Example 1: Basic Go struct generation");
  
  const generator = new StandaloneGoGenerator();
  
  const user = {
    name: "User",
    properties: new Map([
      ["id", { name: "id", type: { kind: "String" }, optional: false }],
      ["name", { name: "name", type: { kind: "String" }, optional: false }],
      ["email", { name: "email", type: { kind: "String" }, optional: true }],
      ["age", { name: "age", type: { kind: "Uint8" }, optional: true }],
    ]),
  };

  // Generate Go code using professional discriminated union pattern
  const result: GoEmitterResult = generator.generateModel(user);

  // Handle result using discriminated union - PROFESSIONAL PATTERN
  if (result._tag === "Success") {
    const goCode = result.data.get("User.go");
    console.log("✅ Success - Generated Go code:");
    console.log(goCode);
    console.log(`📁 Generated files: ${result.generatedFiles.join(", ")}`);
  } else {
    console.error("❌ Error:", result.message);
    console.log(`🔧 Resolution: ${result.resolution}`);
    if ("modelName" in result) {
      console.log(`📋 Model: ${result.modelName}`);
    }
  }
}

/**
 * Example 2: Complex model with various types
 * Demonstrates handling all supported TypeSpec types
 */
function generateProductStruct(): void {
  console.log("\n🏗️ Example 2: Complex model with various types");
  
  const generator = new StandaloneGoGenerator();
  
  const product = {
    name: "Product",
    properties: new Map([
      ["id", { name: "id", type: { kind: "String" }, optional: false }],
      ["name", { name: "name", type: { kind: "String" }, optional: false }],
      ["price", { name: "price", type: { kind: "Float64" }, optional: false }],
      ["quantity", { name: "quantity", type: { kind: "Uint16" }, optional: false }],
      ["inStock", { name: "inStock", type: { kind: "Boolean" }, optional: false }],
      ["tags", { 
        name: "tags", 
        type: { kind: "Array", element: { kind: "String" } }, 
        optional: true 
      }],
      ["rating", { name: "rating", type: { kind: "Float32" }, optional: true }],
    ]),
  };

  const result: GoEmitterResult = generator.generateModel(product);

  // Handle result with railway programming pattern
  if (result._tag === "Success") {
    const goCode = result.data.get("Product.go");
    console.log("✅ Success - Generated Go code:");
    console.log(goCode);
  } else {
    console.error("❌ Generation failed:", result.message);
    // Handle different error types appropriately
    switch (result._tag) {
      case "ModelValidationError":
        console.log("🔧 Model validation error - check your TypeSpec model");
        break;
      case "GoCodeGenerationError":
        console.log("🔧 Code generation error - check type mappings");
        break;
      case "TypeSpecCompilerError":
        console.log("🔧 TypeSpec compiler error - check TypeSpec syntax");
        break;
      default:
        console.log("🔧 Unknown error type");
    }
  }
}

/**
 * Example 3: Error handling patterns
 * Shows how to handle invalid models and different error types
 */
function demonstrateErrorHandling(): void {
  console.log("\n🏗️ Example 3: Error handling patterns");
  
  const generator = new StandaloneGoGenerator();
  
  // Invalid model - empty name
  const invalidModel = {
    name: "", // Invalid empty name
    properties: new Map(),
  };

  const result: GoEmitterResult = generator.generateModel(invalidModel);

  // Professional error handling with type guards
  if (result._tag === "Success") {
    console.log("✅ Unexpected success - model should have failed");
  } else {
    console.log("✅ Expected error caught:");
    console.error(`❌ Error: ${result.message}`);
    console.log(`🔧 Resolution: ${result.resolution}`);
    
    // Type-safe error handling using discriminated union
    if (result._tag === "ModelValidationError") {
      console.log(`📋 Model validation failed for: ${result.modelName}`);
      console.log(`🏷️  Error reason: ${result.reason}`);
    }
  }
}

/**
 * Example 4: Railway programming pattern
 * Shows functional programming approach for error handling
 */
function demonstrateRailwayProgramming(): void {
  console.log("\n🏗️ Example 4: Railway programming pattern");
  
  const generator = new StandaloneGoGenerator();
  
  // Helper function for railway programming
  const processResult = (result: GoEmitterResult): string => {
    if (result._tag === "Success") {
      return `✅ Generated ${result.generatedFiles.length} files`;
    } else {
      return `❌ Error: ${result.message}`;
    }
  };
  
  const order = {
    name: "Order",
    properties: new Map([
      ["id", { name: "id", type: { kind: "String" }, optional: false }],
      ["total", { name: "total", type: { kind: "Float64" }, optional: false }],
      ["items", { 
        name: "items", 
        type: { kind: "Array", element: { kind: "String" } }, 
        optional: false 
      }],
    ]),
  };
  
  const result = generator.generateModel(order);
  const message = processResult(result);
  
  console.log(message);
}

// Run all examples
console.log("🚀 TypeSpec Go Emitter - Basic Usage Examples");
console.log("=" .repeat(50));

generateUserStruct();
generateProductStruct();
demonstrateErrorHandling();
demonstrateRailwayProgramming();

console.log("\n" + "=".repeat(50));
console.log("✅ All examples completed successfully!");
console.log("📖 For more advanced usage, see the documentation and test files");