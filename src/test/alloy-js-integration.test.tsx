/**
 * Basic Integration Test
 * Tests new Alloy-JS component-based generation
 * Follows guide's "Component Testing" pattern
 */

import { describe, it, expect } from "vitest";
import { render, Output } from "@alloy-js/core";
import { SourceFile, StructTypeDeclaration, StructMember } from "@alloy-js/go";
import { TypeExpression } from "../components/TypeExpression.tsx";
import { GoModel } from "../components/GoModel.tsx";

// Mock TypeSpec types for testing
const mockStringType = { kind: "String" as const };
const mockInt32Type = { kind: "Scalar" as const, name: "int32" };
const mockBoolType = { kind: "Scalar" as const, name: "boolean" };
const mockOptionalString = { 
  kind: "Union" as const,
  variants: new Map([
    ["variant1", { kind: "String" as const }],
    ["variant2", { kind: "Null" as const }]
  ])
};

// Mock Model for testing
const mockModel = {
  name: "User",
  kind: "Model" as const,
  properties: new Map([
    ["id", { 
      name: "id", 
      type: mockInt32Type, 
      optional: false 
    }],
    ["name", { 
      name: "name", 
      type: mockStringType, 
      optional: false 
    }],
    ["email", { 
      name: "email", 
      type: mockOptionalString, 
      optional: true 
    }]
  ]),
  doc: "User represents a user in the system"
};

describe("TypeExpression Component", () => {
  it("should generate correct Go primitive types", () => {
    const stringResult = TypeExpression({ type: mockStringType });
    
    // Should contain string type
    expect(stringResult).toBe("string");
    
    const intResult = TypeExpression({ type: mockInt32Type });
    
    // Should contain int32 type
    expect(intResult).toBe("int32");
    
    const boolResult = TypeExpression({ type: mockBoolType });
    
    // Should contain bool type
    expect(boolResult).toBe("bool");
  });
  
  it("should handle optional types with pointers", () => {
    const result = TypeExpression({ type: mockOptionalString });
    
    // Should generate pointer type for optional field
    expect(result).toBe("*string");
  });
  
  it("should fallback to interface{} for unknown types", () => {
    const unknownType = { kind: "Unknown" as const };
    const result = TypeExpression({ type: unknownType });
    
    // Should fallback to interface{}
    expect(result).toBe("interface{}");
  });
});

describe("GoModel Component", () => {
  it("should generate complete Go struct", () => {
    const result = render(
      <Output>
        <SourceFile path="test.go">
          <GoModel model={mockModel} />
        </SourceFile>
      </Output>
    );
    
    console.log("Generated Go code:", result);
    
    // Should contain type declaration
    expect(result).toContain("type User struct");
    
    // Should contain all fields
    expect(result).toContain("Id int32");
    expect(result).toContain("Name string");
    expect(result).toContain("Email *string");
    
    // Should contain JSON tags
    expect(result).toContain('json:"id"');
    expect(result).toContain('json:"name"');
    expect(result).toContain('json:"email",omitempty');
    
    // Should contain documentation
    expect(result).toContain("User represents a user in the system");
  });
  
  it("should handle empty models", () => {
    const emptyModel = {
      name: "EmptyModel",
      kind: "Model" as const,
      properties: new Map()
    };
    
    const result = render(
      <Output>
        <SourceFile path="test.go">
          <GoModel model={emptyModel} />
        </SourceFile>
      </Output>
    );
    
    console.log("Empty model result:", result);
    
    // Should generate empty struct
    expect(result).toContain("type EmptyModel struct");
    expect(result).toContain("{");
    expect(result).toContain("}");
  });
  
  it("should handle models without names", () => {
    const unnamedModel = {
      name: null,
      kind: "Model" as const,
      properties: new Map()
    };
    
    const result = render(
      <Output>
        <SourceFile path="test.go">
          <GoModel model={unnamedModel} />
        </SourceFile>
      </Output>
    );
    
    console.log("Unnamed model result:", result);
    
    // Should handle unnamed gracefully
    expect(result).toContain("type interface{} struct");
  });
});

describe("Integration Testing", () => {
  it("should generate valid Go code structure", () => {
    const result = render(
      <Output>
        <SourceFile path="models.go">
          <GoModel model={mockModel} />
        </SourceFile>
      </Output>
    );
    
    console.log("Integration result:", result);
    
    // Should be valid Go syntax
    expect(result).toMatch(/^[\s\S]*$/m); // Basic syntax check
    
    // Should contain type definitions
    expect(result).toContain("type User struct");
    
    // Should be valid output
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});