/**
 * Comprehensive Test for Complete TypeSpec Go Generator
 * 
 * REAL INTEGRATION TESTING: Tests actual Go code generation
 * BRUTAL HONESTY: Tests verify real output, not fake assertions
 * FUNCTIONAL TESTING: Complete end-to-end verification
 */

import { describe, it, expect, beforeEach } from "bun:test";
import { createTypeSpecGoGenerator, DEFAULT_GENERATION_CONFIG, GenerationContext } from "../generator.js";

describe("Complete TypeSpec Go Generator", () => {
  let generator: ReturnType<typeof createTypeSpecGoGenerator>;

  beforeEach(() => {
    generator = createTypeSpecGoGenerator({
      ...DEFAULT_GENERATION_CONFIG,
      context: GenerationContext.Standalone,
      packageName: 'test',
      includeGeneratedWarning: true
    });
  });

  describe("Given a simple TypeSpec model", () => {
    it("should generate valid Go struct with actual output", () => {
      // Given
      const model = {
        name: "User" as const,
        properties: new Map([
          ["name", { 
            name: "name", 
            type: { kind: "String" }, 
            optional: false 
          }],
          ["age", { 
            name: "age", 
            type: { kind: "Uint8" }, 
            optional: true 
          }]
        ])
      };

      // When
      const goCode = generator.generateModel(model);

      // Then - ACTUAL OUTPUT VERIFICATION
      expect(goCode).toBeDefined();
      expect(typeof goCode).toBe("string");
      expect(goCode).toContain("package test");
      expect(goCode).toContain("// Auto-generated from TypeSpec model");
      expect(goCode).toContain("type User struct {");
      expect(goCode).toContain('Name string `json:"name"`');
      expect(goCode).toContain('Age *uint8 `json:"age,omitempty"`');
      expect(goCode).toContain("}");
      
      // Verify it's valid Go syntax
      expect(goCode).toMatch(/package \w+/);
      expect(goCode).toMatch(/type \w+ struct \{[\s\S]*\}/);
    });

    it("should use proper uint for never-negative values", () => {
      // Given
      const model = {
        name: "Metrics" as const,
        properties: new Map([
          ["count", { 
            name: "count", 
            type: { kind: "Uint32" }, 
            optional: false 
          }],
          ["rating", { 
            name: "rating", 
            type: { kind: "Uint16" }, 
            optional: true 
          }]
        ])
      };

      // When
      const goCode = generator.generateModel(model);

      // Then - PROPER UINT USAGE
      expect(goCode).toContain("uint32");
      expect(goCode).toContain("uint16");
      expect(goCode).toContain("Count uint32");
      expect(goCode).toContain("Rating *uint16");
    });

    it("should handle all numeric types correctly", () => {
      // Given
      const model = {
        name: "Numbers" as const,
        properties: new Map([
          ["int8_val", { name: "int8_val", type: { kind: "Int8" }, optional: false }],
          ["int16_val", { name: "int16_val", type: { kind: "Int16" }, optional: false }],
          ["int32_val", { name: "int32_val", type: { kind: "Int32" }, optional: false }],
          ["int64_val", { name: "int64_val", type: { kind: "Int64" }, optional: false }],
          ["uint8_val", { name: "uint8_val", type: { kind: "Uint8" }, optional: false }],
          ["uint16_val", { name: "uint16_val", type: { kind: "Uint16" }, optional: false }],
          ["uint32_val", { name: "uint32_val", type: { kind: "Uint32" }, optional: false }],
          ["uint64_val", { name: "uint64_val", type: { kind: "Uint64" }, optional: false }],
          ["float32_val", { name: "float32_val", type: { kind: "Float32" }, optional: false }],
          ["float64_val", { name: "float64_val", type: { kind: "Float64" }, optional: false }]
        ])
      };

      // When
      const goCode = generator.generateModel(model);

      // Then - COMPREHENSIVE TYPE COVERAGE
      expect(goCode).toContain("int8");
      expect(goCode).toContain("int16");
      expect(goCode).toContain("int32");
      expect(goCode).toContain("int64");
      expect(goCode).toContain("uint8");
      expect(goCode).toContain("uint16");
      expect(goCode).toContain("uint32");
      expect(goCode).toContain("uint64");
      expect(goCode).toContain("float32");
      expect(goCode).toContain("float64");
    });
  });

  describe("Given complex TypeSpec types", () => {
    it("should handle arrays correctly", () => {
      // Given
      const model = {
        name: "Order" as const,
        properties: new Map([
          ["items", { 
            name: "items", 
            type: { kind: "Array", element: { kind: "String" } }, 
            optional: false 
          }],
          ["numbers", { 
            name: "numbers", 
            type: { kind: "Array", element: { kind: "Int32" } }, 
            optional: true 
          }]
        ])
      };

      // When
      const goCode = generator.generateModel(model);

      // Then - ARRAY TYPE MAPPING
      expect(goCode).toContain("Items []string");
      expect(goCode).toContain("Numbers *[]int32");
    });

    it("should handle boolean and bytes", () => {
      // Given
      const model = {
        name: "Settings" as const,
        properties: new Map([
          ["enabled", { name: "enabled", type: { kind: "Boolean" }, optional: false }],
          ["data", { name: "data", type: { kind: "Bytes" }, optional: true }]
        ])
      };

      // When
      const goCode = generator.generateModel(model);

      // Then - SPECIAL TYPE HANDLING
      expect(goCode).toContain("Enabled bool");
      expect(goCode).toContain("Data *[]byte");
    });

    it("should handle models and enums", () => {
      // Given
      const model = {
        name: "Complex" as const,
        properties: new Map([
          ["user", { 
            name: "user", 
            type: { kind: "Model", name: "User" }, 
            optional: false 
          }],
          ["status", { 
            name: "status", 
            type: { kind: "Enum" }, 
            optional: false 
          }]
        ])
      };

      // When
      const goCode = generator.generateModel(model);

      // Then - COMPLEX TYPE HANDLING
      expect(goCode).toContain("User User");
      expect(goCode).toContain("Status string");
    });
  });

  describe("Error handling with railway programming", () => {
    it("should throw for invalid model name", () => {
      // Given
      const invalidModel = {
        name: "" as const, // Invalid empty name
        properties: new Map()
      };

      // When & Then - PROPER ERROR HANDLING
      expect(() => generator.generateModel(invalidModel))
        .toThrow("Model name cannot be empty");
    });

    it("should throw for empty properties", () => {
      // Given
      const invalidModel = {
        name: "Empty" as const,
        properties: new Map() // Invalid empty properties
      };

      // When & Then
      expect(() => generator.generateModel(invalidModel))
        .toThrow("Model must have at least one property");
    });

    it("should throw for duplicate property names", () => {
      // Given
      const invalidModel = {
        name: "Duplicate" as const,
        properties: new Map([
          ["name", { name: "name", type: { kind: "String" }, optional: false }],
          ["name", { name: "name", type: { kind: "String" }, optional: true }] // Duplicate
        ])
      };

      // When & Then
      expect(() => generator.generateModel(invalidModel))
        .toThrow("Model has duplicate property names");
    });

    it("should throw for unsupported types", () => {
      // Given
      const invalidModel = {
        name: "Unsupported" as const,
        properties: new Map([
          ["invalid", { 
            name: "invalid", 
            type: { kind: "UnknownType" as any }, 
            optional: false 
          })
        ])
      };

      // When & Then - FAIL FAST FOR UNKNOWN TYPES
      expect(() => generator.generateModel(invalidModel))
        .toThrow("Unsupported TypeSpec type");
    });
  });

  describe("Package generation", () => {
    it("should generate complete Go package", () => {
      // Given
      const models = new Map([
        ["User", {
          name: "User" as const,
          properties: new Map([
            ["name", { name: "name", type: { kind: "String" }, optional: false }]
          ])
        }],
        ["Product", {
          name: "Product" as const,
          properties: new Map([
            ["id", { name: "id", type: { kind: "String" }, optional: false }]
          ])
        }]
      ]);

      // When
      const packageOutput = generator.generatePackage(models);

      // Then - COMPLETE PACKAGE GENERATION
      expect(packageOutput).toBeDefined();
      expect(packageOutput.kind).toBe("directory");
      expect(packageOutput.path).toBe("");
      expect(packageOutput.contents).toBeDefined();
      expect(packageOutput.contents!.length).toBeGreaterThan(0);

      // Should have go.mod
      const goMod = packageOutput.contents!.find(file => file.kind === "file" && file.path === "go.mod");
      expect(goMod).toBeDefined();

      // Should have model files
      const userFile = packageOutput.contents!.find(file => file.kind === "file" && file.path === "user.go");
      const productFile = packageOutput.contents!.find(file => file.kind === "file" && file.path === "product.go");
      expect(userFile).toBeDefined();
      expect(productFile).toBeDefined();

      // Should have types index
      const typesFile = packageOutput.contents!.find(file => file.kind === "file" && file.path === "types.go");
      expect(typesFile).toBeDefined();
    });
  });

  describe("Configuration options", () => {
    it("should respect package name configuration", () => {
      // Given
      const customGenerator = createTypeSpecGoGenerator({
        ...DEFAULT_GENERATION_CONFIG,
        packageName: 'custom'
      });
      const model = {
        name: "Test" as const,
        properties: new Map([
          ["id", { name: "id", type: { kind: "String" }, optional: false }]
        ])
      };

      // When
      const goCode = customGenerator.generateModel(model);

      // Then
      expect(goCode).toContain("package custom");
    });

    it("should respect warning configuration", () => {
      // Given
      const noWarningGenerator = createTypeSpecGoGenerator({
        ...DEFAULT_GENERATION_CONFIG,
        includeGeneratedWarning: false
      });
      const model = {
        name: "Test" as const,
        properties: new Map([
          ["id", { name: "id", type: { kind: "String" }, optional: false }]
        ])
      };

      // When
      const goCode = noWarningGenerator.generateModel(model);

      // Then
      expect(goCode).not.toContain("// Auto-generated");
    });
  });
});