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

      // Apply domain intelligence for unsigned integer detection
      let finalMapping = mapping;
      if (fieldName && this.shouldUseUnsignedType(fieldName)) {
        // Map signed integers to unsigned equivalents
        const unsignedMapping = this.getUnsignedEquivalent(mapping.name);
        if (unsignedMapping) {
          finalMapping = unsignedMapping;
        }
      }

      return {
        kind: "basic",
        name: finalMapping.name,
        usePointerForOptional: finalMapping.usePointerForOptional,
        requiresImport: finalMapping.requiresImport,
        ...(finalMapping.importPath && { importPath: finalMapping.importPath }),
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

  /**
   * Check if type should use unsigned integer (domain intelligence)
   * DOMAIN LOGIC: Never-negative fields should use uint
   */
  static shouldUseUnsignedType(fieldName: string): boolean {
    const neverNegativePatterns = [
      /id$/i, // userID, orderID - can't be negative!
      /count$/i, // itemCount - can't be negative!
      /age$/i, // userAge - Can't be negative!
      /amount$/i, // paymentAmount - Can't be negative!
      /quantity$/i, // productQuantity - can't be negative!
      /size$/i, // fileSize, arraySize - can't be negative!
      /length$/i, // stringLength - can't be negative!
      /index$/i, // arrayIndex - can't be negative!
      /position$/i, // arrayPosition - can't be negative!
      /number$/i, // phoneNumber, accountNumber - can't be negative!
      /code$/i, // statusCode, zipCode - can't be negative!
    ];
    return neverNegativePatterns.some((pattern) => pattern.test(fieldName));
  }

  /**
   * Get unsigned equivalent for signed integer types
   * DOMAIN LOGIC: Map signed types to unsigned for never-negative fields
   */
  private static getUnsignedEquivalent(signedTypeName: string): BasicMappedType | null {
    const unsignedEquivalents: Record<string, string> = {
      "int8": "uint8",
      "int16": "uint16", 
      "int32": "uint32",
      "int64": "uint64",
    };

    const unsignedType = unsignedEquivalents[signedTypeName];
    if (!unsignedType) {
      return null; // No unsigned equivalent or not a signed integer
    }

    return SCALAR_TYPE_MAPPINGS[unsignedType] || null;
  }
}
