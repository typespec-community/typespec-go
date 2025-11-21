/**
 * Bun Test for StandaloneGoGenerator
 * BDD-style test framework for TypeSpec Go Emitter
 */

import { describe, it, expect, beforeEach } from "bun:test";
import { StandaloneGoGenerator } from "../standalone-generator.js";

describe("StandaloneGoGenerator", () => {
  let generator: StandaloneGoGenerator;

  beforeEach(() => {
    generator = new StandaloneGoGenerator();
  });

  describe("Given a simple TypeSpec model", () => {
    it("should generate valid Go struct", () => {
      // Given
      const model = {
        name: "User",
        properties: new Map([
          ["name", { name: "name", type: { kind: "String" }, optional: false }],
          ["age", { name: "age", type: { kind: "Uint8" }, optional: true }],
        ]),
      };

      // When
      const result = generator.generateModel(model);

      // Then
      expect(result._tag).toBe("success");
      if (result._tag === "Success") {
        const goCode = result.data.get("User.go");
        expect(goCode).toContain("package api");
        expect(goCode).toContain("type User struct {");
        expect(goCode).toContain('Name string `json:"name"`');
        expect(goCode).toContain('Age *uint8 `json:"age,omitempty"`');
        expect(goCode).toContain("}");
      }
    });

    it("should handle required and optional fields correctly", () => {
      // Given
      const model = {
        name: "Product",
        properties: new Map([
          ["id", { name: "id", type: { kind: "String" }, optional: false }],
          [
            "price",
            { name: "price", type: { kind: "Float64" }, optional: false },
          ],
          [
            "description",
            { name: "description", type: { kind: "String" }, optional: true },
          ],
        ]),
      };

      // When
      const result = generator.generateModel(model);

      // Then
      expect(result._tag).toBe("success");
      if (result._tag === "Success") {
        const goCode = result.data.get("Product.go");
        expect(goCode).toContain('Id string `json:"id"`');
        expect(goCode).toContain('Price float64 `json:"price"`');
        expect(goCode).toContain(
          'Description *string `json:"description,omitempty"`',
        );
      }
    });
  });

  describe("Given complex TypeSpec types", () => {
    it("should handle arrays correctly", () => {
      // Given
      const model = {
        name: "Order",
        properties: new Map([
          [
            "items",
            {
              name: "items",
              type: { kind: "Array", elementType: { kind: "scalar", name: "string" } },
              optional: false,
            },
          ],
        ]),
      };

      // When
      const result = generator.generateModel(model);

      // Then
      expect(result._tag).toBe("success");
      if (result._tag === "Success") {
        const goCode = result.data.get("Order.go");
        expect(goCode).toContain('Items []string `json:"items"`');
      }
    });

    it("should handle boolean fields", () => {
      // Given
      const model = {
        name: "Settings",
        properties: new Map([
          [
            "enabled",
            { name: "enabled", type: { kind: "Boolean" }, optional: false },
          ],
        ]),
      };

      // When
      const result = generator.generateModel(model);

      // Then
      expect(result._tag).toBe("success");
      if (result._tag === "Success") {
        const goCode = result.data.get("Settings.go");
        expect(goCode).toContain('Enabled bool `json:"enabled"`');
      }
    });
  });

  describe("Error handling", () => {
    it("should throw GoGenerationError for invalid models", () => {
      // Given
      const invalidModel = {
        name: "", // Invalid empty name
        properties: new Map(),
      };

      // When
      const result = generator.generateModel(invalidModel);

      // Then
      expect(result._tag).toBe("validation_error");
      if (result._tag === "ModelValidationError") {
        expect(result.message).toBe(
          "Invalid model: name must be a non-empty string",
        );
        expect(result.reason).toBe("empty-name");
        expect(result.resolution).toBe("Provide a valid model name");
      }
    });
  });
});
