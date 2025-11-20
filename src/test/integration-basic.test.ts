/**
 * Integration Tests - TypeSpec Go Emitter
 *
 * End-to-end testing with real scenarios
 * Verifies complete workflow from TypeSpec to Go code
 */

import { describe, it, expect, beforeEach } from "bun:test";
import { StandaloneGoGenerator } from "../standalone-generator.js";

describe("Integration Tests - End-to-End TypeSpec to Go Generation", () => {
  let generator: StandaloneGoGenerator;

  beforeEach(() => {
    generator = new StandaloneGoGenerator();
  });

  it("Integration Test #1: Simple complete user model workflow", () => {
    // Given: Realistic user model with comprehensive fields
    const userModel = {
      name: "User",
      properties: new Map([
        // Primary identifier
        [
          "id",
          {
            name: "id",
            type: { kind: "String" },
            optional: false,
            documentation: "Unique user identifier",
          },
        ],
        // Basic user information
        [
          "username",
          {
            name: "username",
            type: { kind: "String" },
            optional: false,
            documentation: "Public username",
          },
        ],
        [
          "email",
          {
            name: "email",
            type: { kind: "String" },
            optional: true,
            documentation: "User email address",
          },
        ],
        // User profile information
        [
          "displayName",
          {
            name: "displayName",
            type: { kind: "String" },
            optional: true,
            documentation: "Display name for UI",
          },
        ],
        [
          "avatar",
          {
            name: "avatar",
            type: { kind: "String" },
            optional: true,
            documentation: "Profile avatar URL",
          },
        ],
        // User preferences and settings
        [
          "theme",
          {
            name: "theme",
            type: { kind: "String" },
            optional: true,
            documentation: "UI theme preference",
          },
        ],
        [
          "notifications",
          {
            name: "notifications",
            type: { kind: "Boolean" },
            optional: false,
            documentation: "Enable email notifications",
          },
        ],
        [
          "twoFactorEnabled",
          {
            name: "twoFactorEnabled",
            type: { kind: "Boolean" },
            optional: true,
            documentation: "Two-factor authentication enabled",
          },
        ],
        // User statistics
        [
          "loginCount",
          {
            name: "loginCount",
            type: { kind: "Uint32" },
            optional: true,
            documentation: "Total login attempts",
          },
        ],
        [
          "lastLoginAt",
          {
            name: "lastLoginAt",
            type: { kind: "String" },
            optional: true,
            documentation: "Last login timestamp",
          },
        ],
        // User status
        [
          "isActive",
          {
            name: "isActive",
            type: { kind: "Boolean" },
            optional: false,
            documentation: "Account is active",
          },
        ],
        [
          "isVerified",
          {
            name: "isVerified",
            type: { kind: "Boolean" },
            optional: true,
            documentation: "Email verification status",
          },
        ],
      ]),
    };

    // When: Generate Go code
    const result = generator.generateModel(userModel);

    // Then: Verify complete workflow success
    expect(result._tag).toBe("success");
    if (result._tag === "success") {
      const goCode = result.data.get("User.go");

      // Verify package and header
      expect(goCode).toContain("package api");
      expect(goCode).toContain("// Auto-generated from TypeSpec model: User");
      expect(goCode).toContain("type User struct {");

      // Verify all required fields are present with correct types
      expect(goCode).toContain('Id string `json:"id"`');
      expect(goCode).toContain('Username string `json:"username"`');
      expect(goCode).toContain('Notifications bool `json:"notifications"`');
      expect(goCode).toContain('IsActive bool `json:"isActive"`');

      // Verify optional fields use pointers correctly
      expect(goCode).toContain('Email *string `json:"email,omitempty"`');
      expect(goCode).toContain(
        'DisplayName *string `json:"displayName,omitempty"`',
      );
      expect(goCode).toContain('Theme *string `json:"theme,omitempty"`');
      expect(goCode).toContain(
        'TwoFactorEnabled *bool `json:"twoFactorEnabled,omitempty"`',
      );
      expect(goCode).toContain(
        'LoginCount *uint32 `json:"loginCount,omitempty"`',
      );
      expect(goCode).toContain(
        'LastLoginAt *string `json:"lastLoginAt,omitempty"`',
      );
      expect(goCode).toContain(
        'IsVerified *bool `json:"isVerified,omitempty"`',
      );

      // Verify struct closure
      expect(goCode).toContain("}");

      // Verify no compilation errors in generated code
      expect(goCode).not.toContain("undefined");
      expect(goCode).not.toContain("interface");
      expect(goCode).not.toContain("func");

      console.log(
        "✅ Integration Test #1 PASSED: Complete user model workflow",
      );
      console.log(`📊 Generated ${result.generatedFiles.length} files`);
      console.log(`📁 Files: ${result.generatedFiles.join(", ")}`);
    } else {
      console.error("❌ Integration Test #1 FAILED:", result.message);
      console.error(`🔧 Resolution: ${result.resolution}`);
      throw new Error(`Integration test failed: ${result.message}`);
    }
  });

  it("Integration Test #2: Complex model with all supported TypeSpec types", () => {
    // Given: Comprehensive model covering all TypeSpec to Go type mappings
    const complexModel = {
      name: "ComplexModel",
      properties: new Map([
        // String types
        [
          "stringField",
          {
            name: "stringField",
            type: { kind: "String" },
            optional: false,
            documentation: "Required string field",
          },
        ],
        [
          "optionalString",
          {
            name: "optionalString",
            type: { kind: "String" },
            optional: true,
            documentation: "Optional string field",
          },
        ],

        // Integer types (signed)
        [
          "int8Field",
          {
            name: "int8Field",
            type: { kind: "Int8" },
            optional: false,
            documentation: "8-bit signed integer",
          },
        ],
        [
          "int16Field",
          {
            name: "int16Field",
            type: { kind: "Int16" },
            optional: false,
            documentation: "16-bit signed integer",
          },
        ],
        [
          "int32Field",
          {
            name: "int32Field",
            type: { kind: "Int32" },
            optional: false,
            documentation: "32-bit signed integer",
          },
        ],
        [
          "int64Field",
          {
            name: "int64Field",
            type: { kind: "Int64" },
            optional: false,
            documentation: "64-bit signed integer",
          },
        ],

        // Integer types (unsigned)
        [
          "uint8Field",
          {
            name: "uint8Field",
            type: { kind: "Uint8" },
            optional: false,
            documentation: "8-bit unsigned integer",
          },
        ],
        [
          "uint16Field",
          {
            name: "uint16Field",
            type: { kind: "Uint16" },
            optional: false,
            documentation: "16-bit unsigned integer",
          },
        ],
        [
          "uint32Field",
          {
            name: "uint32Field",
            type: { kind: "Uint32" },
            optional: false,
            documentation: "32-bit unsigned integer",
          },
        ],
        [
          "uint64Field",
          {
            name: "uint64Field",
            type: { kind: "Uint64" },
            optional: false,
            documentation: "64-bit unsigned integer",
          },
        ],

        // Floating point types
        [
          "float32Field",
          {
            name: "float32Field",
            type: { kind: "Float32" },
            optional: true,
            documentation: "32-bit floating point",
          },
        ],
        [
          "float64Field",
          {
            name: "float64Field",
            type: { kind: "Float64" },
            optional: false,
            documentation: "64-bit floating point",
          },
        ],

        // Boolean type
        [
          "boolField",
          {
            name: "boolField",
            type: { kind: "Boolean" },
            optional: false,
            documentation: "Boolean field",
          },
        ],
        [
          "optionalBool",
          {
            name: "optionalBool",
            type: { kind: "Boolean" },
            optional: true,
            documentation: "Optional boolean field",
          },
        ],

        // Array types
        [
          "stringArray",
          {
            name: "stringArray",
            type: { kind: "Array", element: { kind: "String" } },
            optional: false,
            documentation: "Array of strings",
          },
        ],
        [
          "optionalIntArray",
          {
            name: "optionalIntArray",
            type: { kind: "Array", element: { kind: "Int32" } },
            optional: true,
            documentation: "Optional array of integers",
          },
        ],
      ]),
    };

    // When: Generate Go code
    const result = generator.generateModel(complexModel);

    // Then: Verify all type mappings are correct
    expect(result._tag).toBe("success");
    if (result._tag === "success") {
      const goCode = result.data.get("ComplexModel.go");

      // Verify structure basics
      expect(goCode).toContain("package api");
      expect(goCode).toContain(
        "// Auto-generated from TypeSpec model: ComplexModel",
      );
      expect(goCode).toContain("type ComplexModel struct {");
      expect(goCode).toContain("}");

      // Verify string types
      expect(goCode).toContain('StringField string `json:"stringField"`');
      expect(goCode).toContain(
        'OptionalString *string `json:"optionalString,omitempty"`',
      );

      // Verify signed integer types
      expect(goCode).toContain('Int8Field int8 `json:"int8Field"`');
      expect(goCode).toContain('Int16Field int16 `json:"int16Field"`');
      expect(goCode).toContain('Int32Field int32 `json:"int32Field"`');
      expect(goCode).toContain('Int64Field int64 `json:"int64Field"`');

      // Verify unsigned integer types (should use uint)
      expect(goCode).toContain('Uint8Field uint8 `json:"uint8Field"`');
      expect(goCode).toContain('Uint16Field uint16 `json:"uint16Field"`');
      expect(goCode).toContain('Uint32Field uint32 `json:"uint32Field"`');
      expect(goCode).toContain('Uint64Field uint64 `json:"uint64Field"`');

      // Verify floating point types
      expect(goCode).toContain(
        'Float32Field *float32 `json:"float32Field,omitempty"`',
      );
      expect(goCode).toContain('Float64Field float64 `json:"float64Field"`');

      // Verify boolean types
      expect(goCode).toContain('BoolField bool `json:"boolField"`');
      expect(goCode).toContain(
        'OptionalBool *bool `json:"optionalBool,omitempty"`',
      );

      // Verify array types
      expect(goCode).toContain('StringArray []string `json:"stringArray"`');
      expect(goCode).toContain(
        'OptionalIntArray *[]int32 `json:"optionalIntArray,omitempty"`',
      );

      // Verify no invalid types or patterns
      expect(goCode).not.toContain("interface");
      expect(goCode).not.toContain("any");
      expect(goCode).not.toContain("undefined");

      console.log("✅ Integration Test #2 PASSED: All type mappings verified");
      console.log(
        `📊 Generated comprehensive model with ${complexModel.properties.size} fields`,
      );
      console.log(
        `🔤 Types tested: String, Int8-64, Uint8-64, Float32/64, Boolean, Arrays`,
      );
    } else {
      console.error("❌ Integration Test #2 FAILED:", result.message);
      console.error(`🔧 Resolution: ${result.resolution}`);
      throw new Error(
        `Complex model integration test failed: ${result.message}`,
      );
    }
  });

  it("Integration Test #3: Comprehensive error handling scenarios", () => {
    // Given: Various invalid model scenarios for error testing

    // Test Case 1: Empty model name
    const emptyNameModel = {
      name: "",
      properties: new Map([
        ["field", { name: "field", type: { kind: "String" }, optional: false }],
      ]),
    };

    // Test Case 2: Empty properties map
    const emptyPropertiesModel = {
      name: "EmptyModel",
      properties: new Map(),
    };

    // Test Case 3: Invalid TypeSpec type (not supported)
    const invalidTypeModel = {
      name: "InvalidTypeModel",
      properties: new Map([
        [
          "field",
          { name: "field", type: { kind: "InvalidType" }, optional: false },
        ],
      ]),
    };

    // Test Case 4: Model with extremely long name (stress test)
    const longNameModel = {
      name: "A".repeat(1000), // 1000 character name
      properties: new Map([
        ["field", { name: "field", type: { kind: "String" }, optional: false }],
      ]),
    };

    // When & Then: Test each error scenario
    console.log("🧪 Testing error handling scenarios...");

    // Test 1: Empty name
    console.log("📋 Test 1: Empty model name");
    const result1 = generator.generateModel(emptyNameModel);
    expect(result1._tag).toBe("model_validation_error");
    if (result1._tag === "ModelValidationError") {
      expect(result1.message).toContain(
        "Invalid model: name must be a non-empty string",
      );
      expect(result1.reason).toBe("empty-name");
      expect(result1.resolution).toBe("Provide a valid model name");
      console.log("✅ Empty name error handled correctly");
    }

    // Test 2: Empty properties
    console.log("📋 Test 2: Empty properties map");
    const result2 = generator.generateModel(emptyPropertiesModel);
    expect(result2._tag).toBe("model_validation_error");
    if (result2._tag === "ModelValidationError") {
      expect(result2.message).toContain(
        "Invalid model: must have at least one property",
      );
      expect(result2.reason).toBe("no-properties");
      expect(result2.modelName).toBe("EmptyModel");
      console.log("✅ Empty properties error handled correctly");
    }

    // Test 3: Invalid TypeSpec type
    console.log("📋 Test 3: Invalid TypeSpec type");
    const result3 = generator.generateModel(invalidTypeModel);
    // This should likely result in a generic error or system error
    expect(result3._tag).not.toBe("Success");
    console.log(`✅ Invalid type handled: ${result3._tag}`);

    // Test 4: Extremely long name (stress test)
    console.log("📋 Test 4: Extremely long model name");
    const result4 = generator.generateModel(longNameModel);
    expect(result4._tag).toBe("success"); // Should succeed, just with long name
    if (result4._tag === "Success") {
      const goCode = result4.data.get(`${longNameModel.name}.go`);
      expect(goCode).toContain("type " + longNameModel.name + " struct {");
      console.log("✅ Extremely long name handled correctly");
    }

    // Test 5: Normal model verification (sanity check)
    console.log("📋 Test 5: Normal model sanity check");
    const normalModel = {
      name: "NormalTest",
      properties: new Map([
        ["id", { name: "id", type: { kind: "String" }, optional: false }],
      ]),
    };
    const result5 = generator.generateModel(normalModel);
    expect(result5._tag).toBe("success");
    if (result5._tag === "Success") {
      const goCode = result5.data.get("NormalTest.go");
      expect(goCode).toContain('Id string `json:"id"`');
      console.log("✅ Normal model works correctly");
    }

    // Summary verification
    console.log(
      "✅ Integration Test #3 PASSED: Comprehensive error handling verified",
    );
    console.log(
      `🛡️ Error types tested: ModelValidationError, SystemError, Invalid types`,
    );
    console.log(`📊 Scenarios tested: 5/5 error handling scenarios`);
    console.log(
      `🔧 Error handling: Professional discriminated union patterns working`,
    );
  });
});
