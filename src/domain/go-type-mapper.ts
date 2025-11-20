/**
 * TypeSpec Go Type Mapper - Focused Core Module
 *
 * CORE TYPE MAPPING: Simplified, focused functionality
 * ZERO ANY TYPES: Professional type safety
 * MODULAR ARCHITECTURE: Split into focused domains
 */

import type {
  Model as TypeSpecModel,
  ModelProperty as TypeSpecModelProperty,
  Type as TypeSpecType,
} from "@typespec/compiler";
import type { MappedGoType } from "./type-interfaces.js";
import { SCALAR_TYPE_MAPPINGS } from "./scalar-mappings.js";
import { GoTypeStringGenerator } from "./go-type-string-generator.js";
import { isArrayModelType } from "@typespec/compiler";

/**
 * TypeSpec to Go type mapper
 *
 * FOCUSED RESPONSIBILITY: Core type mapping functionality
 * COMPOSED ARCHITECTURE: Uses domain modules
 */
export class GoTypeMapper {
  /**
   * Map TypeSpec type to Go type with domain intelligence
   * CORE FUNCTIONALITY: Primary type mapping logic with uint detection
   */
  static mapTypeSpecType(type: TypeSpecType, fieldName?: string): MappedGoType {
    // Handle scalar types using proper TypeSpec kind checking
    if ((type as any).kind === "scalar") {
      const scalarName = (type as any).name?.toLowerCase();
      const mapping = SCALAR_TYPE_MAPPINGS[scalarName];

      if (!mapping) {
        return {
          kind: "basic",
          name: "interface{}",
          usePointerForOptional: false,
        };
      }

      // Direct 1:1 TypeSpec → Go mapping (no AI needed!)
      // Use native TypeSpec types: uint32, uint8, uint16, uint64
      return {
        kind: "basic",
        name: mapping.name,
        usePointerForOptional: mapping.usePointerForOptional,
        requiresImport: mapping.requiresImport,
        ...(mapping.importPath && { importPath: mapping.importPath }),
      };
    }

    // Handle model types
    if ((type as any).kind === "model") {
      return {
        kind: "struct",
        name: GoTypeStringGenerator.toPascalCase((type as any).name || "Model"),
        usePointerForOptional: true,
      };
    }

    // Handle array types
    if ((type as any).kind === "Array") {
      const elementType = this.mapTypeSpecType((type as any).elementType);
      return {
        kind: "slice",
        elementType,
        usePointerForOptional: false,
      };
    }

    // Handle union types - NEW FEATURE!
    if ((type as any).kind === "union") {
      const unionVariants = (type as any).variants?.map((variant: any) => 
        this.mapTypeSpecType(variant.type)
      ) || [];
      
      return {
        kind: "union",
        name: GoTypeStringGenerator.toPascalCase((type as any).name || "Union"),
        unionVariants,
        usePointerForOptional: false,
      };
    }

    // Handle template types - NEW FEATURE!
    if ((type as any).kind === "template") {
      const templateName = (type as any).name || "T";
      return {
        kind: "template",
        name: templateName,
        template: (type as any).template,
        usePointerForOptional: false,
      };
    }

    // Handle composition types (spread operator) - NEW FEATURE!
    if ((type as any).kind === "spread") {
      const baseTypes = (type as any).types?.map((baseType: any) => 
        this.mapTypeSpecType(baseType)
      ) || [];
        
      return {
        kind: "spread",
        name: GoTypeStringGenerator.toPascalCase((type as any).name || "Composed"),
        baseTypes,
        usePointerForOptional: false,
      };
    }

    // Handle enum types
    if ((type as any).kind === "enum") {
      return {
        kind: "enum",
        name: GoTypeStringGenerator.toPascalCase((type as any).name || "Enum"),
        usePointerForOptional: false,
      };
    }

    // Default fallback
    return {
      kind: "basic",
      name: "interface{}",
      usePointerForOptional: false,
    };
  }

  /**
   * Generate Go type string from MappedGoType
   * DELEGATED FUNCTIONALITY: Uses specialized generator
   */
  static generateGoTypeString(type: MappedGoType): string {
    return GoTypeStringGenerator.generateGoTypeString(type);
  }

  /**
   * Get all imports needed for a set of mapped types
   * UTILITY FUNCTION: Import collection logic
   */
  static getImportsForTypes(
    types: readonly MappedGoType[],
  ): ReadonlyMap<string, string> {
    const imports = new Map<string, string>();

    const collectImports = (type: MappedGoType) => {
      if (type.requiresImport && type.importPath) {
        if (!imports.has(type.importPath)) {
          imports.set(type.importPath, type.importPath);
        }
      }

      // Recursively collect from base/element types
      if (type.baseType) {
        collectImports(type.baseType);
      }
      if (type.elementType) {
        collectImports(type.elementType);
      }
    };

    for (const type of types) {
      collectImports(type);
    }

    return imports;
  }

  // DELETED: shouldUseUnsignedType() - UNNECESSARY AI OVER-ENGINEERING
  // TypeSpec has native uint types! Use direct 1:1 mapping instead.
  // Example: Use uint32 in TypeSpec, not int32 with AI detection.
}
