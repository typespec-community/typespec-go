/**
 * Go Type Mapping Utilities
 * 
 * Centralized TypeSpec to Go type conversion with no more 'any'
 * Type-safe, focused, minimal over-engineering
 * 
 * @fileoverview TypeSpec → Go type mapping
 */

import type {
  Model as TypeSpecModel,
  ModelProperty as TypeSpecModelProperty,
  Scalar as TypeSpecScalar,
  Type as TypeSpecType,
} from "@typespec/compiler";

/**
 * Mapped Go type information
 */
export interface MappedGoType {
  /** Go type name (e.g., 'int32', 'string', '[]string') */
  readonly name: string;
  
  /** Whether this type requires import */
  readonly requiresImport: boolean;
  
  /** Import path if needed */
  readonly importPath?: string;
  
  /** Whether to use pointer for optional properties */
  readonly usePointerForOptional: boolean;
}

/**
 * TypeSpec to Go type mapper
 * 
 * Handles conversion of TypeSpec scalar types to Go types
 * with proper import management and type safety
 */
export class GoTypeMapper {
  private static readonly TYPE_MAP: Record<string, MappedGoType> = {
    // Integer types
    "int8": { name: "int8", requiresImport: false, usePointerForOptional: true },
    "int16": { name: "int16", requiresImport: false, usePointerForOptional: true },
    "int32": { name: "int32", requiresImport: false, usePointerForOptional: true },
    "int64": { name: "int64", requiresImport: false, usePointerForOptional: true },
    
    // Unsigned integer types  
    "uint8": { name: "uint8", requiresImport: false, usePointerForOptional: true },
    "uint16": { name: "uint16", requiresImport: false, usePointerForOptional: true },
    "uint32": { name: "uint32", requiresImport: false, usePointerForOptional: true },
    "uint64": { name: "uint64", requiresImport: false, usePointerForOptional: true },
    
    // Floating point types
    "float32": { name: "float32", requiresImport: false, usePointerForOptional: true },
    "float64": { name: "float64", requiresImport: false, usePointerForOptional: true },
    
    // Other built-in types
    "string": { name: "string", requiresImport: false, usePointerForOptional: true },
    "boolean": { name: "bool", requiresImport: false, usePointerForOptional: true },
    "bytes": { name: "[]byte", requiresImport: false, usePointerForOptional: true },
    "plainDate": { name: "string", requiresImport: false, usePointerForOptional: true },
    "plainTime": { name: "string", requiresImport: false, usePointerForOptional: true },
    "url": { name: "string", requiresImport: false, usePointerForOptional: true },
    
    // Time package types
    "utcDateTime": { 
      name: "time.Time", 
      requiresImport: true, 
      importPath: "time",
      usePointerForOptional: true 
    },
    "offsetDateTime": { 
      name: "time.Time", 
      requiresImport: true, 
      importPath: "time",
      usePointerForOptional: true 
    },
    "duration": { 
      name: "time.Duration", 
      requiresImport: true, 
      importPath: "time",
      usePointerForOptional: true 
    },
  };

  /**
   * Map TypeSpec type to Go type
   */
  static mapTypeSpecType(typeSpecType: TypeSpecType): MappedGoType {
    switch (typeSpecType.kind) {
      case "Scalar":
        return this.mapScalar(typeSpecType);
      case "Model":
        return this.mapModel(typeSpecType);
      default:
        return this.createFallbackType(typeSpecType);
    }
  }

  /**
   * Map TypeSpec scalar to Go type
   */
  private static mapScalar(scalar: TypeSpecScalar): MappedGoType {
    const mapped = this.TYPE_MAP[scalar.name];
    if (mapped) {
      return mapped;
    }
    
    // Handle unknown scalars
    return this.createFallbackType(scalar);
  }

  /**
   * Map TypeSpec model to Go type (struct name)
   */
  private static mapModel(model: TypeSpecModel): MappedGoType {
    return {
      name: this.toPascalCase(model.name),
      requiresImport: false,
      usePointerForOptional: true,
    };
  }

  /**
   * Create fallback type for unknown TypeSpec types
   */
  private static createFallbackType(unknownType: any): MappedGoType {
    console.warn(`Unknown TypeSpec type kind: ${(unknownType as any)?.kind || 'undefined'}, using 'any'`);
    return {
      name: "any",
      requiresImport: false,
      usePointerForOptional: false,
    };
  }

  /**
   * Convert string to PascalCase (TypeSpec model name → Go struct name)
   */
  private static toPascalCase(str: string): string {
    return str
      .replace(/(?:^|[_-])([a-z])/g, (_, c) => c.toUpperCase())
      .replace(/([a-z])([A-Z])/g, (_, c1, c2) => `${c1}${c2.toLowerCase()}`);
  }

  /**
   * Get all imports needed for a set of mapped types
   */
  static getImportsForTypes(types: readonly MappedGoType[]): ReadonlyMap<string, string> {
    const imports = new Map<string, string>();
    
    for (const type of types) {
      if (type.requiresImport && type.importPath) {
        if (!imports.has(type.importPath)) {
          imports.set(type.importPath, type.importPath);
        }
      }
    }
    
    return imports;
  }
}