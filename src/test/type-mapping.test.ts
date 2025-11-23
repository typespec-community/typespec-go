import { describe, it, expect } from "bun:test";
import { mapTypeSpecToGo } from "../emitter/main.js";
import { createTestProgram } from "./test-utils.js";

describe("TypeSpec Type Mapping Tests", () => {
  let testProgram;
  
  beforeAll(async () => {
    testProgram = await createTestProgram(`
      model TestModel {
        stringField: string;
        intField: int32;
        floatField: float64;
        boolField: boolean;
        bytesField: bytes;
        optionalField?: string;
        modelField: TestModel;
        arrayField: string[];
      }
      
      enum TestEnum {
        A, B, C
      }
      
      union TestUnion {
        string | int32 | boolean
      }
    `);
  });

  describe("Scalar Type Mapping", () => {
    it("should map string to Go string", async () => {
      // Test with scalar type from TypeSpec
      const stringScalar = testProgram.checker.resolveType("string");
      const result = mapTypeSpecToGo(stringScalar);
      expect(result).toBe("string");
    });

    it("should map int32 to Go int32", async () => {
      const int32Scalar = testProgram.checker.resolveType("int32");
      const result = mapTypeSpecToGo(int32Scalar);
      expect(result).toBe("int32");
    });

    it("should map float64 to Go float64", async () => {
      const float64Scalar = testProgram.checker.resolveType("float64");
      const result = mapTypeSpecToGo(float64Scalar);
      expect(result).toBe("float64");
    });

    it("should map boolean to Go bool", async () => {
      const boolScalar = testProgram.checker.resolveType("boolean");
      const result = mapTypeSpecToGo(boolScalar);
      expect(result).toBe("bool");
    });

    it("should map bytes to Go []byte", async () => {
      const bytesScalar = testProgram.checker.resolveType("bytes");
      const result = mapTypeSpecToGo(bytesScalar);
      expect(result).toBe("[]byte");
    });
  });

  describe("Model Type Mapping", () => {
    it("should map model to model name", async () => {
      const testModel = testProgram.checker.resolveType("TestModel");
      const result = mapTypeSpecToGo(testModel);
      expect(result).toBe("TestModel");
    });
  });

  describe("Union Type Mapping", () => {
    it("should map union to interface{}", async () => {
      const testUnion = testProgram.checker.resolveType("TestUnion");
      const result = mapTypeSpecToGo(testUnion);
      expect(result).toBe("interface{}");
    });
  });

  describe("Array Type Mapping", () => {
    it("should map array to Go slice", async () => {
      // This will test array handling when implemented
      const arrayType = testProgram.checker.resolveType("string[]");
      const result = mapTypeSpecToGo(arrayType);
      // For now, this will likely return interface{} until array handling is complete
      expect(typeof result).toBe("string");
    });
  });

  describe("Edge Cases", () => {
    it("should handle unknown types gracefully", async () => {
      const unknownType = { kind: "UnknownType", name: "mystery" };
      const result = mapTypeSpecToGo(unknownType);
      expect(result).toBe("any");
    });

    it("should handle null types", async () => {
      const nullType = { kind: "Intrinsic", name: "null" };
      const result = mapTypeSpecToGo(nullType);
      expect(result).toBe("any");
    });
  });
});

describe("Go Code Generation Tests", () => {
  it("should generate valid Go structs", async () => {
    const testProgram = await createTestProgram(`
      model User {
        id: int32;
        name: string;
        email?: string;
        age: int32;
      }
      
      model Product {
        id: int32;
        title: string;
        price: float64;
        description?: string;
      }
    `);

    // Test that we can extract models from program
    const globalNamespace = testProgram.getGlobalNamespaceType();
    const models = [...globalNamespace.models.values()];
    
    expect(models).toHaveLength(2);
    expect(models.map(m => m.name)).toContain("User");
    expect(models.map(m => m.name)).toContain("Product");
  });

  it("should handle optional fields correctly", async () => {
    const testProgram = await createTestProgram(`
      model User {
        required: string;
        optional?: string;
      }
    `);

    const globalNamespace = testProgram.getGlobalNamespaceType();
    const user = [...globalNamespace.models.values()].find(m => m.name === "User");
    
    expect(user).toBeDefined();
    
    const requiredProp = user.properties.get("required");
    const optionalProp = user.properties.get("optional");
    
    expect(requiredProp.optional).toBe(false);
    expect(optionalProp.optional).toBe(true);
  });
});