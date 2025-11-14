import { strictEqual } from "node:assert";
import { describe, it } from "node:test";

// Test the type mapper directly
import { GoTypeMapper } from "../src/utils/type-mapper.js";

describe("TypeSpec Go Emitter - Type Mapping", () => {
  it("maps basic scalar types correctly", () => {
    const stringType = { kind: "Scalar", name: "string" } as any;
    const mapped = GoTypeMapper.mapTypeSpecType(stringType);
    
    strictEqual(mapped.kind, "basic");
    strictEqual(mapped.name, "string");
    strictEqual(mapped.usePointerForOptional, true);
  });

  it("maps int32 correctly", () => {
    const int32Type = { kind: "Scalar", name: "int32" } as any;
    const mapped = GoTypeMapper.mapTypeSpecType(int32Type);
    
    strictEqual(mapped.kind, "basic");
    strictEqual(mapped.name, "int32");
    strictEqual(mapped.usePointerForOptional, true);
  });

  it("maps boolean correctly", () => {
    const boolType = { kind: "Scalar", name: "boolean" } as any;
    const mapped = GoTypeMapper.mapTypeSpecType(boolType);
    
    strictEqual(mapped.kind, "basic");
    strictEqual(mapped.name, "bool");
    strictEqual(mapped.usePointerForOptional, true);
  });

  it("maps time types correctly", () => {
    const timeType = { kind: "Scalar", name: "utcDateTime" } as any;
    const mapped = GoTypeMapper.mapTypeSpecType(timeType);
    
    strictEqual(mapped.kind, "basic");
    strictEqual(mapped.name, "time.Time");
    strictEqual(mapped.requiresImport, true);
    strictEqual(mapped.importPath, "time");
    strictEqual(mapped.usePointerForOptional, true);
  });

  it("throws error for unknown types", () => {
    const unknownType = { kind: "UnknownType", name: "something" } as any;
    
    try {
      GoTypeMapper.mapTypeSpecType(unknownType);
      throw new Error("Should have thrown TypeError");
    } catch (error) {
      strictEqual(error instanceof TypeError, true);
      strictEqual((error as TypeError).message.includes("Unsupported TypeSpec type"), true);
    }
  });

  it("generates Go type strings correctly", () => {
    const testCases = [
      { type: { kind: "Scalar", name: "string" } as any, expected: "string" },
      { type: { kind: "Scalar", name: "int32" } as any, expected: "int32" },
      { type: { kind: "Scalar", name: "boolean" } as any, expected: "bool" },
    ];
    
    for (const testCase of testCases) {
      const mapped = GoTypeMapper.mapTypeSpecType(testCase.type);
      const goString = GoTypeMapper.generateGoTypeString(mapped);
      strictEqual(goString, testCase.expected);
    }
  });

  it("generates slice types correctly", () => {
    const sliceType = {
      kind: "slice" as const,
      elementType: { kind: "basic" as const, name: "string" }
    };
    
    const goString = GoTypeMapper.generateGoTypeString(sliceType);
    strictEqual(goString, "[]string");
  });

  it("generates pointer types correctly", () => {
    const pointerType = {
      kind: "pointer" as const,
      baseType: { kind: "basic" as const, name: "string" }
    };
    
    const goString = GoTypeMapper.generateGoTypeString(pointerType);
    strictEqual(goString, "*string");
  });

  it("handles optional properties correctly", () => {
    const stringType = { kind: "Scalar", name: "string" };
    const mapped = GoTypeMapper.mapTypeSpecType(stringType);
    
    // Optional string should use pointer when usePointerForOptional is true
    strictEqual(mapped.usePointerForOptional, true);
    
    const optionalGoString = `*${mapped.name}`;
    strictEqual(optionalGoString, "*string");
  });

  it("handles optional time types correctly", () => {
    const timeType = { kind: "Scalar", name: "utcDateTime" };
    const mapped = GoTypeMapper.mapTypeSpecType(timeType);
    
    strictEqual(mapped.name, "time.Time");
    strictEqual(mapped.requiresImport, true);
    strictEqual(mapped.importPath, "time");
    strictEqual(mapped.usePointerForOptional, true);
    
    // Optional time should be *time.Time
    const optionalGoString = `*${mapped.name}`;
    strictEqual(optionalGoString, "*time.Time");
  });
});
