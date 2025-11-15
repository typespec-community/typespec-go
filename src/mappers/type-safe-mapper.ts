/**
 * Type-Safe Type Mapping Service
 * 
 * ELIMINATES ALL 'any' USAGE
 * Uses exhaustive matching with compile-time safety
 * Supports complete Go integer system (signed + unsigned)
 */

import { 
  TypeSpecTypeNode, 
  GoTypeMapping, 
  OptionalHandlingStrategy,
  GoField,
  TypeSpecPropertyNode,
  ValidationRule
} from "../types/type-spec-types.js";

/**
 * Comprehensive TypeSpec to Go type mappings
 * ZERO 'any' types - fully typed union
 */
export const TYPE_SPEC_MAPPINGS = {
  // String types
  String: { goType: "string", usePointerForOptional: true },
  
  // Signed integer types
  Int8: { goType: "int8", usePointerForOptional: true },
  Int16: { goType: "int16", usePointerForOptional: true },
  Int32: { goType: "int32", usePointerForOptional: true },
  Int64: { goType: "int64", usePointerForOptional: true },
  
  // Unsigned integer types (MISSING PREVIOUSLY)
  Uint8: { goType: "uint8", usePointerForOptional: true },
  Uint16: { goType: "uint16", usePointerForOptional: true },
  Uint32: { goType: "uint32", usePointerForOptional: true },
  Uint64: { goType: "uint64", usePointerForOptional: true },
  
  // Float types
  Float32: { goType: "float32", usePointerForOptional: true },
  Float64: { goType: "float64", usePointerForOptional: true },
  
  // Boolean and other types (FIX: Remove duplicate Bool)
  Boolean: { goType: "bool", usePointerForOptional: true },
  Bytes: { goType: "[]byte", usePointerForOptional: true },
  
  // Complex types (add minimal implementations)
  Array: { goType: "[]interface{}", usePointerForOptional: false },
  Model: { goType: "interface{}", usePointerForOptional: false },
  Enum: { goType: "string", usePointerForOptional: true },
  Union: { goType: "interface{}", usePointerForOptional: false },
  
} as const satisfies Record<TypeSpecTypeNode["kind"], GoTypeMapping>;

/**
 * Type-safe mapping service
 * ZERO 'any' types with exhaustive matching
 */
export class TypeSafeMapper {
  /**
   * Map TypeSpec type to Go type with full type safety
   * NO 'any' types - exhaustive matching enforced
   */
  static mapTypeSpecType(type: TypeSpecTypeNode): GoTypeMapping {
    const mapping = TYPE_SPEC_MAPPINGS[type.kind];
    
    // TypeScript enforces exhaustive matching
    if (!mapping) {
      throw new Error(`Unsupported TypeSpec type: ${type.kind}`);
    }
    
    return mapping;
  }
  
  /**
   * Determine optional handling strategy based on type
   */
  static determineOptionalStrategy(type: TypeSpecTypeNode): OptionalHandlingStrategy {
    // String types use pointer strategy
    if (type.kind === "String") return OptionalHandlingStrategy.Pointer;
    
    // All primitive types use pointer strategy
    const primitiveTypes = ["Int8", "Int16", "Int32", "Int64", "Uint8", "Uint16", "Uint32", "Uint64", "Float32", "Float64", "Boolean"];
    if (primitiveTypes.includes(type.kind)) return OptionalHandlingStrategy.Pointer;
    
    // Bytes uses pointer strategy
    if (type.kind === "Bytes") return OptionalHandlingStrategy.Pointer;
    
    // Array and complex types need validation
    return OptionalHandlingStrategy.Validation;
  }
  
  /**
   * Generate validation rules for complex types
   */
  static generateValidationRules(type: TypeSpecTypeNode): ValidationRule[] {
    switch (type.kind) {
      case "Array":
        return [{ type: "min", value: 0, message: "Array cannot be null" }];
      case "String":
        return [{ type: "min", value: 0, message: "String cannot be null" }];
      default:
        return [];
    }
  }
}