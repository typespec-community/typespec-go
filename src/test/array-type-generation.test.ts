/**
 * Array Type Generation Tests
 * 
 * Testing critical array type support for TypeSpec Go Emitter
 */

import { describe, it, expect } from "vitest";
import { CleanTypeMapper } from "../domain/clean-type-mapper.js";
import type { TypeSpecPropertyNode, TypeSpecTypeNode } from "../types/typespec-domain.js";

describe("Array Type Generation", () => {
  describe("Basic Array Types", () => {
    it("should handle string arrays", () => {
      const arrayType: TypeSpecTypeNode = {
        kind: "array",
        elementType: { kind: "scalar", name: "string" }
      };

      const property: TypeSpecPropertyNode = {
        name: "tags",
        type: arrayType,
        optional: false
      };

      const result = CleanTypeMapper.mapTypeSpecType(property.type, property.name);
      
      expect(result.goType).toBe("[]string");
      expect(result.usePointerForOptional).toBe(true);
      expect(result.requiresImport).toBeUndefined();
    });

    it("should handle integer arrays", () => {
      const arrayType: TypeSpecTypeNode = {
        kind: "array",
        elementType: { kind: "scalar", name: "int32" }
      };

      const property: TypeSpecPropertyNode = {
        name: "scores",
        type: arrayType,
        optional: false
      };

      const result = CleanTypeMapper.mapTypeSpecType(property.type, property.name);
      
      expect(result.goType).toBe("[]int32");
      expect(result.usePointerForOptional).toBe(true);
      expect(result.requiresImport).toBeUndefined();
    });

    it("should handle model arrays", () => {
      const arrayType: TypeSpecTypeNode = {
        kind: "array",
        elementType: { kind: "model", name: "User" }
      };

      const property: TypeSpecPropertyNode = {
        name: "users",
        type: arrayType,
        optional: false
      };

      const result = CleanTypeMapper.mapTypeSpecType(property.type, property.name);
      
      expect(result.goType).toBe("[]User");
      expect(result.usePointerForOptional).toBe(true);
      expect(result.requiresImport).toBeUndefined();
    });
  });

  describe("Complex Array Types", () => {
    it("should handle arrays of time types with imports", () => {
      const arrayType: TypeSpecTypeNode = {
        kind: "array",
        elementType: { kind: "scalar", name: "utcDateTime" }
      };

      const property: TypeSpecPropertyNode = {
        name: "timestamps",
        type: arrayType,
        optional: false
      };

      const result = CleanTypeMapper.mapTypeSpecType(property.type, property.name);
      
      expect(result.goType).toBe("[]time.Time");
      expect(result.usePointerForOptional).toBe(true);
      expect(result.requiresImport).toBe("time");
    });

    it("should handle nested array types", () => {
      const innerArray: TypeSpecTypeNode = {
        kind: "array",
        elementType: { kind: "scalar", name: "string" }
      };

      const outerArray: TypeSpecTypeNode = {
        kind: "array",
        elementType: innerArray
      };

      const property: TypeSpecPropertyNode = {
        name: "matrix",
        type: outerArray,
        optional: false
      };

      const result = CleanTypeMapper.mapTypeSpecType(property.type, property.name);
      
      expect(result.goType).toBe("[][]string");
      expect(result.usePointerForOptional).toBe(true);
      expect(result.requiresImport).toBeUndefined();
    });
  });

  describe("Array Type Edge Cases", () => {
    it("should handle optional arrays", () => {
      const arrayType: TypeSpecTypeNode = {
        kind: "array",
        elementType: { kind: "scalar", name: "string" }
      };

      const property: TypeSpecPropertyNode = {
        name: "optionalTags",
        type: arrayType,
        optional: true
      };

      const result = CleanTypeMapper.mapTypeSpecType(property.type, property.name);
      
      expect(result.goType).toBe("[]string");
      expect(result.usePointerForOptional).toBe(true);
      expect(result.requiresImport).toBeUndefined();
    });

    it("should handle arrays with unknown element types gracefully", () => {
      const arrayType: TypeSpecTypeNode = {
        kind: "array",
        elementType: { kind: "unknown" }
      };

      const property: TypeSpecPropertyNode = {
        name: "unknownArray",
        type: arrayType,
        optional: false
      };

      const result = CleanTypeMapper.mapTypeSpecType(property.type, property.name);
      
      // Should fallback to interface{} for unknown element types
      expect(result.goType).toBe("[]interface{}");
      expect(result.usePointerForOptional).toBe(true);
    });

    it("should handle invalid array types gracefully", () => {
      const invalidArrayType: TypeSpecTypeNode = {
        kind: "array"
        // Missing elementType
      };

      const property: TypeSpecPropertyNode = {
        name: "invalidArray",
        type: invalidArrayType,
        optional: false
      };

      const result = CleanTypeMapper.mapTypeSpecType(property.type, property.name);
      
      // Should fallback to []interface{} for invalid array types
      expect(result.goType).toBe("[]interface{}");
      expect(result.usePointerForOptional).toBe(true);
    });
  });

  describe("Type Guard Validation", () => {
    it("should correctly identify array types", () => {
      const arrayType = {
        kind: "array",
        elementType: { kind: "scalar", name: "string" }
      };

      // Test that the type guard correctly identifies arrays
      // This is tested indirectly through mapTypeSpecType working correctly
      const property: TypeSpecPropertyNode = {
        name: "testArray",
        type: arrayType,
        optional: false
      };

      const result = CleanTypeMapper.mapTypeSpecType(property.type, property.name);
      expect(result.goType).toBe("[]string");
    });

    it("should not confuse array types with other types", () => {
      const modelType = {
        kind: "model",
        name: "User"
      };

      const property: TypeSpecPropertyNode = {
        name: "testModel",
        type: modelType,
        optional: false
      };

      const result = CleanTypeMapper.mapTypeSpecType(property.type, property.name);
      expect(result.goType).toBe("User");
    });
  });

  describe("Real-World Integration Patterns", () => {
    it("should handle UserList pattern from integration tests", () => {
      // This simulates the pattern: users: User[] from integration-basic.tsp
      const userType: TypeSpecTypeNode = {
        kind: "model",
        name: "User"
      };

      const usersArray: TypeSpecTypeNode = {
        kind: "array",
        elementType: userType
      };

      const property: TypeSpecPropertyNode = {
        name: "users",
        type: usersArray,
        optional: false
      };

      const result = CleanTypeMapper.mapTypeSpecType(property.type, property.name);
      
      expect(result.goType).toBe("[]User");
      expect(result.usePointerForOptional).toBe(true);
      expect(result.requiresImport).toBeUndefined();
    });

    it("should handle Task array from project management patterns", () => {
      // This simulates: tasks: Task[] from project management models
      const taskType: TypeSpecTypeNode = {
        kind: "model",
        name: "Task"
      };

      const tasksArray: TypeSpecTypeNode = {
        kind: "array",
        elementType: taskType
      };

      const property: TypeSpecPropertyNode = {
        name: "tasks",
        type: tasksArray,
        optional: false
      };

      const result = CleanTypeMapper.mapTypeSpecType(property.type, property.name);
      
      expect(result.goType).toBe("[]Task");
      expect(result.usePointerForOptional).toBe(true);
      expect(result.requiresImport).toBeUndefined();
    });
  });
});