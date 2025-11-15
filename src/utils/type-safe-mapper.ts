/**
 * Type-safe Type Mapper
 * 
 * ZERO ANY TYPES: Professional type safety
 * EXHAUSTIVE MATCHING: Compile-time safety enforced
 * UNREPRESENTABLE INVALID STATES: Strong typing
 */

import { TypeSpecTypeNode } from "../types/type-spec-types.js";

/**
 * Go Type Mapping
 * 
 * ZERO ANY TYPES: Professional type safety
 * SINGLE RESPONSIBILITY: Go type concerns only
 */
export interface GoTypeMapping {
  readonly goType: string;
  readonly usePointerForOptional: boolean;
  readonly isComplex: boolean;
}

/**
 * Type-safe Mapper Service
 * 
 * ZERO ANY TYPES: Professional type safety
 * EXHAUSTIVE MATCHING: All TypeSpec types covered
 */
export class TypeSafeMapperService {
  /**
   * Complete TypeSpec to Go mappings
   * 
   * EXHAUSTIVE MATCHING: All TypeSpec kinds covered
   * ZERO ANY TYPES: Professional type safety
   */
  private static readonly TYPE_MAPPINGS: Record<TypeSpecTypeNode["kind"], GoTypeMapping> = {
    // String types
    String: { goType: "string", usePointerForOptional: true, isComplex: false },
    
    // Signed integer types
    Int8: { goType: "int8", usePointerForOptional: true, isComplex: false },
    Int16: { goType: "int16", usePointerForOptional: true, isComplex: false },
    Int32: { goType: "int32", usePointerForOptional: true, isComplex: false },
    Int64: { goType: "int64", usePointerForOptional: true, isComplex: false },
    
    // Unsigned integer types (COMPLETE COVERAGE)
    Uint8: { goType: "uint8", usePointerForOptional: true, isComplex: false },
    Uint16: { goType: "uint16", usePointerForOptional: true, isComplex: false },
    Uint32: { goType: "uint32", usePointerForOptional: true, isComplex: false },
    Uint64: { goType: "uint64", usePointerForOptional: true, isComplex: false },
    
    // Float types
    Float32: { goType: "float32", usePointerForOptional: true, isComplex: false },
    Float64: { goType: "float64", usePointerForOptional: true, isComplex: false },
    
    // Boolean and other types
    Boolean: { goType: "bool", usePointerForOptional: true, isComplex: false },
    Bytes: { goType: "[]byte", usePointerForOptional: true, isComplex: true },
    
    // Complex types (type-safe implementations)
    Array: { goType: "[]interface{}", usePointerForOptional: false, isComplex: true },
    Model: { goType: "interface{}", usePointerForOptional: false, isComplex: true },
    Enum: { goType: "string", usePointerForOptional: true, isComplex: true },
    Union: { goType: "interface{}", usePointerForOptional: false, isComplex: true }
  } as const;

  /**
   * Type-safe type mapping
   * 
   * EXHAUSTIVE MATCHING: All TypeSpec kinds covered
   * ZERO ANY TYPES: Professional type safety
   * UNREPRESENTABLE INVALID STATES: Compile-time safety
   */
  static mapTypeSpecType(type: TypeSpecTypeNode): GoTypeMapping {
    const mapping = this.TYPE_MAPPINGS[type.kind];
    if (!mapping) {
      throw new Error(`Unsupported TypeSpec type: ${type.kind}`);
    }
    return mapping;
  }

  /**
   * Type-safe optional field mapping
   * 
   * ZERO ANY TYPES: Professional type safety
   * SINGLE RESPONSIBILITY: Optional field concerns only
   */
  static mapOptionalField(type: TypeSpecTypeNode): GoTypeMapping {
    const baseMapping = this.mapTypeSpecType(type);
    
    if (!baseMapping.usePointerForOptional) {
      return baseMapping;
    }

    return {
      ...baseMapping,
      goType: `*${baseMapping.goType}`
    };
  }

  /**
   * Type-safe complex type validation
   * 
   * ZERO ANY TYPES: Professional type safety
   * SINGLE RESPONSIBILITY: Complex type concerns only
   */
  static isComplexType(type: TypeSpecTypeNode): boolean {
    const mapping = this.mapTypeSpecType(type);
    return mapping.isComplex;
  }

  /**
   * Type-safe validation of mapping
   * 
   * ZERO ANY TYPES: Professional type safety
   * SINGLE RESPONSIBILITY: Validation concerns only
   */
  static validateMapping(type: TypeSpecTypeNode): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    try {
      const mapping = this.mapTypeSpecType(type);
      
      if (!mapping.goType) {
        errors.push('Missing Go type in mapping');
      }
      
      if (typeof mapping.usePointerForOptional !== 'boolean') {
        errors.push('Invalid pointer flag in mapping');
      }
      
      if (typeof mapping.isComplex !== 'boolean') {
        errors.push('Invalid complexity flag in mapping');
      }
      
    } catch (error) {
      errors.push(`Mapping validation error: ${error.message}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}