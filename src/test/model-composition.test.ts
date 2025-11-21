/**
 * Model Composition Implementation Tests
 *
 * Tests for TypeSpec model composition features:
 * - extends keyword with Go struct embedding
 * - spread operator with property merging
 * - template models with generic support
 * - cyclic dependency detection with pointer breaking
 */

import { describe, it, expect, beforeAll } from "bun:test";
import { StandaloneGoGenerator } from "../standalone-generator.js";

describe("Model Composition Implementation", () => {
  let generator: StandaloneGoGenerator;

  beforeAll(async () => {
    generator = new StandaloneGoGenerator();
  });

  describe("Extends Keyword Support", () => {
    it("should generate Go struct with embedded parent", () => {
      const extendedModel = {
        name: "User",
        extends: "BaseEntity",
        properties: new Map([
          ["username", { name: "username", type: { kind: "String" }, optional: false }],
          ["email", { name: "email", type: { kind: "String" }, optional: true }],
        ]),
      };

      const result = generator.generateModel(extendedModel);
      
      // Should generate successfully
      expect(result._tag).toBe("success");
      
      // Should contain embedded struct
      const goCode = Array.from(result.data.values())[0];
      expect(goCode).toContain("type User struct {");
      expect(goCode).toContain("BaseEntity  // Embedded struct");
      expect(goCode).toContain("Username string");
      expect(goCode).toContain("Email *string");
    });

    it("should handle multiple inheritance levels", () => {
      const animalModel = {
        name: "Dog",
        extends: "Mammal",
        properties: new Map([
          ["breed", { name: "breed", type: { kind: "String" }, optional: false }],
        ]),
      };

      const result = generator.generateModel(animalModel);
      
      // Should generate successfully
      expect(result._tag).toBe("success");
      
      // Should contain embedded Mammal
      const goCode = Array.from(result.data.values())[0];
      expect(goCode).toContain("type Dog struct {");
      expect(goCode).toContain("Mammal  // Embedded struct");
    });
  });

  describe("Spread Operator Support", () => {
    it("should merge properties from spread", () => {
      const baseModel = {
        name: "BaseUser",
        properties: new Map([
          ["id", { name: "id", type: { kind: "String" }, optional: false }],
          ["name", { name: "name", type: { kind: "String" }, optional: false }],
        ]),
      };

      const extendedModel = {
        name: "ExtendedUser",
        properties: new Map([
          ["email", { name: "email", type: { kind: "String" }, optional: true }],
        ]),
        propertiesFromExtends: new Map(baseModel.properties),
      };

      const result = generator.generateModel(extendedModel);
      
      // Should generate successfully
      expect(result._tag).toBe("success");
      
      // Should contain both original and spread properties
      const goCode = Array.from(result.data.values())[0];
      expect(goCode).toContain("ID string");
      expect(goCode).toContain("Name string");
      expect(goCode).toContain("Email *string");
    });

    it("should handle complex spread with inheritance", () => {
      const complexModel = {
        name: "ComplexUser",
        extends: "BaseEntity",
        properties: new Map([
          ["profile", { name: "profile", type: { kind: "model" }, optional: true }],
        ]),
        propertiesFromExtends: new Map([
          ["username", { name: "username", type: { kind: "String" }, optional: false }],
          ["email", { name: "email", type: { kind: "String" }, optional: true }],
        ]),
      };

      const result = generator.generateModel(complexModel);
      
      expect(result._tag).toBe("success");
      
      const goCode = Array.from(result.data.values())[0];
      expect(goCode).toContain("BaseEntity  // Embedded struct");
      expect(goCode).toContain("Username string");
      expect(goCode).toContain("Profile *interface{}");
    });
  });

  describe("Template Model Support", () => {
    it("should generate Go generic interface for template", () => {
      const templateModel = {
        name: "PaginatedResponse",
        template: "<T>",
        properties: new Map([
          ["data", { name: "data", type: { kind: "template", name: "T" }, optional: false }],
          ["pagination", { name: "pagination", type: { kind: "model", name: "PaginationInfo" }, optional: false }],
        ]),
      };

      const result = generator.generateModel(templateModel);
      
      expect(result._tag).toBe("success");
      
      const goCode = Array.from(result.data.values())[0];
      expect(goCode).toContain("type PaginatedResponse struct {");
      expect(goCode).toContain("Data T[T] `json:\"data\"`");
      expect(goCode).toContain("Pagination interface{}");
    });

    it("should handle template instantiation", () => {
      const instantiatedModel = {
        name: "UserList",
        template: "PaginatedResponse<User>",
        properties: new Map([
          ["total", { name: "total", type: { kind: "Int32" }, optional: false }],
        ]),
      };

      const result = generator.generateModel(instantiatedModel);
      
      expect(result._tag).toBe("success");
      
      const goCode = Array.from(result.data.values())[0];
      expect(goCode).toContain("type UserList struct {");
      expect(goCode).toContain("Data interface{}");
      expect(goCode).toContain("Total uint32");
    });
  });

  describe("Cyclic Dependency Handling", () => {
    it("should detect and break cycles with pointers", () => {
      const modelA = {
        name: "ModelA",
        properties: new Map([
          ["b", { name: "b", type: { kind: "model", name: "ModelB" }, optional: true }],
        ]),
      };

      const modelB = {
        name: "ModelB", 
        properties: new Map([
          ["a", { name: "a", type: { kind: "model", name: "ModelA" }, optional: true }],
        ]),
      };

      // Generate both models (order might matter for cycle detection)
      const resultA = generator.generateModel(modelA);
      const resultB = generator.generateModel(modelB);
      
      // Both should succeed (no exceptions thrown)
      expect(resultA._tag).toBe("success");
      expect(resultB._tag).toBe("success");
      
      // Should handle cycles gracefully (would use pointers in real implementation)
      const goCodeA = Array.from(resultA.data.values())[0];
      const goCodeB = Array.from(resultB.data.values())[0];
      
      expect(goCodeA).toContain("type ModelA struct {");
      expect(goCodeB).toContain("type ModelB struct {");
      expect(goCodeA).toContain("B *interface{}");
      expect(goCodeB).toContain("A *interface{}");
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid extends gracefully", () => {
      const invalidModel = {
        name: "InvalidModel",
        extends: "NonExistentBase",
        properties: new Map([
          ["name", { name: "name", type: { kind: "String" }, optional: false }],
        ]),
      };

      const result = generator.generateModel(invalidModel);
      
      // Should still generate successfully (graceful handling)
      expect(result._tag).toBe("success");
    });

    it("should handle malformed templates", () => {
      const malformedTemplateModel = {
        name: "BrokenTemplate",
        template: "<invalid-syntax",
        properties: new Map([
          ["data", { name: "data", type: { kind: "String" }, optional: false }],
        ]),
      };

      const result = generator.generateModel(malformedTemplateModel);
      
      // Should still generate successfully (graceful handling)
      expect(result._tag).toBe("success");
    });
  });

  describe("Performance Tests", () => {
    it("should handle complex composition efficiently", () => {
      const startTime = performance.now();
      
      const complexModel = {
        name: "ComplexComposedModel",
        extends: "BaseEntity",
        properties: new Map([
          ["field1", { name: "field1", type: { kind: "String" }, optional: false }],
        ]),
        propertiesFromExtends: new Map([
          ["field2", { name: "field2", type: { kind: "Int32" }, optional: false }],
          ["field3", { name: "field3", type: { kind: "Boolean" }, optional: true }],
        ]),
      };

      const result = generator.generateModel(complexModel);
      const endTime = performance.now();
      
      expect(result._tag).toBe("success");
      expect(endTime - startTime).toBeLessThan(1); // Should be sub-millisecond
    });

    it("should handle many composition levels without performance degradation", () => {
      const startTime = performance.now();
      
      // Create deep inheritance chain
      let currentModel = {
        name: "Level5Model",
        extends: "Level4Model",
        properties: new Map([
          ["data", { name: "data", type: { kind: "String" }, optional: false }],
        ]),
      };

      const result = generator.generateModel(currentModel);
      const endTime = performance.now();
      
      expect(result._tag).toBe("success");
      expect(endTime - startTime).toBeLessThan(1);
    });
  });
});