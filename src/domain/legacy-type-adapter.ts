/**
 * Legacy Type Adapter - Crisis Resolution
 *
 * COMPATIBILITY LAYER: Handles legacy test type formats
 * BREAKTHROUGH STRATEGY: Convert legacy → TypeSpec → Unified
 * ZERO REGRESSION: Maintains all existing functionality
 */

/**
 * Legacy type format from tests
 * LEGACY FORMAT: { kind: "String", "Int32", "Uint8" } (from tests)
 */
interface LegacyType {
  kind: string;
  elementType?: unknown;
  name?: string;
  variants?: unknown[];
}

/**
 * TypeSpec compiler format
 * TYPESPEC FORMAT: { kind: "scalar", name: "string" } (expected by GoTypeMapper)
 */
interface TypeSpecType {
  kind: string;
  name?: string;
  elementType?: unknown;
  variants?: unknown[];
  template?: string;
}

/**
 * Universal type that can be legacy or TypeSpec format
 */
export interface UniversalType {
  kind: string;
  name?: string;
  elementType?: unknown;
  variants?: unknown[];
  template?: string;
}

/**
 * Legacy type format conversion
 * 
 * CRISIS RESOLUTION: Convert legacy test format to TypeSpec compiler format
 * LEGACY COMPATIBILITY: Support existing test data without breaking changes
 * UNIFIED PATH: Provides bridge to eventual type system unification
 */
export class LegacyTypeAdapter {
  /**
   * Convert legacy test type format to TypeSpec compiler format
   * 
   * LEGACY FORMAT: { kind: "String", "Int32", "Uint8" } (from tests)
   * TYPESPEC FORMAT: { kind: "scalar", name: "string" } (expected by GoTypeMapper)
   * UNIFIED FORMAT: { kind: "basic", name: "string" } (our final format)
   */
  static convertLegacyToTypeSpecFormat(legacyType: LegacyType): TypeSpecType | LegacyType {
    // Check if this is legacy format (has kind but no name property)
    if (legacyType && typeof legacyType === 'object' && 
        legacyType.kind && !legacyType.name && 
        typeof legacyType.kind === 'string') {
      
      const legacyMappings: Record<string, string> = {
        "String": "string",
        "Int8": "int8",
        "Int16": "int16",
        "Int32": "int32",
        "Int64": "int64",
        "Uint8": "uint8",
        "Uint16": "uint16",
        "Uint32": "uint32",
        "Uint64": "uint64",
        "Float32": "float32",
        "Float64": "float64",
        "Boolean": "bool",
        "Bytes": "bytes",
        "Decimal": "float64",
        "PlainDate": "time.Time",
        "PlainTime": "time.Time",
        "UtcDateTime": "time.Time",
        "OffsetDateTime": "time.Time",
        "Duration": "time.Duration",
      };

      const scalarName = legacyMappings[legacyType.kind];
      if (scalarName) {
        return {
          kind: "scalar",
          name: scalarName,
        };
      }

      // Handle array types in legacy format
      if (legacyType.kind === "Array" && legacyType.elementType) {
        const convertedElement = legacyType.elementType ? 
          this.convertLegacyToTypeSpecFormat(legacyType.elementType) : 
          { kind: "String", name: "string" };
        return {
          kind: "Array",
          elementType: convertedElement,
        };
      }

      // Handle model types in legacy format
      if (legacyType.kind === "Model" && legacyType.name) {
        return {
          kind: "model",
          name: legacyType.name,
        };
      }

      // Handle union types in legacy format
      if (legacyType.kind === "Union" && legacyType.name) {
        return {
          kind: "union",
          name: legacyType.name,
          variants: legacyType.variants || [],
        };
      }

      // Handle template types in legacy format
      if (legacyType.kind === "Template" || legacyType.kind === "template") {
        return {
          kind: "template",
          name: "T",
          template: "T",
        };
      }

      // Unknown legacy type - pass through with error
      return {
        kind: "unknown",
        name: legacyType.kind,
      };
    }

    // Not legacy format - return as-is
    return legacyType;
  }

  /**
   * Check if type is in legacy format
   * 
   * DETECTION LOGIC: Identify legacy vs TypeSpec vs Unified formats
   */
  static isLegacyFormat(type: UniversalType): boolean {
    return type !== null && 
           typeof type === 'object' && 
           'kind' in type && 
           !('name' in type) && 
           typeof (type as any).kind === 'string' &&
           !["scalar", "model", "union", "enum", "template"].includes((type as any).kind.toLowerCase());
  }

  /**
   * Convert any type to TypeSpec format (universal adapter)
   * 
   * UNIVERSAL ADAPTER: Handles legacy, TypeSpec, and unified formats
   * SINGLE ENTRY POINT: One method to rule them all
   */
  static toTypeSpecFormat(type: UniversalType): UniversalType {
    // Check if already in TypeSpec format (has kind and name)
    if (type && typeof type === 'object' && 
        type.kind && type.name && 
        typeof type.kind === 'string') {
      return type; // Already in TypeSpec format
    }

    // Check if legacy format and convert
    if (this.isLegacyFormat(type)) {
      return this.convertLegacyToTypeSpecFormat(type);
    }

    // Default fallback
    return type;
  }

  /**
   * Get legacy type name (for debugging)
   * 
   * DEBUGGING UTILITY: Identify legacy type names
   */
  static getLegacyTypeName(type: UniversalType): string {
    if (this.isLegacyFormat(type)) {
      return type.kind;
    }
    return "not-legacy";
  }

  /**
   * Validate legacy type conversion
   * 
   * QUALITY ASSURANCE: Ensure conversion succeeded
   */
  static validateConversion(original: UniversalType, converted: UniversalType): boolean {
    // If original was legacy format, converted should have kind "scalar"
    if (this.isLegacyFormat(original)) {
      return converted && 
             typeof converted === 'object' && 
             converted.kind === "scalar" && 
             typeof converted.name === 'string';
    }

    // If original wasn't legacy, converted should be unchanged
    return original === converted;
  }
}