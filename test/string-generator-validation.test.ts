/**
 * Validate String Generator Using Working Baseline
 * 
 * Tests SimpleGoGenerator + GoTypeMapper integration
 * Uses existing working test infrastructure
 */
import { strictEqual } from "node:assert";
import { describe, it } from "node:test";

// Test string generator directly without complex integration
import { SimpleGoGenerator } from "../src/simple-generator.js";

describe("TypeSpec Go Emitter - String Generator Validation", () => {
  it("can generate Go struct from TypeSpec model", () => {
    // Create mock model matching TypeSpec structure
    const mockModel = {
      name: "User",
      properties: new Map([
        ["name", {
          name: "name",
          type: { kind: "String" },
          optional: false
        }],
        ["age", {
          name: "age", 
          type: { kind: "Int32" },
          optional: false
        }],
        ["email", {
          name: "email",
          type: { kind: "String" },
          optional: true
        }],
        ["active", {
          name: "active",
          type: { kind: "Boolean" },
          optional: false
        }]
      ])
    };
    
    // Generate Go code
    const generator = new SimpleGoGenerator();
    const goCode = generator.generateModel(mockModel);
    
    console.log("📄 Generated Go code:");
    console.log(goCode);
    
    // Basic validation
    const hasPackage = goCode.includes("package");
    const hasTypeStruct = goCode.includes("type User struct");
    const hasNameField = goCode.includes("Name string");
    const hasAgeField = goCode.includes("Age int32");
    const hasEmailField = goCode.includes("Email *string");
    const hasActiveField = goCode.includes("Active bool");
    const hasJsonTags = goCode.includes('json:');
    
    console.log("🔍 Validations:");
    console.log(`  📦 Has package: ${hasPackage}`);
    console.log(`  🏗️ Has type struct: ${hasTypeStruct}`);
    console.log(`  📝 Has name field: ${hasNameField}`);
    console.log(`  🔢 Has age field: ${hasAgeField}`);
    console.log(`  📧 Has email field: ${hasEmailField}`);
    console.log(`  ✅ Has active field: ${hasActiveField}`);
    console.log(`  🏷️ Has JSON tags: ${hasJsonTags}`);
    
    // Check all required elements
    strictEqual(hasPackage, true, "Should have package declaration");
    strictEqual(hasTypeStruct, true, "Should generate User struct");
    strictEqual(hasNameField, true, "Should generate Name field");
    strictEqual(hasAgeField, true, "Should generate Age field");
    strictEqual(hasEmailField, true, "Should generate Email field with pointer");
    strictEqual(hasActiveField, true, "Should generate Active field");
    strictEqual(hasJsonTags, true, "Should generate JSON tags");
    
    // Check optional property pointer
    strictEqual(goCode.includes("*string"), true, "Optional email should be pointer");
    
    // Check JSON omitempty for optional
    strictEqual(goCode.includes('omitempty'), true, "Optional email should have omitempty");
    
    console.log("✅ String generator validation successful!");
  });
});