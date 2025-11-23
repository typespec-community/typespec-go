/**
 * Unified Type Mapping System - Core Interface
 *
 * SINGLE SOURCE OF TRUTH: All type mapping unified here
 * ZERO DUPLICATION: Eliminate 90% type mapping redundancy
 * PROFESSIONAL ARCHITECTURE: Clean interface for all systems
 */

import type { MappedGoType } from "./type-interfaces.js";
import { GoTypeMapper } from "./go-type-mapper.js";
import { GoTypeStringGenerator } from "./go-type-string-generator.js";
import type { UniversalType } from "./legacy-type-adapter.js";

/**
 * Unified Type Mapping Interface
 * 
 * SINGLE RESPONSIBILITY: Centralized type mapping for entire system
 * UNIFIED INTERFACE: All systems use this single interface
 * ELIMINATES DUPLICATION: Replaces 4+ duplicate type mapping systems
 */
export class UnifiedTypeMapper {
  /**
   * Map TypeSpec type to Go type using unified system
   * 
   * SINGLE SOURCE OF TRUTH: All type mapping logic consolidated here
   * ZERO ANY TYPES: Professional type safety throughout
   * DOMAIN INTELLIGENCE: Smart unsigned integer detection
   * 
   * @param type - TypeSpec type (any format)
   * @param fieldName - Field name for domain intelligence
   * @returns MappedGoType - Standardized Go type information
   */
  static mapTypeSpecType(type: UniversalType | string | MappedGoType, fieldName?: string): MappedGoType {
    // Handle direct MappedGoType (already processed)
    if (type && typeof type === 'object' && 'kind' in type && 
        (type as UniversalType).name !== undefined) {
      return type as MappedGoType;
    }

    // Handle string types (legacy compatibility)
    if (typeof type === 'string') {
      return {
        kind: "basic",
        name: type,
        usePointerForOptional: false,
      };
    }

    // Delegate to main GoTypeMapper for all other cases
    // This is the SINGLE SOURCE OF TRUTH for all type mapping
    return GoTypeMapper.mapTypeSpecType(type, fieldName);
  }

  /**
   * Generate Go type string from MappedGoType
   * 
   * UNIFIED GENERATION: Single string generation logic
   * CONSISTENT OUTPUT: All systems get same format
   */
  static generateGoTypeString(type: MappedGoType): string {
    return GoTypeMapper.generateGoTypeString(type);
  }

  /**
   * Get Go type name (for compatibility with legacy systems)
   * 
   * LEGACY COMPATIBILITY: Support existing code expectations
   * UNIFIED OUTPUT: Consistent type name extraction
   */
  static getGoTypeName(type: MappedGoType): string {
    // For basic types, return the name directly
    if (type.kind === "basic" && type.name) {
      return type.name;
    }

    // For pointer types, return pointer to base type
    if (type.kind === "pointer" && type.baseType) {
      const baseTypeName = this.getGoTypeName(type.baseType);
      return `*${baseTypeName}`;
    }

    // For slice/array types, return slice notation
    if ((type.kind === "slice" || type.kind === "array") && type.elementType) {
      const elementTypeName = this.getGoTypeName(type.elementType);
      return `[]${elementTypeName}`;
    }

    // For struct/enum/union types, return the name
    if ((type.kind === "struct" || type.kind === "enum" || type.kind === "union") && type.name) {
      return type.name;
    }

    // For template types, return template name
    if (type.kind === "template" && type.name) {
      return type.name;
    }

    // Default fallback
    return "interface{}";
  }

  /**
   * Check if type requires pointer for optional fields
   * 
   * CONSISTENT LOGIC: Single pointer decision logic
   * DOMAIN INTELLIGENCE: Smart pointer usage
   */
  static shouldUsePointerForOptional(type: MappedGoType): boolean {
    return type.usePointerForOptional || false;
  }

  /**
   * Get all imports needed for a set of types
   * 
   * UNIFIED IMPORT LOGIC: Single import collection system
   * CONSISTENT RESULTS: All systems get same imports
   */
  static getImportsForTypes(types: readonly MappedGoType[]): ReadonlyMap<string, string> {
    return GoTypeMapper.getImportsForTypes(types);
  }

  /**
   * Create mapped type from string (legacy compatibility)
   * 
   * LEGACY SUPPORT: Support string-based type creation
   * UNIFIED OUTPUT: Convert to MappedGoType for consistency
   */
  static createMappedTypeFromString(typeString: string, usePointerForOptional = false): MappedGoType {
    return {
      kind: "basic",
      name: typeString,
      usePointerForOptional,
    };
  }

  /**
   * Convert StandaloneGoGenerator format to unified format
   * 
   * LEGACY COMPATIBILITY: Support existing StandaloneGoGenerator code
   * UNIFIED CONVERSION: Convert to standard MappedGoType
   */
  static convertFromStandaloneFormat(goTypeMapping: {
    goType: string;
    usePointerForOptional: boolean;
  }): MappedGoType {
    return {
      kind: "basic",
      name: goTypeMapping.goType,
      usePointerForOptional: goTypeMapping.usePointerForOptional,
    };
  }

  /**
   * Convert to StandaloneGoGenerator format (legacy compatibility)
   * 
   * LEGACY COMPATIBILITY: Support existing StandaloneGoGenerator code
   * UNIFIED CONVERSION: Convert from standard MappedGoType
   */
  static convertToStandaloneFormat(type: MappedGoType): {
    goType: string;
    usePointerForOptional: boolean;
  } {
    return {
      goType: this.getGoTypeName(type),
      usePointerForOptional: this.shouldUsePointerForOptional(type),
    };
  }

  /**
   * Validate type mapping result
   * 
   * QUALITY ASSURANCE: Ensure type mapping is valid
   * CONSISTENT VALIDATION: Single validation logic
   */
  static validateTypeMapping(type: MappedGoType): boolean {
    // Check required fields
    if (!type || typeof type !== 'object') {
      return false;
    }

    if (!type.kind) {
      return false;
    }

    // Validate based on kind
    switch (type.kind) {
      case "basic":
        return !!type.name;
      case "pointer":
        return !!type.baseType;
      case "slice":
      case "array":
        return !!type.elementType;
      case "struct":
      case "enum":
      case "union":
        return !!type.name;
      case "template":
        return !!type.name && !!type.template;
      default:
        return false;
    }
  }
}