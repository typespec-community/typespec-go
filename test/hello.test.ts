import { strictEqual } from "node:assert";
import { describe, it } from "node:test";

// Test the type mapper directly
import { GoTypeMapper } from "../dist/src/utils/type-mapper.js";

describe("TypeSpec Go Emitter - Type Mapping", () => {
  it("maps basic scalar types correctly", () => {
    const stringType = { kind: "Scalar", name: "string" };
    const mapped = GoTypeMapper.mapTypeSpecType(stringType);
    
    strictEqual(mapped.kind, "basic");
    strictEqual(mapped.name, "string");
    strictEqual(mapped.usePointerForOptional, true);
  });

  it("maps int32 correctly", () => {
    const int32Type = { kind: "Scalar", name: "int32" };
    const mapped = GoTypeMapper.mapTypeSpecType(int32Type);
    
    strictEqual(mapped.kind, "basic");
    strictEqual(mapped.name, "int32");
    strictEqual(mapped.usePointerForOptional, true);
  });

  it("maps boolean correctly", () => {
    const boolType = { kind: "Scalar", name: "boolean" };
    const mapped = GoTypeMapper.mapTypeSpecType(boolType);
    
    strictEqual(mapped.kind, "basic");
    strictEqual(mapped.name, "bool");
    strictEqual(mapped.usePointerForOptional, true);
  });

  it("maps time types correctly", () => {
    const timeType = { kind: "Scalar", name: "utcDateTime" };
    const mapped = GoTypeMapper.mapTypeSpecType(timeType);
    
    strictEqual(mapped.kind, "basic");
    strictEqual(mapped.name, "time.Time");
    strictEqual(mapped.requiresImport, true);
    strictEqual(mapped.importPath, "time");
    strictEqual(mapped.usePointerForOptional, true);
  });

  it("throws error for unknown types", () => {
    const unknownType = { kind: "UnknownType", name: "something" };
    
    try {
      GoTypeMapper.mapTypeSpecType(unknownType);
      throw new Error("Should have thrown TypeError");
    } catch (error) {
      strictEqual(error instanceof TypeError, true);
      strictEqual(error.message.includes("Unsupported TypeSpec type"), true);
    }
  });

  it("generates Go type strings correctly", () => {
    const testCases = [
      { type: { kind: "Scalar", name: "string" }, expected: "string" },
      { type: { kind: "Scalar", name: "int32" }, expected: "int32" },
      { type: { kind: "Scalar", name: "boolean" }, expected: "bool" },
    ];
    
    for (const testCase of testCases) {
      const mapped = GoTypeMapper.mapTypeSpecType(testCase.type);
      const goString = GoTypeMapper.generateGoTypeString(mapped);
      strictEqual(goString, testCase.expected);
    }
  });

  it("generates slice types correctly", () => {
    const sliceType = {
      kind: "slice",
      elementType: { kind: "basic", name: "string" }
    };
    
    const goString = GoTypeMapper.generateGoTypeString(sliceType);
    strictEqual(goString, "[]string");
  });

  it("generates pointer types correctly", () => {
    const pointerType = {
      kind: "pointer",
      baseType: { kind: "basic", name: "string" }
    };
    
    const goString = GoTypeMapper.generateGoTypeString(pointerType);
    strictEqual(goString, "*string");
  });
});
