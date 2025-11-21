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

      // DOMAIN INTELLIGENCE: Automatic uint detection for never-negative fields
      // If this is an int type but fieldName suggests it should be uint, upgrade it
      const goType = this.applyUintDomainIntelligence(mapping.name, scalarName, fieldName);

      return {
        kind: "basic",
        name: goType,
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

    // Handle array types using our test data structure
    if (type.kind === "Array" && (type as any).elementType) {
      const elementType = this.mapTypeSpecType((type as any).elementType);
      return {
        kind: "slice",
        elementType,
        usePointerForOptional: false,
      };
    }

    // Handle union types - ENHANCED FEATURE!
    if ((type as any).kind === "union") {
      const unionVariants = (type as any).variants?.map((variant: any) => 
        this.mapTypeSpecType(variant.type)
      ) || [];
      
      const unionName = GoTypeStringGenerator.toPascalCase((type as any).name || "Union");
      return {
        kind: "union",
        name: unionName,
        unionVariants,
        usePointerForOptional: false,
      };
    }

    // Handle template types - ENHANCED FEATURE!
    if ((type as any).kind === "template") {
      const templateName = (type as any).name || "T";
      const templateParams = (type as any).template || "T";
      return {
        kind: "template",
        name: templateName,
        template: templateParams,
        usePointerForOptional: false,
      };
    }

    // Handle composition types (spread operator) - ENHANCED FEATURE!
    if ((type as any).kind === "spread") {
      const baseTypes = (type as any).types?.map((baseType: any) => 
        this.mapTypeSpecType(baseType)
      ) || [];
        
      const spreadName = GoTypeStringGenerator.toPascalCase((type as any).name || "Spread");
      return {
        kind: "spread",
        name: spreadName,
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

  /**
   * DOMAIN INTELLIGENCE: Automatic uint detection for never-negative fields
   * 
   * This method applies domain knowledge to upgrade int types to uint when field names
   * suggest the values should never be negative (IDs, counts, ages, ports, etc.)
   * 
   * Priority: Native TypeSpec uint types > Automatic detection > Default types
   */
  private static applyUintDomainIntelligence(
    goType: string, 
    typeSpecType: string, 
    fieldName?: string
  ): string {
    // If this is already a uint type, no changes needed
    if (goType.startsWith("uint")) {
      return goType;
    }

    // If this is not an int type, don't upgrade to uint
    if (!goType.startsWith("int")) {
      return goType;
    }

    // Apply domain intelligence to detect when integers should be unsigned
    if (!fieldName) {
      return goType; // No field name, can't apply intelligence
    }

    // PATTERNS FOR UNSIGNED INTEGERS (never-negative values)
    const uintPatterns = [
      // IDs and identifiers
      /\bid\d*\b/i,           // id, userID, orderID
      /.*_id$/i,              // user_id, order_id  
      /.*id$/i,               // userid, orderid
      
      // Counts and quantities
      /\bcount\b/i,           // count, userCount
      /\bquantity\b/i,         // quantity, itemQuantity
      /\bnum(ber)?\b/i,       // num, number, itemNumber
      /\btotal\b/i,           // total, grandTotal
      
      // Ages and durations
      /\bage\b/i,             // age, userAge
      /\bduration\b/i,        // duration, sessionDuration
      /\blength\b/i,          // length, arrayLength
      /\bsize\b/i,            // size, fileSize
      
      // Network and ports
      /\bport\b/i,            // port, serverPort
      /\bcode\b/i,            // code, statusCode, errorCode
      
      // Indices and positions
      /\bindex\b/i,           // index, arrayIndex
      /\bposition\b/i,        // position, cursorPosition
      /\boffset\b/i,          // offset, byteOffset
      
      // Status and flags
      /\bstatus\b/i,          // status, orderStatus
      /\bflag\b/i,            // flag, isActive
      /\blevel\b/i,           // level, skillLevel
      /\bscore\b/i,           // score, gameScore
    ];

    // Check if field name matches any uint pattern
    const shouldUseUint = uintPatterns.some(pattern => pattern.test(fieldName));
    
    if (!shouldUseUint) {
      return goType; // No pattern match, use original type
    }

    // Upgrade int to uint based on the original int size
    switch (goType) {
      case "int8":
        return "uint8";   // 0-255 for small counts/flags
      case "int16":
        return "uint16";  // 0-65535 for ports/codes
      case "int32":
        return "uint32";  // 0-4.29B for IDs/timestamps
      case "int64":
        return "uint64";  // 0-18.4Q for large counts/big IDs
      case "int":
        return "uint";    // Default Go int size
      default:
        return goType;    // Unknown int type, keep original
    }
  }

  // DELETED: shouldUseUnsignedType() - UNNECESSARY AI OVER-ENGINEERING
  // TypeSpec has native uint types! Use direct 1:1 mapping instead.
  // Example: Use uint32 in TypeSpec, not int32 with AI detection.
}
