/**
 * Integration Test for Array Types in Real TypeSpec Files
 * 
 * This test validates that array types work correctly with real TypeSpec integration patterns
 * Critical for the UserList pattern: users: User[] from integration-basic.tsp
 */

import { describe, it, expect } from "vitest";
import { CleanTypeMapper } from "../domain/clean-type-mapper.js";
import type { TypeSpecPropertyNode, TypeSpecTypeNode } from "../types/typespec-domain.js";

describe("Array Type Integration Tests", () => {
  describe("Real-World TypeSpec Patterns", () => {
    it("should handle UserList pattern from integration-basic.tsp", () => {
      // This represents the exact pattern from integration-basic.tsp line 22:
      // model UserList {
      //   users: User[];
      //   total: int32;
      // }
      
      const userType: TypeSpecTypeNode = {
        kind: "model",
        name: "User"
      };

      const usersArrayProperty: TypeSpecPropertyNode = {
        name: "users",
        type: {
          kind: "array",
          elementType: userType
        },
        optional: false
      };

      const result = CleanTypeMapper.mapTypeSpecType(
        usersArrayProperty.type, 
        usersArrayProperty.name
      );

      // Validate the Go slice generation
      expect(result.goType).toBe("[]User");
      expect(result.usePointerForOptional).toBe(true);
      expect(result.requiresImport).toBeUndefined();
    });

    it("should handle complete UserList model generation", () => {
      // This simulates generating the complete UserList model
      const userProperties = [
        {
          name: "users",
          type: {
            kind: "array" as const,
            elementType: { kind: "model" as const, name: "User" }
          },
          optional: false
        },
        {
          name: "total",
          type: {
            kind: "scalar" as const,
            name: "int32"
          },
          optional: false
        }
      ] as TypeSpecPropertyNode[];

      const results = userProperties.map(prop => 
        CleanTypeMapper.mapTypeSpecType(prop.type, prop.name)
      );

      // Validate users field: []User
      expect(results[0].goType).toBe("[]User");
      expect(results[0].usePointerForOptional).toBe(true);

      // Validate total field: int32  
      expect(results[1].goType).toBe("int32");
      expect(results[1].usePointerForOptional).toBe(true);
    });

    it("should handle complex project management patterns", () => {
      // Simulate a Project model with multiple array fields
      // like: tasks: Task[], members: User[], tags: string[]
      
      const projectProperties = [
        {
          name: "tasks",
          type: {
            kind: "array" as const,
            elementType: { kind: "model" as const, name: "Task" }
          },
          optional: false
        },
        {
          name: "members", 
          type: {
            kind: "array" as const,
            elementType: { kind: "model" as const, name: "User" }
          },
          optional: false
        },
        {
          name: "tags",
          type: {
            kind: "array" as const,
            elementType: { kind: "scalar" as const, name: "string" }
          },
          optional: false
        }
      ] as TypeSpecPropertyNode[];

      const results = projectProperties.map(prop => 
        CleanTypeMapper.mapTypeSpecType(prop.type, prop.name)
      );

      // Validate Task array: []Task
      expect(results[0].goType).toBe("[]Task");
      expect(results[0].usePointerForOptional).toBe(true);

      // Validate User array: []User
      expect(results[1].goType).toBe("[]User");
      expect(results[1].usePointerForOptional).toBe(true);

      // Validate string array: []string
      expect(results[2].goType).toBe("[]string");
      expect(results[2].usePointerForOptional).toBe(true);
    });

    it("should handle time arrays with proper imports", () => {
      // Pattern like: timestamps: utcDateTime[]
      const timestampArray: TypeSpecPropertyNode = {
        name: "timestamps",
        type: {
          kind: "array",
          elementType: { kind: "scalar", name: "utcDateTime" }
        },
        optional: false
      };

      const result = CleanTypeMapper.mapTypeSpecType(timestampArray.type, timestampArray.name);

      expect(result.goType).toBe("[]time.Time");
      expect(result.usePointerForOptional).toBe(true);
      expect(result.requiresImport).toBe("time");
    });
  });

  describe("Import Management for Arrays", () => {
    it("should correctly track imports for array element types", () => {
      const timeArray = {
        name: "timestamps",
        type: {
          kind: "array" as const,
          elementType: { kind: "scalar" as const, name: "utcDateTime" }
        },
        optional: false
      } as TypeSpecPropertyNode;

      const durationArray = {
        name: "durations", 
        type: {
          kind: "array" as const,
          elementType: { kind: "scalar" as const, name: "duration" }
        },
        optional: false
      } as TypeSpecPropertyNode;

      const timeResult = CleanTypeMapper.mapTypeSpecType(timeArray.type, timeArray.name);
      const durationResult = CleanTypeMapper.mapTypeSpecType(durationArray.type, durationArray.name);

      // Both should require time import
      expect(timeResult.requiresImport).toBe("time");
      expect(durationResult.requiresImport).toBe("time");

      // Test import collection
      const requiredImports = CleanTypeMapper.getRequiredImports([timeResult, durationResult]);
      expect(requiredImports).toEqual(["time"]);
    });

    it("should handle mixed imports across different array types", () => {
      const arrays = [
        {
          name: "timestamps",
          type: { kind: "array", elementType: { kind: "scalar", name: "utcDateTime" } }
        },
        {
          name: "users",
          type: { kind: "array", elementType: { kind: "model", name: "User" } }
        },
        {
          name: "tags",
          type: { kind: "array", elementType: { kind: "scalar", name: "string" } }
        }
      ] as TypeSpecPropertyNode[];

      const results = arrays.map(array => 
        CleanTypeMapper.mapTypeSpecType(array.type, array.name)
      );

      const requiredImports = CleanTypeMapper.getRequiredImports(results);
      expect(requiredImports).toEqual(["time"]); // Only time import needed
    });
  });

  describe("Array Type Edge Cases", () => {
    it("should handle optional arrays correctly", () => {
      const optionalArray: TypeSpecPropertyNode = {
        name: "optionalTags",
        type: {
          kind: "array",
          elementType: { kind: "scalar", name: "string" }
        },
        optional: true
      };

      const result = CleanTypeMapper.mapTypeSpecType(optionalArray.type, optionalArray.name);

      expect(result.goType).toBe("[]string");
      expect(result.usePointerForOptional).toBe(true);
    });

    it("should handle nested array patterns", () => {
      // Pattern like: matrix: string[][] (2D array)
      const stringArray: TypeSpecTypeNode = {
        kind: "array",
        elementType: { kind: "scalar", name: "string" }
      };

      const nestedArray: TypeSpecTypeNode = {
        kind: "array",
        elementType: stringArray
      };

      const property: TypeSpecPropertyNode = {
        name: "matrix",
        type: nestedArray,
        optional: false
      };

      const result = CleanTypeMapper.mapTypeSpecType(property.type, property.name);

      expect(result.goType).toBe("[][]string");
      expect(result.usePointerForOptional).toBe(true);
    });
  });

  describe("TypeSpec Compliance", () => {
    it("should validate array type structure", () => {
      // This test ensures we correctly identify TypeSpec array types
      const validArrayType = {
        kind: "array",
        elementType: { kind: "scalar", name: "string" }
      };

      const invalidArrayType = {
        kind: "array"
        // Missing elementType
      };

      const validProperty = {
        name: "validArray",
        type: validArrayType,
        optional: false
      } as TypeSpecPropertyNode;

      const invalidProperty = {
        name: "invalidArray", 
        type: invalidArrayType,
        optional: false
      } as TypeSpecPropertyNode;

      const validResult = CleanTypeMapper.mapTypeSpecType(validProperty.type, validProperty.name);
      const invalidResult = CleanTypeMapper.mapTypeSpecType(invalidProperty.type, invalidProperty.name);

      // Valid array should generate proper slice type
      expect(validResult.goType).toBe("[]string");

      // Invalid array should fallback gracefully
      expect(invalidResult.goType).toBe("[]interface{}");
    });
  });
});