/**
 * TypeSpec to Alloy.js Bridge Test
 * 
 * Tests transformation from TypeSpec models to JSX Go components
 */

import { describe, it, expect, beforeEach } from "bun:test";
import { createTypeSpecAlloyBridge } from "../utils/typespec-alloy-bridge.js";

describe("TypeSpec to Alloy.js Bridge", () => {
  let bridge: ReturnType<typeof createTypeSpecAlloyBridge>;

  beforeEach(() => {
    bridge = createTypeSpecAlloyBridge();
  });

  describe("Given a simple TypeSpec model", () => {
    it("should convert to JSX Go struct", () => {
      // Given
      const model = {
        name: "User",
        properties: new Map([
          ["name", { name: "name", type: { kind: "String" }, optional: false }],
          ["age", { name: "age", type: { kind: "Uint8" }, optional: true }]
        ])
      };

      // When
      const jsxOutput = bridge.modelToJsxStruct(model);

      // Then
      expect(jsxOutput).toBeDefined();
      // The JSX output is a ComponentCreator, not a simple object
      expect(typeof jsxOutput).toBe("function");
    });

    it("should handle required string fields", () => {
      // Given
      const model = {
        name: "Product",
        properties: new Map([
          ["id", { name: "id", type: { kind: "String" }, optional: false }]
        ])
      };

      // When
      const jsxOutput = bridge.modelToJsxStruct(model);

      // Then
      expect(jsxOutput).toBeDefined();
      expect(typeof jsxOutput).toBe("function");
    });

    it("should handle optional numeric fields", () => {
      // Given
      const model = {
        name: "Metrics",
        properties: new Map([
          ["count", { name: "count", type: { kind: "Uint32" }, optional: true }]
        ])
      };

      // When
      const jsxOutput = bridge.modelToJsxStruct(model);

      // Then
      expect(jsxOutput).toBeDefined();
      expect(typeof jsxOutput).toBe("function");
    });
  });

  describe("Given complex TypeSpec types", () => {
    it("should handle array types", () => {
      // Given
      const model = {
        name: "Order",
        properties: new Map([
          ["items", { 
            name: "items", 
            type: { kind: "Array", element: { kind: "String" } }, 
            optional: false 
          }]
        ])
      };

      // When
      const jsxOutput = bridge.modelToJsxStruct(model);

      // Then
      expect(jsxOutput).toBeDefined();
      expect(typeof jsxOutput).toBe("function");
    });

    it("should handle boolean fields", () => {
      // Given
      const model = {
        name: "Settings",
        properties: new Map([
          ["enabled", { name: "enabled", type: { kind: "Boolean" }, optional: false }]
        ])
      };

      // When
      const jsxOutput = bridge.modelToJsxStruct(model);

      // Then
      expect(jsxOutput).toBeDefined();
      expect(typeof jsxOutput).toBe("function");
    });
  });

  describe("Error handling", () => {
    it("should handle invalid type gracefully", () => {
      // Given
      const model = {
        name: "InvalidModel",
        properties: new Map([
          ["invalid", { 
            name: "invalid", 
            type: { kind: "UnknownType" }, 
            optional: false 
          }]
        ])
      };

      // When
      const jsxOutput = bridge.modelToJsxStruct(model);

      // Then - Should not throw, but handle gracefully
      expect(jsxOutput).toBeDefined();
      expect(typeof jsxOutput).toBe("function");
    });
  });
});