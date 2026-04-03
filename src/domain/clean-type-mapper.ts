/**
 * Clean Type Mapper - TypeSpec Go Emitter
 *
 * UNIFIED TYPE MAPPING: Single source of truth for type conversion
 * TYPE SAFETY: Zero any types, comprehensive coverage
 * PERFORMANCE: Optimized type mapping with caching
 * MAINTAINABILITY: Clear separation of concerns
 * STRONG ID TYPES: Support for brand/phantom types from go-composable-business-types/id
 * DOMAIN TYPES: Support for Email, Age, Total, and enum types from go-composable-business-types
 */

import type { TypeSpecPropertyNode } from "../types/typespec-domain.js";
import type { GoTypeMapping } from "../types/emitter.types.js";

/**
 * Domain type detection patterns
 * Maps field names to branded types from go-composable-business-types
 */
const DOMAIN_TYPE_PATTERNS = {
  EMAIL: /^email$/i,
  AGE: /^age$/i,
  TOTAL: /^(total|count|quantity)$/i,
  ACTIVE: /^(active|enabled|visible|published|archived|locked)$/i,
} as const;

/**
 * Strong ID type information
 */
export interface StrongIdType {
  /** Whether this is a strong ID type */
  isStrongId: true;
  /** The strong ID Go type (e.g., "IDID", "UserIDID") */
  strongIdType: string;
  /** The underlying primitive type (e.g., "string") */
  underlyingType: string;
}

/**
 * Check if a field name represents an ID field that should use strong ID type
 * Matches patterns like: id, ID, Id, userId, UserId, orderId, OrderId, etc.
 */
export function isStrongIdField(fieldName: string): boolean {
  if (!fieldName) return false;

  // Exact matches for common ID field names
  const exactMatches = ["id", "ID", "Id", "iD"];
  if (exactMatches.includes(fieldName)) {
    return true;
  }

  // Matches fields ending with "Id" (camelCase) or "ID" (PascalCase)
  // Examples: userId, orderId, UserId, OrderId, itemId, ItemId
  if (fieldName.endsWith("Id") || fieldName.endsWith("ID")) {
    return true;
  }

  return false;
}

/**
 * Generate strong ID type name from field name
 * Examples:
 *   "id" -> "IDID"
 *   "ID" -> "IDID"
 *   "userId" -> "UserIdID"
 *   "OrderId" -> "OrderIdID"
 */
export function generateStrongIdType(fieldName: string): string {
  if (!fieldName) return "IDID";

  // If it's exactly "id" or "ID", use a generic IDID
  if (fieldName.toLowerCase() === "id") {
    return "IDID";
  }

  // For fields like "userId", "OrderId", "itemId" -> "UserIdID", "OrderIdID", "ItemIdID"
  // Capitalize the first letter and append "ID"
  const capitalized = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  return `${capitalized}ID`;
}

/**
 * Get strong ID type mapping for ID fields
 * Returns the appropriate strong ID type with required imports
 */
export function getStrongIdMapping(fieldName: string): StrongIdType {
  return {
    isStrongId: true,
    strongIdType: generateStrongIdType(fieldName),
    underlyingType: "string",
  };
}

/**
 * Domain type information for branded types
 */
export interface DomainType {
  /** Whether this is a domain type */
  isDomainType: true;
  /** The Go type (e.g., "types.Email", "Age", "ActiveStatus") */
  goType: string;
  /** Whether to use pointer for optional */
  usePointerForOptional: boolean;
  /** Required import path */
  requiresImport: string;
}

/**
 * Check if a field name represents an email field that should use types.Email
 */
export function isEmailField(fieldName: string): boolean {
  return DOMAIN_TYPE_PATTERNS.EMAIL.test(fieldName);
}

/**
 * Check if a field name represents an age field that should use branded Age type
 */
export function isAgeField(fieldName: string): boolean {
  return DOMAIN_TYPE_PATTERNS.AGE.test(fieldName);
}

/**
 * Check if a field name represents a total/count field
 */
export function isTotalField(fieldName: string): boolean {
  return DOMAIN_TYPE_PATTERNS.TOTAL.test(fieldName);
}

/**
 * Check if a field name represents a status boolean that should use enum
 */
export function isStatusBooleanField(fieldName: string): boolean {
  return DOMAIN_TYPE_PATTERNS.ACTIVE.test(fieldName);
}

/**
 * Get email type mapping
 * Uses types.Email from go-composable-business-types
 */
export function getEmailMapping(isOptional: boolean): DomainType {
  return {
    isDomainType: true,
    goType: "types.Email",
    usePointerForOptional: isOptional,
    requiresImport: "github.com/larsartmann/go-composable-business-types/types",
  };
}

/**
 * Get Age type mapping
 * Uses branded Age type from go-composable-business-types
 */
export function getAgeMapping(isOptional: boolean): DomainType {
  return {
    isDomainType: true,
    goType: "Age",
    usePointerForOptional: isOptional,
    requiresImport: "github.com/larsartmann/go-composable-business-types/types",
  };
}

/**
 * Get Total type mapping
 * Uses branded TotalInt type from go-composable-business-types
 */
export function getTotalMapping(isOptional: boolean): DomainType {
  return {
    isDomainType: true,
    goType: "TotalInt",
    usePointerForOptional: isOptional,
    requiresImport: "github.com/larsartmann/go-composable-business-types/types",
  };
}

/**
 * Get Active status enum mapping
 * Uses ActiveStatus enum from go-composable-business-types/enums
 */
export function getActiveStatusMapping(isOptional: boolean): DomainType {
  return {
    isDomainType: true,
    goType: "ActiveStatus",
    usePointerForOptional: isOptional,
    requiresImport: "github.com/larsartmann/go-composable-business-types/enums",
  };
}

/**
 * Detect and map domain types based on field name and type
 * Returns domain type mapping if applicable, undefined otherwise
 */
export function detectDomainType(fieldName: string, typeKind: string): DomainType | undefined {
  // Email field with string type
  if (isEmailField(fieldName) && (typeKind === "String" || typeKind === "string")) {
    return getEmailMapping(false);
  }

  // Age field with integer type
  if (isAgeField(fieldName) && typeKind.includes("Int")) {
    return getAgeMapping(false);
  }

  // Total/Count field with integer type
  if (isTotalField(fieldName) && typeKind.includes("Int")) {
    return getTotalMapping(false);
  }

  // Active/Enabled status field with boolean type
  if (isStatusBooleanField(fieldName) && (typeKind === "Boolean" || typeKind === "bool")) {
    return getActiveStatusMapping(false);
  }

  return undefined;
}

/**
 * Type mapping cache for performance
 */
class TypeMappingCache {
  private static cache = new Map<string, GoTypeMapping>();

  static get(key: string): GoTypeMapping | undefined {
    return this.cache.get(key);
  }

  static set(key: string, value: GoTypeMapping): void {
    this.cache.set(key, value);
  }

  static clear(): void {
    this.cache.clear();
  }

  static size(): number {
    return this.cache.size;
  }
}

/**
 * Clean Type Mapper - Professional type mapping implementation
 * ZERO ANY TYPES: Complete type safety
 * COMPREHENSIVE COVERAGE: All TypeSpec types supported
 */
export class CleanTypeMapper {
  /**
   * Core TypeSpec scalar to Go type mappings
   */
  private static readonly SCALAR_MAPPINGS: Record<string, GoTypeMapping> = {
    // String types
    string: { goType: "string", usePointerForOptional: true },
    plainDate: { goType: "time.Time", usePointerForOptional: true, requiresImport: "time" },
    plainTime: { goType: "time.Time", usePointerForOptional: true, requiresImport: "time" },
    utcDateTime: { goType: "time.Time", usePointerForOptional: true, requiresImport: "time" },
    duration: { goType: "time.Duration", usePointerForOptional: true, requiresImport: "time" },

    // Integer types
    int8: { goType: "int8", usePointerForOptional: true },
    int16: { goType: "int16", usePointerForOptional: true },
    int32: { goType: "int32", usePointerForOptional: true },
    int64: { goType: "int64", usePointerForOptional: true },
    uint8: { goType: "uint8", usePointerForOptional: true },
    uint16: { goType: "uint16", usePointerForOptional: true },
    uint32: { goType: "uint32", usePointerForOptional: true },
    uint64: { goType: "uint64", usePointerForOptional: true },

    // Float types
    float32: { goType: "float32", usePointerForOptional: true },
    float64: { goType: "float64", usePointerForOptional: true },

    // Special types
    bytes: { goType: "[]byte", usePointerForOptional: true },
    boolean: { goType: "bool", usePointerForOptional: true },
    bool: { goType: "bool", usePointerForOptional: true },
  };

  /**
   * TypeSpec built-in type mappings
   */
  private static readonly BUILTIN_MAPPINGS: Record<string, GoTypeMapping> = {
    String: { goType: "string", usePointerForOptional: true },
    Boolean: { goType: "bool", usePointerForOptional: true },
    Number: { goType: "float64", usePointerForOptional: true }, // Fallback
  };

  /**
   * Map TypeSpec type to Go type with full type safety
   * NO ANY TYPES: Comprehensive type checking
   */
  static mapTypeSpecType(type: TypeSpecPropertyNode["type"], fieldName?: string): GoTypeMapping {
    // Create cache key
    const cacheKey = this.createCacheKey(type, fieldName);

    // Check cache first
    const cached = TypeMappingCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    let result: GoTypeMapping;

    // Handle different TypeSpec type structures
    if (this.isTypeSpecScalar(type)) {
      result = this.mapScalarType(type, fieldName);
    } else if (this.isTypeSpecModel(type)) {
      result = this.mapModelType(type, fieldName);
    } else if (this.isTypeSpecBuiltin(type)) {
      result = this.mapBuiltinType(type, fieldName);
    } else if (this.isTypeSpecUnion(type)) {
      result = this.mapUnionType(type, fieldName);
    } else if (this.isTypeSpecEnum(type)) {
      result = this.mapEnumType(type, fieldName);
    } else if (this.isTypeSpecTemplate(type)) {
      result = this.mapTemplateType(type, fieldName);
    } else if (this.isTypeSpecArray(type)) {
      result = this.mapArrayType(type, fieldName);
    } else if (this.isTypeSpecMap(type)) {
      result = this.mapMapType(type, fieldName);
    } else {
      // Fallback with error
      result = {
        goType: "interface{}",
        usePointerForOptional: true,
        requiresImport: undefined,
      };

      console.warn(`Unsupported TypeSpec type for field ${fieldName}:`, type);
    }

    // Cache the result
    TypeMappingCache.set(cacheKey, result);

    return result;
  }

  /**
   * Generic helper for checking if type has 'name' property
   * ELIMINATES DUPLICATION: Single function for name-based type checks
   */
  private static hasTypeName(type: unknown): type is { name: string } {
    return typeof type === "object" && type !== null && "name" in type;
  }

  /**
   * Map TypeSpec scalar type
   * Uses domain type detection for Email, Age, Total, and Status fields
   */
  private static mapScalarType(
    type: TypeSpecPropertyNode["type"],
    fieldName?: string,
  ): GoTypeMapping {
    if (this.hasTypeName(type)) {
      const scalarName = type.name;
      const mapping = this.SCALAR_MAPPINGS[scalarName];

      if (mapping) {
        return mapping;
      }

      // Try to infer from common patterns
      if (scalarName.toLowerCase().includes("string")) {
        // Check for domain types first (Email field)
        if (fieldName && isEmailField(fieldName)) {
          return {
            goType: "types.Email",
            usePointerForOptional: false,
            requiresImport: "github.com/larsartmann/go-composable-business-types/types",
          };
        }
        // Check if this is a strong ID field (id, ID, userId, etc.)
        if (fieldName && isStrongIdField(fieldName)) {
          const strongId = getStrongIdMapping(fieldName);
          return {
            goType: strongId.strongIdType,
            usePointerForOptional: false,
            requiresImport: "github.com/larsartmann/go-composable-business-types/id",
          };
        }
        return { goType: "string", usePointerForOptional: false };
      }
      if (scalarName.toLowerCase().includes("int")) {
        // Check for Age field
        if (fieldName && isAgeField(fieldName)) {
          return {
            goType: "Age",
            usePointerForOptional: false,
            requiresImport: "github.com/larsartmann/go-composable-business-types/types",
          };
        }
        // Check for Total/Count fields
        if (fieldName && isTotalField(fieldName)) {
          return {
            goType: "TotalInt",
            usePointerForOptional: false,
            requiresImport: "github.com/larsartmann/go-composable-business-types/types",
          };
        }
        return { goType: "int32", usePointerForOptional: false };
      }
      if (scalarName.toLowerCase().includes("float")) {
        return { goType: "float64", usePointerForOptional: true };
      }
      if (scalarName.toLowerCase().includes("bool")) {
        // Check for status boolean fields
        if (fieldName && isStatusBooleanField(fieldName)) {
          return {
            goType: "ActiveStatus",
            usePointerForOptional: false,
            requiresImport: "github.com/larsartmann/go-composable-business-types/enums",
          };
        }
        return { goType: "bool", usePointerForOptional: false };
      }
    }

    // Return fallback type for unknown scalars
    console.warn(`Unknown scalar type for field ${fieldName}: ${JSON.stringify(type)}`);
    return { goType: "interface{}", usePointerForOptional: true };
  }

  /**
   * Map TypeSpec model type
   */
  private static mapModelType(
    type: TypeSpecPropertyNode["type"],
    fieldName?: string,
  ): GoTypeMapping {
    if (this.hasTypeName(type)) {
      const modelName = type.name;
      return {
        goType: modelName,
        usePointerForOptional: true,
      };
    }

    // Handle case where model type is just { kind: "model" }
    if (this.isTypeSpecModel(type)) {
      return {
        goType: "interface{}",
        usePointerForOptional: true,
      };
    }

    // Return fallback type for invalid model types
    console.warn(`Invalid model type for field ${fieldName}: ${JSON.stringify(type)}`);
    return { goType: "interface{}", usePointerForOptional: true };
  }

  /**
   * Map TypeSpec built-in type
   * Uses domain type detection for Email, Age, Total, and Status fields
   */
  private static mapBuiltinType(
    type: TypeSpecPropertyNode["type"],
    fieldName?: string,
  ): GoTypeMapping {
    if (typeof type === "object" && type !== null && "kind" in type) {
      const kind = (type as { kind: string }).kind;
      const mapping = this.BUILTIN_MAPPINGS[kind];

      if (mapping) {
        return mapping;
      }

      // Handle special cases including all TypeSpec numeric types
      // ALL types use pointers for optional fields - Go best practice
      switch (kind) {
        case "String":
          // Check for domain types first (Email field)
          if (fieldName && isEmailField(fieldName)) {
            return {
              goType: "types.Email",
              usePointerForOptional: false,
              requiresImport: "github.com/larsartmann/go-composable-business-types/types",
            };
          }
          // Check if this is a strong ID field (id, ID, userId, etc.)
          if (fieldName && isStrongIdField(fieldName)) {
            const strongId = getStrongIdMapping(fieldName);
            return {
              goType: strongId.strongIdType,
              usePointerForOptional: false,
              requiresImport: "github.com/larsartmann/go-composable-business-types/id",
            };
          }
          return { goType: "string", usePointerForOptional: true };
        case "Boolean":
          // Check for status boolean fields (Active, Enabled, etc.)
          if (fieldName && isStatusBooleanField(fieldName)) {
            return {
              goType: "ActiveStatus",
              usePointerForOptional: false,
              requiresImport: "github.com/larsartmann/go-composable-business-types/enums",
            };
          }
          return { goType: "bool", usePointerForOptional: true };
        case "Number":
          return { goType: "float64", usePointerForOptional: true };
        // Handle TypeSpec v1.7.0 numeric types
        case "Int8":
          // Check for Age field
          if (fieldName && isAgeField(fieldName)) {
            return {
              goType: "Age",
              usePointerForOptional: false,
              requiresImport: "github.com/larsartmann/go-composable-business-types/types",
            };
          }
          return { goType: "int8", usePointerForOptional: true };
        case "Int16":
          // Check for Total/Count fields
          if (fieldName && isTotalField(fieldName)) {
            return {
              goType: "TotalInt",
              usePointerForOptional: false,
              requiresImport: "github.com/larsartmann/go-composable-business-types/types",
            };
          }
          return { goType: "int16", usePointerForOptional: true };
        case "Int32":
          // Check for Age field
          if (fieldName && isAgeField(fieldName)) {
            return {
              goType: "Age",
              usePointerForOptional: false,
              requiresImport: "github.com/larsartmann/go-composable-business-types/types",
            };
          }
          // Check for Total/Count fields
          if (fieldName && isTotalField(fieldName)) {
            return {
              goType: "TotalInt",
              usePointerForOptional: false,
              requiresImport: "github.com/larsartmann/go-composable-business-types/types",
            };
          }
          return { goType: "int32", usePointerForOptional: true };
        case "Int64":
          return { goType: "int64", usePointerForOptional: true };
        case "Uint8":
          return { goType: "uint8", usePointerForOptional: true };
        case "Uint16":
          return { goType: "uint16", usePointerForOptional: true };
        case "Uint32":
          return { goType: "uint32", usePointerForOptional: true };
        case "Uint64":
          return { goType: "uint64", usePointerForOptional: true };
        case "Float32":
          return { goType: "float32", usePointerForOptional: true };
        case "Float64":
          return { goType: "float64", usePointerForOptional: true };
        default:
          console.warn(`Unsupported built-in type for field ${fieldName}:`, kind);
          return { goType: "interface{}", usePointerForOptional: true };
      }
    }

    return { goType: "interface{}", usePointerForOptional: true };
  }

  /**
   * Map TypeSpec union type
   */
  private static mapUnionType(
    _type: TypeSpecPropertyNode["type"],

    _fieldName?: string,
  ): GoTypeMapping {
    // TODO: Implement proper union type mapping to Go sealed interfaces
    // For union types, use interface{} as safest fallback
    // In future, could generate sealed interfaces
    return {
      goType: "interface{}",
      usePointerForOptional: true,
    };
  }

  /**
   * Map TypeSpec enum type
   */
  private static mapEnumType(
    type: TypeSpecPropertyNode["type"],

    _fieldName?: string,
  ): GoTypeMapping {
    if (this.hasTypeName(type)) {
      const enumName = type.name;
      // Generate Go enum with string suffix
      const goEnumName = `${enumName}Type`;
      return {
        goType: goEnumName,
        usePointerForOptional: false,
      };
    }

    return { goType: "string", usePointerForOptional: false };
  }

  /**
   * Map TypeSpec array type
   */
  private static mapArrayType(
    type: TypeSpecPropertyNode["type"],
    fieldName?: string,
  ): GoTypeMapping {
    if (this.isTypeSpecArray(type)) {
      const arrayType = type as { elementType?: TypeSpecPropertyNode["type"] };

      // Check if elementType exists
      if (!arrayType.elementType) {
        console.warn(
          `Array type missing elementType for field ${fieldName}: ${JSON.stringify(type)}`,
        );
        return { goType: "[]interface{}", usePointerForOptional: true };
      }

      // Recursively map the element type
      const elementMapping = this.mapTypeSpecType(arrayType.elementType, `${fieldName}Element`);

      // Generate Go slice type: []ElementType
      const goSliceType = `[]${elementMapping.goType}`;

      return {
        goType: goSliceType,
        usePointerForOptional: true, // Arrays/slices are reference types in Go
        requiresImport: elementMapping.requiresImport,
      };
    }

    // Return fallback type for invalid array types
    console.warn(`Invalid array type for field ${fieldName}: ${JSON.stringify(type)}`);
    return { goType: "[]interface{}", usePointerForOptional: true };
  }

  /**
   * Map TypeSpec map/record type
   */
  private static mapMapType(type: TypeSpecPropertyNode["type"], fieldName?: string): GoTypeMapping {
    if (typeof type === "object" && type !== null && "kind" in type) {
      const kind = (type as { kind: string }).kind;
      if (kind === "map" || kind === "record") {
        const mapType = type as {
          keyType?: TypeSpecPropertyNode["type"];
          valueType?: TypeSpecPropertyNode["type"];
        };

        // Check if keyType and valueType exist
        if (!mapType.keyType || !mapType.valueType) {
          console.warn(
            `Map/record type missing keyType or valueType for field ${fieldName}: ${JSON.stringify(type)}`,
          );
          return { goType: "map[string]interface{}", usePointerForOptional: true };
        }

        // Map the key and value types
        const keyMapping = this.mapTypeSpecType(mapType.keyType, `${fieldName}Key`);
        const valueMapping = this.mapTypeSpecType(mapType.valueType, `${fieldName}Value`);

        // For Go maps, keys must be comparable types
        let goKeyType = keyMapping.goType;

        // Ensure key type is comparable in Go
        if (!this.isGoComparableType(goKeyType)) {
          console.warn(
            `Non-comparable map key type for field ${fieldName}: ${goKeyType}, defaulting to string`,
          );
          goKeyType = "string";
        }

        // Generate Go map type: map[keyType]valueType
        const goMapType = `map[${goKeyType}]${valueMapping.goType}`;

        return {
          goType: goMapType,
          usePointerForOptional: true, // Maps are reference types in Go
          requiresImport: valueMapping.requiresImport || keyMapping.requiresImport,
        };
      }
    }

    // Return fallback type for invalid map types
    console.warn(`Invalid map/record type for field ${fieldName}: ${JSON.stringify(type)}`);
    return { goType: "map[string]interface{}", usePointerForOptional: true };
  }

  /**
   * Check if a Go type is comparable (can be used as map key)
   */
  private static isGoComparableType(goType: string): boolean {
    // Go comparable types: string, int, float, bool, pointers, arrays, structs, interfaces
    // Non-comparable: slice, map, function, complex numbers
    const nonComparable = ["[]", "map[", "func", "complex64", "complex128"];

    return !nonComparable.some((pattern) => goType.includes(pattern));
  }

  /**
   * Map TypeSpec template type
   */
  private static mapTemplateType(
    type: TypeSpecPropertyNode["type"],

    _fieldName?: string,
  ): GoTypeMapping {
    if (this.hasTypeName(type)) {
      const templateName = type.name;
      // Template types become their parameter name in Go
      return {
        goType: templateName,
        usePointerForOptional: false,
      };
    }

    return { goType: "interface{}", usePointerForOptional: true };
  }

  /**
   * Type guard: Check if type is TypeSpec scalar
   */
  private static isTypeSpecScalar(type: unknown): boolean {
    return (
      typeof type === "object" &&
      type !== null &&
      "name" in type &&
      // Exclude model types (they have both name and kind)
      (!("kind" in type) ||
        ((type as { kind: string }).kind !== "model" &&
          (type as { kind: string }).kind !== "template"))
    );
  }

  /**
   * Generic type guard helper for TypeSpec types with 'kind' property
   * ELIMINATES DUPLICATION: Single function for all kind-based type guards
   */
  private static isTypeSpecKind(type: unknown, expectedKind: string): boolean {
    return (
      typeof type === "object" &&
      type !== null &&
      "kind" in type &&
      (type as { kind: string }).kind === expectedKind
    );
  }

  /**
   * Type guard: Check if type is TypeSpec model
   */
  private static isTypeSpecModel(type: unknown): boolean {
    return this.isTypeSpecKind(type, "model");
  }

  /**
   * Generic helper for basic type structure validation - eliminates duplication
   * SINGLE SOURCE OF TRUTH: Centralized type checking pattern
   */
  private static isTypeSpecObject(type: unknown): type is { kind: string } {
    return typeof type === "object" && type !== null && "kind" in type;
  }

  /**
   * Type guard: Check if type is TypeSpec built-in
   */
  private static isTypeSpecBuiltin(type: unknown): boolean {
    if (this.isTypeSpecObject(type)) {
      const kind = type.kind;
      return [
        "String",
        "Boolean",
        "Number",
        "Int8",
        "Int16",
        "Int32",
        "Int64",
        "Uint8",
        "Uint16",
        "Uint32",
        "Uint64",
        "Float32",
        "Float64",
      ].includes(kind);
    }
    return false;
  }

  /**
   * Type guard: Check if type is TypeSpec union
   */
  private static isTypeSpecUnion(type: unknown): boolean {
    return this.isTypeSpecKind(type, "Union");
  }

  /**
   * Type guard: Check if type is TypeSpec enum
   */
  private static isTypeSpecEnum(type: unknown): boolean {
    return this.isTypeSpecKind(type, "Enum");
  }

  /**
   * Type guard: Check if type is TypeSpec template
   */
  private static isTypeSpecTemplate(type: unknown): boolean {
    return this.isTypeSpecKind(type, "template");
  }

  /**
   * Type guard: Check if type is TypeSpec array
   */
  private static isTypeSpecArray(type: unknown): boolean {
    return this.isTypeSpecKind(type, "array");
  }

  /**
   * Type guard: Check if type is TypeSpec map/record
   */
  private static isTypeSpecMap(type: unknown): boolean {
    if (this.isTypeSpecObject(type)) {
      const kind = type.kind;
      return kind === "map" || kind === "record";
    }
    return false;
  }

  /**
   * Create cache key for type mapping
   */
  private static createCacheKey(type: TypeSpecPropertyNode["type"], fieldName?: string): string {
    const typeString = JSON.stringify(type);
    return `${typeString}:${fieldName || "unknown"}`;
  }

  /**
   * Get all required imports for a set of types
   */
  static getRequiredImports(types: GoTypeMapping[]): string[] {
    const imports = new Set<string>();

    for (const type of types) {
      if (type.requiresImport) {
        imports.add(type.requiresImport);
      }
    }

    return Array.from(imports).sort();
  }

  /**
   * Clear type mapping cache
   */
  static clearCache(): void {
    TypeMappingCache.clear();
  }

  /**
   * Get cache statistics
   */
  static getCacheStats(): { size: number; entries: number } {
    return {
      size: TypeMappingCache.size(),
      entries: TypeMappingCache.size(),
    };
  }

  /**
   * Validate type mapping result
   */
  static validateMapping(
    mapping: GoTypeMapping,
    fieldName?: string,
  ): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!mapping.goType) {
      errors.push(`Invalid goType for field ${fieldName}: ${mapping.goType}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Convenience function: Map TypeSpec type to Go type
 * PROXY PATTERN: Maintains API compatibility while leveraging CleanTypeMapper
 */
export function mapTypeSpecTypeToGo(
  type: TypeSpecPropertyNode["type"],
  fieldName?: string,
): GoTypeMapping {
  return CleanTypeMapper.mapTypeSpecType(type, fieldName);
}

/**
 * Convenience function: Get Go type string from TypeSpec type
 * PROXY PATTERN: Extracts just the Go type string for simple cases
 */
export function getGoTypeString(type: TypeSpecPropertyNode["type"], fieldName?: string): string {
  const mapping = CleanTypeMapper.mapTypeSpecType(type, fieldName);
  return mapping.goType;
}

/**
 * Convenience function: Get required imports for multiple types
 */
export function getRequiredImportsForTypes(
  types: Array<{ type: TypeSpecPropertyNode["type"] }>,
  fieldNames?: string[],
): string[] {
  const mappings = types.map((item, index) =>
    CleanTypeMapper.mapTypeSpecType(item.type, fieldNames?.[index]),
  );
  return CleanTypeMapper.getRequiredImports(mappings);
}
