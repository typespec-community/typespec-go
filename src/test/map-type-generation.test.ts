/**
 * Map/Record Type Generation Tests
 * 
 * Testing critical map/record type support for TypeSpec Go Emitter
 * Pattern: Record<string, string>, Map<string, any>, etc.
 */

import { describe, it, expect } from "vitest";
import { CleanTypeMapper } from "../domain/clean-type-mapper.js";
import type { TypeSpecPropertyNode, TypeSpecTypeNode } from "../types/typespec-domain.js";

describe("Map/Record Type Generation", () => {
  describe("Basic Map Types", () => {
    it("should handle string-to-string maps", () => {
      const mapType: TypeSpecTypeNode = {
        kind: "map",
        keyType: { kind: "scalar", name: "string" },
        valueType: { kind: "scalar", name: "string" }
      };

      const property: TypeSpecPropertyNode = {
        name: "metadata",
        type: mapType,
        optional: false
      };

      const result = CleanTypeMapper.mapTypeSpecType(property.type, property.name);
      
      expect(result.goType).toBe("map[string]string");
      expect(result.usePointerForOptional).toBe(true);
      expect(result.requiresImport).toBeUndefined();
    });

    it("should handle record types (alias for map)", () => {
      const recordType: TypeSpecTypeNode = {
        kind: "record",
        keyType: { kind: "scalar", name: "string" },
        valueType: { kind: "scalar", name: "string" }
      };

      const property: TypeSpecPropertyNode = {
        name: "config",
        type: recordType,
        optional: false
      };

      const result = CleanTypeMapper.mapTypeSpecType(property.type, property.name);
      
      expect(result.goType).toBe("map[string]string");
      expect(result.usePointerForOptional).toBe(true);
      expect(result.requiresImport).toBeUndefined();
    });

    it("should handle string-to-int maps", () => {
      const mapType: TypeSpecTypeNode = {
        kind: "map",
        keyType: { kind: "scalar", name: "string" },
        valueType: { kind: "scalar", name: "int32" }
      };

      const property: TypeSpecPropertyNode = {
        name: "scores",
        type: mapType,
        optional: false
      };

      const result = CleanTypeMapper.mapTypeSpecType(property.type, property.name);
      
      expect(result.goType).toBe("map[string]int32");
      expect(result.usePointerForOptional).toBe(true);
      expect(result.requiresImport).toBeUndefined();
    });
  });

  describe("Complex Map Types", () => {
    it("should handle maps with model values", () => {
      const mapType: TypeSpecTypeNode = {
        kind: "map",
        keyType: { kind: "scalar", name: "string" },
        valueType: { kind: "model", name: "User" }
      };

      const property: TypeSpecPropertyNode = {
        name: "users",
        type: mapType,
        optional: false
      };

      const result = CleanTypeMapper.mapTypeSpecType(property.type, property.name);
      
      expect(result.goType).toBe("map[string]User");
      expect(result.usePointerForOptional).toBe(true);
      expect(result.requiresImport).toBeUndefined();
    });

    it("should handle maps with time values and imports", () => {
      const mapType: TypeSpecTypeNode = {
        kind: "map",
        keyType: { kind: "scalar", name: "string" },
        valueType: { kind: "scalar", name: "utcDateTime" }
      };

      const property: TypeSpecPropertyNode = {
        name: "timestamps",
        type: mapType,
        optional: false
      };

      const result = CleanTypeMapper.mapTypeSpecType(property.type, property.name);
      
      expect(result.goType).toBe("map[string]time.Time");
      expect(result.usePointerForOptional).toBe(true);
      expect(result.requiresImport).toBe("time");
    });

    it("should handle maps with array values", () => {
      const arrayType: TypeSpecTypeNode = {
        kind: "array",
        elementType: { kind: "scalar", name: "string" }
      };

      const mapType: TypeSpecTypeNode = {
        kind: "map",
        keyType: { kind: "scalar", name: "string" },
        valueType: arrayType
      };

      const property: TypeSpecPropertyNode = {
        name: "tags",
        type: mapType,
        optional: false
      };

      const result = CleanTypeMapper.mapTypeSpecType(property.type, property.name);
      
      expect(result.goType).toBe("map[string][]string");
      expect(result.usePointerForOptional).toBe(true);
      expect(result.requiresImport).toBeUndefined();
    });
  });

  describe("Map Type Key Constraints", () => {
    it("should handle int keys", () => {
      const mapType: TypeSpecTypeNode = {
        kind: "map",
        keyType: { kind: "scalar", name: "int32" },
        valueType: { kind: "scalar", name: "string" }
      };

      const property: TypeSpecPropertyNode = {
        name: "indexMap",
        type: mapType,
        optional: false
      };

      const result = CleanTypeMapper.mapTypeSpecType(property.type, property.name);
      
      expect(result.goType).toBe("map[int32]string");
      expect(result.usePointerForOptional).toBe(true);
    });

    it("should handle non-comparable key types gracefully", () => {
      const arrayKeyType: TypeSpecTypeNode = {
        kind: "array",
        elementType: { kind: "scalar", name: "string" }
      };

      const mapType: TypeSpecTypeNode = {
        kind: "map",
        keyType: arrayKeyType,
        valueType: { kind: "scalar", name: "string" }
      };

      const property: TypeSpecPropertyNode = {
        name: "invalidKeyMap",
        type: mapType,
        optional: false
      };

      const result = CleanTypeMapper.mapTypeSpecType(property.type, property.name);
      
      // Should default to string key type, keep string value type
      expect(result.goType).toBe("map[string]string");
      expect(result.usePointerForOptional).toBe(true);
    });

    it("should handle map keys (special Go constraint)", () => {
      // Map with map key type should default to string
      const innerMapType: TypeSpecTypeNode = {
        kind: "map",
        keyType: { kind: "scalar", name: "string" },
        valueType: { kind: "scalar", name: "string" }
      };

      const mapType: TypeSpecTypeNode = {
        kind: "map",
        keyType: innerMapType,
        valueType: { kind: "scalar", name: "string" }
      };

      const property: TypeSpecPropertyNode = {
        name: "mapKeyMap",
        type: mapType,
        optional: false
      };

      const result = CleanTypeMapper.mapTypeSpecType(property.type, property.name);
      
      // Should default to string key type
      expect(result.goType).toBe("map[string]string");
      expect(result.usePointerForOptional).toBe(true);
    });
  });

  describe("Map Type Edge Cases", () => {
    it("should handle optional maps", () => {
      const mapType: TypeSpecTypeNode = {
        kind: "map",
        keyType: { kind: "scalar", name: "string" },
        valueType: { kind: "scalar", name: "string" }
      };

      const property: TypeSpecPropertyNode = {
        name: "optionalConfig",
        type: mapType,
        optional: true
      };

      const result = CleanTypeMapper.mapTypeSpecType(property.type, property.name);
      
      expect(result.goType).toBe("map[string]string");
      expect(result.usePointerForOptional).toBe(true);
    });

    it("should handle maps with missing key type", () => {
      const invalidMapType: TypeSpecTypeNode = {
        kind: "map",
        valueType: { kind: "scalar", name: "string" }
        // Missing keyType
      };

      const property: TypeSpecPropertyNode = {
        name: "invalidMap",
        type: invalidMapType,
        optional: false
      };

      const result = CleanTypeMapper.mapTypeSpecType(property.type, property.name);
      
      // Should fallback to map[string]interface{}
      expect(result.goType).toBe("map[string]interface{}");
      expect(result.usePointerForOptional).toBe(true);
    });

    it("should handle maps with missing value type", () => {
      const invalidMapType: TypeSpecTypeNode = {
        kind: "map",
        keyType: { kind: "scalar", name: "string" }
        // Missing valueType
      };

      const property: TypeSpecPropertyNode = {
        name: "invalidMap",
        type: invalidMapType,
        optional: false
      };

      const result = CleanTypeMapper.mapTypeSpecType(property.type, property.name);
      
      // Should fallback to map[string]interface{}
      expect(result.goType).toBe("map[string]interface{}");
      expect(result.usePointerForOptional).toBe(true);
    });

    it("should handle invalid map types gracefully", () => {
      const invalidMapType = {
        kind: "map"
        // Missing both keyType and valueType
      };

      const property: TypeSpecPropertyNode = {
        name: "invalidMap",
        type: invalidMapType,
        optional: false
      };

      const result = CleanTypeMapper.mapTypeSpecType(property.type, property.name);
      
      // Should fallback to map[string]interface{}
      expect(result.goType).toBe("map[string]interface{}");
      expect(result.usePointerForOptional).toBe(true);
    });
  });

  describe("Real-World Integration Patterns", () => {
    it("should handle Config model with metadata map", () => {
      // Pattern: model Config { metadata: Record<string, string>; }
      const metadataMap: TypeSpecTypeNode = {
        kind: "record",
        keyType: { kind: "scalar", name: "string" },
        valueType: { kind: "scalar", name: "string" }
      };

      const property: TypeSpecPropertyNode = {
        name: "metadata",
        type: metadataMap,
        optional: false
      };

      const result = CleanTypeMapper.mapTypeSpecType(property.type, property.name);
      
      expect(result.goType).toBe("map[string]string");
      expect(result.usePointerForOptional).toBe(true);
      expect(result.requiresImport).toBeUndefined();
    });

    it("should handle complex settings map", () => {
      // Pattern: settings: Map<string, any>
      const settingsMap: TypeSpecTypeNode = {
        kind: "map",
        keyType: { kind: "scalar", name: "string" },
        valueType: { kind: "built-in" } // Would be "any" in real TypeSpec
      };

      const property: TypeSpecPropertyNode = {
        name: "settings",
        type: settingsMap,
        optional: false
      };

      const result = CleanTypeMapper.mapTypeSpecType(property.type, property.name);
      
      // Should handle unknown value types gracefully
      expect(result.goType).toContain("map[string]");
      expect(result.usePointerForOptional).toBe(true);
    });

    it("should handle nested map structures", () => {
      // Pattern: Map<string, Map<string, int>>
      const innerMapType: TypeSpecTypeNode = {
        kind: "map",
        keyType: { kind: "scalar", name: "string" },
        valueType: { kind: "scalar", name: "int32" }
      };

      const outerMapType: TypeSpecTypeNode = {
        kind: "map",
        keyType: { kind: "scalar", name: "string" },
        valueType: innerMapType
      };

      const property: TypeSpecPropertyNode = {
        name: "nestedMap",
        type: outerMapType,
        optional: false
      };

      const result = CleanTypeMapper.mapTypeSpecType(property.type, property.name);
      
      expect(result.goType).toBe("map[string]map[string]int32");
      expect(result.usePointerForOptional).toBe(true);
    });
  });

  describe("Import Management for Maps", () => {
    it("should correctly track imports for map value types", () => {
      const timeMap = {
        name: "timestamps",
        type: {
          kind: "map" as const,
          keyType: { kind: "scalar" as const, name: "string" },
          valueType: { kind: "scalar" as const, name: "utcDateTime" }
        },
        optional: false
      } as TypeSpecPropertyNode;

      const durationMap = {
        name: "durations",
        type: {
          kind: "map" as const,
          keyType: { kind: "scalar" as const, name: "string" },
          valueType: { kind: "scalar" as const, name: "duration" }
        },
        optional: false
      } as TypeSpecPropertyNode;

      const timeResult = CleanTypeMapper.mapTypeSpecType(timeMap.type, timeMap.name);
      const durationResult = CleanTypeMapper.mapTypeSpecType(durationMap.type, durationMap.name);

      // Both should require time import
      expect(timeResult.requiresImport).toBe("time");
      expect(durationResult.requiresImport).toBe("time");

      // Test import collection
      const requiredImports = CleanTypeMapper.getRequiredImports([timeResult, durationResult]);
      expect(requiredImports).toEqual(["time"]);
    });

    it("should handle mixed imports across different map types", () => {
      const maps = [
        {
          name: "timestamps",
          type: {
            kind: "map" as const,
            keyType: { kind: "scalar" as const, name: "string" },
            valueType: { kind: "scalar" as const, name: "utcDateTime" }
          }
        },
        {
          name: "users",
          type: {
            kind: "map" as const,
            keyType: { kind: "scalar" as const, name: "string" },
            valueType: { kind: "model" as const, name: "User" }
          }
        },
        {
          name: "scores",
          type: {
            kind: "map" as const,
            keyType: { kind: "scalar" as const, name: "string" },
            valueType: { kind: "scalar" as const, name: "int32" }
          }
        }
      ] as TypeSpecPropertyNode[];

      const results = maps.map(map => 
        CleanTypeMapper.mapTypeSpecType(map.type, map.name)
      );

      const requiredImports = CleanTypeMapper.getRequiredImports(results);
      expect(requiredImports).toEqual(["time"]); // Only time import needed
    });
  });
});